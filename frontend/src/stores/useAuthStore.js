import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import { authService } from "@/services/authService.js";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      loading: false,

      // ===== SETTERS =====
      setAccessToken: (accessToken) => {
        set({ accessToken });
      },

      clearState: () => {
        set({
          accessToken: null,
          user: null,
          loading: false,
        });
      },

      // ===== AUTH =====
      signUp: async (userName, password, email, firstName, lastName) => {
        try {
          set({ loading: true });
          await authService.signUp(
            userName,
            password,
            email,
            firstName,
            lastName
          );
          toast.success("Sign up successfully! Redirect to Sign in page");
        } catch (error) {
          console.error("SignUp error:", error);
          const errorMessage = error.response?.data?.message || error.message;
          if (error.response?.status === 409) {
            toast.error("UserName already exists!");
          } else {
            toast.error(errorMessage || "Sign up failed!");
          }
          // Throw error để component có thể catch và không navigate
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      signIn: async (userName, password) => {
        try {
          set({ loading: true });

          const result = await authService.signIn(userName, password);
          const accessToken = result?.accessToken || result?.data?.accessToken;

          if (!accessToken) {
            throw new Error("Access token not found");
          }

          console.log("AccessToken received:", accessToken);
          set({ accessToken });
          console.log("AccessToken saved to store:", get().accessToken);

          await get().fetchMe();

          toast.success("Welcome back 🎉");
        } catch (error) {
          console.error("SignIn error:", error);
          get().clearState();
          toast.error("Sign in unsuccessful!");
        } finally {
          set({ loading: false });
        }
      },

      signOut: async () => {
        try {
          set({ loading: true });
          await authService.signOut();
          get().clearState();
          toast.success("Logout successfully!");
        } catch (error) {
          console.error("SignOut error:", error);
          toast.error("Logout failed!");
        } finally {
          set({ loading: false });
        }
      },

      // ===== USER =====
      fetchMe: async () => {
        try {
          set({ loading: true });
          const user = await authService.fetchMe();
          set({ user });
        } catch (error) {
          console.error("FetchMe error:", error);

          // ❗ chỉ clear khi token thật sự invalid
          get().clearState();

          toast.error("Session expired. Please login again!");
        } finally {
          set({ loading: false });
        }
      },

      // ===== REFRESH TOKEN =====
      refresh: async () => {
        try {
          set({ loading: true });
          const accessToken = await authService.refresh();
          set({ accessToken });

          if (!get().user) {
            await get().fetchMe();
          }
        } catch (error) {
          console.error("Refresh error:", error);
          get().clearState();
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "auth-storage", // key trong localStorage
      partialize: (state) => ({
        accessToken: state.accessToken, // ✅ CHỈ LƯU TOKEN
      }),
    }
  )
);
