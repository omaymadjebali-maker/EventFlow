import { defineStore } from "pinia";
import { apiFetch } from "../api/http";
import { useAuthStore } from "./auth";

export const useEventsStore = defineStore("events", {
  state: () => ({
    items: [],
    loading: false,
    error: ""
  }),
  actions: {
    async fetchEvents() {
      this.loading = true;
      this.error = "";
      try {
        this.items = await apiFetch("/events");
      } catch (e) {
        this.error = e.message;
      } finally {
        this.loading = false;
      }
    },
    async createEvent(payload) {
      const auth = useAuthStore();
      const created = await apiFetch("/events", {
        token: auth.token,
        method: "POST",
        body: payload
      });
      this.items.unshift(created);
      return created;
    },
    async register(eventId) {
      const auth = useAuthStore();
      const data = await apiFetch(`/events/${eventId}/register`, {
        token: auth.token,
        method: "POST"
      });
      await this.fetchEvents();
      return data;
    },
    
    async deleteEvent(eventId) {
      const auth = useAuthStore();
      await apiFetch(`/events/${eventId}`, {
        token: auth.token,
        method: "DELETE"
      });

      this.items = this.items.filter(e => e._id !== eventId);
    },

    async updateEvent(eventId, payload) {
      const auth = useAuthStore();
      const updated = await apiFetch(`/events/${eventId}`, {
        token: auth.token,
        method: "PUT",
        body: payload
      });

      const index = this.items.findIndex(e => e._id === eventId);
      if (index !== -1) this.items[index] = updated;

      return updated;
    },

    async fetchMyEvents() {
      const auth = useAuthStore();
      return await apiFetch("/events/mine", {
        token: auth.token
      });
    },

    async fetchRegisteredEvents() {
      const auth = useAuthStore();
      return await apiFetch("/events/registered", {
        token: auth.token
      });
    },

    async fetchParticipants(eventId) {
      const auth = useAuthStore();
      return await apiFetch(`/events/${eventId}/participants`, {
        token: auth.token
      });
    }
  }
});
