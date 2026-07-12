import { LoaderCircle } from "lucide-react";

const variants = {
  primary:
    "bg-primary text-white hover:bg-primary-hover focus:ring-primary/30",

  secondary:
    "border border-border bg-surface text-text hover:bg-surface-secondary focus:ring-primary/20",

  danger:
    "bg-danger text-white hover:bg-red-700 focus:ring-danger/30",
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  type = "button",
  className = "",
  ...props
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-button font-medium
        transition-all duration-200
        focus:outline-none focus:ring-4
        disabled:pointer-events-none disabled:opacity-50
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <LoaderCircle className="h-4 w-4 animate-spin" />
      ) : (
        LeftIcon && <LeftIcon className="h-4 w-4" />
      )}

      {children}

      {!loading && RightIcon && <RightIcon className="h-4 w-4" />}
    </button>
  );
}

export default Button;
//one button for all with controlled variants, same button used everywhere