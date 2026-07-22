import api from "@/api/axios";

const getNotifications = async (params = {}) => {
  const response = await api.get("/notifications", {
    params,
  });

  return response.data;
};

const getUnreadNotifications = async (params = {}) => {
  const response = await api.get("/notifications/unread", {
    params,
  });

  return response.data;
};

const getUnreadNotificationCount = async () => {
  const response = await api.get("/notifications/unread/count");

  return response.data;
};

const updateNotificationReadStatus = async (
  notificationId,
  isRead,
) => {
  const response = await api.put(
    `/notifications/${notificationId}`,
    {
      isRead,
    },
  );

  return response.data;
};

const markAllNotificationsRead = async () => {
  const response = await api.put("/notifications/read-all");

  return response.data;
};

const clearNotifications = async () => {
  const response = await api.delete("/notifications");

  return response.data;
};

const notificationService = {
  getNotifications,
  getUnreadNotifications,
  getUnreadNotificationCount,
  updateNotificationReadStatus,
  markAllNotificationsRead,
  clearNotifications,
};

export default notificationService;