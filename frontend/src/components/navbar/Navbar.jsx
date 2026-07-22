import { useEffect, useRef, useState } from "react";
import {
  Bell,
  LogOut,
  Menu,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import NotificationDropdown from "@/components/notifications/NotificationDropdown";
import ConfirmModal from "@/components/modals/ConfirmModal";
import notificationService from "@/services/notificationService";
import useAuth from "@/hooks/useAuth";

const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [notificationPage, setNotificationPage] = useState(null);
  const [isNotificationsOpen, setIsNotificationsOpen] =
    useState(false);
  const [isClearModalOpen, setIsClearModalOpen] =
    useState(false);
  const [isClearingNotifications, setIsClearingNotifications] =
    useState(false);

  const [profileImageError, setProfileImageError] =
    useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const data =
          await notificationService.getUnreadNotificationCount();

        setUnreadCount(data.count || 0);
      } catch (err) {
        console.error(
          "Unable to load unread notification count.",
          err,
        );
      }
    };

    fetchUnreadCount();
  }, []);

  useEffect(() => {
    setProfileImageError(false);
  }, [user?.profileImage]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationsOpen(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
    };
  }, []);

  const getInitials = (name) => {
    if (!name) {
      return "U";
    }

    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const handleNotificationClick = async () => {
    if (isNotificationsOpen) {
      setIsNotificationsOpen(false);
      return;
    }

    try {
      const data =
        await notificationService.getNotifications({
          page: 0,
          size: 10,
        });

      setNotifications(data.content || []);
      setNotificationPage(data);
      setIsProfileOpen(false);
      setIsNotificationsOpen(true);
    } catch (err) {
      console.error(
        "Unable to load notifications.",
        err,
      );
    }
  };

  const handleLoadMoreNotifications = async () => {
    if (!notificationPage || notificationPage.last) {
      return;
    }

    try {
      const nextPage = notificationPage.number + 1;

      const data =
        await notificationService.getNotifications({
          page: nextPage,
          size: 10,
        });

      setNotifications((currentNotifications) => [
        ...currentNotifications,
        ...(data.content || []),
      ]);

      setNotificationPage(data);
    } catch (err) {
      console.error(
        "Unable to load more notifications.",
        err,
      );
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllNotificationsRead();

      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      );

      setUnreadCount(0);
    } catch (err) {
      console.error(
        "Unable to mark all notifications as read.",
        err,
      );
    }
  };

  const handleClearNotifications = async () => {
    try {
      setIsClearingNotifications(true);

      await notificationService.clearNotifications();

      setNotifications([]);
      setNotificationPage(null);
      setUnreadCount(0);
      setIsClearModalOpen(false);
    } catch (err) {
      console.error(
        "Unable to clear notifications.",
        err,
      );
    } finally {
      setIsClearingNotifications(false);
    }
  };

  const handleNotificationSelect = async (notification) => {
    try {
      if (!notification.isRead) {
        await notificationService.updateNotificationReadStatus(
          notification.notification_id,
          true,
        );

        setNotifications((currentNotifications) =>
          currentNotifications.map((currentNotification) =>
            currentNotification.notification_id ===
            notification.notification_id
              ? {
                  ...currentNotification,
                  isRead: true,
                }
              : currentNotification,
          ),
        );

        setUnreadCount((currentCount) =>
          Math.max(currentCount - 1, 0),
        );
      }

      setIsNotificationsOpen(false);

      if (
        notification.entityType === "TASK" &&
        notification.actionType !== "DELETED"
      ) {
        navigate(
          `/projects/${notification.projectId}/tasks/${notification.entityId}`,
        );

        return;
      }

      navigate(`/projects/${notification.projectId}`);
    } catch (err) {
      console.error(
        "Unable to open notification.",
        err,
      );
    }
  };

  const handleProfileClick = () => {
    setIsNotificationsOpen(false);

    setIsProfileOpen((currentValue) => !currentValue);
  };

  const handleOpenSettings = () => {
    setIsProfileOpen(false);
    navigate("/settings");
  };

  const handleLogout = () => {
    setIsProfileOpen(false);
    logout();
  };

  return (
    <>
      <header
        className="
          flex h-16 items-center justify-between
          border-b border-border
          bg-surface
          px-4 sm:px-6 lg:px-8
        "
      >
        <button
          type="button"
          onClick={onMenuClick}
          className="
            flex h-10 w-10
            items-center justify-center
            rounded-button
            text-text-secondary
            transition-colors duration-200
            hover:bg-surface-secondary
            hover:text-text
            focus:outline-none
            focus:ring-4 focus:ring-primary/10
            md:hidden
          "
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="ml-auto flex items-center gap-2">
          <div
            ref={notificationRef}
            className="relative"
          >
            <button
              type="button"
              onClick={handleNotificationClick}
              className="
                relative
                flex h-10 w-10
                items-center justify-center
                rounded-button
                text-text-secondary
                transition-colors duration-200
                hover:bg-surface-secondary
                hover:text-text
                focus:outline-none
                focus:ring-4 focus:ring-primary/10
              "
              aria-label="Open notifications"
            >
              <Bell className="h-5 w-5" />

              {unreadCount > 0 && (
                <span
                  className="
                    absolute -right-1 -top-1
                    flex min-h-5 min-w-5
                    items-center justify-center
                    rounded-full
                    bg-danger
                    px-1
                    text-[10px] font-semibold
                    text-white
                  "
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            {isNotificationsOpen && (
              <NotificationDropdown
                notifications={notifications}
                hasMore={
                  notificationPage && !notificationPage.last
                }
                onLoadMore={handleLoadMoreNotifications}
                onMarkAllRead={handleMarkAllRead}
                onClearNotifications={() =>
                  setIsClearModalOpen(true)
                }
                onNotificationClick={handleNotificationSelect}
              />
            )}
          </div>

          <div
            ref={profileRef}
            className="relative"
          >
            <button
              type="button"
              onClick={handleProfileClick}
              className="
                flex h-10 w-10
                items-center justify-center
                overflow-hidden
                rounded-full
                bg-primary-light
                text-sm font-semibold
                text-primary
                transition-all duration-200
                hover:ring-4 hover:ring-primary/10
                focus:outline-none
                focus:ring-4 focus:ring-primary/10
              "
              aria-label="Open profile menu"
            >
              {user?.profileImage && !profileImageError ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  onError={() => setProfileImageError(true)}
                  className="h-full w-full object-cover"
                />
              ) : (
                getInitials(user?.name)
              )}
            </button>

            {isProfileOpen && (
              <div
                className="
                  absolute right-0 top-12 z-50
                  w-64
                  overflow-hidden
                  rounded-card
                  border border-border
                  bg-surface
                  shadow-lg
                "
              >
                <div className="border-b border-border px-4 py-4">
                  <p
                    className="
                      truncate
                      text-sm font-semibold
                      text-text
                    "
                  >
                    {user?.name || "User"}
                  </p>

                  <p
                    className="
                      mt-1 truncate
                      text-xs text-text-muted
                    "
                  >
                    {user?.email}
                  </p>
                </div>

                <div className="p-2">
                  <button
                    type="button"
                    onClick={handleOpenSettings}
                    className="
                      flex h-10 w-full
                      items-center gap-3
                      rounded-button
                      px-3
                      text-sm font-medium
                      text-text-secondary
                      transition-colors duration-200
                      hover:bg-surface-secondary
                      hover:text-text
                      focus:outline-none
                      focus:ring-4 focus:ring-primary/10
                    "
                  >
                    <Settings className="h-4 w-4 shrink-0" />

                    <span>Profile & Settings</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="
                      flex h-10 w-full
                      items-center gap-3
                      rounded-button
                      px-3
                      text-sm font-medium
                      text-text-secondary
                      transition-colors duration-200
                      hover:bg-surface-secondary
                      hover:text-text
                      focus:outline-none
                      focus:ring-4 focus:ring-primary/10
                    "
                  >
                    <LogOut className="h-4 w-4 shrink-0" />

                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <ConfirmModal
        open={isClearModalOpen}
        title="Clear notifications?"
        description="This will permanently delete all your notifications. This action cannot be undone."
        confirmLabel="Clear notifications"
        loading={isClearingNotifications}
        onConfirm={handleClearNotifications}
        onCancel={() => setIsClearModalOpen(false)}
      />
    </>
  );
};

export default Navbar;