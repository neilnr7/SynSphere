function Input({
  label,
  error,
  helperText,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  className = "",
  id,
  ...props  //component automatically supports std input properties(type,name,onChange,etc)
  //lets React Hook Form pass its registration props. ...register("email")
  //do not need special React Hook Form logic inside Input.
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
        {LeftIcon && (
          <LeftIcon
            className="
              pointer-events-none
              absolute left-3 top-1/2
              h-5 w-5
              -translate-y-1/2
              text-text-muted
            "
          />
        )}

        <input
          id={id}
          className={`
            h-11 w-full
            rounded-input
            border
            bg-surface
            px-3
            text-sm text-text
            outline-none
            transition-colors duration-200
            placeholder:text-text-muted
            focus:border-primary
            focus:ring-4 focus:ring-primary/10
            disabled:cursor-not-allowed
            disabled:bg-surface-secondary
            disabled:opacity-60

            ${LeftIcon ? "pl-10" : ""}
            ${RightIcon ? "pr-10" : ""}

            ${
              error
                ? "border-danger focus:border-danger focus:ring-danger/10"
                : "border-border"
            }

            ${className}
          `}
          {...props}
        />

        {RightIcon && (
          <RightIcon
            className="
              pointer-events-none
              absolute right-3 top-1/2
              h-5 w-5
              -translate-y-1/2
              text-text-muted
            "
          />
        )}
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

export default Input;