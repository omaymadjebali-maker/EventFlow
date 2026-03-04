<template>
  <header style="border-bottom:1px solid #eee;">
    <div style="max-width:980px;margin:0 auto;padding:12px 16px;display:flex;gap:12px;align-items:center;justify-content:space-between;">
      <div style="display:flex;gap:12px;align-items:center;">
        <b>EVENTFLOW</b>
        <router-link to="/">Dashboard</router-link>
        <router-link v-if="canCreate" to="/create">Créer</router-link>
      </div>

      <div style="display:flex;gap:12px;align-items:center;">
        <span v-if="auth.isLogged">{{ auth.user.email }} ({{ auth.user.role }})</span>
        <router-link v-if="!auth.isLogged" to="/login">Login</router-link>
        <router-link v-if="!auth.isLogged" to="/register">Register</router-link>
        <button v-if="auth.isLogged" @click="auth.logout()">Logout</button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from "vue";
import { useAuthStore } from "../stores/auth";
const auth = useAuthStore();
const canCreate = computed(() => ["ADMIN", "ORGANIZER"].includes(auth.role));
</script>

<style scoped>
a { text-decoration: none; color: #333; }
a.router-link-active { font-weight: 700; }
button { padding: 6px 10px; cursor: pointer; }
</style>
