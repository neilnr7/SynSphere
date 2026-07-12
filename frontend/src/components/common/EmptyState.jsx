function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = "",
}) {
  return (
    <div
      className={`
        flex min-h-80
        flex-col items-center justify-center
        px-6 py-12
        text-center
        ${className}
      `}
    >
      {Icon && (
        <div
          className="
            mb-4
            flex h-12 w-12
            items-center justify-center
            rounded-xl
            bg-primary-light
            text-primary
          "
        >
          <Icon className="h-6 w-6" />
        </div>
      )}

      <h3 className="text-base font-semibold text-text">
        {title}
      </h3>

      {description && (
        <p className="mt-2 max-w-sm text-sm leading-6 text-text-secondary">
          {description}
        </p>
      )}

      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
}

export default EmptyState;