import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

function PasswordInput({
  label,
  error,
  helperText,
  className = "",
  id,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-2 block text-sm font-medium text-text"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          className={`
            h-11 w-full
            rounded-input
            border
            bg-surface
            px-3 pr-11
            text-sm text-text
            outline-none
            transition-colors duration-200
            placeholder:text-text-muted
            focus:border-primary
            focus:ring-4 focus:ring-primary/10
            disabled:cursor-not-allowed
            disabled:bg-surface-secondary
            disabled:opacity-60

            ${
              error
                ? "border-danger focus:border-danger focus:ring-danger/10"
                : "border-border"
            }

            ${className}
          `}
          {...props}
        />

        <button
          type="button"
          onClick={() => setShowPassword((previous) => !previous)}
          className="
            absolute right-3 top-1/2
            flex -translate-y-1/2
            items-center justify-center
            text-text-muted
            transition-colors duration-200
            hover:text-text
            focus:outline-none
          "
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>

      {error && (
        <p className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}

      {!error && helperText && (
        <p className="mt-1.5 text-sm text-text-muted">
          {helperText}
        </p>
      )}
    </div>
  );
}

export default PasswordInput;