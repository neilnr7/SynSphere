import { UserPlus, X } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

const roleOptions = [
  {
    value: "MEMBER",
    label: "Member",
  },
  {
    value: "MANAGER",
    label: "Manager",
  },
];

const AddMemberModal = ({
  open,
  email,
  role,
  error,
  loading = false,
  onEmailChange,
  onRoleChange,
  onSubmit,
  onCancel,
}) => {
  if (!open) {
    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit();
  };

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
        aria-labelledby="add-member-modal-title"
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
                bg-primary-light
                text-primary
              "
            >
              <UserPlus className="h-5 w-5" />
            </div>

            <div>
              <h2
                id="add-member-modal-title"
                className="font-semibold text-text"
              >
                Add Member
              </h2>

              <p
                className="
                  mt-1 text-sm leading-6
                  text-text-secondary
                "
              >
                Add an existing SynSphere user to this project.
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close add member modal"
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

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 px-6 py-5">
            <Input
              id="member-email"
              type="email"
              label="User Email"
              placeholder="member@example.com"
              value={email}
              onChange={(event) =>
                onEmailChange(event.target.value)
              }
              disabled={loading}
              required
            />

            <Select
              id="member-role"
              label="Role"
              value={role}
              onChange={(event) =>
                onRoleChange(event.target.value)
              }
              options={roleOptions}
              placeholder=""
              disabled={loading}
            />

            {error && (
              <div
                role="alert"
                className="
                  rounded-card
                  border border-danger/20
                  bg-danger/5
                  px-4 py-3
                  text-sm text-danger
                "
              >
                {error}
              </div>
            )}
          </div>

          <div
            className="
              flex flex-col-reverse gap-3
              border-t border-border
              px-6 py-4
              sm:flex-row sm:justify-end
            "
          >
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              loading={loading}
              leftIcon={UserPlus}
            >
              Add Member
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemberModal;