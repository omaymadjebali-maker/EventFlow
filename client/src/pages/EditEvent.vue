<template>
  <h2>Modifier l'événement</h2>

  <form @submit.prevent="onSubmit" style="display:grid;gap:10px;max-width:520px;">
    <input v-model="title" required />
    <textarea v-model="description"></textarea>
    <input v-model="date" type="datetime-local" required />
    <input v-model="location" required />
    <input v-model.number="capacity" type="number" min="1" required />

    <button>Mettre à jour</button>
  </form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useEventsStore } from "../stores/events";

const route = useRoute();
const router = useRouter();
const events = useEventsStore();

const title = ref("");
const description = ref("");
const date = ref("");
const location = ref("");
const capacity = ref(1);

onMounted(async () => {
  await events.fetchEvents();
  const ev = events.items.find(e => e._id === route.params.id);

  if (!ev) return;

  title.value = ev.title;
  description.value = ev.description;
  date.value = new Date(ev.date).toISOString().slice(0,16);
  location.value = ev.location;
  capacity.value = ev.capacity;
});

async function onSubmit() {
  await events.updateEvent(route.params.id, {
    title: title.value,
    description: description.value,
    date: new Date(date.value).toISOString(),
    location: location.value,
    capacity: capacity.value
  });

  router.push({ name: "dashboard" });
}
</script>