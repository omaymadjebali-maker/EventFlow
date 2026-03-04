<template>
  <h2>Connexion</h2>
  <form @submit.prevent="onSubmit" style="display:grid;gap:10px;max-width:360px;">
    <input v-model="email" type="email" placeholder="Email" required />
    <input v-model="password" type="password" placeholder="Mot de passe" required />
    <button :disabled="loading">{{ loading ? "..." : "Se connecter" }}</button>
    <p v-if="error" style="color:#b00020;">{{ error }}</p>
  </form>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const auth = useAuthStore();

const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);

async function onSubmit() {
  loading.value = true; error.value = "";
  try {
    await auth.login(email.value, password.value);
    router.push({ name: "dashboard" });
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
}
</script>
