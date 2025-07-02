<template>
  <div>
    <h2>Sprints</h2>
    <div
      v-for="sprint in sprints"
      :key="sprint._id"
      @click="$emit('sprint-selected', sprint._id)"
      class="cursor-pointer hover:bg-blue-100 p-1"
    >
      <p>{{ sprint.name }} ({{ sprint.status }})</p>
    </div>
  </div>
</template>
<script setup>
import { ref, watch } from "vue";
import axios from "axios";

const props = defineProps({ projectId: String });
const sprints = ref([]);

watch(() => props.projectId, fetchSprints, { immediate: true });

async function fetchSprints() {
  const res = await axios.get("http://localhost:5000/api/sprints", {
    params: { projectId: props.projectId },
  });
  sprints.value = res.data;
}
</script>

<!-- <template>
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
</script> -->
