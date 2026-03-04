<template>
  <NavBar />
  <main style="max-width: 980px; margin: 0 auto; padding: 16px;">
    <router-view />
  </main>
</template>

<script setup>
import NavBar from "./components/NavBar.vue";
</script>
