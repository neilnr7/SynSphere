import { useEffect, useRef, useState } from "react";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import {
  CalendarDays,
  CheckSquare,
  FolderKanban,
  MoreHorizontal,
  Pencil,
} from "lucide-react";

const ProjectCard = ({ project, onClick, onEdit }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
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

  const formattedDeadline = project.deadline
    ? new Date(project.deadline).toLocaleDateString()
    : "No deadline";

  const handleCardClick = () => {
    onClick?.(project);
  };

  const handleEdit = (event) => {
    event.stopPropagation();

    setIsMenuOpen(false);
    onEdit?.(project);
  };

  return (
    <Card
      hoverable
      padding="none"
      className="group overflow-hidden"
    >
      <div
        role="button"
        tabIndex={0}
        onClick={handleCardClick}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            handleCardClick();
          }
        }}
        className="cursor-pointer"
      >
        <div className="p-5">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {project.tags?.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="
                    rounded-full
                    bg-primary-light
                    px-2.5 py-1
                    text-xs font-medium
                    text-primary
                  "
                >
                  {tag}
                </span>
              ))}
            </div>

            {onEdit && (
              <div
                ref={menuRef}
                className="relative shrink-0"
              >
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setIsMenuOpen((current) => !current);
                  }}
                  className="
                    flex h-8 w-8
                    items-center justify-center
                    rounded-button
                    text-text-muted
                    transition-colors duration-200
                    hover:bg-surface-secondary
                    hover:text-text
                    focus:outline-none
                    focus:ring-4 focus:ring-primary/10
                  "
                  aria-label="Project actions"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>

                {isMenuOpen && (
                  <div
                    className="
                      absolute right-0 top-10 z-20
                      w-36
                      rounded-button
                      border border-border
                      bg-surface
                      p-1.5
                      shadow-lg
                    "
                  >
                    <button
                      type="button"
                      onClick={handleEdit}
                      className="
                        flex w-full items-center gap-2
                        rounded-lg
                        px-3 py-2
                        text-left text-sm
                        text-text-secondary
                        transition-colors duration-200
                        hover:bg-surface-secondary
                        hover:text-text
                      "
                    >
                      <Pencil className="h-4 w-4" />

                      Edit
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <h3 className="truncate text-base font-semibold text-text">
            {project.name}
          </h3>
        </div>

        <div className="aspect-[16/7] overflow-hidden bg-surface-secondary">
          {project.imageUrl ? (
            <img
              src={project.imageUrl}
              alt={project.name}
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
            <FolderKanban className="h-12 w-12 text-primary/60" />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-4 p-5">
          <div className="flex min-w-0 items-center gap-4">
            <div
              className="
                flex items-center gap-1.5
                text-sm text-text-muted
              "
            >
              <CalendarDays className="h-4 w-4 shrink-0" />

              <span className="whitespace-nowrap">
                {formattedDeadline}
              </span>
            </div>

            <Avatar
              name={project.projectManagerName}
              size="sm"
            />
          </div>

          <div
            className="
              flex shrink-0 items-center gap-1.5
              text-sm text-text-secondary
            "
          >
            <CheckSquare className="h-4 w-4" />

            <span>
              {project.taskCount ?? 0}{" "}
              {project.taskCount === 1 ? "task" : "tasks"}
            </span>
          </div>
        </div>

        <div className="px-5 pb-5">
          <Badge type="priority" value={project.priority} />
        </div>
      </div>
    </Card>
  );
};

export default ProjectCard;