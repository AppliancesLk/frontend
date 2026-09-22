import { useCallback, useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { generatePath, useNavigate } from "react-router-dom";
import { ROUTES } from "../../../../constants/routes";
import { getCart } from "../../../../services/cartService";
import { prepareCheckout } from "../../../../services/checkoutService";
import { createOrder } from "../../../../services/orderService";
import {
  getOrderPayment,
  initiatePayment,
} from "../../../../services/paymentService";
import type { Cart } from "../../../../types/cart.types";
import type { CheckoutSummary } from "../../../../types/checkout.types";
import type { PaymentStatus } from "../../../../types/payment.types";
import { getApiError } from "../../../../utils/apiErrors";
import { translations } from "../../../../utils/translations";
import {
  checkoutChanges,
  initialDelivery,
  normalizeDelivery,
  validateDelivery,
} from "../helpers/checkout.helpers";
import { loadPayHere } from "../helpers/payhere.helpers";
import type { DeliveryDraft, DeliveryErrors } from "../types/checkout.types";
const t = translations.checkout;

export function useCheckoutPage(email: string) {
  const navigate = useNavigate();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [paying, setPaying] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(
    null,
  );
  const [orderCreated, setOrderCreated] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState("");
  const [error, setError] = useState("");
  const [draft, setDraft] = useState(() => initialDelivery(email));
  const [errors, setErrors] = useState<DeliveryErrors>({});
  const [summary, setSummary] = useState<CheckoutSummary | null>(null);
  const [latestSummary, setLatestSummary] = useState<CheckoutSummary | null>(
    null,
  );
  const alive = useRef(false),
    busy = useRef(false);
  const orderId = useRef<string | null>(null);
  const idempotencyKey = useRef(crypto.randomUUID());
  const paymentRead = useRef<AbortController | null>(null);
  const read = useRef<AbortController | null>(null);

  const refresh = useCallback(async () => {
    if (busy.current) return;
    read.current?.abort();
    const controller = new AbortController();
    read.current = controller;
    setLoading(true);
    setError("");
    setSummary(null);
    setLatestSummary(null);
    orderId.current = null;
    setOrderCreated(false);
    idempotencyKey.current = crypto.randomUUID();
    setPaymentStatus(null);
    setPaymentMessage("");
    try {
      const result = await getCart(controller.signal);
      if (alive.current && !controller.signal.aborted) setCart(result);
    } catch (err: unknown) {
      if (alive.current && !controller.signal.aborted)
        setError(getApiError(err, t.loadError));
    } finally {
      if (alive.current && !controller.signal.aborted) setLoading(false);
    }
  }, []);
  useEffect(() => {
    alive.current = true;
    // Restore the server's current cart, without storing delivery data locally.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
    return () => {
      alive.current = false;
      read.current?.abort();
      paymentRead.current?.abort();
    };
  }, [refresh]);
  function change(field: keyof DeliveryDraft, value: string) {
    if (busy.current) return;
    setDraft((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSummary(null);
    orderId.current = null;
    setOrderCreated(false);
    idempotencyKey.current = crypto.randomUUID();
    setPaymentStatus(null);
    setPaymentMessage("");
    setError("");
  }

  const checkPayment = useCallback(
    async (id: string) => {
      paymentRead.current?.abort();
      const controller = new AbortController();
      paymentRead.current = controller;
      const payment = await getOrderPayment(id, controller.signal);
      if (!alive.current || controller.signal.aborted) return payment.status;
      setPaymentStatus(payment.status);
      if (payment.status === "SUCCESS") {
        navigate(generatePath(ROUTES.orderDetail, { id }), { replace: true });
      } else if (payment.status === "FAILED") {
        setPaymentMessage(t.paymentFailed);
      } else if (payment.status === "CANCELLED") {
        setPaymentMessage(t.paymentCancelled);
      } else {
        setPaymentMessage(t.verificationPending);
      }
      return payment.status;
    },
    [navigate],
  );

  async function verifyPayment(id: string) {
    setPaymentMessage(t.verifyingPayment);
    for (let attempt = 0; attempt < 8; attempt += 1) {
      try {
        const status = await checkPayment(id);
        if (status !== "PENDING") return;
      } catch (err: unknown) {
        if (attempt === 7 && alive.current)
          setPaymentMessage(getApiError(err, t.verificationError));
      }
      await new Promise((resolve) => window.setTimeout(resolve, 750));
      if (!alive.current) return;
    }
    if (alive.current) setPaymentMessage(t.verificationPending);
  }

  async function pay() {
    if (busy.current || !summary) return;
    busy.current = true;
    setPaying(true);
    setError("");
    setPaymentMessage(t.creatingOrder);
    let gatewayOpened = false;
    try {
      let id = orderId.current;
      if (!id) {
        const order = await createOrder({
          idempotencyKey: idempotencyKey.current,
          delivery: normalizeDelivery(draft),
        });
        id = order.id;
        orderId.current = id;
        setOrderCreated(true);
      }
      setPaymentMessage(t.openingPayHere);
      const [initiation, sdk] = await Promise.all([
        initiatePayment(id),
        loadPayHere(),
      ]);
      setPaymentStatus(initiation.payment.status);
      const settle = async () => {
        setPaying(true);
        try {
          await verifyPayment(id);
        } finally {
          busy.current = false;
          if (alive.current) setPaying(false);
        }
      };
      sdk.onCompleted = () => void settle();
      sdk.onDismissed = () => void settle();
      sdk.onError = () => void settle();
      sdk.startPayment(initiation.paymentData);
      gatewayOpened = true;
      setPaymentMessage(t.completeInPayHere);
    } catch (err: unknown) {
      if (alive.current) {
        setError(getApiError(err, t.paymentStartError));
        setPaymentMessage("");
      }
    } finally {
      if (!gatewayOpened) {
        busy.current = false;
        if (alive.current) setPaying(false);
      }
    }
  }

  async function retryVerification() {
    if (!orderId.current || busy.current) return;
    busy.current = true;
    setPaying(true);
    try {
      await verifyPayment(orderId.current);
    } finally {
      busy.current = false;
      if (alive.current) setPaying(false);
    }
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current || loading || !cart?.items.length) return;
    setSummary(null);
    setError("");
    const invalid = validateDelivery(draft);
    setErrors(invalid);
    if (Object.keys(invalid).length) {
      const field = Object.keys(invalid)[0];
      event.currentTarget
        .querySelector<HTMLInputElement>(`[name="${field}"]`)
        ?.focus();
      return;
    }
    busy.current = true;
    setSaving(true);
    try {
      const result = await prepareCheckout({
        delivery: normalizeDelivery(draft),
      });
      if (alive.current) {
        setSummary(result);
        setLatestSummary(result);
      }
    } catch (err: unknown) {
      if (alive.current) setError(getApiError(err, t.prepareError));
      // Reconcile stock/deletions/price changes; keep delivery entries and never
      // automatically repeat the preparation request after a network failure.
      try {
        const current = await getCart();
        if (alive.current) {
          setCart(current);
          setLatestSummary(null);
        }
      } catch {
        /* Retain the last cart alongside the original error. */
      }
    } finally {
      busy.current = false;
      if (alive.current) setSaving(false);
    }
  }
  return {
    cart,
    loading,
    saving,
    paying,
    locked: saving || paying || orderCreated,
    paymentStatus,
    paymentMessage,
    error,
    draft,
    errors,
    summary,
    latestSummary,
    refresh,
    change,
    submit,
    pay,
    retryVerification,
    changes:
      cart && summary
        ? checkoutChanges(cart, summary)
        : { pricesChanged: false, itemsChanged: false },
  };
}
