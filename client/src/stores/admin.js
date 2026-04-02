import { defineStore } from "pinia";
import { apiFetch } from "../api/http";
import { useAuthStore } from "./auth";

export const useAdminStore = defineStore("admin", {
  state: () => ({
    stats: {
      users: 0,
      events: 0,
      registrations: 0,
      anonymizedUsers: 0
    },
    roleDistribution: {
      admins: 0,
      organizers: 0,
      participants: 0
    },
    recentEvents: [],
    loading: false,
    error: ""
  }),
  actions: {
    async fetchStats() {
      const auth = useAuthStore();
      this.loading = true;
      this.error = "";

      try {
        const data = await apiFetch("/admin/stats", {
          token: auth.token
        });

        this.stats = data.stats || this.stats;
        this.roleDistribution = data.roleDistribution || this.roleDistribution;
        this.recentEvents = data.recentEvents || [];
      } catch (e) {
        this.error = e.message;
      } finally {
        this.loading = false;
      }
    }
  }
});
