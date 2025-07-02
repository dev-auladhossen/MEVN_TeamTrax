<template>
  <div>
    <h2>All Sprints</h2>
    <div v-for="sprint in sprints" :key="sprint._id">
      <p>{{ sprint.name }} ({{ sprint.status }})</p>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const sprints = ref([]);
onMounted(async () => {
  const res = await axios.get('http://localhost:5000/api/sprints');
  sprints.value = res.data;
});
</script>