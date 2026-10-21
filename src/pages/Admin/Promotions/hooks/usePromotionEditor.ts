import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createPromotion,
  getPromotion,
  previewPromotion,
  sendPromotion,
  updatePromotion,
} from '../../../../services/promotionService';
import type {
  PromotionContent,
  PromotionDetail,
  PromotionPreview,
  PromotionProduct,
  PromotionUser,
} from '../../../../types/promotion.types';
import { ROUTES } from '../../../../constants/routes';
import { getApiError } from '../../../../utils/apiErrors';
import { promotionText as t } from '../../../../utils/promotionText';
import {
  EMPTY_PROMOTION,
  isSending,
  promotionContent,
} from '../helpers/promotion.helpers';
export function usePromotionEditor() {
  const { id: routeId } = useParams(),
    id = routeId?.toLowerCase(),
    navigate = useNavigate();
  const [detail, setDetail] = useState<PromotionDetail | null>(null),
    [draft, setDraft] = useState<PromotionContent>(EMPTY_PROMOTION);
  const [selectedUsers, setSelectedUsers] = useState<PromotionUser[]>([]),
    [selectedProducts, setSelectedProducts] = useState<PromotionProduct[]>([]);
  const [loading, setLoading] = useState(id !== 'new'),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [success, setSuccess] = useState('');
  const [preview, setPreview] = useState<PromotionPreview | null>(null),
    [previewing, setPreviewing] = useState(false),
    [previewError, setPreviewError] = useState('');
  const [review, setReview] = useState<{
    promotion: PromotionDetail;
    preview: PromotionPreview;
    requestId: string;
  } | null>(null);
  const [revision, setRevision] = useState(0);
  const savedId = useRef<string | null>(null),
    lock = useRef(false),
    mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const reload = useCallback(() => {
    savedId.current = null;
    setRevision((n) => n + 1);
  }, []);
  useEffect(() => {
    if (!id || id === 'new' || savedId.current === id) return;
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      setError('');
      try {
        const next = await getPromotion(id!, controller.signal);
        if (!controller.signal.aborted) {
          savedId.current = next.id;
          setDetail(next);
          setDraft(promotionContent(next));
          setSelectedUsers(next.selectedUsers);
          setSelectedProducts(next.selectedProducts);
        }
      } catch (err) {
        if (!controller.signal.aborted) setError(getApiError(err, t.loadError));
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void load();
    return () => controller.abort();
  }, [id, revision]);
  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setPreviewing(true);
      setPreviewError('');
      try {
        const value = await previewPromotion(draft, controller.signal);
        if (!controller.signal.aborted) setPreview(value);
      } catch (err) {
        if (!controller.signal.aborted)
          setPreviewError(getApiError(err, t.previewError));
      } finally {
        if (!controller.signal.aborted) setPreviewing(false);
      }
    }, 400);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [draft, revision]);
  const hasActive = detail?.runs.some((run) => isSending(run.status));
  useEffect(() => {
    if (!detail?.id || !hasActive) return;
    const controller = new AbortController();
    const timer = window.setInterval(() => {
      void getPromotion(detail.id, controller.signal)
        .then((next) => {
          if (!controller.signal.aborted)
            setDetail((old) => (old ? { ...old, runs: next.runs } : old));
        })
        .catch(() => {
          /* Keep the last report; the next poll retries. */
        });
    }, 3000);
    return () => {
      window.clearInterval(timer);
      controller.abort();
    };
  }, [detail?.id, hasActive]);
  async function persist() {
    if (
      detail &&
      JSON.stringify(draft) === JSON.stringify(promotionContent(detail))
    )
      return detail;
    const next = detail
      ? await updatePromotion(detail.id, draft, detail.version)
      : await createPromotion(draft);
    if (mounted.current) {
      savedId.current = next.id;
      setDetail(next);
      setDraft(promotionContent(next));
      if (id === 'new')
        void navigate(`${ROUTES.adminPromotions}/${next.id}`, {
          replace: true,
        });
    }
    return next;
  }
  async function save(forReview = false) {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError('');
    setSuccess('');
    try {
      const next = await persist();
      if (forReview) {
        const fresh = await previewPromotion(promotionContent(next));
        if (mounted.current) {
          setPreview(fresh);
          setReview({
            promotion: next,
            preview: fresh,
            requestId: crypto.randomUUID(),
          });
        }
      } else if (mounted.current) setSuccess(t.saved);
    } catch (err) {
      if (mounted.current) setError(getApiError(err, t.saveError));
    } finally {
      lock.current = false;
      if (mounted.current) setBusy(false);
    }
  }
  async function send() {
    if (lock.current || !review) return;
    lock.current = true;
    setBusy(true);
    setError('');
    try {
      const run = await sendPromotion(review.promotion.id, {
        version: review.promotion.version,
        requestId: review.requestId,
        expectedRecipients: review.preview.recipientCount,
      });
      if (mounted.current) {
        setDetail((old) =>
          old
            ? {
                ...old,
                runs: [run, ...old.runs.filter((item) => item.id !== run.id)],
              }
            : old,
        );
        setReview(null);
        setSuccess(t.queued);
      }
    } catch (err) {
      if (mounted.current) setError(getApiError(err, t.sendError));
    } finally {
      lock.current = false;
      if (mounted.current) setBusy(false);
    }
  }
  return {
    detail,
    draft,
    setDraft,
    selectedUsers,
    setSelectedUsers,
    selectedProducts,
    setSelectedProducts,
    loading,
    busy,
    error,
    success,
    preview,
    previewing,
    previewError,
    review,
    setReview,
    save,
    send,
    reload,
    hasActive,
    ready: id === 'new' || detail?.id === id,
    dirty:
      JSON.stringify(draft) !==
      JSON.stringify(detail ? promotionContent(detail) : EMPTY_PROMOTION),
  };
}
