<template>
  <div
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 p-4"
  >
    <StatCard
      title="Total Projects"
      icon="project-diagram"
      :count="stats.totalProjects"
      color="bg-blue-100 text-blue-800"
      @click="goToDetails('/projects')"
    />
    <StatCard
      title="Total Tasks"
      icon="tasks"
      :count="stats.totalTasks"
      color="bg-green-100 text-green-800"
      @click="goToDetails('/tasks')"
    />
    <StatCard
      title="Total Users"
      icon="user"
      :count="stats.totalUsers"
      color="bg-purple-100 text-purple-800"
      @click="goToDetails('/add-user')"
    />
    <StatCard
      title="GitHub Repos"
      icon="code-branch"
      :count="stats.totalRepos"
      color="bg-gray-100 text-gray-800"
      @click="goToDetails('/github')"
    />
    <StatCard
      title="Total Roles"
      icon="people-group"
      :count="stats.totalRoles"
      color="bg-yellow-100 text-yellow-800"
      @click="goToDetails('/roles')"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import StatCard from "./StatCard.vue";

const router = useRouter();

const stats = ref({
  totalProjects: 12,
  totalTasks: 87,
  totalUsers: 25,
  totalRepos: 9,
  totalRoles: 6,
});

const goTo = (route) => () => {
  router.push(route);
};
const goToDetails = (route) => {
  router.push(route);
};
</script>
