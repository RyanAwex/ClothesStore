import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const API_AUTH =
  import.meta.env.VITE_MODE === "development"
    ? `http://localhost:5000/api/auth`
    : `${API_URL}/api/auth`;

axios.defaults.withCredentials = true;

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      profile: null,
      isAuthenticated: false,
      error: null,
      isLoading: false,
      isCheckingAuth: true,
      message: null,

      signup: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(`${API_AUTH}/signup`, {
            email,
            password,
          });
          set({
            user: response.data.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error.response.data.message || "Error signing up",
            isLoading: false,
          });
          throw error;
        }
      },
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(`${API_AUTH}/login`, {
            email,
            password,
          });
          set({
            isAuthenticated: true,
            user: response.data.user,
            error: null,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error.response?.data?.message || "Error logging in",
            isLoading: false,
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          await axios.post(`${API_AUTH}/logout`);
          set({
            user: null,
            isAuthenticated: false,
            error: null,
            isLoading: false,
          });
        } catch (error) {
          set({ error: "Error logging out", isLoading: false });
          throw error;
        }
      },
      verifyEmail: async (code) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(`${API_AUTH}/verify-email`, {
            code,
          });
          set({
            user: response.data.user,
            isAuthenticated: true,
            isLoading: false,
          });
          return response.data;
        } catch (error) {
          set({
            error: error.response.data.message || "Error verifying email",
            isLoading: false,
          });
          throw error;
        }
      },
      checkAuth: async () => {
        set({ isCheckingAuth: true, error: null });
        try {
          const response = await axios.get(`${API_AUTH}/check-auth`);
          set({
            user: response.data.user,
            isAuthenticated: true,
            isCheckingAuth: false,
          });
        } catch (error) {
          set({
            error: error.response?.data?.message || "Error checking auth",
            isCheckingAuth: false,
            isAuthenticated: false,
          });
        }
      },
      forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(`${API_AUTH}/forgot-password`, {
            email,
          });
          set({ message: response.data.message, isLoading: false });
        } catch (error) {
          set({
            isLoading: false,
            error:
              error.response.data.message ||
              "Error sending reset password email",
          });
          throw error;
        }
      },
      resetPassword: async (token, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(
            `${API_AUTH}/reset-password/${token}`,
            {
              password,
            },
          );
          set({ message: response.data.message, isLoading: false });
        } catch (error) {
          set({
            isLoading: false,
            error: error.response.data.message || "Error resetting password",
          });
          throw error;
        }
      },
      deleteAccount: async () => {
        set({ isLoading: true, error: null });
        try {
          await axios.delete(`${API_AUTH}/delete-account`);
          set({
            user: null,
            isAuthenticated: false,
            error: null,
            isLoading: false,
          });
        } catch (error) {
          set({ error: "Error logging out", isLoading: false });
          throw error;
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
