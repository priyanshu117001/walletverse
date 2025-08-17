import api from "./api";

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export async function login(email: string, password: string) {
  const response = await api.post<LoginResponse>("/auth/login", {
    email,
    password,
  });
  if (response.data.access_token) {
    localStorage.setItem("token", response.data.access_token);
  }
  return response.data;
}

export async function register(email: string, password: string, name: string) {
  return api.post("/auth/register", { email, password, name });
}

export function logout() {
  localStorage.removeItem("token");
}
