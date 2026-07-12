import { useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  CheckSquare2,
  Circle,
  CircleCheck,
  CircleDot,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";

const STATUS_ACTIONS = [
  {
    value: "TODO",
    label: "Todo",
    icon: Circle,
  },
  {
    value: "IN_PROGRESS",
    label: "In Progress",
    icon: CircleDot,
  },
  {
    value: "DONE",
    label: "Done",
    icon: CircleCheck,
  },
];

const TaskCard = ({
  task,
  assignee,
  onClick,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);

  const formatDueDate = (dueDate) => {
    if (!dueDate) {
      return "No due date";
    }

    return new Intl.DateTimeFormat("en", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(dueDate));
  };

  const handleCardClick = () => {
    onClick?.(task);
  };

  const handleEdit = (event) => {
    event.stopPropagation();
    setMenuOpen(false);
    onEdit?.(task);
  };

  const handleDelete = (event) => {
    event.stopPropagation();
    setMenuOpen(false);
    onDelete?.(task);
  };

  const handleStatusChange = (event, status) => {
    event.stopPropagation();
    setMenuOpen(false);

    if (status === task.status) {
      return;
    }

    onStatusChange?.(task, status);
  };

  const hasActions =
    onEdit || onDelete || onStatusChange;

  return (
    <article
      onClick={handleCardClick}
      className={`
        group relative
        rounded-card border border-border
        bg-surface p-4
        transition-all duration-200
        hover:-translate-y-0.5
        hover:border-primary/30
        hover:shadow-md
        ${onClick ? "cursor-pointer" : ""}
      `}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge type="status" value={task.status} />

          <Badge type="priority" value={task.priority} />
        </div>

        {hasActions && (
          <div ref={menuRef} className="relative">
            <button
              type="button"
              aria-label="Open task actions"
              aria-expanded={menuOpen}
              onClick={(event) => {
                event.stopPropagation();
                setMenuOpen((current) => !current);
              }}
              className="
                flex h-8 w-8 items-center justify-center
                rounded-lg
                text-text-muted
                transition-colors
                hover:bg-surface-secondary
                hover:text-text
              "
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>

            {menuOpen && (
              <div
                className="
                  absolute right-0 top-9 z-20
                  min-w-44
                  rounded-xl border border-border
                  bg-surface p-1.5
                  shadow-lg
                "
              >
                {onStatusChange && (
                  <>
                    <p
                      className="
                        px-3 py-2
                        text-xs font-medium
                        uppercase tracking-wide
                        text-text-muted
                      "
                    >
                      Change status
                    </p>

                    {STATUS_ACTIONS.map((status) => {
                      const StatusIcon = status.icon;
                      const isActive =
                        task.status === status.value;

                      return (
                        <button
                          key={status.value}
                          type="button"
                          disabled={isActive}
                          onClick={(event) =>
                            handleStatusChange(
                              event,
                              status.value,
                            )
                          }
                          className={`
                            flex w-full items-center gap-2
                            rounded-lg px-3 py-2
                            text-left text-sm
                            transition-colors
                            ${
                              isActive
                                ? "cursor-default bg-surface-secondary text-text"
                                : "text-text-secondary hover:bg-surface-secondary hover:text-text"
                            }
                          `}
                        >
                          <StatusIcon className="h-4 w-4" />

                          {status.label}
                        </button>
                      );
                    })}

                    {(onEdit || onDelete) && (
                      <div className="my-1 border-t border-border" />
                    )}
                  </>
                )}

                {onEdit && (
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="
                      flex w-full items-center gap-2
                      rounded-lg px-3 py-2
                      text-left text-sm text-text-secondary
                      transition-colors
                      hover:bg-surface-secondary
                      hover:text-text
                    "
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </button>
                )}

                {onDelete && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="
                      flex w-full items-center gap-2
                      rounded-lg px-3 py-2
                      text-left text-sm text-danger
                      transition-colors
                      hover:bg-danger/5
                    "
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <h3
        className="
          mb-4 line-clamp-2
          text-base font-semibold text-text
        "
      >
        {task.title}
      </h3>

      <div
        className="
          mb-4 h-36 overflow-hidden
          rounded-xl border border-border
          bg-surface-secondary
        "
      >
        {task.imageUrl ? (
          <img
            src={task.imageUrl}
            alt={task.title}
            className="
              h-full w-full object-cover
              transition-transform duration-200
              group-hover:scale-[1.02]
            "
          />
        ) : (
          <div
            className="
              flex h-full items-center justify-center
              bg-primary-light
            "
          >
            <CheckSquare2 className="h-12 w-12 text-primary/60" />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-4">
        <div
          className="
            flex min-w-0 items-center gap-2
            text-sm text-text-secondary
          "
        >
          <CalendarDays className="h-4 w-4 shrink-0 text-text-muted" />

          <span className="truncate">
            {formatDueDate(task.dueDate)}
          </span>
        </div>

        {assignee ? (
          <Avatar name={assignee.name} size="sm" />
        ) : (
          <div
            title="Unassigned"
            className="
              flex h-8 w-8 items-center justify-center
              rounded-full border border-dashed border-border
              text-xs font-medium text-text-muted
            "
          >
            —
          </div>
        )}
      </div>
    </article>
  );
};

export default TaskCard;