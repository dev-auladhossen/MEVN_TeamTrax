<template>
  <div class="p-4">
    <div class="grid grid-cols-1 gap-6 max-h-screen overflow-auto">
      <div
        v-for="sprint in sprints"
        :key="sprint._id"
        class="bg-white border rounded-lg p-4 shadow transition-transform"
      >
        <!-- Sprint Header -->
        <div class="mb-4">
          <div class="flex justify-between">
            <h3 class="text-xl font-bold">{{ sprint.name }}</h3>
            <!-- Progress Bar -->
            <div class="flex w-[30%] gap-2">
              <div class="w-full text-right text-xs text-gray-500 mt-1">
                Progress: {{ sprintProgress(sprint._id) }}%
              </div>
              <div class="w-full h-2 bg-gray-200 rounded mt-2">
                <div
                  class="h-2 bg-blue-500 rounded transition-all duration-500"
                  :style="{ width: sprintProgress(sprint._id) + '%' }"
                ></div>
              </div>
            </div>
          </div>

          <div
            class="text-xs text-gray-600 flex flex-wrap justify-between gap-4 mt-1"
          >
            <div class="flex gap-4">
              <span
                >🗓️ {{ formatDate(sprint.startDate) }} -
                {{ formatDate(sprint.endDate) }}</span
              >
              <span>📦 Total Tasks: {{ countTasks(sprint._id) }}</span>
            </div>

            <!-- Sprint Status Dropdown -->
            <div class="relative">
              <select
                v-model="sprint.status"
                @change="updateSprintStatus(sprint)"
                class="border rounded px-2 py-1 text-sm"
              >
                <option disabled value="">Change Status</option>
                <option value="planned">Planned</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Sprint Columns -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            v-for="status in statuses"
            :key="status"
            class="bg-gray-100 min-h-[150px] rounded p-2 transition-all duration-300"
            @dragover.prevent
            @drop="onDrop($event, sprint._id, status)"
          >
            <h4
              class="text-sm font-semibold capitalize mb-2 flex justify-between"
            >
              <span>{{ status }}</span>
              <span class="bg-gray-300 px-2 rounded text-xs">{{
                countTasksByStatus(sprint._id, status)
              }}</span>
            </h4>
            <transition-group
              name="fade"
              tag="ul"
              class="max-h-[250px] overflow-auto"
            >
              <li
                v-for="task in filteredTasks(sprint._id, status)"
                :key="task._id"
                class="bg-white border rounded px-2 py-1 mb-2 text-sm shadow cursor-move hover:bg-gray-50 transition"
                draggable="true"
                @dragstart="onDragStart(task)"
              >
                {{ task.title }}
              </li>
            </transition-group>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { useToast } from "../components/Composables/useToast.js";

const { success, error } = useToast();
const props = defineProps({ projectId: String });
const emit = defineEmits(["task-moved"]);

const sprints = ref([]);
const tasks = ref([]);

const statuses = ["todo", "inprogress", "review", "done"];

// Fetch sprints and tasks
onMounted(() => {
  if (props.projectId) {
    fetchSprints();
    fetchTasks();
  }
});

watch(
  () => props.projectId,
  () => {
    fetchSprints();
    fetchTasks();
  }
);

async function fetchSprints() {
  const res = await axios.get("http://localhost:5000/api/sprints", {
    params: { projectId: props.projectId },
  });
  sprints.value = res.data;
}

async function fetchTasks() {
  const res = await axios.get("http://localhost:5000/api/sprint-tasks", {
    params: { projectId: props.projectId },
  });
  tasks.value = res.data;
}

function filteredTasks(sprintId, status) {
  return tasks.value.filter(
    (task) => task.sprintId?._id === sprintId && task.status === status
  );
}

function onDragStart(task) {
  event.dataTransfer.setData("application/json", JSON.stringify(task));
}

async function onDrop(event, targetSprintId, targetStatus) {
  const task = JSON.parse(event.dataTransfer.getData("application/json"));

  try {
    await axios.patch(`http://localhost:5000/api/sprint-task/${task._id}`, {
      sprintId: targetSprintId,
      status: targetStatus,
    });
    fetchTasks();
    emit("task-moved");
  } catch (err) {
    console.error("Failed to update task:", err);
  }
}

function formatDate(dateStr) {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  return date.toLocaleDateString();
}

function countTasks(sprintId) {
  return tasks.value.filter((task) => task.sprintId?._id === sprintId).length;
}

function countTasksByStatus(sprintId, status) {
  return tasks.value.filter(
    (task) => task.sprintId?._id === sprintId && task.status === status
  ).length;
}

function sprintProgress(sprintId) {
  const total = countTasks(sprintId);
  const done = countTasksByStatus(sprintId, "done");
  return total === 0 ? 0 : Math.round((done / total) * 100);
}

async function updateSprintStatus(sprint) {
  try {
    await axios.patch(`http://localhost:5000/api/sprints/${sprint._id}`, {
      status: sprint.status,
    });
    fetchSprints(); // Refresh data
    success("Sprint Status Changed Successfully!", { title: "Success" });
  } catch (err) {
    console.error("Failed to update sprint status:", err);
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(5px);
}
</style>
