import api from "@/api/axios";

const getProjectActivities = async (
  projectId,
  params = {},
) => {
  const response = await api.get(
    `/projects/${projectId}/activities`,
    {
      params,
    },
  );

  return response.data;
};

const activityService = {
  getProjectActivities,
};

export default activityService;