import {
  Activity,
  ListTodo,
  MessageSquare,
  UserPlus,
  Users,
} from "lucide-react";
import Button from "@/components/ui/Button";

const getActivityIcon = (entityType) => {
  switch (entityType) {
    case "TASK":
      return ListTodo;

    case "COMMENT":
      return MessageSquare;

    case "MEMBER":
      return UserPlus;

    case "PROJECT":
      return Users;

    default:
      return Activity;
  }
};

const getTaskTitle = (metadata) => {
  const match = metadata?.match(/Task "([^"]+)"/i);

  return match?.[1] || null;
};

const getCommentTaskTitle = (metadata) => {
  const match = metadata?.match(/task "([^"]+)"/i);

  return match?.[1] || null;
};

const formatStatus = (status) => {
  return status?.replaceAll("_", " ");
};

const getActivityMessage = (activity) => {
  const {
    userName,
    actionType,
    entityType,
    metadata,
  } = activity;

  if (entityType === "TASK") {
    const taskTitle = getTaskTitle(metadata);

    if (actionType === "CREATED" && taskTitle) {
      return (
        <>
          <span className="font-medium text-text">
            {userName}
          </span>{" "}
          created task{" "}
          <span className="font-medium text-text">
            "{taskTitle}"
          </span>
        </>
      );
    }

    if (actionType === "ASSIGNED" && taskTitle) {
      const assignedTo = metadata
        ?.split(" was assigned to ")[1]
        ?.trim();

      return (
        <>
          <span className="font-medium text-text">
            {userName}
          </span>{" "}
          assigned task{" "}
          <span className="font-medium text-text">
            "{taskTitle}"
          </span>
          {assignedTo && (
            <>
              {" "}
              to{" "}
              <span className="font-medium text-text">
                {assignedTo}
              </span>
            </>
          )}
        </>
      );
    }

    if (actionType === "UPDATED" && taskTitle) {
      return (
        <>
          <span className="font-medium text-text">
            {userName}
          </span>{" "}
          updated task{" "}
          <span className="font-medium text-text">
            "{taskTitle}"
          </span>
        </>
      );
    }

    if (
      actionType === "STATUS_CHANGED" &&
      taskTitle
    ) {
      return (
        <>
          <span className="font-medium text-text">
            {userName}
          </span>{" "}
          changed the status of task{" "}
          <span className="font-medium text-text">
            "{taskTitle}"
          </span>
        </>
      );
    }

    if (actionType === "DELETED" && taskTitle) {
      return (
        <>
          <span className="font-medium text-text">
            {userName}
          </span>{" "}
          deleted task{" "}
          <span className="font-medium text-text">
            "{taskTitle}"
          </span>
        </>
      );
    }
  }

  if (entityType === "PROJECT") {
    const projectMatch = metadata?.match(
      /Project "([^"]+)"/i,
    );

    const projectName = projectMatch?.[1];

    if (actionType === "CREATED" && projectName) {
      return (
        <>
          <span className="font-medium text-text">
            {userName}
          </span>{" "}
          created project{" "}
          <span className="font-medium text-text">
            "{projectName}"
          </span>
        </>
      );
    }

    if (actionType === "UPDATED" && projectName) {
      return (
        <>
          <span className="font-medium text-text">
            {userName}
          </span>{" "}
          updated project{" "}
          <span className="font-medium text-text">
            "{projectName}"
          </span>
        </>
      );
    }
  }

  if (entityType === "MEMBER") {
    const memberName = metadata
      ?.split(" was ")[0]
      ?.trim();

    if (actionType === "ADDED" && memberName) {
      return (
        <>
          <span className="font-medium text-text">
            {userName}
          </span>{" "}
          added{" "}
          <span className="font-medium text-text">
            {memberName}
          </span>{" "}
          to the project
        </>
      );
    }

    if (actionType === "REMOVED" && memberName) {
      return (
        <>
          <span className="font-medium text-text">
            {userName}
          </span>{" "}
          removed{" "}
          <span className="font-medium text-text">
            {memberName}
          </span>{" "}
          from the project
        </>
      );
    }
  }

  if (entityType === "COMMENT") {
    const taskTitle = getCommentTaskTitle(metadata);

    if (actionType === "ADDED" && taskTitle) {
      return (
        <>
          <span className="font-medium text-text">
            {userName}
          </span>{" "}
          added a comment to task{" "}
          <span className="font-medium text-text">
            "{taskTitle}"
          </span>
        </>
      );
    }

    if (actionType === "UPDATED" && taskTitle) {
      return (
        <>
          <span className="font-medium text-text">
            {userName}
          </span>{" "}
          updated a comment on task{" "}
          <span className="font-medium text-text">
            "{taskTitle}"
          </span>
        </>
      );
    }

    if (actionType === "DELETED" && taskTitle) {
      return (
        <>
          <span className="font-medium text-text">
            {userName}
          </span>{" "}
          deleted a comment from task{" "}
          <span className="font-medium text-text">
            "{taskTitle}"
          </span>
        </>
      );
    }
  }

  return (
    <>
      <span className="font-medium text-text">
        {userName}
      </span>{" "}
      performed an activity
    </>
  );
};

const getActivityDetail = (activity) => {
  if (
    activity.entityType === "TASK" &&
    activity.actionType === "STATUS_CHANGED"
  ) {
    const statusMatch = activity.metadata?.match(
      /status changed from ([A-Z_]+) to ([A-Z_]+)/,
    );

    if (statusMatch) {
      return `${formatStatus(statusMatch[1])} → ${formatStatus(
        statusMatch[2],
      )}`;
    }
  }

  return null;
};

const formatActivityDate = (createdAt) => {
  if (!createdAt) {
    return "";
  }

  return new Date(createdAt).toLocaleString();
};

const ActivityFeed = ({
  activities,
  hasMore,
  onLoadMore,
  actionFilter,
  entityFilter,
  onActionFilterChange,
  onEntityFilterChange,
}) => {
  return (
    <div
      className="
        overflow-hidden
        rounded-card
        border border-border
        bg-surface
      "
    >
      <div
        className="
          flex flex-col gap-4
          border-b border-border
          px-5 py-4
          sm:flex-row sm:items-center sm:justify-between
        "
      >
        <div>
          <h2 className="font-semibold text-text">
            Recent Activity
          </h2>

          <p className="mt-1 text-sm text-text-secondary">
            Latest actions and updates in this project.
          </p>
        </div>

        <div
          className="
            flex flex-col gap-2
            sm:flex-row sm:items-center
          "
        >
          <select
            value={actionFilter}
            onChange={(event) =>
              onActionFilterChange(event.target.value)
            }
            className="
              rounded-lg
              border border-border
              bg-surface
              px-3 py-2
              text-sm text-text
              outline-none
              transition-colors
              focus:border-primary
            "
          >
            <option value="">All actions</option>
            <option value="CREATED">Created</option>
            <option value="UPDATED">Updated</option>
            <option value="DELETED">Deleted</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="STATUS_CHANGED">
              Status changed
            </option>
            <option value="ADDED">Added</option>
            <option value="REMOVED">Removed</option>
          </select>

          <select
            value={entityFilter}
            onChange={(event) =>
              onEntityFilterChange(event.target.value)
            }
            className="
              rounded-lg
              border border-border
              bg-surface
              px-3 py-2
              text-sm text-text
              outline-none
              transition-colors
              focus:border-primary
            "
          >
            <option value="">All activity</option>
            <option value="PROJECT">Projects</option>
            <option value="TASK">Tasks</option>
            <option value="COMMENT">Comments</option>
            <option value="MEMBER">Members</option>
          </select>
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <Activity
            className="
              mx-auto h-8 w-8
              text-text-muted
            "
          />

          <p className="mt-3 text-sm font-medium text-text">
            No activity found
          </p>

          <p className="mt-1 text-sm text-text-muted">
            No project activity matches the selected filters.
          </p>
        </div>
      ) : (
        <>
          <div className="divide-y divide-border">
            {activities.map((activity) => {
              const ActivityIcon = getActivityIcon(
                activity.entityType,
              );

              const activityDetail =
                getActivityDetail(activity);

              return (
                <div
                  key={activity.activityId}
                  className="
                    flex gap-3
                    px-5 py-4
                  "
                >
                  <div
                    className="
                      flex h-9 w-9 shrink-0
                      items-center justify-center
                      rounded-full
                      bg-primary-light
                      text-primary
                    "
                  >
                    <ActivityIcon className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-text-secondary">
                      {getActivityMessage(activity)}
                    </p>

                    {activityDetail && (
                      <p
                        className="
                          mt-1
                          text-sm text-text-muted
                        "
                      >
                        {activityDetail}
                      </p>
                    )}

                    <p
                      className="
                        mt-1
                        text-xs text-text-muted
                      "
                    >
                      {formatActivityDate(
                        activity.createdAt,
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {hasMore && (
            <div
              className="
                border-t border-border
                px-5 py-4
                text-center
              "
            >
              <Button
                variant="secondary"
                onClick={onLoadMore}
              >
                Load more activity
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ActivityFeed;