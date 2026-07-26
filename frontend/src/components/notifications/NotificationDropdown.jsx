import {
  Bell,
  ListTodo,
  MessageSquare,
  UserPlus,
  Users,
} from "lucide-react";

const getNotificationIcon = (entityType) => {
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
      return Bell;
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

const getNotificationMessage = (notification) => {
  const {
    userName,
    actionType,
    entityType,
    metadata,
  } = notification;

  if (entityType === "TASK") {
    const taskTitle = getTaskTitle(metadata);

    if (actionType === "CREATED" && taskTitle) {
      return `${userName} created task "${taskTitle}"`;
    }

    if (actionType === "ASSIGNED" && taskTitle) {
      const assignedTo = metadata
        ?.split(" was assigned to ")[1]
        ?.trim();

      return assignedTo
        ? `${userName} assigned task "${taskTitle}" to ${assignedTo}`
        : `${userName} assigned task "${taskTitle}"`;
    }

    if (actionType === "UPDATED" && taskTitle) {
      return `${userName} updated task "${taskTitle}"`;
    }

    if (
      actionType === "STATUS_CHANGED" &&
      taskTitle
    ) {
      return `${userName} changed the status of task "${taskTitle}"`;
    }

    if (actionType === "DELETED" && taskTitle) {
      return `${userName} deleted task "${taskTitle}"`;
    }
  }

  if (entityType === "PROJECT") {
    const projectMatch = metadata?.match(
      /Project "([^"]+)"/i,
    );

    const projectName = projectMatch?.[1];

    if (actionType === "CREATED" && projectName) {
      return `${userName} created project "${projectName}"`;
    }

    if (actionType === "UPDATED" && projectName) {
      return `${userName} updated project "${projectName}"`;
    }
  }

  if (entityType === "MEMBER") {
    const memberName = metadata
      ?.split(" was ")[0]
      ?.trim();

    if (actionType === "ADDED" && memberName) {
      return `${userName} added ${memberName} to the project`;
    }

    if (actionType === "REMOVED" && memberName) {
      return `${userName} removed ${memberName} from the project`;
    }
  }

  if (entityType === "COMMENT") {
    const taskTitle = getCommentTaskTitle(metadata);

    if (actionType === "ADDED" && taskTitle) {
      return `${userName} added a comment to task "${taskTitle}"`;
    }

    if (actionType === "UPDATED" && taskTitle) {
      return `${userName} updated a comment on task "${taskTitle}"`;
    }

    if (actionType === "DELETED" && taskTitle) {
      return `${userName} deleted a comment from task "${taskTitle}"`;
    }
  }

  return `${userName || "Someone"} performed an activity`;
};

const getNotificationDetail = (notification) => {
  if (
    notification.entityType === "TASK" &&
    notification.actionType === "STATUS_CHANGED"
  ) {
    const statusMatch = notification.metadata?.match(
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

const formatNotificationDate = (createdAt) => {
  if (!createdAt) {
    return "";
  }

  return new Date(createdAt).toLocaleString();
};

const NotificationDropdown = ({
  notifications,
  hasMore,
  onLoadMore,
  onMarkAllRead,
  onClearNotifications,
  onNotificationClick,
}) => {
  return (
    <div
      className="
        fixed left-4 right-4 top-20 z-50
        overflow-hidden
        rounded-card
        border border-border
        bg-surface
        shadow-lg
        sm:absolute sm:left-auto sm:right-0 sm:top-12
        sm:w-96
      "
    >
      <div
        className="
          flex items-center justify-between
          border-b border-border
          px-4 py-3
        "
      >
        <h2 className="font-semibold text-text">
          Notifications
        </h2>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMarkAllRead}
            className="
              text-xs font-medium text-primary
              transition-colors
              hover:opacity-80
            "
          >
            Mark all as read
          </button>

          <button
            type="button"
            onClick={onClearNotifications}
            className="
              text-xs font-medium text-danger
              transition-colors
              hover:opacity-80
            "
          >
            Clear
          </button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <Bell className="mx-auto h-7 w-7 text-text-muted" />

          <p className="mt-3 text-sm font-medium text-text">
            No notifications
          </p>

          <p className="mt-1 text-sm text-text-muted">
            You're all caught up.
          </p>
        </div>
      ) : (
        <div className="max-h-[420px] overflow-y-auto">
          {notifications.map((notification) => {
            const NotificationIcon = getNotificationIcon(
              notification.entityType,
            );

            const notificationDetail =
              getNotificationDetail(notification);

            return (
              <button
                type="button"
                key={notification.notification_id}
                onClick={() =>
                  onNotificationClick(notification)
                }
                className={`
                  flex w-full gap-3
                  border-b border-border
                  px-4 py-3
                  text-left
                  transition-colors
                  last:border-b-0
                  hover:bg-surface-secondary
                  ${
                    notification.isRead
                      ? "bg-surface"
                      : "bg-primary-light"
                  }
                `}
              >
                <div
                  className="
                    flex h-9 w-9 shrink-0
                    items-center justify-center
                    rounded-full
                    bg-surface-secondary
                    text-primary
                  "
                >
                  <NotificationIcon className="h-4 w-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm text-text-secondary">
                    {getNotificationMessage(notification)}
                  </p>

                  {notificationDetail && (
                    <p className="mt-1 text-sm text-text-muted">
                      {notificationDetail}
                    </p>
                  )}

                  <p className="mt-1 text-xs text-text-muted">
                    {formatNotificationDate(
                      notification.createdAt,
                    )}
                  </p>
                </div>

                {!notification.isRead && (
                  <span
                    className="
                      mt-2 h-2 w-2 shrink-0
                      rounded-full
                      bg-primary
                    "
                    aria-label="Unread notification"
                  />
                )}
              </button>
            );
          })}

          {hasMore && (
            <div
              className="
                border-t border-border
                px-4 py-3
                text-center
              "
            >
              <button
                type="button"
                onClick={onLoadMore}
                className="
                  text-sm font-medium text-primary
                  transition-colors
                  hover:opacity-80
                "
              >
                Load more notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;