function Textarea({
  label,
  error,
  helperText,
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

      <textarea
        id={id}
        className={`
          min-h-28 w-full
          resize-y
          rounded-input
          border
          bg-surface
          px-3 py-3
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

export default Textarea;