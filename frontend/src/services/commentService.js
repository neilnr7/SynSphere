import api from "@/api/axios";

const getComments = async (projectId, taskId) => {
  const response = await api.get(
    `/projects/${projectId}/tasks/${taskId}/comments`,
  );

  return response.data;
};

const createComment = async (
  projectId,
  taskId,
  commentData,
) => {
  const response = await api.post(
    `/projects/${projectId}/tasks/${taskId}/comments`,
    commentData,
  );

  return response.data;
};

const updateComment = async (
  projectId,
  taskId,
  commentId,
  commentData,
) => {
  const response = await api.put(
    `/projects/${projectId}/tasks/${taskId}/comments/${commentId}`,
    commentData,
  );

  return response.data;
};

const deleteComment = async (
  projectId,
  taskId,
  commentId,
) => {
  const response = await api.delete(
    `/projects/${projectId}/tasks/${taskId}/comments/${commentId}`,
  );

  return response.data;
};

const commentService = {
  getComments,
  createComment,
  updateComment,
  deleteComment,
};

export default commentService;