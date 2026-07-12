import { ChevronDown } from "lucide-react";

function Select({
  label,
  error,
  helperText,
  options = [],
  placeholder = "Select an option",
  className = "",
  id,
  ...props
}) {
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
        <select
          id={id}
          className={`
            h-11 w-full
            appearance-none
            rounded-input
            border
            bg-surface
            px-3 pr-10
            text-sm text-text
            outline-none
            transition-colors duration-200
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
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}

          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown
          className="
            pointer-events-none
            absolute right-3 top-1/2
            h-4 w-4
            -translate-y-1/2
            text-text-muted
          "
        />
      </div>

      {error && <p className="mt-1.5 text-sm text-danger">{error}</p>}

      {!error && helperText && (
        <p className="mt-1.5 text-sm text-text-muted">{helperText}</p>
      )}
    </div>
  );
}

export default Select;