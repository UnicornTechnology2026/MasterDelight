import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function ConfirmDialog({
  open,
  title = "Are you sure?",
  message = "",
  confirmText = "Delete",
  cancelText = "Cancel",
  danger = true,
  onConfirm,
  onCancel,
}) {
  const cancelRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === "Escape") onCancel?.();
    };
    document.addEventListener("keydown", onKey);

    // lock background scroll while the box is open
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // focus "Cancel" first so Enter never deletes by accident
    cancelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onCancel]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onCancel}
      role="presentation"
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm animate-rise rounded-2xl border border-gold/40 bg-maroon p-5 text-center shadow-2xl"
      >
        <div
          className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border text-2xl ${
            danger
              ? "border-red-400/60 bg-red-500/20 text-red-300"
              : "border-gold/60 bg-gold/15 text-gold"
          }`}
        >
          {danger ? "!" : "?"}
        </div>

        <h2
          id="confirm-title"
          className="font-display text-2xl uppercase tracking-wide text-gold"
        >
          {title}
        </h2>

        {message && (
          <p
            id="confirm-message"
            className="mt-2 font-body text-sm text-white/80"
          >
            {message}
          </p>
        )}

        <div className="mt-5 flex gap-3">
          <button
            ref={cancelRef}
            onClick={onCancel}
            className="btn-ghost flex-1 bg-black/30 !px-3 !py-2 text-sm"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 rounded-md border px-3 py-2 text-sm font-semibold transition ${
              danger
                ? "border-red-400/60 bg-red-500/80 text-white hover:bg-red-500"
                : "border-gold bg-gold text-maroon hover:brightness-110"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
