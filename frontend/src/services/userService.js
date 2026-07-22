import api from "@/api/axios";

const getCurrentUserProfile = async () => {
  const response = await api.get("/users/profile");

  return response.data;
};

const updateCurrentUserProfile = async (profileData) => {
  const response = await api.put(
    "/users/profile",
    profileData,
  );

  return response.data;
};

const changePassword = async (passwordData) => {
  const response = await api.put(
    "/users/password",
    passwordData,
  );

  return response.data;
};

const userService = {
  getCurrentUserProfile,
  updateCurrentUserProfile,
  changePassword,
};

export default userService;