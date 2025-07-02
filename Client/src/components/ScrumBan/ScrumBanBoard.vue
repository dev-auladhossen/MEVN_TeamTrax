<!-- <template>
  <div class="grid grid-cols-5 gap-4">
    <div
      v-for="status in statuses"
      :key="status"
      class="p-4 border rounded min-h-[100px]"
      @dragover.prevent
      @drop="onDrop(status)"
    >
      <h3 class="font-bold capitalize mb-2">{{ status }}</h3>

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

const props = defineProps({ projectId: String });
const tasks = ref([]);
const draggedTaskId = ref(null);
const statuses = ["todo", "inprogress", "review", "done"];

onMounted(async () => {
  const res = await axios.get(
    `http://localhost:5000/api/sprint-tasks?projectId=${props.projectId}`
  );
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
</script> -->

<template>
  <div class="grid grid-cols-4 gap-4">
    <div
      v-for="status in statuses"
      :key="status"
      class="bg-gray-100 p-2 rounded"
    >
      <h3 class="font-semibold capitalize">{{ status }}</h3>
      <div
        v-for="task in filtered(status)"
        :key="task._id"
        class="bg-white p-2 my-1 rounded shadow"
      >
        {{ task.title }}
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, watch } from "vue";
import axios from "axios";

const props = defineProps({ projectId: String, sprintId: [String, null] });
const statuses = ["backlog", "todo", "inprogress", "review", "done"];
const tasks = ref([]);

watch([() => props.projectId, () => props.sprintId], fetchTasks, {
  immediate: true,
});

async function fetchTasks() {
  const res = await axios.get(
    `http://localhost:5000/api/sprint-tasks?projectId=${props.projectId}`,
    {
      params: { projectId: props.projectId, sprintId: props.sprintId },
    }
  );
  tasks.value = res.data;
  console.log("sprint's tasks", tasks.value);
}

function filtered(status) {
  return tasks.value.filter((t) => t.status === status);
}
</script>
