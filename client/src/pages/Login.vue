<template>
  <div class="login-page">
    <div class="login-shell">
      <!-- Left side -->
      <section class="login-showcase">
        <div class="showcase-content">
          <span class="showcase-kicker">EventFlow · Plateforme événementielle</span>

          <h1>
            Connectez-vous et gérez vos événements dans une interface moderne.
          </h1>

          <p>
            Accédez à votre espace personnel, consultez les événements disponibles,
            inscrivez-vous rapidement et gérez vos actions selon votre rôle.
          </p>

          <div class="showcase-points">
            <div class="point-card">
              <span class="point-icon">📅</span>
              <div>
                <strong>Suivi des événements</strong>
                <p>Consultez les événements disponibles en temps réel.</p>
              </div>
            </div>

            <div class="point-card">
              <span class="point-icon">🎟️</span>
              <div>
                <strong>Inscription simplifiée</strong>
                <p>Réservez vos places en quelques clics.</p>
              </div>
            </div>

            <div class="point-card">
              <span class="point-icon">🔐</span>
              <div>
                <strong>Accès sécurisé</strong>
                <p>Authentification protégée avec gestion des rôles.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Right side -->
      <section class="login-card-wrapper">
        <div class="login-card">
          <div class="login-card-header">
            <div class="brand-mark">E</div>
            <h2>Connexion</h2>
            <p>Entrez vos identifiants pour accéder à votre compte.</p>
          </div>

          <form class="login-form" @submit.prevent="onSubmit">
            <div class="field-group">
              <label for="email">Adresse email</label>
              <div class="input-wrapper" :class="{ focused: focusedField === 'email' }">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16v16H4z" stroke="none" />
                  <path d="M4 6l8 7 8-7" />
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                </svg>

                <input
                  id="email"
                  v-model="email"
                  type="email"
                  placeholder="vous@exemple.com"
                  autocomplete="email"
                  required
                  @focus="focusedField = 'email'"
                  @blur="focusedField = ''"
                />
              </div>
            </div>

            <div class="field-group">
              <label for="password">Mot de passe</label>
              <div class="input-wrapper" :class="{ focused: focusedField === 'password' }">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="10" rx="2" />
                  <path d="M7 11V8a5 5 0 0110 0v3" />
                </svg>

                <input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Votre mot de passe"
                  autocomplete="current-password"
                  required
                  @focus="focusedField = 'password'"
                  @blur="focusedField = ''"
                />

                <button
                  type="button"
                  class="password-toggle"
                  @click="showPassword = !showPassword"
                  :title="showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
                >
                  <svg
                    v-if="!showPassword"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>

                  <svg
                    v-else
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M17.94 17.94A10.94 10.94 0 0112 19C5 19 1 12 1 12a21.77 21.77 0 015.06-5.94" />
                    <path d="M9.9 4.24A10.94 10.94 0 0112 5c7 0 11 7 11 7a21.8 21.8 0 01-3.17 4.36" />
                    <path d="M1 1l22 22" />
                    <path d="M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-.58" />
                  </svg>
                </button>
              </div>
            </div>

            <div v-if="error" class="error-alert">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{{ error }}</span>
            </div>

            <button class="submit-btn" :disabled="loading">
              <svg
                v-if="loading"
                class="spinner"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <line x1="12" y1="2" x2="12" y2="6" />
                <line x1="12" y1="18" x2="12" y2="22" />
                <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                <line x1="2" y1="12" x2="6" y2="12" />
                <line x1="18" y1="12" x2="22" y2="12" />
                <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
                <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
              </svg>

              {{ loading ? "Connexion en cours..." : "Se connecter" }}
            </button>
          </form>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const auth = useAuthStore();

const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);
const showPassword = ref(false);
const focusedField = ref("");

async function onSubmit() {
  loading.value = true;
  error.value = "";

  try {
    await auth.login(email.value, password.value);
    router.push({ name: "dashboard" });
  } catch (e) {
    error.value = e.message || "Connexion impossible";
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

.login-page {
  min-height: 100vh;
  padding: 24px;
  background:
    radial-gradient(circle at top left, rgba(37, 99, 235, 0.09), transparent 26%),
    radial-gradient(circle at bottom right, rgba(14, 165, 233, 0.10), transparent 24%),
    linear-gradient(180deg, #f8fbff 0%, #f3f7fc 100%);
  font-family: "Inter", system-ui, sans-serif;
  color: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-shell {
  width: var(--app-container-width);
  max-width: none;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 22px;
  align-items: stretch;
}

.login-showcase {
  position: relative;
  overflow: hidden;
  border-radius: 30px;
  padding: 36px;
  background:
    linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.95)),
    linear-gradient(135deg, #111827, #1e293b);
  color: white;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.16);
}

.login-showcase::before {
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

.login-showcase::after {
  content: "";
  position: absolute;
  bottom: -100px;
  left: 20%;
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
  border: 1px solid rgba(255, 255, 255, 0.10);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.82);
}

.login-showcase h1 {
  margin: 0 0 16px;
  font-size: clamp(2rem, 4vw, 3.3rem);
  line-height: 1.03;
  font-weight: 800;
  letter-spacing: -0.04em;
  max-width: 640px;
}

.login-showcase > .showcase-content > p {
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
  border: 1px solid rgba(255, 255, 255, 0.10);
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
  color: white;
}

.point-card p {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.75);
}

.login-card-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  width: 100%;
  max-width: 460px;
  padding: 32px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #e8eef6;
  box-shadow: 0 20px 46px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(12px);
}

.login-card-header {
  text-align: left;
  margin-bottom: 24px;
}

.brand-mark {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  color: white;
  font-size: 1.2rem;
  font-weight: 800;
  box-shadow: 0 12px 26px rgba(37, 99, 235, 0.2);
}

.login-card-header h2 {
  margin: 0 0 8px;
  font-size: 1.9rem;
  line-height: 1.1;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #0f172a;
}

.login-card-header p {
  margin: 0;
  color: #64748b;
  line-height: 1.6;
  font-size: 0.95rem;
}

.login-form {
  display: grid;
  gap: 18px;
}

.field-group {
  display: grid;
  gap: 8px;
}

.field-group label {
  font-size: 0.9rem;
  font-weight: 700;
  color: #334155;
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

.input-wrapper svg {
  color: #64748b;
  flex-shrink: 0;
}

.input-wrapper input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  color: #0f172a;
  font-size: 0.96rem;
  font-family: inherit;
}

.input-wrapper input::placeholder {
  color: #94a3b8;
}

.password-toggle {
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 999px;
  background: transparent;
  color: #64748b;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: background 0.18s ease;
}

.password-toggle:hover {
  background: #f1f5f9;
}

.error-alert {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 14px 16px;
  border-radius: 16px;
  background: #fff2f2;
  border: 1px solid #ffd5d5;
  color: #b42318;
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1.5;
}

.error-alert svg {
  flex-shrink: 0;
  margin-top: 1px;
}

.submit-btn {
  min-height: 54px;
  border: none;
  border-radius: 16px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
  font-family: inherit;
  font-size: 0.96rem;
  font-weight: 800;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 14px 28px rgba(37, 99, 235, 0.20);
  transition: all 0.18s ease;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  filter: brightness(1.03);
}

.submit-btn:disabled {
  opacity: 0.75;
  cursor: wait;
}

.spinner {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 980px) {
  .login-shell {
    grid-template-columns: 1fr;
  }

  .login-card {
    max-width: 100%;
  }
}

@media (max-width: 640px) {
  .login-page {
    padding: 16px;
  }

  .login-showcase,
  .login-card {
    border-radius: 22px;
    padding: 22px;
  }

  .login-showcase h1 {
    font-size: 2rem;
  }
}
</style>
