<template>
  <div class="profile-page">
    <div class="profile-shell">
      <section class="profile-showcase">
        <div class="showcase-content">
          <span class="showcase-kicker">EventFlow · Mon espace</span>

          <h1>
            Consultez votre profil dans une interface claire, cohérente et prête pour la suite.
          </h1>

          <p>
            Retrouvez les informations essentielles de votre compte, vérifiez votre rôle et consultez
            rapidement vos événements créés et vos inscriptions.
          </p>

          <div class="showcase-points">
            <div class="point-card">
              <span class="point-icon">👤</span>
              <div>
                <strong>Identité centralisée</strong>
                <p>Vos informations principales sont regroupées dans un seul espace lisible.</p>
              </div>
            </div>

            <div class="point-card">
              <span class="point-icon">🧭</span>
              <div>
                <strong>Rôle visible</strong>
                <p>Votre niveau d’accès reste immédiatement identifiable dans l’application.</p>
              </div>
            </div>

            <div class="point-card">
              <span class="point-icon">📅</span>
              <div>
                <strong>Activité visible</strong>
                <p>Vos créations et vos inscriptions restent accessibles sans changer d’écran.</p>
              </div>
            </div>
          </div>

          <div class="tips-card">
            <span class="tips-label">Statut</span>
            <p>
              Votre rôle actuel influence directement les écrans et les actions disponibles dans
              EventFlow.
            </p>
          </div>
        </div>
      </section>

      <section class="profile-card-wrapper">
        <div class="profile-card">
          <div class="profile-card-header">
            <div class="brand-mark">E</div>
            <div>
              <p class="eyebrow">Compte connecté</p>
              <h2>Profil</h2>
              <p class="subtitle">Informations du compte actuellement connecté.</p>
            </div>
          </div>

          <div class="profile-summary">
            <div class="summary-avatar">{{ userInitial }}</div>
            <div class="summary-copy">
              <strong>{{ auth.user?.email || "Utilisateur EventFlow" }}</strong>
              <span>{{ roleLabel }}</span>
            </div>
          </div>

          <div class="profile-grid">
            <div class="info-card">
              <span class="info-label">Email</span>
              <strong class="info-value">{{ auth.user?.email || "Non disponible" }}</strong>
              <p class="info-help">Adresse utilisée pour la connexion à votre compte.</p>
            </div>

            <div class="info-card accent">
              <span class="info-label">Rôle</span>
              <div class="badge-row">
                <span class="role-badge">{{ auth.user?.role || "Non défini" }}</span>
              </div>
              <p class="info-help">{{ roleDescription }}</p>
            </div>

            <div class="info-card full">
              <span class="info-label">Identifiant</span>
              <strong class="info-value mono">{{ auth.user?.id || "Non disponible" }}</strong>
              <p class="info-help">Identifiant interne du compte utilisateur.</p>
            </div>

            <div class="info-card">
              <span class="info-label">Événements créés</span>
              <strong class="info-value">{{ createdEvents.length }}</strong>
              <p class="info-help">Nombre d’événements que vous gérez depuis ce compte.</p>
            </div>

            <div class="info-card">
              <span class="info-label">Inscriptions</span>
              <strong class="info-value">{{ registeredEvents.length }}</strong>
              <p class="info-help">Nombre d’événements auxquels vous êtes actuellement inscrit.</p>
            </div>
          </div>

          <div class="activity-section">
            <div class="activity-head">
              <div>
                <p class="eyebrow">Activité</p>
                <h3>Mes événements créés</h3>
              </div>
            </div>

            <div v-if="activityLoading" class="activity-state">
              Chargement de votre activité...
            </div>

            <div v-else-if="activityError" class="activity-state error">
              {{ activityError }}
            </div>

            <div v-else-if="createdEvents.length === 0" class="activity-state">
              Aucun événement créé pour le moment.
            </div>

            <div v-else class="activity-list">
              <article v-for="event in createdEvents" :key="event._id" class="activity-card">
                <div class="activity-card-head">
                  <strong>{{ event.title }}</strong>
                  <span class="activity-badge">{{ event.remainingSeats }}/{{ event.capacity }} places</span>
                </div>
                <p>{{ formatDate(event.date) }} · {{ event.location || "Lieu non précisé" }}</p>
              </article>
            </div>
          </div>

          <div class="activity-section">
            <div class="activity-head">
              <div>
                <p class="eyebrow">Participation</p>
                <h3>Mes inscriptions</h3>
              </div>
            </div>

            <div v-if="activityLoading" class="activity-state">
              Chargement de votre activité...
            </div>

            <div v-else-if="activityError" class="activity-state error">
              {{ activityError }}
            </div>

            <div v-else-if="registeredEvents.length === 0" class="activity-state">
              Vous n’êtes inscrit à aucun événement.
            </div>

            <div v-else class="activity-list">
              <article v-for="event in registeredEvents" :key="event._id" class="activity-card">
                <div class="activity-card-head">
                  <strong>{{ event.title }}</strong>
                  <span class="activity-badge accent">Inscrit</span>
                </div>
                <p>{{ formatDate(event.date) }} · {{ event.location || "Lieu non précisé" }}</p>
              </article>
            </div>
          </div>

          <div class="actions">
            <router-link class="btn btn-secondary" :to="{ name: 'dashboard' }">
              Retour au dashboard
            </router-link>
            <button class="btn btn-primary" @click="auth.logout()">
              Se déconnecter
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { useEventsStore } from "../stores/events";

const auth = useAuthStore();
const events = useEventsStore();
const createdEvents = ref([]);
const registeredEvents = ref([]);
const activityLoading = ref(false);
const activityError = ref("");

const userInitial = computed(() => {
  const email = auth.user?.email || "";
  return email ? email.charAt(0).toUpperCase() : "U";
});

const roleLabel = computed(() => {
  const role = auth.user?.role;
  if (role === "ADMIN") return "Administrateur";
  if (role === "ORGANIZER") return "Organisateur";
  if (role === "PARTICIPANT") return "Participant";
  return "Utilisateur";
});

const roleDescription = computed(() => {
  const role = auth.user?.role;
  if (role === "ADMIN") return "Vous disposez d’un accès complet aux fonctionnalités d’administration.";
  if (role === "ORGANIZER") return "Vous pouvez créer et gérer vos événements depuis l’interface.";
  if (role === "PARTICIPANT") return "Vous pouvez consulter les événements et vous y inscrire.";
  return "Le rôle de ce compte n’est pas encore défini.";
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

async function loadActivity() {
  activityLoading.value = true;
  activityError.value = "";

  const [mineResult, registeredResult] = await Promise.allSettled([
    events.fetchMyEvents(),
    events.fetchRegisteredEvents(),
  ]);

  if (mineResult.status === "fulfilled") {
    createdEvents.value = mineResult.value;
  } else {
    createdEvents.value = [];
  }

  if (registeredResult.status === "fulfilled") {
    registeredEvents.value = registeredResult.value;
  } else {
    registeredEvents.value = [];
  }

  if (mineResult.status === "rejected") {
    activityError.value = mineResult.reason?.message || "Impossible de charger vos événements créés.";
  } else if (registeredResult.status === "rejected") {
    activityError.value = registeredResult.reason?.message || "Impossible de charger vos inscriptions.";
  }

  activityLoading.value = false;
}

onMounted(() => {
  loadActivity();
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");

* {
  box-sizing: border-box;
}

.profile-page {
  min-height: 100vh;
  padding: 24px;
  background:
    radial-gradient(circle at top left, rgba(37, 99, 235, 0.09), transparent 26%),
    radial-gradient(circle at bottom right, rgba(14, 165, 233, 0.1), transparent 24%),
    linear-gradient(180deg, #f8fbff 0%, #f3f7fc 100%);
  font-family: "Inter", system-ui, sans-serif;
  color: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-shell {
  width: var(--app-container-width);
  max-width: none;
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 22px;
  align-items: stretch;
}

.profile-showcase {
  position: relative;
  overflow: hidden;
  border-radius: 30px;
  padding: 36px;
  background:
    linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.95)),
    linear-gradient(135deg, #111827, #1e293b);
  color: #fff;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.16);
}

.profile-showcase::before {
  content: "";
  position: absolute;
  top: -90px;
  right: -90px;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.16);
  filter: blur(10px);
}

.profile-showcase::after {
  content: "";
  position: absolute;
  bottom: -100px;
  left: 18%;
  width: 240px;
  height: 240px;
  border-radius: 50%;
  background: rgba(14, 165, 233, 0.12);
  filter: blur(14px);
}

.showcase-content {
  position: relative;
  z-index: 1;
}

.showcase-kicker {
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

.profile-showcase h1 {
  margin: 0 0 16px;
  font-size: clamp(2rem, 4vw, 3.2rem);
  line-height: 1.03;
  font-weight: 800;
  letter-spacing: -0.04em;
  max-width: 700px;
}

.profile-showcase > .showcase-content > p {
  margin: 0;
  max-width: 620px;
  font-size: 1rem;
  line-height: 1.75;
  color: rgba(255, 255, 255, 0.8);
}

.showcase-points {
  display: grid;
  gap: 14px;
  margin-top: 28px;
}

.point-card {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 16px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(14px);
}

.point-icon {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.12);
  flex-shrink: 0;
  font-size: 1.1rem;
}

.point-card strong {
  display: block;
  margin-bottom: 4px;
  font-size: 0.98rem;
  font-weight: 700;
  color: #fff;
}

.point-card p {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.75);
}

.tips-card {
  margin-top: 22px;
  padding: 18px;
  border-radius: 22px;
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.2), rgba(14, 165, 233, 0.16));
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.tips-label {
  display: inline-flex;
  min-height: 30px;
  align-items: center;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.tips-card p {
  margin: 12px 0 0;
  color: rgba(255, 255, 255, 0.84);
  line-height: 1.7;
}

.profile-card-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-card {
  width: 100%;
  max-width: 620px;
  padding: 32px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #e8eef6;
  box-shadow: 0 20px 46px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(12px);
}

.profile-card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.brand-mark {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  color: #fff;
  font-size: 1.2rem;
  font-weight: 800;
  box-shadow: 0 12px 26px rgba(37, 99, 235, 0.2);
}

.eyebrow {
  margin: 0 0 8px;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #2563eb;
}

.profile-card-header h2 {
  margin: 0 0 8px;
  font-size: 1.9rem;
  line-height: 1.1;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #0f172a;
}

.subtitle {
  margin: 0;
  color: #64748b;
  line-height: 1.6;
  font-size: 0.95rem;
}

.profile-summary {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
  border-radius: 22px;
  background: linear-gradient(180deg, #f8fbff 0%, #f4f8fd 100%);
  border: 1px solid #e4edf7;
  margin-bottom: 18px;
}

.summary-avatar {
  width: 56px;
  height: 56px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  background: linear-gradient(135deg, #0f172a, #334155);
  color: #fff;
  font-size: 1.1rem;
  font-weight: 800;
}

.summary-copy {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.summary-copy strong {
  color: #0f172a;
  font-size: 1rem;
  word-break: break-word;
}

.summary-copy span {
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 600;
}

.profile-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.info-card {
  padding: 18px;
  border-radius: 20px;
  background: #fff;
  border: 1px solid #e8eef6;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.info-card.accent {
  background: linear-gradient(180deg, #f8fbff 0%, #f4f8fd 100%);
  border-color: #dbe8f8;
}

.info-card.full {
  grid-column: 1 / -1;
}

.info-label {
  display: block;
  margin-bottom: 8px;
  color: #64748b;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.info-value {
  display: block;
  color: #0f172a;
  font-size: 1rem;
  line-height: 1.5;
  word-break: break-word;
}

.mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 0.9rem;
}

.badge-row {
  margin-bottom: 10px;
}

.role-badge {
  display: inline-flex;
  min-height: 32px;
  align-items: center;
  padding: 0 12px;
  border-radius: 999px;
  background: #e8f0ff;
  color: #1d4ed8;
  font-size: 0.78rem;
  font-weight: 800;
}

.info-help {
  margin: 10px 0 0;
  color: #64748b;
  font-size: 0.88rem;
  line-height: 1.6;
}

.activity-section {
  margin-top: 20px;
  padding: 18px;
  border-radius: 22px;
  background: linear-gradient(180deg, #f8fbff 0%, #f4f8fd 100%);
  border: 1px solid #e4edf7;
}

.activity-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.activity-head h3 {
  margin: 0;
  color: #0f172a;
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.activity-list {
  display: grid;
  gap: 12px;
}

.activity-card {
  padding: 16px;
  border-radius: 18px;
  background: #fff;
  border: 1px solid #e8eef6;
}

.activity-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
}

.activity-card-head strong {
  color: #0f172a;
  font-size: 0.95rem;
}

.activity-card p {
  margin: 0;
  color: #64748b;
  font-size: 0.88rem;
  line-height: 1.6;
}

.activity-badge {
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

.activity-badge.accent {
  background: #eafaf3;
  color: #0f9f6e;
}

.activity-state {
  padding: 14px;
  border-radius: 16px;
  background: #fff;
  border: 1px solid #e2e8f0;
  color: #475569;
  font-size: 0.9rem;
}

.activity-state.error {
  background: #fff5f5;
  border-color: #fecaca;
  color: #b91c1c;
}

.actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.btn {
  min-height: 52px;
  padding: 0 20px;
  border-radius: 16px;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.18s ease;
}

.btn-secondary {
  border: 1.5px solid #dbe4ee;
  background: #fff;
  color: #334155;
}

.btn-secondary:hover {
  background: #f8fafc;
}

.btn-primary {
  border: none;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #fff;
  box-shadow: 0 14px 28px rgba(37, 99, 235, 0.2);
}

.btn-primary:hover {
  transform: translateY(-1px);
  filter: brightness(1.03);
}

@media (max-width: 980px) {
  .profile-shell {
    grid-template-columns: 1fr;
  }

  .profile-card {
    max-width: 100%;
  }
}

@media (max-width: 760px) {
  .profile-grid {
    grid-template-columns: 1fr;
  }

  .actions {
    flex-direction: column-reverse;
  }

  .activity-card-head {
    align-items: flex-start;
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}

@media (max-width: 640px) {
  .profile-page {
    padding: 16px;
  }

  .profile-showcase,
  .profile-card {
    border-radius: 22px;
    padding: 22px;
  }

  .profile-showcase h1 {
    font-size: 2rem;
  }

  .profile-card-header {
    align-items: flex-start;
  }

  .profile-summary {
    align-items: flex-start;
  }
}
</style>
