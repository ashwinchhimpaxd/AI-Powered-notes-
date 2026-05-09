/**
 * Fires a toast notification through the global ToastContainer already mounted
 * in App.jsx. Works anywhere in the app — no props or context needed.
 *
 * @param {"error"|"warning"|"network"|"server"|"client"|"unknown"} type
 * @param {string} message
 */
export function showToast(type, message) {
  window.dispatchEvent(
    new CustomEvent("show-toast", {
      detail: { type, message },
    })
  );
}
