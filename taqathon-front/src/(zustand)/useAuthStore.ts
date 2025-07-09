import { create } from "zustand";
//
import apiClient from "@/lib/api";
import { authState } from "@/types/user.types";

export const useAuthStore = create<authState>((set) => ({
  user: {},

  login: async (data) => {
    try {
      const response = await apiClient.post("/auth/login", data);
      console.log("Login successful:", response);
      set({ user: response.data });
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  },

  setUser: (user) => {
    set({ user });
  },

  register: async (data) => {
    try {
      const { sec_password, ...rest } = data;
      const response = await apiClient.post("/user", rest);
      console.log("response : ", response);

      if (response.data === "") return false;
      console.log("Registration successful:", response);
      return true;
    } catch (error) {
      console.error("Registration failed:", error);
      return false;
    }
  },
}));
