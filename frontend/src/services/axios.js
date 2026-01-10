import axios from "axios";
import { useAuthStore } from "@/stores/useAuthStore";

// Xác định baseURL cho dev & production
const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api";

// Tạo axios instance
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // ⚠️ BẮT BUỘC nếu refreshToken lưu bằng cookie (httpOnly)
});

/* =======================
   REQUEST INTERCEPTOR
   Gắn accessToken vào header
======================= */
api.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* =======================
   RESPONSE INTERCEPTOR
   Tự refresh token khi 401 / 403
======================= */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Các API KHÔNG được refresh token
    const ignoredUrls = ["/auth/signin", "/auth/signup", "/auth/refresh"];

    if (ignoredUrls.some((url) => originalRequest?.url?.includes(url))) {
      return Promise.reject(error);
    }

    // Chống loop vô hạn
    originalRequest._retryCount = originalRequest._retryCount || 0;

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      originalRequest._retryCount < 3
    ) {
      originalRequest._retryCount += 1;

      try {
        // Gọi API refresh
        const res = await api.post("/auth/refresh");

        const newAccessToken = res.data.accessToken;

        // Lưu token mới
        useAuthStore.getState().setAccessToken(newAccessToken);

        // Gắn token mới vào request cũ
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        // Refresh thất bại → logout
        useAuthStore.getState().clearState();

        if (window.location.pathname !== "/signin") {
          window.location.href = "/signin";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
