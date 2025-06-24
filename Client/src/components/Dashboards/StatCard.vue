<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
    <div
      v-for="card in cards"
      :key="card.label"
      @click="goTo(card.route)"
      class="cursor-pointer rounded-2xl bg-white shadow-md hover:shadow-lg transition-all p-5 flex items-center gap-4 group"
    >
      <div class="text-white p-3 rounded-xl" :class="card.bg">
        <font-awesome-icon :icon="card.icon" size="lg" />
      </div>
      <div>
        <p class="text-sm text-gray-500 group-hover:text-gray-700">
          {{ card.label }}
        </p>
        <h3
          class="text-xl font-semibold text-gray-800 group-hover:text-blue-600"
        >
          {{ card.count }}
        </h3>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

// Dummy data — replace later with actual API/computed values
const cards = [
  {
    label: "Total Projects",
    count: 12,
    icon: "project-diagram",
    bg: "bg-blue-500",
    route: "/projects",
  },
  {
    label: "Total Tasks",
    count: 56,
    icon: "tasks-alt",
    bg: "bg-green-500",
    route: "/tasks",
  },
  {
    label: "Total Users",
    count: 14,
    icon: "user",
    bg: "bg-yellow-500",
    route: "/users",
  },
  {
    label: "GitHub Repos",
    count: 7,
    icon: "code-branch",
    bg: "bg-purple-500",
    route: "/github",
  },
  {
    label: "Roles",
    count: 5,
    icon: "people-group",
    bg: "bg-red-500",
    route: "/roles",
  },
];

const goTo = (route) => {
  router.push(route);
};
</script>

<style scoped>
/* Optional enhancements */
</style>
