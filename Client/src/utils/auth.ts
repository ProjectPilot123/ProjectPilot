import axios from "axios";

const API = "http://localhost:5000/api/auth";

export const signup = async (
  name: string,
  username: string,
  email: string,
  password: string
) => {
  const res = await axios.post(`${API}/signup`, {
    name,
    username,
    email,
    password,
  });

  localStorage.setItem("token", res.data.token);

  return res.data;
};

export const login = async (
  email: string,
  password: string
) => {
  const res = await axios.post(`${API}/login`, {
    email,
    password,
  });

  localStorage.setItem("token", res.data.token);

  return res.data;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const getProfile = async () => {
  const token = localStorage.getItem("token");

  return axios.get(`${API}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};