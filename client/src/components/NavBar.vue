<template>
  <header class="app-header">
    <div class="app-header__inner">
      <!-- Brand -->
      <div class="app-header__left">
        <router-link to="/" class="brand">
          <div class="brand-mark">E</div>
          <div class="brand-text">
            <strong>EventFlow</strong>
            <span>Gestion d'événements</span>
          </div>
        </router-link>

        <nav class="nav-links desktop-only">
          <router-link to="/" class="nav-link">Dashboard</router-link>

          <router-link v-if="canCreate" to="/create" class="nav-link">
            Créer
          </router-link>

          <router-link v-if="auth.isLogged" to="/profile" class="nav-link">
            Profil
          </router-link>

          <router-link v-if="auth.isLogged" to="/my-events" class="nav-link">
            Mes événements
          </router-link>

          <router-link v-if="isAdmin" to="/admin" class="nav-link">
            Admin
          </router-link>
        </nav>
      </div>

      <!-- Right -->
      <div class="app-header__right desktop-only">
        <template v-if="auth.isLogged">
          <div class="user-chip">
            <div class="user-avatar">
              {{ userInitial }}
            </div>

            <div class="user-meta">
              <span class="user-email">{{ auth.user?.email }}</span>
              <span class="user-role">{{ roleLabel }}</span>
            </div>
          </div>

          <button class="btn btn-logout" @click="onLogout">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </template>

        <template v-else>
          <router-link to="/login" class="btn btn-light">Login</router-link>
          <router-link to="/register" class="btn btn-primary">Register</router-link>
        </template>
      </div>

      <!-- Mobile toggle -->
      <button class="mobile-menu-btn mobile-only" @click="menuOpen = !menuOpen" aria-label="Ouvrir le menu">
        <svg v-if="!menuOpen" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>

        <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>

    <!-- Mobile menu -->
    <transition name="menu-fade">
      <div v-if="menuOpen" class="mobile-panel mobile-only">
        <nav class="mobile-nav">
          <router-link to="/" class="mobile-link" @click="closeMenu">Dashboard</router-link>

          <router-link
            v-if="canCreate"
            to="/create"
            class="mobile-link"
            @click="closeMenu"
          >
            Créer
          </router-link>

          <router-link
            v-if="auth.isLogged"
            to="/profile"
            class="mobile-link"
            @click="closeMenu"
          >
            Profil
          </router-link>

          <router-link
            v-if="auth.isLogged"
            to="/my-events"
            class="mobile-link"
            @click="closeMenu"
          >
            Mes événements
          </router-link>

          <router-link
            v-if="isAdmin"
            to="/admin"
            class="mobile-link"
            @click="closeMenu"
          >
            Admin
          </router-link>
        </nav>

        <div class="mobile-footer">
          <template v-if="auth.isLogged">
            <div class="mobile-user-card">
              <div class="user-avatar">
                {{ userInitial }}
              </div>

              <div class="user-meta">
                <span class="user-email">{{ auth.user?.email }}</span>
                <span class="user-role">{{ roleLabel }}</span>
              </div>
            </div>

            <button class="btn btn-logout mobile-full" @click="onLogout">
              Logout
            </button>
          </template>

          <template v-else>
            <div class="mobile-auth-actions">
              <router-link to="/login" class="btn btn-light mobile-full" @click="closeMenu">
                Login
              </router-link>
              <router-link to="/register" class="btn btn-primary mobile-full" @click="closeMenu">
                Register
              </router-link>
            </div>
          </template>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();
const router = useRouter();
const menuOpen = ref(false);

const canCreate = computed(() => {
  const role = auth.user?.role || auth.role;
  return ["ADMIN", "ORGANIZER", "admin", "organizer"].includes(role);
});

const isAdmin = computed(() => {
  const role = auth.user?.role || auth.role;
  return ["ADMIN", "admin"].includes(role);
});

const userInitial = computed(() => {
  const email = auth.user?.email || "";
  return email ? email.charAt(0).toUpperCase() : "U";
});

const roleLabel = computed(() => {
  const role = auth.user?.role || auth.role;

  if (role === "ADMIN" || role === "admin") return "Administrateur";
  if (role === "ORGANIZER" || role === "organizer") return "Organisateur";
  if (role === "PARTICIPANT" || role === "participant") return "Participant";
  return role || "Utilisateur";
});

function closeMenu() {
  menuOpen.value = false;
}

function onLogout() {
  auth.logout();
  closeMenu();
  router.push({ name: "login" });
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");

* {
  box-sizing: border-box;
}

.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(16px);
  background: rgba(248, 251, 255, 0.82);
  border-bottom: 1px solid rgba(219, 228, 238, 0.9);
}

.app-header__inner {
  width: var(--app-container-width);
  max-width: none;
  margin: 0 auto;
  min-height: 78px;
  padding: 0 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
}

.app-header__left {
  display: flex;
  align-items: center;
  gap: 24px;
  min-width: 0;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  min-width: 0;
}

.brand-mark {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  color: white;
  font-size: 1rem;
  font-weight: 800;
  box-shadow: 0 10px 24px rgba(37, 99, 235, 0.22);
  flex-shrink: 0;
}

.brand-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.brand-text strong {
  color: #0f172a;
  font-size: 1rem;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.brand-text span {
  color: #64748b;
  font-size: 0.78rem;
  font-weight: 600;
  line-height: 1.2;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-link {
  min-height: 42px;
  padding: 0 14px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  color: #475569;
  font-size: 0.92rem;
  font-weight: 700;
  transition: all 0.18s ease;
}

.nav-link:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.nav-link.router-link-active {
  background: #e8f0ff;
  color: #1d4ed8;
}

.app-header__right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-chip {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px 8px 8px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid #e2e8f0;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.04);
  min-width: 0;
  max-width: 320px;
}

.user-avatar {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #0f172a, #334155);
  color: white;
  font-size: 0.92rem;
  font-weight: 800;
  flex-shrink: 0;
}

.user-meta {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.user-email {
  color: #0f172a;
  font-size: 0.85rem;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  color: #64748b;
  font-size: 0.76rem;
  font-weight: 600;
}

.btn {
  min-height: 44px;
  padding: 0 16px;
  border-radius: 14px;
  border: none;
  text-decoration: none;
  font-family: "Inter", system-ui, sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
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

.btn-light {
  background: #ffffff;
  color: #0f172a;
  border: 1px solid #dbe4ee;
}

.btn-light:hover {
  background: #f8fafc;
}

.btn-primary {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
  box-shadow: 0 12px 24px rgba(37, 99, 235, 0.18);
}

.btn-primary:hover {
  filter: brightness(1.03);
}

.btn-logout {
  background: #fff1f2;
  color: #dc2626;
  border: 1px solid #ffd9dd;
}

.btn-logout:hover {
  background: #ffe7ea;
}

.mobile-menu-btn {
  width: 46px;
  height: 46px;
  border: 1px solid #dbe4ee;
  border-radius: 14px;
  background: #ffffff;
  color: #0f172a;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: all 0.18s ease;
}

.mobile-menu-btn:hover {
  background: #f8fafc;
}

.mobile-panel {
  border-top: 1px solid rgba(219, 228, 238, 0.9);
  background: rgba(248, 251, 255, 0.95);
  backdrop-filter: blur(16px);
  padding: 14px;
}

.mobile-nav {
  display: grid;
  gap: 8px;
  margin-bottom: 14px;
}

.mobile-link {
  min-height: 48px;
  padding: 0 14px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #334155;
  font-size: 0.94rem;
  font-weight: 700;
  background: #ffffff;
  border: 1px solid #e2e8f0;
}

.mobile-link.router-link-active {
  background: #e8f0ff;
  color: #1d4ed8;
  border-color: #d7e6ff;
}

.mobile-footer {
  display: grid;
  gap: 12px;
}

.mobile-user-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
}

.mobile-auth-actions {
  display: grid;
  gap: 10px;
}

.mobile-full {
  width: 100%;
}

.desktop-only {
  display: flex;
}

.mobile-only {
  display: none;
}

.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (max-width: 900px) {
  .desktop-only {
    display: none;
  }

  .mobile-only {
    display: grid;
  }

  .app-header__inner {
    min-height: 72px;
  }

  .brand-text span {
    display: none;
  }
}

@media (max-width: 640px) {
  .app-header__inner {
    padding: 0 14px;
  }

  .brand-mark {
    width: 38px;
    height: 38px;
    border-radius: 12px;
  }

  .brand-text strong {
    font-size: 0.95rem;
  }
}
</style>
