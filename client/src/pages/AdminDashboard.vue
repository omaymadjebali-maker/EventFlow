<template>
  <div class="page-wrapper">
    <div class="page-header">
      <div>
        <h1 class="page-title">Dashboard Admin</h1>
        <p class="page-subtitle">
          Vue globale de la plateforme EventFlow
        </p>
      </div>
    </div>

    <div v-if="admin.loading" class="loading-box">
      Chargement des statistiques...
    </div>

    <div v-else-if="admin.error" class="error-box">
      {{ admin.error }}
    </div>

    <template v-else>
      <div class="stats-grid">
        <div class="stat-card">
          <p class="stat-label">Utilisateurs</p>
          <h2 class="stat-value">{{ admin.stats.users }}</h2>
        </div>

        <div class="stat-card">
          <p class="stat-label">Événements</p>
          <h2 class="stat-value">{{ admin.stats.events }}</h2>
        </div>

        <div class="stat-card">
          <p class="stat-label">Inscriptions</p>
          <h2 class="stat-value">{{ admin.stats.registrations }}</h2>
        </div>
      </div>

      <section class="panel">
        <div class="panel-header">
          <h2>Événements récents</h2>
        </div>

        <div v-if="!admin.recentEvents.length" class="empty-state">
          Aucun événement trouvé.
        </div>

        <div v-else class="table-wrapper">
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
                <td>{{ event.location }}</td>
                <td>{{ event.organizer?.email || "—" }}</td>
                <td>{{ event.participantsCount }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useAdminStore } from "../stores/admin";

const admin = useAdminStore();

function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

onMounted(() => {
  admin.fetchStats();
});
</script>

<style scoped>
.page-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px 40px;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px;
}

.page-subtitle {
  margin: 0;
  color: #6b7280;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
}

.stat-label {
  margin: 0 0 10px;
  color: #6b7280;
  font-size: 14px;
}

.stat-value {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  color: #111827;
}

.panel {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
}

.panel-header {
  margin-bottom: 16px;
}

.panel-header h2 {
  margin: 0;
  font-size: 20px;
}

.table-wrapper {
  overflow-x: auto;
}

.events-table {
  width: 100%;
  border-collapse: collapse;
}

.events-table th,
.events-table td {
  text-align: left;
  padding: 14px 12px;
  border-bottom: 1px solid #e5e7eb;
  font-size: 14px;
}

.events-table th {
  color: #6b7280;
  font-weight: 600;
}

.loading-box,
.error-box,
.empty-state {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 18px;
}

.error-box {
  color: #b91c1c;
}

@media (max-width: 900px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
