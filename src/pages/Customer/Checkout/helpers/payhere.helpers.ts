import type { PayHereSdk } from "../types/payhere.types";

const scriptId = "payhere-checkout-sdk";
const scriptSource = "https://www.payhere.lk/lib/payhere-2.0.js";
let sdkPromise: Promise<PayHereSdk> | null = null;

export function loadPayHere(): Promise<PayHereSdk> {
  if (window.payhere) return Promise.resolve(window.payhere);
  if (sdkPromise) return sdkPromise;
  const loading = new Promise<PayHereSdk>((resolve, reject) => {
    const existing = document.getElementById(scriptId) as HTMLScriptElement;
    const script = existing ?? document.createElement("script");
    const loaded = () => {
      const sdk = window.payhere;
      if (sdk) resolve(sdk);
      else reject(new Error("PayHere SDK did not initialize."));
    };
    script.addEventListener("load", loaded, { once: true });
    script.addEventListener(
      "error",
      () => reject(new Error("PayHere SDK could not be loaded.")),
      { once: true },
    );
    if (!existing) {
      script.id = scriptId;
      script.src = scriptSource;
      script.async = true;
      document.head.appendChild(script);
    }
  }).catch((error: unknown) => {
    sdkPromise = null;
    throw error;
  });
  sdkPromise = loading;
  return loading;
}
