import axios from "axios";
import { authAPI } from "@/services/api";
import { LoginResponse } from "@/types";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true, // Important for cookies (refresh tokens)
});

// Request interceptor to add access token
api.interceptors.request.use(
  (config) => {
    // Check for staff/admin token first
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // Check for member token
      const memberToken = localStorage.getItem("memberToken");
      if (memberToken) {
        config.headers.Authorization = `Bearer ${memberToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Check if this is a member or staff request
        const isMemberRequest = localStorage.getItem("memberToken");

        if (isMemberRequest) {
          // For members, just redirect to member login on 401
          localStorage.removeItem("memberToken");
          localStorage.removeItem("memberData");
          window.location.href = "/members/login";
          return Promise.reject(error);
        } else {
          // Try to refresh the staff/admin token
          const response = await authAPI.refreshToken();
          const responseData = response.data as LoginResponse;

          if (responseData.isSuccess && responseData.token) {
            // Update the token in localStorage
            localStorage.setItem("token", responseData.token);
            if (responseData.user) {
              localStorage.setItem("user", JSON.stringify(responseData.user));
            }

            // Retry the original request with new token
            originalRequest.headers.Authorization = `Bearer ${responseData.token}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        // Refresh failed, redirect to appropriate login
        const isMember = localStorage.getItem("memberToken");
        if (isMember) {
          localStorage.removeItem("memberToken");
          localStorage.removeItem("memberData");
          window.location.href = "/members/login";
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("userData");
          window.location.href = "/auth/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
