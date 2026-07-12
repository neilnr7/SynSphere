import { AlertTriangle, X } from "lucide-react";
import Button from "@/components/ui/Button";

const ConfirmModal = ({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
}) => {
  if (!open) {
    return null;
  }

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/40
        px-4
      "
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        onClick={(event) => event.stopPropagation()}
        className="
          w-full max-w-md
          rounded-card border border-border
          bg-surface
          shadow-xl
        "
      >
        <div
          className="
            flex items-start justify-between gap-4
            border-b border-border
            px-6 py-5
          "
        >
          <div className="flex items-start gap-3">
            <div
              className="
                flex h-10 w-10 shrink-0
                items-center justify-center
                rounded-full
                bg-danger/10
                text-danger
              "
            >
              <AlertTriangle className="h-5 w-5" />
            </div>

            <div>
              <h2
                id="confirm-modal-title"
                className="font-semibold text-text"
              >
                {title}
              </h2>

              <p
                className="
                  mt-1 text-sm leading-6
                  text-text-secondary
                "
              >
                {description}
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close confirmation modal"
            onClick={onCancel}
            disabled={loading}
            className="
              flex h-8 w-8 shrink-0
              items-center justify-center
              rounded-lg
              text-text-muted
              transition-colors
              hover:bg-surface-secondary
              hover:text-text
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div
          className="
            flex flex-col-reverse gap-3
            px-6 py-4
            sm:flex-row sm:justify-end
          "
        >
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelLabel}
          </Button>

          <Button
            variant="danger"
            loading={loading}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;