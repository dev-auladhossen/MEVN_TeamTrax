<template>
  <CardViewBoard :statuses="statuses" :items="projects" type="project" />
</template>
<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import moment from "moment";
import CardViewBoard from "../components/Task/CardViewBoard.vue";

const projects = ref([]);
const statuses = ref(["To Do", "Pending", "In Progress", "Completed"]);

const fetchStatuses = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5000/api/project/status", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    statuses.value = res.data;

    console.log("clg from statuses ", statuses.value);
  } catch (error) {
    console.error("Failed to fetch statuses:", error);
  }
};

const fetchProjects = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5000/api/projects", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    projects.value = res.data;
    projects.value = res.data.map((project) => ({
      ...project,
      createdBy: project.createdBy?.username || "Unknown",
      startDate: moment(project.startDate).format("LL"),
      endDate: moment(project.endDate).format("LL"),
    }));
    console.log("clg from projects board", projects.value);
  } catch (error) {
    console.error("Failed to fetch users:", error);
  }
};

onMounted(() => {
  fetchProjects();
  fetchStatuses();
});

defineExpose({ fetchProjects, fetchStatuses });
</script>
<style lang=""></style>
