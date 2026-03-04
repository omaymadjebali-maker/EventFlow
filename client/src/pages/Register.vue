<template>
  <h2>Inscription</h2>
  <form @submit.prevent="onSubmit" style="display:grid;gap:10px;max-width:360px;">
    <input v-model="email" type="email" placeholder="Email" required />
    <input v-model="password" type="password" placeholder="Mot de passe (min 6)" required />

    <select v-model="role">
      <option value="PARTICIPANT">Participant</option>
      <option value="ORGANIZER">Organisateur</option>
      <option value="ADMIN">Admin</option>
    </select>

    <button :disabled="loading">{{ loading ? "..." : "Créer le compte" }}</button>
    <p v-if="msg" style="color:green;">{{ msg }}</p>
    <p v-if="error" style="color:#b00020;">{{ error }}</p>
  </form>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();

const email = ref("");
const password = ref("");
const role = ref("PARTICIPANT");
const msg = ref("");
const error = ref("");
const loading = ref(false);

async function onSubmit() {
  loading.value = true; error.value = ""; msg.value = "";
  try {
    await auth.register(email.value, password.value, role.value);
    msg.value = "Compte créé. Tu peux te connecter.";
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
}
</script>
