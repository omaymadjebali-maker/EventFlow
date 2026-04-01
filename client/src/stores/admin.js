import { defineStore } from "pinia";
import { apiFetch } from "../api/http";
import { useAuthStore } from "./auth";

export const useAdminStore = defineStore("admin", {
  state: () => ({
    stats: {
      users: 0,
      events: 0,
      registrations: 0,
    },
    recentEvents: [],
    loading: false,
    error: "",
  }),

  actions: {
    async fetchStats() {
      this.loading = true;
      this.error = "";

      try {
        const auth = useAuthStore();

        const data = await apiFetch("/admin/stats", {
          token: auth.token
        });

        this.stats = data.stats || {
          users: 0,
          events: 0,
          registrations: 0,
        };

        this.recentEvents = data.recentEvents || [];
      } catch (error) {
        this.error = error.message || "Impossible de charger le dashboard admin";
      } finally {
        this.loading = false;
      }
    },
  },
});