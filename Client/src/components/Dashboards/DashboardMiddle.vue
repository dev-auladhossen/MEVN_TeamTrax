<template>
  <div class="grid grid-cols-1 xl:grid-cols-2 gap-4 px-4 py-6">
    <TaskChart />
    <ActivityFeed />
  </div>
</template>

<script setup>
import TaskChart from './TaskChart.vue'
import ActivityFeed from './ActivityFeed.vue'
</script>
