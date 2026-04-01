<template>
  <div class="dashboard-page">
    <div class="dashboard-shell">
      <!-- Header / Intro -->
      <section class="dashboard-hero">
        <div class="hero-left">
          <span class="hero-kicker">EventFlow · Plateforme événementielle</span>
          <h1 class="hero-title">Trouvez le bon événement, au bon moment.</h1>
          <p class="hero-description">
            Explorez les événements disponibles, filtrez rapidement par titre ou lieu,
            consultez les places restantes et inscrivez-vous en quelques secondes.
          </p>

          <div class="hero-actions">
            <router-link
              v-if="auth.isLogged && (auth.user?.role === 'ORGANIZER' || auth.user?.role === 'ADMIN')"
              :to="{ name: 'create' }"
              class="btn btn-primary"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Créer un événement
            </router-link>

            <button
              class="btn btn-ghost"
              :class="{ spinning: events.loading }"
              @click="events.fetchEvents()"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
              </svg>
              Actualiser
            </button>
          </div>
        </div>

        <div class="hero-right">
          <div class="stats-grid">
            <div class="stat-card">
              <span class="stat-icon">📅</span>
              <div>
                <p class="stat-value">{{ events.items.length }}</p>
                <p class="stat-label">Événements</p>
              </div>
            </div>

            <div class="stat-card">
              <span class="stat-icon">🎟️</span>
              <div>
                <p class="stat-value">{{ availableCount }}</p>
                <p class="stat-label">Avec places</p>
              </div>
            </div>

            <div class="stat-card">
              <span class="stat-icon">🔎</span>
              <div>
                <p class="stat-value">{{ filtered.length }}</p>
                <p class="stat-label">Résultats</p>
              </div>
            </div>

            <div class="stat-card accent">
              <span class="stat-icon">👤</span>
              <div>
                <p class="stat-value">{{ auth.user?.role || "Visiteur" }}</p>
                <p class="stat-label">Votre rôle</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Toolbar -->
      <section class="toolbar-card">
        <div class="toolbar-header">
          <div>
            <h2>Événements disponibles</h2>
            <p>
              {{ filtered.length }} événement{{ filtered.length > 1 ? "s" : "" }}
              affiché{{ filtered.length > 1 ? "s" : "" }}
            </p>
          </div>

          <div class="toolbar-badges">
            <span class="toolbar-chip">Vue dashboard</span>
            <span v-if="onlyAvailable" class="toolbar-chip active">Places disponibles</span>
          </div>
        </div>

        <div class="toolbar-controls">
          <div class="search-box" :class="{ focused: searchFocused }">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>

            <input
              v-model="query"
              type="text"
              placeholder="Rechercher un événement par titre ou lieu..."
              @focus="searchFocused = true"
              @blur="searchFocused = false"
            />

            <button v-if="query" class="clear-btn" @click="query = ''" title="Effacer">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div class="filter-group">
            <button
              class="filter-btn"
              :class="{ active: !onlyAvailable }"
              @click="onlyAvailable = false"
            >
              Tous
            </button>

            <button
              class="filter-btn"
              :class="{ active: onlyAvailable }"
              @click="onlyAvailable = true"
            >
              Places disponibles
            </button>
          </div>
        </div>
      </section>

      <!-- Loading -->
      <section v-if="events.loading" class="loading-grid">
        <div v-for="n in 6" :key="n" class="skeleton-card"></div>
      </section>

      <!-- Error -->
      <section v-else-if="events.error" class="error-card">
        <div class="error-icon">!</div>
        <div>
          <h3>Impossible de charger les événements</h3>
          <p>{{ events.error }}</p>
        </div>
      </section>

      <!-- Empty -->
      <section v-else-if="filtered.length === 0" class="empty-card">
        <div class="empty-icon">📭</div>
        <h3>Aucun événement trouvé</h3>
        <p>Essayez une autre recherche ou désactivez le filtre des places disponibles.</p>
      </section>

      <!-- Cards -->
      <section v-else class="event-grid">
        <article v-for="ev in filtered" :key="ev._id" class="event-card">
          <div class="event-card-top">
            <div class="event-date-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {{ formatDate(ev.date) }}
            </div>

            <span
              class="status-badge"
              :class="{
                success: ev.remainingSeats > 5,
                warning: ev.remainingSeats > 0 && ev.remainingSeats <= 5,
                danger: ev.remainingSeats === 0
              }"
            >
              {{ seatStatusLabel(ev) }}
            </span>
          </div>

          <div class="event-main">
            <h3 class="event-title">{{ ev.title }}</h3>

            <div class="meta-line">
              <span class="meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {{ ev.location || "Lieu non précisé" }}
              </span>
            </div>

            <p v-if="ev.description" class="event-description">
              {{ ev.description }}
            </p>
            <p v-else class="event-description muted">
              Aucun descriptif disponible pour cet événement.
            </p>
          </div>

          <div class="capacity-card">
            <div class="capacity-row">
              <span>Taux de remplissage</span>
              <strong>{{ ev.capacity - ev.remainingSeats }}/{{ ev.capacity }}</strong>
            </div>

            <div class="progress-track">
              <div
                class="progress-fill"
                :class="{
                  warning: ev.remainingSeats > 0 && ev.remainingSeats <= 5,
                  danger: ev.remainingSeats === 0
                }"
                :style="{ width: `${seatFillPercent(ev)}%` }"
              ></div>
            </div>

            <div class="capacity-footer">
              <span class="remaining-number" :class="{ warning: ev.remainingSeats <= 5 && ev.remainingSeats > 0, danger: ev.remainingSeats === 0 }">
                {{ ev.remainingSeats }}
              </span>
              <span class="remaining-text">
                place{{ ev.remainingSeats > 1 ? "s" : "" }} restante{{ ev.remainingSeats > 1 ? "s" : "" }}
              </span>
            </div>
          </div>

          <div class="event-actions">
            <button
              v-if="auth.isLogged"
              class="btn btn-register"
              :disabled="ev.remainingSeats <= 0"
              :class="{ disabled: ev.remainingSeats <= 0 }"
              @click="onRegister(ev._id)"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4">
                <path d="M5 13l4 4L19 7" />
              </svg>
              {{ ev.remainingSeats <= 0 ? "Complet" : "S'inscrire" }}
            </button>

            <p v-else class="login-hint">
              Connectez-vous pour vous inscrire
            </p>

            <div v-if="canManage(ev)" class="manage-row">
              <button class="btn btn-light" @click="onToggleParticipants(ev)">
                {{ participantsOpenId === ev._id ? "Masquer participants" : "Voir participants" }}
              </button>
              <button class="btn btn-light" @click="onEdit(ev)">
                Modifier
              </button>
              <button class="btn btn-danger" @click="onDelete(ev._id)">
                Supprimer
              </button>
            </div>

            <div v-if="participantsOpenId === ev._id" class="participants-panel">
              <div class="participants-head">
                <strong>Participants</strong>
                <span>
                  {{ participantsByEvent[ev._id]?.length || 0 }}
                  inscrit{{ (participantsByEvent[ev._id]?.length || 0) > 1 ? "s" : "" }}
                </span>
              </div>

              <div v-if="participantsLoadingId === ev._id" class="participants-state">
                Chargement des participants...
              </div>

              <div v-else-if="participantsError" class="participants-state error">
                {{ participantsError }}
              </div>

              <div
                v-else-if="!participantsByEvent[ev._id] || participantsByEvent[ev._id].length === 0"
                class="participants-state"
              >
                Aucun participant inscrit pour le moment.
              </div>

              <ul v-else class="participants-list">
                <li
                  v-for="participant in participantsByEvent[ev._id]"
                  :key="participant._id || participant.email"
                  class="participant-item"
                >
                  <div>
                    <strong>{{ participantDisplayName(participant) }}</strong>
                    <p>{{ participant.email || "Email non disponible" }}</p>
                  </div>
                  <span class="participant-role">{{ participant.role || "USER" }}</span>
                </li>
              </ul>
            </div>
          </div>
        </article>
      </section>
    </div>

    <!-- Toast -->
    <transition name="toast-slide">
      <div v-if="toast" class="toast" :class="toastType">
        {{ toast }}
      </div>
    </transition>
  </div>
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
const toastType = ref("success");
const searchFocused = ref(false);
const participantsOpenId = ref("");
const participantsLoadingId = ref("");
const participantsError = ref("");
const participantsByEvent = ref({});

let toastTimer = null;

onMounted(() => {
  events.fetchEvents();
});

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase();

  return events.items.filter((e) => {
    const title = e.title?.toLowerCase?.() || "";
    const location = e.location?.toLowerCase?.() || "";
    const matches = !q || title.includes(q) || location.includes(q);
    const avail = !onlyAvailable.value || e.remainingSeats > 0;
    return matches && avail;
  });
});

const availableCount = computed(() => {
  return events.items.filter((e) => e.remainingSeats > 0).length;
});

function formatDate(d) {
  return new Date(d).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function seatFillPercent(ev) {
  if (!ev.capacity || ev.capacity <= 0) return 0;
  return Math.min(100, ((ev.capacity - ev.remainingSeats) / ev.capacity) * 100);
}

function seatStatusLabel(ev) {
  if (ev.remainingSeats === 0) return "Complet";
  if (ev.remainingSeats <= 5) return "Dernières places";
  return "Disponible";
}

function participantDisplayName(participant) {
  const fullName = `${participant.firstName || ""} ${participant.lastName || ""}`.trim();
  return fullName || participant.email || "Participant";
}

function showToast(msg, type = "success") {
  toast.value = msg;
  toastType.value = type;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.value = "";
  }, 4000);
}

async function onRegister(id) {
  try {
    const r = await events.register(id);
    showToast(`Inscription confirmée — ${r.remainingSeats} place(s) restante(s)`);
  } catch (e) {
    showToast(e.message || "Une erreur est survenue", "error");
  }
}

function canManage(ev) {
  if (!auth.user) return false;
  return auth.user.role === "ADMIN" || ev.organizerId?.toString?.() === auth.user.id;
}

async function onDelete(id) {
  if (!confirm("Supprimer cet événement ?")) return;

  try {
    await events.deleteEvent(id);
    showToast("Événement supprimé");
  } catch (e) {
    showToast(e.message || "Suppression impossible", "error");
  }
}

function onEdit(ev) {
  router.push({ name: "edit-event", params: { id: ev._id } });
}

async function onToggleParticipants(ev) {
  if (participantsOpenId.value === ev._id) {
    participantsOpenId.value = "";
    participantsError.value = "";
    participantsLoadingId.value = "";
    return;
  }

  participantsOpenId.value = ev._id;
  participantsError.value = "";

  if (participantsByEvent.value[ev._id]) return;

  participantsLoadingId.value = ev._id;

  try {
    const data = await events.fetchParticipants(ev._id);
    participantsByEvent.value = {
      ...participantsByEvent.value,
      [ev._id]: data.participants || [],
    };
  } catch (e) {
    participantsError.value = e.message || "Impossible de charger les participants";
  } finally {
    participantsLoadingId.value = "";
  }
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");

* {
  box-sizing: border-box;
}

.dashboard-page {
  min-height: 100vh;
  padding: 32px 18px 80px;
  background:
    radial-gradient(circle at top left, rgba(37, 99, 235, 0.08), transparent 26%),
    radial-gradient(circle at top right, rgba(14, 165, 233, 0.08), transparent 22%),
    linear-gradient(180deg, #f8fbff 0%, #f3f7fc 100%);
  font-family: "Inter", system-ui, sans-serif;
  color: #0f172a;
}

.dashboard-shell {
  width: var(--app-container-width);
  max-width: none;
  margin: 0 auto;
}

.dashboard-hero {
  display: grid;
  grid-template-columns: 1.2fr 0.9fr;
  gap: 22px;
  margin-bottom: 22px;
  padding: 28px;
  border-radius: 28px;
  background:
    linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.95)),
    linear-gradient(135deg, #111827, #1e293b);
  color: white;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.16);
  position: relative;
  overflow: hidden;
}

.dashboard-hero::before {
  content: "";
  position: absolute;
  top: -80px;
  right: -80px;
  width: 240px;
  height: 240px;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.16);
  filter: blur(10px);
}

.dashboard-hero::after {
  content: "";
  position: absolute;
  bottom: -90px;
  left: 40%;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: rgba(14, 165, 233, 0.12);
  filter: blur(14px);
}

.hero-left,
.hero-right {
  position: relative;
  z-index: 1;
}

.hero-kicker {
  display: inline-flex;
  margin-bottom: 14px;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.82);
}

.hero-title {
  margin: 0 0 14px;
  font-size: clamp(2rem, 4vw, 3.4rem);
  line-height: 1.02;
  font-weight: 800;
  letter-spacing: -0.04em;
  max-width: 680px;
}

.hero-description {
  margin: 0;
  max-width: 640px;
  font-size: 1rem;
  line-height: 1.75;
  color: rgba(255, 255, 255, 0.8);
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  height: 100%;
  align-content: center;
}

.stat-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 18px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(14px);
}

.stat-card.accent {
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.24), rgba(14, 165, 233, 0.18));
}

.stat-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.12);
  font-size: 1.1rem;
}

.stat-value {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 800;
  line-height: 1.1;
  word-break: break-word;
}

.stat-label {
  margin: 6px 0 0;
  font-size: 0.88rem;
  color: rgba(255, 255, 255, 0.74);
}

.toolbar-card {
  padding: 22px;
  margin-bottom: 22px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #e5edf6;
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.06);
  backdrop-filter: blur(12px);
}

.toolbar-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
  margin-bottom: 18px;
  flex-wrap: wrap;
}

.toolbar-header h2 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.02em;
}

.toolbar-header p {
  margin: 6px 0 0;
  color: #64748b;
  font-size: 0.94rem;
}

.toolbar-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.toolbar-chip {
  padding: 8px 12px;
  border-radius: 999px;
  background: #f8fafc;
  color: #475569;
  border: 1px solid #e2e8f0;
  font-size: 0.8rem;
  font-weight: 700;
}

.toolbar-chip.active {
  background: #e0ecff;
  color: #1d4ed8;
  border-color: #cddfff;
}

.toolbar-controls {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 14px;
  align-items: center;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 58px;
  padding: 0 16px;
  border-radius: 18px;
  border: 1.5px solid #d9e3ef;
  background: #ffffff;
  transition: all 0.18s ease;
}

.search-box.focused {
  border-color: rgba(37, 99, 235, 0.5);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.08);
}

.search-box svg {
  color: #64748b;
  flex-shrink: 0;
}

.search-box input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  color: #0f172a;
  font-size: 0.96rem;
  font-family: inherit;
}

.search-box input::placeholder {
  color: #94a3b8;
}

.clear-btn {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border: none;
  border-radius: 999px;
  background: transparent;
  color: #64748b;
  cursor: pointer;
}

.clear-btn:hover {
  background: #f1f5f9;
}

.filter-group {
  display: inline-flex;
  padding: 4px;
  border-radius: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.filter-btn {
  min-height: 48px;
  padding: 0 16px;
  border: none;
  background: transparent;
  border-radius: 12px;
  color: #64748b;
  font-family: inherit;
  font-weight: 700;
  font-size: 0.92rem;
  cursor: pointer;
  transition: all 0.18s ease;
}

.filter-btn.active {
  background: #ffffff;
  color: #1d4ed8;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.08);
}

.event-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.event-card {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding: 20px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid #e8eef6;
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.05);
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}

.event-card:hover {
  transform: translateY(-4px);
  border-color: #d9e6f7;
  box-shadow: 0 22px 42px rgba(15, 23, 42, 0.08);
}

.event-card-top {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: flex-start;
  margin-bottom: 16px;
}

.event-date-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 12px;
  border-radius: 999px;
  background: #f8fafc;
  color: #334155;
  border: 1px solid #e2e8f0;
  font-size: 0.8rem;
  font-weight: 700;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 32px;
  padding: 0 12px;
  border-radius: 999px;
  font-size: 0.77rem;
  font-weight: 800;
  white-space: nowrap;
}

.status-badge.success {
  background: #eafaf3;
  color: #0f9f6e;
}

.status-badge.warning {
  background: #fff5e8;
  color: #d97706;
}

.status-badge.danger {
  background: #fef0f0;
  color: #dc2626;
}

.event-main {
  margin-bottom: 18px;
}

.event-title {
  margin: 0 0 10px;
  font-size: 1.15rem;
  line-height: 1.3;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #0f172a;
}

.meta-line {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 12px;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #64748b;
  font-size: 0.88rem;
  font-weight: 600;
}

.event-description {
  margin: 0;
  color: #475569;
  font-size: 0.93rem;
  line-height: 1.7;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.event-description.muted {
  color: #94a3b8;
  font-style: italic;
}

.capacity-card {
  margin-top: auto;
  margin-bottom: 16px;
  padding: 16px;
  border-radius: 18px;
  background: linear-gradient(180deg, #f8fbff 0%, #f4f8fd 100%);
  border: 1px solid #e4edf7;
}

.capacity-row {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 10px;
  font-size: 0.85rem;
  color: #64748b;
}

.capacity-row strong {
  color: #0f172a;
}

.progress-track {
  width: 100%;
  height: 10px;
  border-radius: 999px;
  overflow: hidden;
  background: #dde7f2;
}

.progress-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #2563eb, #3b82f6);
  transition: width 0.35s ease;
}

.progress-fill.warning {
  background: linear-gradient(90deg, #f59e0b, #f97316);
}

.progress-fill.danger {
  background: linear-gradient(90deg, #ef4444, #dc2626);
}

.capacity-footer {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-top: 12px;
}

.remaining-number {
  font-size: 1.4rem;
  font-weight: 800;
  color: #2563eb;
  line-height: 1;
}

.remaining-number.warning {
  color: #d97706;
}

.remaining-number.danger {
  color: #dc2626;
}

.remaining-text {
  font-size: 0.84rem;
  color: #64748b;
  font-weight: 600;
}

.event-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.manage-row {
  display: flex;
  gap: 10px;
}

.participants-panel {
  margin-top: 14px;
  padding: 16px;
  border-radius: 18px;
  background: linear-gradient(180deg, #f8fbff 0%, #f4f8fd 100%);
  border: 1px solid #dbe8f8;
}

.participants-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.participants-head strong {
  color: #0f172a;
  font-size: 0.95rem;
}

.participants-head span {
  color: #64748b;
  font-size: 0.82rem;
  font-weight: 700;
}

.participants-state {
  padding: 12px 14px;
  border-radius: 14px;
  background: #fff;
  color: #475569;
  font-size: 0.9rem;
  border: 1px solid #e2e8f0;
}

.participants-state.error {
  color: #b91c1c;
  background: #fff5f5;
  border-color: #fecaca;
}

.participants-list {
  list-style: none;
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
}

.participant-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px;
  border-radius: 16px;
  background: #fff;
  border: 1px solid #e2e8f0;
}

.participant-item strong {
  display: block;
  color: #0f172a;
  font-size: 0.92rem;
}

.participant-item p {
  margin: 4px 0 0;
  color: #64748b;
  font-size: 0.84rem;
  word-break: break-word;
}

.participant-role {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 0 10px;
  border-radius: 999px;
  background: #e8f0ff;
  color: #1d4ed8;
  font-size: 0.76rem;
  font-weight: 800;
  flex-shrink: 0;
}

.btn {
  min-height: 46px;
  padding: 0 16px;
  border: none;
  border-radius: 14px;
  font-family: inherit;
  font-size: 0.92rem;
  font-weight: 700;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.18s ease;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn-primary {
  background: #ffffff;
  color: #0f172a;
}

.btn-primary:hover {
  background: #f8fafc;
}

.btn-ghost {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.btn-ghost:hover {
  background: rgba(255, 255, 255, 0.14);
}

.btn-register {
  width: 100%;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
  box-shadow: 0 12px 22px rgba(37, 99, 235, 0.18);
}

.btn-register:hover:not(.disabled) {
  filter: brightness(1.03);
}

.btn-register.disabled {
  background: #cbd5e1;
  color: white;
  box-shadow: none;
  cursor: not-allowed;
}

.btn-light {
  flex: 1;
  background: #ffffff;
  color: #0f172a;
  border: 1px solid #dbe4ee;
}

.btn-light:hover {
  background: #f8fafc;
}

.btn-danger {
  flex: 1;
  background: #fff1f2;
  color: #dc2626;
  border: 1px solid #ffd9dd;
}

.btn-danger:hover {
  background: #ffe7ea;
}

.login-hint {
  margin: 0;
  min-height: 46px;
  padding: 0 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  text-align: center;
  background: #f8fafc;
  color: #64748b;
  border: 1px dashed #d6e0ea;
  font-size: 0.84rem;
  font-weight: 600;
}

.loading-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.skeleton-card {
  height: 280px;
  border-radius: 24px;
  background: linear-gradient(90deg, #e8eef6 25%, #f8fbff 50%, #e8eef6 75%);
  background-size: 200% 100%;
  animation: shimmer 1.2s linear infinite;
}

.error-card,
.empty-card {
  padding: 48px 24px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid #e8eef6;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.05);
  text-align: center;
}

.error-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.error-icon,
.empty-icon {
  width: 64px;
  height: 64px;
  border-radius: 20px;
  display: grid;
  place-items: center;
  margin: 0 auto;
  font-size: 1.5rem;
}

.error-icon {
  background: #fef0f0;
  color: #dc2626;
  font-weight: 800;
}

.empty-icon {
  background: #eff6ff;
}

.error-card h3,
.empty-card h3 {
  margin: 0;
  font-size: 1.15rem;
  color: #0f172a;
}

.error-card p,
.empty-card p {
  margin: 8px 0 0;
  color: #64748b;
  line-height: 1.6;
}

.toast {
  position: fixed;
  left: 50%;
  bottom: 28px;
  transform: translateX(-50%);
  z-index: 999;
  min-height: 52px;
  padding: 0 18px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 700;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.2);
}

.toast.success {
  background: #0f172a;
  color: white;
}

.toast.error {
  background: #dc2626;
  color: white;
}

.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.toast-slide-enter-from,
.toast-slide-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}

.spinning svg {
  animation: spin 0.7s linear infinite;
}

@keyframes shimmer {
  to {
    background-position: -200% 0;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 1100px) {
  .dashboard-hero {
    grid-template-columns: 1fr;
  }

  .event-grid,
  .loading-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .dashboard-page {
    padding: 18px 14px 72px;
  }

  .dashboard-hero,
  .toolbar-card,
  .event-card,
  .error-card,
  .empty-card {
    border-radius: 20px;
  }

  .dashboard-hero {
    padding: 22px;
  }

  .toolbar-card {
    padding: 18px;
  }

  .toolbar-controls {
    grid-template-columns: 1fr;
  }

  .event-grid,
  .loading-grid,
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .event-card-top,
  .capacity-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .manage-row {
    flex-direction: column;
  }

  .participant-item {
    align-items: flex-start;
    flex-direction: column;
  }

  .btn-light,
  .btn-danger {
    width: 100%;
  }

  .toast {
    width: calc(100% - 24px);
    text-align: center;
    white-space: normal;
  }
}
</style>
