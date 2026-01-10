import api from "./axios";

export const authService = {
  //dang ki tai khoan
  signUp: async (userName, password, email, firstName, lastName) => {
    const res = await api.post(
      "/auth/signup",
      {
        userName,
        password,
        email,
        firstName,
        lastName,
      },
      { withCredentials: true }
    );
    return res.data;
  },

  //dang nhap, backend. tra ve accessToken
  signIn: async (userName, password) => {
    const res = await api.post(
      "/auth/signin",
      { userName, password },
      { withCredentials: true }
    );
    return res.data;
  },
  // dang xuat backend se clear refresh token cookie
  signOut: async () => {
    const res = await api.post("/auth/signout", {}, { withCredentials: true });
    return res.data;
  },

  //lay thong tin user hien tai
  fetchMe: async () => {
    const res = await api.get("/users/me", { withCredentials: true });
    return res.data.user;
  },

  //refresh access token (thường dùng trong interceptor)
  refresh: async () => {
    const res = await api.post("/auth/refresh", {}, { withCredentials: true });
    return res.data.accessToken;
  },
};

export default authService;
