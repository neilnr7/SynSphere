import api from "@/api/axios";

const getTasks = async (
  projectId,
  {
    status,
    assignedTo,
    search,
    page = 0,
    size = 10,
    sort = "createdAt,desc",
  } = {},
) => {
  const response = await api.get(
    `/projects/${projectId}/tasks`,
    {
      params: {
        status: status || undefined,
        assignedTo: assignedTo || undefined,
        search: search || undefined,
        page,
        size,
        sort,
      },
    },
  );

  return response.data;
};

const createTask = async (projectId, taskData) => {
  const response = await api.post(
    `/projects/${projectId}/tasks`,
    taskData,
  );

  return response.data;
};

const updateTask = async (projectId, taskId, taskData) => {
  const response = await api.put(
    `/projects/${projectId}/tasks/${taskId}`,
    taskData,
  );

  return response.data;
};

const updateTaskStatus = async (
  projectId,
  taskId,
  status,
) => {
  const response = await api.patch(
    `/projects/${projectId}/tasks/${taskId}/status`,
    {
      status,
    },
  );

  return response.data;
};

const deleteTask = async (projectId, taskId) => {
  const response = await api.delete(
    `/projects/${projectId}/tasks/${taskId}`,
  );

  return response.data;
};

const getTaskById = async (projectId, taskId) => {
  const response = await api.get(
    `/projects/${projectId}/tasks/${taskId}`,
  );

  return response.data;
};

const taskService = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
};

export default taskService;