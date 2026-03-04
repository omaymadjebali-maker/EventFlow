<template>
  <h2>Créer un événement</h2>

  <form @submit.prevent="onSubmit" style="display:grid;gap:10px;max-width:520px;">
    <input v-model="title" placeholder="Titre" required minlength="3" maxlength="120" />
    <textarea v-model="description" placeholder="Description (optionnel)" rows="4" />
    <input v-model="date" type="datetime-local" required />
    <input v-model="location" placeholder="Lieu" required />
    <input v-model.number="capacity" type="number" min="1" placeholder="Capacité" required />

    <button :disabled="loading">{{ loading ? "..." : "Créer" }}</button>
    <p v-if="error" style="color:#b00020;">{{ error }}</p>
    <p v-if="msg" style="color:green;">{{ msg }}</p>
  </form>
</template>

<script setup>
import { ref } from "vue";
import { useEventsStore } from "../stores/events";
import { useRouter } from "vue-router";

const router = useRouter();
const events = useEventsStore();

const title = ref("");
const description = ref("");
const date = ref("");
const location = ref("");
const capacity = ref(50);

const loading = ref(false);
const error = ref("");
const msg = ref("");

async function onSubmit() {
  loading.value = true; error.value = ""; msg.value = "";
  try {
    await events.createEvent({
      title: title.value,
      description: description.value,
      date: new Date(date.value).toISOString(),
      location: location.value,
      capacity: capacity.value
    });
    msg.value = "✅ Événement créé";
    router.push({ name: "dashboard" });
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
}
</script>
