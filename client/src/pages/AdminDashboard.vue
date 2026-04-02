<template>
  <div class="admin-page">
    <div class="admin-shell">
      <section class="admin-showcase">
        <div class="showcase-content">
          <span class="showcase-kicker">EventFlow · Administration</span>

          <h1>Supervisez la plateforme avec une vue claire, rapide et utile en soutenance.</h1>

          <p>
            Ce dashboard regroupe les indicateurs essentiels de la plateforme et met en avant
            l’activité récente pour un compte administrateur.
          </p>

          <div class="showcase-points">
            <div class="point-card">
              <strong>Vision globale</strong>
              <p>Suivez immédiatement les utilisateurs, événements et inscriptions.</p>
            </div>

            <div class="point-card">
              <strong>Activité récente</strong>
              <p>Consultez les derniers événements créés et leur niveau de participation.</p>
            </div>

            <div class="point-card">
              <strong>Accès sécurisé</strong>
              <p>La page et l’API restent réservées au rôle administrateur.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="admin-content">
        <div class="content-header">
          <div>
            <p class="eyebrow">Vue administrateur</p>
            <h2>Dashboard Admin</h2>
            <p class="subtitle">Statistiques globales et événements récents de la plateforme.</p>
          </div>

          <button class="refresh-btn" :disabled="admin.loading" @click="admin.fetchStats()">
            {{ admin.loading ? "Actualisation..." : "Actualiser" }}
          </button>
        </div>

        <div class="stats-grid">
          <article class="stat-card">
            <span class="stat-label">Utilisateurs</span>
            <strong class="stat-value">{{ admin.stats.users }}</strong>
            <p class="stat-help">Nombre total de comptes présents sur la plateforme.</p>
          </article>

          <article class="stat-card">
            <span class="stat-label">Événements</span>
            <strong class="stat-value">{{ admin.stats.events }}</strong>
            <p class="stat-help">Nombre total d’événements enregistrés.</p>
          </article>

          <article class="stat-card">
            <span class="stat-label">Inscriptions</span>
            <strong class="stat-value">{{ admin.stats.registrations }}</strong>
            <p class="stat-help">Somme de toutes les participations utilisateurs.</p>
          </article>

          <article class="stat-card accent">
            <span class="stat-label">Comptes anonymisés</span>
            <strong class="stat-value">{{ admin.stats.anonymizedUsers }}</strong>
            <p class="stat-help">Suivi simple des comptes traités côté RGPD.</p>
          </article>
        </div>

        <div class="split-grid">
          <section class="panel-card">
            <div class="panel-head">
              <div>
                <p class="eyebrow">Répartition</p>
                <h3>Rôles utilisateurs</h3>
              </div>
            </div>

            <div class="roles-grid">
              <div class="role-chip">
                <span>Admins</span>
                <strong>{{ admin.roleDistribution.admins }}</strong>
              </div>
              <div class="role-chip">
                <span>Organisateurs</span>
                <strong>{{ admin.roleDistribution.organizers }}</strong>
              </div>
              <div class="role-chip">
                <span>Participants</span>
                <strong>{{ admin.roleDistribution.participants }}</strong>
              </div>
            </div>
          </section>

          <section class="panel-card">
            <div class="panel-head">
              <div>
                <p class="eyebrow">Statut</p>
                <h3>Accès actif</h3>
              </div>
            </div>

            <div class="status-box">
              <strong>{{ auth.user?.email }}</strong>
              <p>Connecté avec le rôle {{ auth.user?.role || "ADMIN" }}.</p>
            </div>
          </section>
        </div>

        <section class="panel-card">
          <div class="panel-head">
            <div>
              <p class="eyebrow">Activité récente</p>
              <h3>5 derniers événements créés</h3>
            </div>
          </div>

          <div v-if="admin.loading" class="state-card">
            Chargement des statistiques administrateur...
          </div>

          <div v-else-if="admin.error" class="state-card error">
            {{ admin.error }}
          </div>

          <div v-else-if="admin.recentEvents.length === 0" class="state-card">
            Aucun événement récent à afficher.
          </div>

          <div v-else class="events-table-wrap">
            <table class="events-table">
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Date</th>
                  <th>Lieu</th>
                  <th>Organisateur</th>
                  <th>Participants</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="event in admin.recentEvents" :key="event.id">
                  <td>{{ event.title }}</td>
                  <td>{{ formatDate(event.date) }}</td>
                  <td>{{ event.location || "Lieu non précisé" }}</td>
                  <td>{{ event.organizer?.email || "Organisateur inconnu" }}</td>
                  <td>{{ event.participantsCount }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useAdminStore } from "../stores/admin";
import { useAuthStore } from "../stores/auth";

const admin = useAdminStore();
const auth = useAuthStore();

function formatDate(value) {
  return new Date(value).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

onMounted(() => {
  admin.fetchStats();
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");

* {
  box-sizing: border-box;
}

.admin-page {
  min-height: 100vh;
  padding: 24px;
  background:
    radial-gradient(circle at top left, rgba(15, 23, 42, 0.08), transparent 24%),
    radial-gradient(circle at bottom right, rgba(37, 99, 235, 0.12), transparent 28%),
    linear-gradient(180deg, #f8fbff 0%, #edf4fb 100%);
  font-family: "Inter", system-ui, sans-serif;
  color: #0f172a;
}

.admin-shell {
  width: var(--app-container-width);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 0.95fr 1.05fr;
  gap: 22px;
}

.admin-showcase,
.admin-content {
  border-radius: 28px;
}

.admin-showcase {
  position: relative;
  overflow: hidden;
  padding: 36px;
  background:
    linear-gradient(140deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.94)),
    linear-gradient(140deg, #0f172a, #1e293b);
  color: #fff;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.16);
}

.admin-showcase::before {
  content: "";
  position: absolute;
  top: -120px;
  right: -80px;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.16);
  filter: blur(10px);
}

.showcase-content,
.admin-content {
  position: relative;
  z-index: 1;
}

.showcase-kicker,
.eyebrow {
  display: inline-block;
  margin-bottom: 12px;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.showcase-kicker {
  color: rgba(191, 219, 254, 0.95);
}

.admin-showcase h1 {
  margin: 0 0 16px;
  font-size: clamp(2rem, 3vw, 3.2rem);
  line-height: 1.06;
  letter-spacing: -0.04em;
}

.admin-showcase p {
  margin: 0;
  color: rgba(226, 232, 240, 0.92);
  line-height: 1.7;
}

.showcase-points {
  margin-top: 28px;
  display: grid;
  gap: 14px;
}

.point-card {
  padding: 18px 20px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.point-card strong {
  display: block;
  margin-bottom: 6px;
}

.admin-content {
  padding: 32px;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(226, 232, 240, 0.92);
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.08);
}

.content-header,
.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.content-header h2,
.panel-head h3 {
  margin: 0;
  color: #0f172a;
}

.subtitle {
  margin: 8px 0 0;
  color: #64748b;
}

.refresh-btn {
  min-height: 44px;
  padding: 0 16px;
  border: 0;
  border-radius: 14px;
  background: #0f172a;
  color: white;
  font-weight: 700;
  cursor: pointer;
}

.refresh-btn:disabled {
  opacity: 0.65;
  cursor: wait;
}

.stats-grid {
  margin-top: 26px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.stat-card,
.panel-card {
  border-radius: 22px;
  border: 1px solid #e2e8f0;
  background: white;
}

.stat-card {
  padding: 22px;
}

.stat-card.accent {
  background: linear-gradient(180deg, #eff6ff 0%, #ffffff 100%);
}

.stat-label,
.stat-help,
.role-chip span,
.status-box p {
  color: #64748b;
}

.stat-label {
  display: block;
  font-size: 0.88rem;
  font-weight: 700;
}

.stat-value {
  display: block;
  margin: 10px 0 8px;
  font-size: 2rem;
  line-height: 1;
}

.stat-help {
  margin: 0;
  line-height: 1.5;
}

.split-grid {
  margin-top: 16px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.panel-card {
  margin-top: 16px;
  padding: 22px;
}

.roles-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.role-chip,
.status-box {
  margin-top: 16px;
  padding: 18px;
  border-radius: 18px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.role-chip strong,
.status-box strong {
  display: block;
  margin-top: 10px;
  font-size: 1.4rem;
  color: #0f172a;
}

.status-box p {
  margin: 8px 0 0;
}

.state-card {
  margin-top: 16px;
  padding: 20px;
  border-radius: 18px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #475569;
}

.state-card.error {
  background: #fef2f2;
  border-color: #fecaca;
  color: #991b1b;
}

.events-table-wrap {
  margin-top: 16px;
  overflow-x: auto;
}

.events-table {
  width: 100%;
  border-collapse: collapse;
}

.events-table th,
.events-table td {
  padding: 14px 12px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.events-table th {
  font-size: 0.82rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #64748b;
}

.events-table td {
  color: #0f172a;
}

@media (max-width: 1180px) {
  .admin-shell {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .admin-page {
    padding: 16px;
  }

  .admin-content,
  .admin-showcase {
    padding: 24px;
  }

  .stats-grid,
  .split-grid,
  .roles-grid {
    grid-template-columns: 1fr;
  }

  .content-header,
  .panel-head {
    align-items: flex-start;
    flex-direction: column;
  }

  .refresh-btn {
    width: 100%;
  }
}
</style>
