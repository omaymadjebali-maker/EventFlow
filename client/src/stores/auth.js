import { defineStore } from "pinia";
import { apiFetch } from "../api/http";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || "",
    user: JSON.parse(localStorage.getItem("user") || "null")
  }),
  getters: {
    isLogged: (s) => !!s.token,
    role: (s) => s.user?.role || null
  },
  actions: {
    async login(email, password) {
      const data = await apiFetch("/auth/login", { method: "POST", body: { email, password } });
      this.token = data.token;
      this.user = data.user;
      localStorage.setItem("token", this.token);
      localStorage.setItem("user", JSON.stringify(this.user));
    },
    async register(email, password, role) {
      await apiFetch("/auth/register", { method: "POST", body: { email, password, role } });
    },
    logout() {
      this.token = "";
      this.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }
});
