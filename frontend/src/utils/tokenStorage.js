const TOKEN_KEY = "synsphere_token";

const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

const tokenStorage = {
  getToken,
  setToken,
  removeToken,
};

export default tokenStorage;