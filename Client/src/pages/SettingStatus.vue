<template>
  <div class="flex flex-col md:flex-row gap-4">
    <ProjectStatusSettings></ProjectStatusSettings>
    <TaskStatusSettings></TaskStatusSettings>
  </div>
</template>

<script setup>
import ProjectStatusSettings from "./ProjectStatusSettings.vue";
import TaskStatusSettings from "./TaskStatusSettings.vue";
</script>
<style scoped></style>
