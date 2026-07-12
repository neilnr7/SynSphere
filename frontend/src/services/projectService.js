import api from "@/api/axios";

const getProjects = async () => {
  const response = await api.get("/projects");

  return response.data;
};

const getProjectById = async (projectId) => {
  const response = await api.get(`/projects/${projectId}`);

  return response.data;
};

const createProject = async (projectData) => {
  const response = await api.post("/projects", projectData);

  return response.data;
};

const updateProject = async (projectId, projectData) => {
  const response = await api.put(`/projects/${projectId}`, projectData);

  return response.data;
};

const getProjectMembers = async (projectId) => {
  const response = await api.get(`/projects/${projectId}/members`);

  return response.data;
};

const addProjectMember = async (projectId, memberData) => {
  const response = await api.post(
    `/projects/${projectId}/members`,
    memberData,
  );

  return response.data;
};

const removeProjectMember = async (projectId, userId) => {
  const response = await api.delete(
    `/projects/${projectId}/members/${userId}`,
  );

  return response.data;
};

const projectService = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  getProjectMembers,
  addProjectMember,
  removeProjectMember,
};

export default projectService;