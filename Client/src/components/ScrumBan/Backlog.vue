<template>
  <div>
    <h2>Backlog</h2>
    <div v-for="task in tasks" :key="task._id">
      <p>{{ task.title }} - {{ task.status }}</p>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const tasks = ref([]);
onMounted(async () => {
  const res = await axios.get("http://localhost:5000/api/scrum-tasks");
  tasks.value = res.data.filter((t) => t.status === "backlog");
});
</script>
