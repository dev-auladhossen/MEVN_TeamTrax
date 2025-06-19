<template>
  <DataTable
    :headers="[
      'Project Title',
      'Description',
      'Status',
      'Owner',
      'Assigned Team',
      'Start Date',
      'End Date',
    ]"
    :headerKeys="[
      'name',
      'description',
      'status',
      'createdBy',
      'teams',
      'startDate',
      'endDate',
    ]"
    :data="projects"
    :items-per-page="5"
    :type="'project'"
  />
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import DataTable from "./Task/DataTable.vue";
import moment from "moment";

const projects = ref([]);

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
  } catch (error) {
    console.error("Failed to fetch users:", error);
  }
};

onMounted(fetchProjects);

defineExpose({ fetchProjects });
</script>
