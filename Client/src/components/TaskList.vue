<template>
  <DataTable
    :headers="[
      'Task Title',
      'Description',
      'Status',
      'Priority',
      'Assigned To',
      'Due Date',
      'Project',
    ]"
    :headerKeys="[
      'title',
      'description',
      'status',
      'priority',
      'assignedTo',
      'dueDate',
      'project',
    ]"
    :data="tasks"
    :items-per-page="5"
  />
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import DataTable from "./Task/DataTable.vue";
import moment from "moment";

const tasks = ref([]);

const fetchTasks = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5000/api/get-tasks", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    tasks.value = res.data;
    tasks.value = res.data.map((task) => ({
      ...task,
      dueDate: moment(task.dueDate).format("LL"),
      project: task.projectId.name,
      assignedTo: task.assignedTo.map((user) => {
        return user.fullName;
      }),
    }));
    console.log("tasks", tasks.value);
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
  }
};

onMounted(fetchTasks);

defineExpose({ fetchTasks });
</script>
