<template>
  <h2>Événements</h2>

  <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
    <input v-model="query" placeholder="Rechercher (titre/lieu)" />
    <select v-model="onlyAvailable">
      <option :value="false">Tous</option>
      <option :value="true">Places dispo</option>
    </select>
    <button @click="events.fetchEvents()">Rafraîchir</button>
  </div>

  <p v-if="events.loading">Chargement…</p>
  <p v-if="events.error" style="color:#b00020;">{{ events.error }}</p>

  <div style="display:grid; gap:12px; margin-top:16px;">
    <div v-for="ev in filtered" :key="ev._id" style="border:1px solid #eee; padding:12px; border-radius:10px;">
      <div style="display:flex; justify-content:space-between; gap:12px;">
        <div>
          <b>{{ ev.title }}</b>
          <div style="opacity:.7;">{{ formatDate(ev.date) }} • {{ ev.location }}</div>
          <p style="margin:8px 0 0;">{{ ev.description }}</p>
        </div>

        <div style="text-align:right; min-width:160px;">
          <div><b>{{ ev.remainingSeats }}</b> / {{ ev.capacity }} places</div>
          <button v-if="auth.isLogged" @click="onRegister(ev._id)" :disabled="ev.remainingSeats<=0">
            S'inscrire
          </button>
          <div v-else style="opacity:.7;">Connecte-toi pour t’inscrire</div>
          <div v-if="canManage(ev)" style="margin-top:8px;">
          <button @click="onEdit(ev)">Modifier</button>
          <button
            @click="onDelete(ev._id)"
            style="background:#b00020;color:white;margin-left:5px;">
            Supprimer
          </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <p v-if="toast" style="margin-top:12px; color:green;">{{ toast }}</p>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useEventsStore } from "../stores/events";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

const events = useEventsStore();
const auth = useAuthStore();
const router = useRouter();

const query = ref("");
const onlyAvailable = ref(false);
const toast = ref("");

onMounted(() => events.fetchEvents());

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase();
  return events.items.filter((e) => {
    const matches = !q || e.title.toLowerCase().includes(q) || e.location.toLowerCase().includes(q);
    const avail = !onlyAvailable.value || e.remainingSeats > 0;
    return matches && avail;
  });
});

function formatDate(d) {
  return new Date(d).toLocaleString();
}

async function onRegister(id) {
  toast.value = "";
  try {
    const r = await events.register(id);
    toast.value = `✅ Inscription OK — places restantes: ${r.remainingSeats}`;
  } catch (e) {
    toast.value = "";
    alert(e.message);
  }
}

function canManage(ev) {
  if (!auth.user) return false;

  const isAdmin = auth.user.role === "ADMIN";
  const isOwner = ev.organizerId.toString() === auth.user._id;

  return isAdmin || isOwner;
}

async function onDelete(id) {
  if (!confirm("Supprimer cet événement ?")) return;

  try {
    await events.deleteEvent(id);
    toast.value = "✅ Événement supprimé";
  } catch (e) {
    alert(e.message);
  }
}

function onEdit(ev) {
  router.push({ name: "edit-event", params: { id: ev._id } });
}

</script>

<style scoped>
input, select { padding: 8px; }
button { padding: 8px 10px; cursor:pointer; }
</style>
