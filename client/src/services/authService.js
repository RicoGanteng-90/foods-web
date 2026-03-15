import api from "./api";

export const login = async (email, password) => {
  const { data } = await api.post("/auth/login-user", { email, password });
  return data.result;
};
