<template>
  <Layout>
    <div class="p-6 max-w-3xl mx-auto">
      <h1 class="text-2xl font-bold mb-4">{{ project?.name }}</h1>

      <div v-if="project">
        <p><strong>Title:</strong> {{ project.name }}</p>
        <p><strong>Description:</strong> {{ project.description }}</p>
        <p><strong>Status:</strong> {{ project.status }}</p>
      </div>

      <div v-else>
        <p>Loading project details...</p>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import Layout from "./Layout.vue";
import axios from "axios";
import moment from "moment";

const route = useRoute();
const project = ref(null);

const fetchProject = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `http://localhost:5000/api/project-details/${route.params.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const p = res.data;
    project.value = {
      ...p,
      createdBy: p.createdBy?.username || "Unknown",
      startDate: moment(p.startDate).format("LL"),
      endDate: moment(p.endDate).format("LL"),
    };
  } catch (error) {
    console.error("Failed to fetch project:", error);
  }
};

onMounted(() => {
  fetchProject();
  //   const projectId = Number(route.params.id);
  //   project.value = mockProjects.find((p) => p.id === projectId);
});
</script>
