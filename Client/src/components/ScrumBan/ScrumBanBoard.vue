<template>
  <div class="grid grid-cols-5 gap-4">
    <div
      v-for="status in statuses"
      :key="status"
      class="p-4 border rounded min-h-[100px]"
      @dragover.prevent
      @drop="onDrop(status)"
    >
      <h3 class="font-bold capitalize mb-2">{{ status }}</h3>

      <!-- Task Cards -->
      <div
        v-for="task in filteredTasks(status)"
        :key="task._id"
        class="bg-white rounded p-2 shadow my-2 cursor-move"
        draggable="true"
        @dragstart="onDragStart(task._id)"
      >
        <p>{{ task.title }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Backlog from "./Backlog.vue";
import SprintManager from "./SprintManager.vue";

const tasks = ref([]);
const draggedTaskId = ref(null);
const statuses = ["todo", "inprogress", "review", "done"];

onMounted(async () => {
  const res = await axios.get("http://localhost:5000/api/scrum-tasks");
  tasks.value = res.data.filter((t) => statuses.includes(t.status));
});

function filteredTasks(status) {
  return tasks.value.filter((t) => t.status === status);
}

function onDragStart(taskId) {
  draggedTaskId.value = taskId;
}

async function onDrop(targetStatus) {
  const task = tasks.value.find((t) => t._id === draggedTaskId.value);
  if (!task || task.status === targetStatus) return;
  task.status = targetStatus;
  await axios.patch(`http://localhost:5000/api/scrum-task/${task._id}`, {
    status: targetStatus,
  });
}
</script>
