import api from "@/api/axios";

const getProjectDashboard = async (projectId) => {
  const response = await api.get(
    `/projects/${projectId}/dashboard`,
  );

  return response.data;
};

const getOverdueTasks = async (projectId, params = {}) => {
  const response = await api.get(
    `/projects/${projectId}/dashboard/overdue`,
    {
      params,
    },
  );

  return response.data;
};

const getMemberTaskStatistics = async (projectId) => {
  const response = await api.get(
    `/projects/${projectId}/dashboard/member-stats`,
  );

  return response.data;
};

const analyticsService = {
  getProjectDashboard,
  getOverdueTasks,
  getMemberTaskStatistics,
};

export default analyticsService;