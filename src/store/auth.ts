import { create } from "zustand";
import {
  login as loginApi,
  logout as logoutApi,
} from "../services/authService";

export type Role = "user" | "admin";
export interface User {
  email: string;
  role: Role;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

const useAuth = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await loginApi(email, password);
      // For now, we'll use a simple role detection
      // In a real app, you'd decode the JWT token to get user info
      const role = email.includes("admin") ? "admin" : "user";
      set({ user: { email, role }, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  logout: () => {
    logoutApi();
    set({ user: null });
  },
  setUser: (user: User) => set({ user }),
}));

export default useAuth;
