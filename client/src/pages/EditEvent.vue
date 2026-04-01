<template>
  <div class="edit-page">
    <div class="edit-shell">
      <section class="edit-showcase">
        <div class="showcase-content">
          <span class="showcase-kicker">EventFlow · Gestion d'événement</span>

          <h1>
            Modifiez votre événement sans perdre en lisibilité ni en cohérence visuelle.
          </h1>

          <p>
            Mettez à jour les informations importantes, ajustez la capacité ou corrigez la fiche
            avant qu’elle ne soit consultée depuis le dashboard.
          </p>

          <div class="showcase-points">
            <div class="point-card">
              <span class="point-icon">✏️</span>
              <div>
                <strong>Modification rapide</strong>
                <p>Retouchez les champs essentiels dans un formulaire clair et stable.</p>
              </div>
            </div>

            <div class="point-card">
              <span class="point-icon">🧩</span>
              <div>
                <strong>Données cohérentes</strong>
                <p>Gardez une fiche propre entre le dashboard, le profil et les inscriptions.</p>
              </div>
            </div>

            <div class="point-card">
              <span class="point-icon">📈</span>
              <div>
                <strong>Capacité maîtrisée</strong>
                <p>Ajustez le nombre de places pour refléter l’état réel de votre événement.</p>
              </div>
            </div>
          </div>

          <div class="tips-card">
            <span class="tips-label">Conseil</span>
            <p>
              Avant de sauvegarder, vérifiez surtout le titre, le lieu et la date. Ce sont les
              éléments les plus visibles dans les cartes du dashboard.
            </p>
          </div>
        </div>
      </section>

      <section class="edit-card-wrapper">
        <div class="edit-card">
          <div class="edit-card-header">
            <div class="brand-mark">E</div>
            <div>
              <h2>Modifier l'événement</h2>
              <p>Apportez vos changements puis enregistrez la nouvelle version.</p>
            </div>
          </div>

          <form @submit.prevent="onSubmit" class="edit-form" novalidate>
            <div class="field-group">
              <div class="field-head">
                <label class="field-label" for="title">Titre</label>
                <span class="field-meta">{{ title.length }}/120</span>
              </div>

              <div class="input-wrapper" :class="{ focused: focusedField === 'title', error: errors.title }">
                <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>

                <input
                  id="title"
                  v-model="title"
                  type="text"
                  placeholder="Ex : Conférence tech Paris 2025"
                  required
                  minlength="3"
                  maxlength="120"
                  @focus="focusedField = 'title'"
                  @blur="focusedField = ''; validateField('title')"
                />
              </div>

              <p class="field-hint">Conservez un titre simple, visible et immédiatement compréhensible.</p>
              <p v-if="errors.title" class="field-error">{{ errors.title }}</p>
            </div>

            <div class="field-group">
              <div class="field-head">
                <label class="field-label" for="description">Description</label>
                <span class="optional-badge">Optionnel</span>
              </div>

              <div class="input-wrapper textarea-wrapper" :class="{ focused: focusedField === 'description' }">
                <textarea
                  id="description"
                  v-model="description"
                  placeholder="Décrivez votre événement, son objectif, le public visé ou le programme…"
                  rows="5"
                  @focus="focusedField = 'description'"
                  @blur="focusedField = ''"
                />
              </div>
            </div>

            <div class="field-row">
              <div class="field-group">
                <label class="field-label" for="date">Date et heure</label>

                <div class="input-wrapper" :class="{ focused: focusedField === 'date', error: errors.date }">
                  <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>

                  <input
                    id="date"
                    v-model="date"
                    type="datetime-local"
                    required
                    @focus="focusedField = 'date'"
                    @blur="focusedField = ''; validateField('date')"
                  />
                </div>

                <p v-if="errors.date" class="field-error">{{ errors.date }}</p>
              </div>

              <div class="field-group">
                <label class="field-label" for="location">Lieu</label>

                <div class="input-wrapper" :class="{ focused: focusedField === 'location', error: errors.location }">
                  <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>

                  <input
                    id="location"
                    v-model="location"
                    type="text"
                    placeholder="Ex : Paris, Salle Pleyel"
                    required
                    @focus="focusedField = 'location'"
                    @blur="focusedField = ''; validateField('location')"
                  />
                </div>

                <p v-if="errors.location" class="field-error">{{ errors.location }}</p>
              </div>
            </div>

            <div class="capacity-section">
              <div class="capacity-copy">
                <label class="field-label" for="capacity">Capacité</label>
                <p class="field-hint">Mettez à jour le nombre maximum de participants autorisés.</p>
              </div>

              <div class="capacity-control">
                <button type="button" class="stepper-btn" @click="capacity = Math.max(1, capacity - 1)">−</button>

                <div class="input-wrapper capacity-input" :class="{ focused: focusedField === 'capacity', error: errors.capacity }">
                  <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 00-3-3.87" />
                    <path d="M16 3.13a4 4 0 010 7.75" />
                  </svg>

                  <input
                    id="capacity"
                    v-model.number="capacity"
                    type="number"
                    min="1"
                    required
                    @focus="focusedField = 'capacity'"
                    @blur="focusedField = ''; validateField('capacity')"
                  />

                  <span class="capacity-unit">personnes</span>
                </div>

                <button type="button" class="stepper-btn" @click="capacity++">+</button>
              </div>

              <p v-if="errors.capacity" class="field-error">{{ errors.capacity }}</p>
            </div>

            <div class="summary-card">
              <span class="summary-badge">Aperçu mis à jour</span>
              <div class="summary-grid">
                <div class="summary-item">
                  <span class="summary-label">Titre</span>
                  <strong>{{ title || "Non renseigné" }}</strong>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Lieu</span>
                  <strong>{{ location || "Non renseigné" }}</strong>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Date</span>
                  <strong>{{ date || "Non renseignée" }}</strong>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Capacité</span>
                  <strong>{{ capacity }} places</strong>
                </div>
              </div>
            </div>

            <transition name="fade">
              <div v-if="error" class="alert alert-error">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {{ error }}
              </div>
            </transition>

            <transition name="fade">
              <div v-if="msg" class="alert alert-success">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                {{ msg }}
              </div>
            </transition>

            <div class="form-actions">
              <button type="button" class="btn-secondary" @click="router.back()">
                Annuler
              </button>

              <button type="submit" class="btn-primary" :disabled="loading">
                <span v-if="!loading" class="btn-content">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                  Enregistrer les modifications
                </span>
                <span v-else class="btn-content">
                  <svg class="spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                  Mise à jour…
                </span>
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  </div>
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

const loading = ref(false);
const error = ref("");
const msg = ref("");
const focusedField = ref("");
const errors = ref({});

function validateField(field) {
  const e = { ...errors.value };
  if (field === "title") {
    if (!title.value) e.title = "Le titre est requis.";
    else if (title.value.length < 3) e.title = "Minimum 3 caractères.";
    else delete e.title;
  }
  if (field === "date") {
    if (!date.value) e.date = "La date est requise.";
    else delete e.date;
  }
  if (field === "location") {
    if (!location.value) e.location = "Le lieu est requis.";
    else delete e.location;
  }
  if (field === "capacity") {
    if (!capacity.value || capacity.value < 1) e.capacity = "Capacité minimum : 1.";
    else delete e.capacity;
  }
  errors.value = e;
}

function validateAll() {
  ["title", "date", "location", "capacity"].forEach(validateField);
  return Object.keys(errors.value).length === 0;
}

onMounted(async () => {
  await events.fetchEvents();
  const ev = events.items.find((e) => e._id === route.params.id);

  if (!ev) {
    error.value = "Événement introuvable.";
    return;
  }

  title.value = ev.title;
  description.value = ev.description;
  date.value = new Date(ev.date).toISOString().slice(0, 16);
  location.value = ev.location;
  capacity.value = ev.capacity;
});

async function onSubmit() {
  if (!validateAll()) return;

  loading.value = true;
  error.value = "";
  msg.value = "";

  try {
    await events.updateEvent(route.params.id, {
      title: title.value,
      description: description.value,
      date: new Date(date.value).toISOString(),
      location: location.value,
      capacity: capacity.value,
    });

    msg.value = "Événement mis à jour avec succès !";
    setTimeout(() => router.push({ name: "dashboard" }), 900);
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");

* {
  box-sizing: border-box;
}

.edit-page {
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

.edit-shell {
  width: var(--app-container-width);
  max-width: none;
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 22px;
  align-items: stretch;
}

.edit-showcase {
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

.edit-showcase::before {
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

.edit-showcase::after {
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

.edit-showcase h1 {
  margin: 0 0 16px;
  font-size: clamp(2rem, 4vw, 3.2rem);
  line-height: 1.03;
  font-weight: 800;
  letter-spacing: -0.04em;
  max-width: 700px;
}

.edit-showcase > .showcase-content > p {
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

.edit-card-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-card {
  width: 100%;
  max-width: 620px;
  padding: 32px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #e8eef6;
  box-shadow: 0 20px 46px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(12px);
}

.edit-card-header {
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

.edit-card-header h2 {
  margin: 0 0 8px;
  font-size: 1.9rem;
  line-height: 1.1;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #0f172a;
}

.edit-card-header p {
  margin: 0;
  color: #64748b;
  line-height: 1.6;
  font-size: 0.95rem;
}

.edit-form {
  display: grid;
  gap: 18px;
}

.field-group {
  display: grid;
  gap: 8px;
}

.field-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.field-label {
  font-size: 0.9rem;
  font-weight: 700;
  color: #334155;
}

.field-meta {
  color: #64748b;
  font-size: 0.8rem;
  font-weight: 700;
}

.field-hint {
  margin: 0;
  color: #64748b;
  font-size: 0.84rem;
  line-height: 1.5;
}

.optional-badge {
  display: inline-flex;
  min-height: 28px;
  align-items: center;
  padding: 0 10px;
  border-radius: 999px;
  background: #eef4ff;
  color: #1d4ed8;
  font-size: 0.74rem;
  font-weight: 800;
}

.input-wrapper {
  min-height: 56px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 14px;
  border-radius: 18px;
  border: 1.5px solid #dbe4ee;
  background: #fff;
  transition: all 0.18s ease;
}

.input-wrapper.focused {
  border-color: rgba(37, 99, 235, 0.52);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.08);
}

.input-wrapper.error {
  border-color: #dc2626;
  box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.08);
}

.input-icon {
  color: #64748b;
  flex-shrink: 0;
}

.input-wrapper input,
.input-wrapper textarea {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  color: #0f172a;
  font-size: 0.96rem;
  font-family: inherit;
}

.input-wrapper input::placeholder,
.input-wrapper textarea::placeholder {
  color: #94a3b8;
}

.textarea-wrapper {
  align-items: flex-start;
  padding-top: 12px;
  padding-bottom: 12px;
}

.textarea-wrapper textarea {
  resize: vertical;
  min-height: 120px;
  line-height: 1.65;
}

input[type="datetime-local"] {
  min-width: 0;
}

.field-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.capacity-section {
  display: grid;
  gap: 10px;
  padding: 18px;
  border-radius: 22px;
  background: linear-gradient(180deg, #f8fbff 0%, #f4f8fd 100%);
  border: 1px solid #e4edf7;
}

.capacity-copy {
  display: grid;
  gap: 6px;
}

.capacity-control {
  display: flex;
  align-items: center;
  gap: 10px;
}

.capacity-input {
  flex: 1;
}

.capacity-input input {
  width: 72px;
  text-align: center;
  -moz-appearance: textfield;
}

.capacity-input input::-webkit-outer-spin-button,
.capacity-input input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

.capacity-unit {
  color: #64748b;
  font-size: 0.84rem;
  font-weight: 700;
  white-space: nowrap;
}

.stepper-btn {
  width: 42px;
  height: 42px;
  border: 1.5px solid #dbe4ee;
  border-radius: 14px;
  background: #fff;
  color: #0f172a;
  font-size: 1.2rem;
  line-height: 1;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: all 0.18s ease;
  flex-shrink: 0;
}

.stepper-btn:hover {
  background: #eff6ff;
  border-color: #bfdbfe;
  color: #1d4ed8;
}

.summary-card {
  padding: 18px;
  border-radius: 22px;
  background: #ffffff;
  border: 1px solid #e8eef6;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.summary-badge {
  display: inline-flex;
  min-height: 30px;
  align-items: center;
  padding: 0 12px;
  border-radius: 999px;
  background: #e8f0ff;
  color: #1d4ed8;
  font-size: 0.76rem;
  font-weight: 800;
}

.summary-grid {
  margin-top: 14px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.summary-item {
  padding: 14px;
  border-radius: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.summary-label {
  display: block;
  margin-bottom: 6px;
  color: #64748b;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.summary-item strong {
  color: #0f172a;
  font-size: 0.92rem;
  line-height: 1.5;
  word-break: break-word;
}

.field-error {
  margin: 0;
  color: #b42318;
  font-size: 0.82rem;
  font-weight: 600;
}

.alert {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 14px 16px;
  border-radius: 16px;
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1.5;
}

.alert svg {
  flex-shrink: 0;
  margin-top: 1px;
}

.alert-error {
  background: #fff2f2;
  border: 1px solid #ffd5d5;
  color: #b42318;
}

.alert-success {
  background: #ecfdf3;
  border: 1px solid #c8f2d8;
  color: #027a48;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-secondary,
.btn-primary {
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

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  filter: brightness(1.03);
}

.btn-primary:disabled {
  opacity: 0.75;
  cursor: wait;
}

.btn-content {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.spin {
  animation: spin 0.8s linear infinite;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 980px) {
  .edit-shell {
    grid-template-columns: 1fr;
  }

  .edit-card {
    max-width: 100%;
  }
}

@media (max-width: 760px) {
  .field-row,
  .summary-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .btn-secondary,
  .btn-primary {
    width: 100%;
  }
}

@media (max-width: 640px) {
  .edit-page {
    padding: 16px;
  }

  .edit-showcase,
  .edit-card {
    border-radius: 22px;
    padding: 22px;
  }

  .edit-showcase h1 {
    font-size: 2rem;
  }

  .edit-card-header {
    align-items: flex-start;
  }

  .capacity-control {
    gap: 8px;
  }
}
</style>
