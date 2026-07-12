const badgeStyles = {
  status: {
    TODO: "bg-slate-100 text-slate-600",
    IN_PROGRESS: "bg-blue-100 text-blue-700",
    DONE: "bg-green-100 text-green-700",
  },

  priority: {
    LOW: "bg-green-100 text-green-700",
    MEDIUM: "bg-amber-100 text-amber-700",
    HIGH: "bg-red-100 text-red-700",
  },

  role: {
    OWNER: "bg-indigo-100 text-indigo-700",
    MANAGER: "bg-purple-100 text-purple-700",
    MEMBER: "bg-slate-100 text-slate-600",
  },
};

const badgeLabels = {
  TODO: "Todo",
  IN_PROGRESS: "In Progress",
  DONE: "Done",

  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",

  OWNER: "Owner",
  MANAGER: "Manager",
  MEMBER: "Member",
};

function Badge({
  type,
  value,
  children,
  className = "",
}) {
  const style =
    badgeStyles[type]?.[value] ??
    "bg-slate-100 text-slate-600";

  const label = children ?? badgeLabels[value] ?? value;

  return (
    <span
      className={`
        inline-flex items-center
        rounded-full
        px-2.5 py-1
        text-xs font-medium
        ${style}
        ${className}
      `}
    >
      {label}
    </span>
  );
}

export default Badge;