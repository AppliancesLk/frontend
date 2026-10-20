export interface ToastMessage {
  message: string;
  action?: { label: string; to: string };
}
export function notifyToast(message: ToastMessage) {
  window.dispatchEvent(
    new CustomEvent<ToastMessage>('store-toast', { detail: message }),
  );
}
