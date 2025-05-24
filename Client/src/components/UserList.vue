<template>
  <DataTable
    :headers="['Full Name', 'Title', 'Email', 'Role', 'Status']"
    :headerKeys="['username', 'title', 'email', 'role', 'status']"
    :data="users"
    :items-per-page="5"
  />
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import DataTable from "./Task/DataTable.vue";

const users = ref([]);

const fetchUsers = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5000/api/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    users.value = res.data;
  } catch (error) {
    console.error("Failed to fetch users:", error);
  }
};

onMounted(fetchUsers);

defineExpose({ fetchUsers });
</script>
