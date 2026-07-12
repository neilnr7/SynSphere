const paddingStyles = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

function Card({
  children,
  hoverable = false,
  padding = "md",
  className = "",
  ...props
}) {
  return (
    <div
      className={`
        rounded-card
        border border-border
        bg-surface
        shadow-sm
        transition-all duration-200
        ${
          hoverable
            ? "hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
            : ""
        }
        ${paddingStyles[padding]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

function CardHeader({ children, className = "" }) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

function CardTitle({ children, className = "" }) {
  return (
    <h3
      className={`
        text-base font-semibold
        text-text
        ${className}
      `}
    >
      {children}
    </h3>
  );
}

function CardDescription({ children, className = "" }) {
  return (
    <p
      className={`
        mt-1
        text-sm leading-6
        text-text-secondary
        ${className}
      `}
    >
      {children}
    </p>
  );
}

function CardContent({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

function CardFooter({ children, className = "" }) {
  return (
    <div
      className={`
        mt-6
        flex items-center
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};