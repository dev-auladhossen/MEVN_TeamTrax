<template>
  <main>
    <RouterView />
    <Toast />
  </main>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import Toast from "./components/Task/Toast.vue";

const $route = useRoute();
</script>
