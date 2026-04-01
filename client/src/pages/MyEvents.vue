<template>
  <div class="my-events-page">
    <div class="my-events-shell">
      <section class="my-events-showcase">
        <div class="showcase-content">
          <span class="showcase-kicker">EventFlow · Mes événements</span>

          <h1>
            Retrouvez au même endroit les événements que vous gérez et ceux auxquels vous êtes inscrit.
          </h1>

          <p>
            Cette page centralise vos activités pour suivre rapidement vos créations et vos inscriptions
            sans repasser par plusieurs écrans.
          </p>

          <div class="showcase-points">
            <div class="point-card">
              <span class="point-icon">🗂️</span>
              <div>
                <strong>Vue centralisée</strong>
                <p>Vos événements créés et vos inscriptions sont séparés clairement.</p>
              </div>
            </div>

            <div class="point-card">
              <span class="point-icon">⚡</span>
              <div>
                <strong>Chargement simple</strong>
                <p>Chaque section affiche son état de chargement, ses erreurs et ses états vides.</p>
              </div>
            </div>

            <div class="point-card">
              <span class="point-icon">📌</span>
              <div>
                <strong>Suivi personnel</strong>
                <p>Gardez un aperçu lisible de ce que vous organisez et de ce que vous rejoignez.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="my-events-content">
        <div class="content-header">
          <div>
            <p class="eyebrow">Tableau personnel</p>
            <h2>Mes événements</h2>
            <p class="subtitle">Vos créations et vos inscriptions, actualisées depuis l’API.</p>
          </div>

          <button class="refresh-btn" :disabled="pageLoading" @click="loadData">
            {{ pageLoading ? "Actualisation..." : "Actualiser" }}
          </button>
        </div>

        <section class="events-section">
          <div class="section-head">
            <div>
              <h3>Mes événements créés</h3>
              <p>{{ createdEvents.length }} événement{{ createdEvents.length > 1 ? "s" : "" }}</p>
            </div>
          </div>

          <div v-if="createdLoading" class="stack-list">
            <div v-for="n in 2" :key="`created-${n}`" class="skeleton-card"></div>
          </div>

          <div v-else-if="createdError" class="alert alert-error">
            <strong>Impossible de charger vos événements créés.</strong>
            <span>{{ createdError }}</span>
          </div>

          <div v-else-if="createdEvents.length === 0" class="empty-card">
            <h4>Aucun événement créé</h4>
            <p>Vous n’avez pas encore créé d’événement depuis ce compte.</p>
          </div>

          <div v-else class="stack-list">
            <article v-for="event in createdEvents" :key="event._id" class="event-card">
              <div class="event-top">
                <div>
                  <h4>{{ event.title }}</h4>
                  <p class="meta">{{ formatDate(event.date) }} · {{ event.location }}</p>
                </div>
                <span class="status-chip">{{ event.remainingSeats }}/{{ event.capacity }} places</span>
              </div>

              <p class="description">
                {{ event.description || "Aucun descriptif disponible pour cet événement." }}
              </p>
            </article>
          </div>
        </section>

        <section class="events-section">
          <div class="section-head">
            <div>
              <h3>Mes inscriptions</h3>
              <p>{{ registeredEvents.length }} événement{{ registeredEvents.length > 1 ? "s" : "" }}</p>
            </div>
          </div>

          <div v-if="registeredLoading" class="stack-list">
            <div v-for="n in 2" :key="`registered-${n}`" class="skeleton-card"></div>
          </div>

          <div v-else-if="registeredError" class="alert alert-error">
            <strong>Impossible de charger vos inscriptions.</strong>
            <span>{{ registeredError }}</span>
          </div>

          <div v-else-if="registeredEvents.length === 0" class="empty-card">
            <h4>Aucune inscription</h4>
            <p>Vous n’êtes inscrit à aucun événement pour le moment.</p>
          </div>

          <div v-else class="stack-list">
            <article v-for="event in registeredEvents" :key="event._id" class="event-card">
              <div class="event-top">
                <div>
                  <h4>{{ event.title }}</h4>
                  <p class="meta">{{ formatDate(event.date) }} · {{ event.location }}</p>
                </div>
                <span class="status-chip accent">Inscrit</span>
              </div>

              <p class="description">
                {{ event.description || "Aucun descriptif disponible pour cet événement." }}
              </p>
            </article>
          </div>
        </section>
      </section>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useEventsStore } from "../stores/events";

const events = useEventsStore();

const createdEvents = ref([]);
const registeredEvents = ref([]);

const createdLoading = ref(false);
const registeredLoading = ref(false);
const createdError = ref("");
const registeredError = ref("");
const pageLoading = ref(false);

function formatDate(d) {
  return new Date(d).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function loadData() {
  pageLoading.value = true;
  createdLoading.value = true;
  registeredLoading.value = true;
  createdError.value = "";
  registeredError.value = "";

  const [mineResult, registeredResult] = await Promise.allSettled([
    events.fetchMyEvents(),
    events.fetchRegisteredEvents(),
  ]);

  if (mineResult.status === "fulfilled") {
    createdEvents.value = mineResult.value;
  } else {
    createdEvents.value = [];
    createdError.value = mineResult.reason?.message || "Chargement impossible";
  }

  if (registeredResult.status === "fulfilled") {
    registeredEvents.value = registeredResult.value;
  } else {
    registeredEvents.value = [];
    registeredError.value = registeredResult.reason?.message || "Chargement impossible";
  }

  createdLoading.value = false;
  registeredLoading.value = false;
  pageLoading.value = false;
}

onMounted(() => {
  loadData();
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");

* {
  box-sizing: border-box;
}

.my-events-page {
  min-height: 100vh;
  padding: 24px;
  background:
    radial-gradient(circle at top left, rgba(37, 99, 235, 0.09), transparent 26%),
    radial-gradient(circle at bottom right, rgba(14, 165, 233, 0.1), transparent 24%),
    linear-gradient(180deg, #f8fbff 0%, #f3f7fc 100%);
  font-family: "Inter", system-ui, sans-serif;
  color: #0f172a;
}

.my-events-shell {
  width: var(--app-container-width);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 22px;
}

.my-events-showcase,
.my-events-content {
  border-radius: 28px;
}

.my-events-showcase {
  position: relative;
  overflow: hidden;
  padding: 36px;
  background:
    linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.95)),
    linear-gradient(135deg, #111827, #1e293b);
  color: #fff;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.16);
}

.my-events-showcase::before {
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

.my-events-showcase::after {
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

.my-events-showcase h1 {
  margin: 0 0 16px;
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.03;
  font-weight: 800;
  letter-spacing: -0.04em;
}

.my-events-showcase > .showcase-content > p {
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
}

.point-card p {
  margin: 0;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.75);
}

.my-events-content {
  padding: 32px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #e8eef6;
  box-shadow: 0 20px 46px rgba(15, 23, 42, 0.08);
}

.content-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.eyebrow {
  margin: 0 0 8px;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #2563eb;
}

.content-header h2 {
  margin: 0 0 8px;
  font-size: 1.9rem;
  line-height: 1.1;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.subtitle {
  margin: 0;
  color: #64748b;
  line-height: 1.6;
}

.refresh-btn {
  min-height: 46px;
  padding: 0 16px;
  border: none;
  border-radius: 14px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #fff;
  font-family: inherit;
  font-weight: 800;
  cursor: pointer;
}

.refresh-btn:disabled {
  opacity: 0.75;
  cursor: wait;
}

.events-section + .events-section {
  margin-top: 26px;
}

.section-head {
  margin-bottom: 14px;
}

.section-head h3 {
  margin: 0 0 6px;
  font-size: 1.2rem;
}

.section-head p {
  margin: 0;
  color: #64748b;
}

.stack-list {
  display: grid;
  gap: 14px;
}

.event-card,
.empty-card,
.alert,
.skeleton-card {
  border-radius: 20px;
}

.event-card {
  padding: 18px;
  background: #fff;
  border: 1px solid #e8eef6;
}

.event-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.event-top h4 {
  margin: 0 0 6px;
  font-size: 1rem;
}

.meta {
  margin: 0;
  color: #64748b;
  font-size: 0.9rem;
}

.description {
  margin: 14px 0 0;
  color: #475569;
  line-height: 1.65;
}

.status-chip {
  display: inline-flex;
  min-height: 32px;
  align-items: center;
  padding: 0 12px;
  border-radius: 999px;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 0.78rem;
  font-weight: 800;
  white-space: nowrap;
}

.status-chip.accent {
  background: #ecfdf3;
  color: #027a48;
}

.empty-card,
.alert {
  padding: 18px;
  border: 1px solid #e8eef6;
  background: #fff;
}

.empty-card h4 {
  margin: 0 0 8px;
}

.empty-card p {
  margin: 0;
  color: #64748b;
}

.alert {
  display: grid;
  gap: 6px;
}

.alert-error {
  background: #fff2f2;
  border-color: #ffd5d5;
  color: #b42318;
}

.skeleton-card {
  height: 124px;
  background: linear-gradient(90deg, #e8eef6 25%, #f8fbff 50%, #e8eef6 75%);
  background-size: 200% 100%;
  animation: shimmer 1.2s linear infinite;
}

@keyframes shimmer {
  to {
    background-position: -200% 0;
  }
}

@media (max-width: 980px) {
  .my-events-shell {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .my-events-page {
    padding: 16px;
  }

  .my-events-showcase,
  .my-events-content {
    padding: 22px;
    border-radius: 22px;
  }

  .content-header,
  .event-top {
    flex-direction: column;
  }
}
</style>
