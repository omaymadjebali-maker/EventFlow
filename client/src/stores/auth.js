import { defineStore } from "pinia";
import { apiFetch } from "../api/http";

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    localStorage.removeItem("user");
    return null;
  }
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || "",
    user: readStoredUser()
  }),
  getters: {
    isLogged: (s) => !!s.token && !!s.user,
    role: (s) => s.user?.role || null,
  },
  actions: {
    async login(email, password) {
      const data = await apiFetch("/auth/login", { method: "POST", body: { email, password } });
      this.token = data.token;
      this.user = data.user;
      localStorage.setItem("token", this.token);
      localStorage.setItem("user", JSON.stringify(this.user));
    },
    async register(email, password) {
      await apiFetch("/auth/register", { method: "POST", body: { email, password } });
    },
    logout() {
      this.token = "";
      this.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }
});
