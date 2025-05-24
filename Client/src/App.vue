<template>
  <!-- <div v-if="!$route.meta.hideLayout">
    <h1
      class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900"
    >
      Hello App!
    </h1>
    <p><strong>Current route path:</strong> {{ $route.fullPath }}</p>
  </div>
  <nav>
    <RouterLink
      class="mx-2 font-medium text-blue-600 dark:text-blue-500 hover:underline"
      to="/home"
      >Go to Home</RouterLink
    >
    <RouterLink
      class="mx-2 font-medium text-blue-600 dark:text-blue-500 hover:underline"
      to="/login"
      >Go to login</RouterLink
    >
  </nav> -->
  <main>
    <RouterView />
  </main>
</template>

<script setup>
import { useRoute } from "vue-router";
const $route = useRoute();
</script>
