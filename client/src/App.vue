<template>
  <NavBar />
  <main style="max-width: 980px; margin: 0 auto; padding: 16px;">
    <router-view />
  </main>
</template>

<script setup>
import NavBar from "./components/NavBar.vue";
</script>

<style>
:root {
  --app-container-width: min(100%, 1440px);
  --app-container-gutter: 16px;
}

.app-container {
  width: var(--app-container-width);
  margin: 0 auto;
}

main {
  width: var(--app-container-width) !important;
  max-width: none !important;
  margin: 0 auto !important;
  padding: var(--app-container-gutter) !important;
}

main > form[style*="max-width:360px"],
main > form[style*="max-width:520px"] {
  width: 100%;
  max-width: 720px !important;
}

@media (max-width: 640px) {
  :root {
    --app-container-gutter: 14px;
  }
}
</style>
