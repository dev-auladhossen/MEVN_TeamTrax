<template>
  <div>
    <div class="grid grid-cols-1 gap-3 max-h-screen overflow-auto">
      <!-- Skeleton while loading -->
      <div v-if="loading" class="space-y-4">
        <div
          v-for="n in 2"
          :key="n"
          class="animate-pulse bg-white p-4 rounded-xl shadow border border-gray-200"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="h-5 w-1/3 bg-gray-300 rounded"></div>
            <div class="h-2 w-1/4 bg-gray-200 rounded"></div>
          </div>
          <div class="space-y-2">
            <div class="h-3 bg-gray-200 rounded w-full"></div>
            <div class="h-3 bg-gray-200 rounded w-5/6"></div>
            <div class="h-3 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="sprints.length === 0"
        class="text-center py-12 text-gray-500"
      >
        <div class="text-2xl font-semibold mb-2">No Sprints Yet</div>
        <p class="text-sm">
          Start by creating a sprint to organize your tasks.
        </p>
      </div>
      <!-- Render Sprints -->
      <div
        v-else
        v-for="sprint in sprints"
        :key="sprint._id"
        class="bg-white border rounded-lg px-4 py-3 shadow transition-transform mr-1"
      >
        <!-- Sprint Header -->
        <div class="mb-3">
          <div class="flex justify-between">
            <div class="flex items-center gap-2">
              <button
                @click="toggleSprintBody(sprint._id)"
                class="text-gray-600 hover:text-black transition duration-300"
                title="Expand/Collapse"
              >
                <i
                  class="fas fa-chevron-right transition-transform duration-300"
                  :class="{ 'rotate-90': isExpanded(sprint._id) }"
                ></i>
              </button>
              <h3 class="text-lg font-bold">{{ sprint.name }}</h3>
            </div>

            <!-- Progress Bar & Deadline Info -->
            <div class="flex w-[50%]">
              <div class="w-full text-xs text-gray-600 mt-1 ml-1">
                <span> Total Tasks: {{ countTasks(sprint._id) }}</span>
              </div>
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
            <!-- Editable Dates -->
            <div class="flex items-center">
              <span>Deadline:</span>
              <input
                class="border-none rounded px-1 py-0.5 text-xs cursor-pointer"
                type="datetime-local"
                :value="formatDateTimeInput(sprint.endDate)"
                @change="
                  (e) => {
                    sprint.endDate = e.target.value;
                    updateSprintDates(sprint);
                  }
                "
              />

              <div class="w-full text-xs text-gray-600 mt-1 ml-1">
                <span v-if="daysLeft(sprint.endDate) > 0">
                  ⏳ {{ daysLeft(sprint.endDate) }} day<span
                    v-if="daysLeft(sprint.endDate) > 1"
                    >s</span
                  >
                  left
                </span>
                <span
                  v-else-if="daysLeft(sprint.endDate) === 0"
                  class="text-orange-500"
                >
                  🟡 Deadline is today
                </span>
                <span v-else class="text-red-500">
                  ⚠️ {{ Math.abs(daysLeft(sprint.endDate)) }} day<span
                    v-if="Math.abs(daysLeft(sprint.endDate)) > 1"
                    >s</span
                  >
                  overdue
                </span>
              </div>
            </div>

            <!-- Sprint Status Dropdown -->
            <div class="relative">
              <select
                v-model="sprint.status"
                @change="updateSprintStatus(sprint)"
                class="border rounded px-2 py-1 text-xs cursor-pointer"
              >
                <option disabled value="">Change Status</option>
                <option value="planned">Planned</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
              <font-awesome-icon
                @click="deleteSprint(sprint._id)"
                icon="trash-can"
                class="cursor-pointer text-red-400 ms-4"
              />
            </div>
          </div>
        </div>

        <!-- Sprint Columns -->
        <transition name="expand" mode="out-in">
          <div
            v-if="isExpanded(sprint._id)"
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
          >
            <div
              v-for="status in statuses"
              :key="status"
              class="rounded-sm p-3 min-h-[180px] shadow-sm border-t-4"
              :class="getStatusColor(status)"
              @dragover.prevent
              @drop="onDrop($event, sprint._id, status)"
            >
              <!-- Column Header -->
              <h4 class="flex justify-between items-center mb-3">
                <span class="text-sm font-bold capitalize">{{ status }}</span>
                <span
                  class="text-xs bg-white text-gray-700 px-2 py-0.5 rounded shadow-sm"
                >
                  {{ countTasksByStatus(sprint._id, status) }}
                </span>
              </h4>

              <!-- Tasks -->
              <transition-group
                name="fade"
                tag="ul"
                class="space-y-2 max-h-[200px] overflow-y-auto pr-1 pb-1"
              >
                <li
                  @click="$emit('open-task', task)"
                  v-for="task in filteredTasks(sprint._id, status)"
                  :key="task._id"
                  class="bg-white border rounded-lg px-3 py-2 text-sm shadow-md cursor-move hover:shadow-lg transition"
                  draggable="true"
                  @dragstart="onDragStart(task)"
                >
                  <div class="font-medium text-gray-800 truncate">
                    {{ task.title }}
                  </div>
                </li>
              </transition-group>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { useToast } from "../components/Composables/useToast.js";
import VueDatePicker from "@vuepic/vue-datepicker";

const { success, error } = useToast();
const props = defineProps({ projectId: String });
const emit = defineEmits(["task-moved", "open-task"]);

const sprints = ref([]);
const tasks = ref([]);
const expandedSprintIds = ref([]);
const loading = ref(true);

const statuses = ["Todo", "InProgress", "Review", "Done"];

// Fetch sprints and tasks
onMounted(async () => {
  if (props.projectId) {
    loading.value = true;
    await Promise.all([fetchSprints(), fetchTasks()]);
    loading.value = false;
    expandedSprintIds.value = sprints.value.map((s) => s._id);
  }
  // expandedSprintIds.value = [];
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
    success(`Task Status has Changed to ${capitalizeFirst(targetStatus)}!`, {
      title: "Success",
    });
  } catch (err) {
    console.error("Failed to update task:", err);
  }
}

function capitalizeFirst(text) {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
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
  const done = countTasksByStatus(sprintId, "Done");
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

async function updateSprintDates(sprint) {
  try {
    await axios.patch(`http://localhost:5000/api/sprints/${sprint._id}`, {
      startDate: sprint.startDate,
      endDate: sprint.endDate,
    });
    fetchSprints();
    success("Sprint start/end time updated", { title: "Updated" });
  } catch (err) {
    error("Failed to update sprint time", { title: "Error" });
    console.error(err);
  }
}

function formatDateTimeInput(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toISOString().slice(0, 16); // format: YYYY-MM-DDTHH:MM
}

function daysLeft(endDate) {
  if (!endDate) return null;
  const now = new Date();
  const end = new Date(endDate);
  const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24)); // In days
  return diff;
}

function toggleSprintBody(id) {
  if (expandedSprintIds.value.includes(id)) {
    expandedSprintIds.value = expandedSprintIds.value.filter((i) => i !== id);
  } else {
    expandedSprintIds.value.push(id);
  }
}

function isExpanded(id) {
  return expandedSprintIds.value.includes(id);
}

function getStatusColor(status) {
  const map = {
    Todo: "border-blue-500 bg-blue-50",
    InProgress: "border-yellow-500 bg-yellow-50",
    Review: "border-purple-500 bg-purple-50",
    Done: "border-green-500 bg-green-50",
  };
  return map[status] || "border-gray-300 bg-gray-50";
}

const deleteSprint = async (sprintId) => {
  const token = localStorage.getItem("token");

  const confirmed = await $confirm({
    title: "Delete Item",
    message: "Are you sure you want to delete the selected record?",
  });

  if (!confirmed) {
    return;
  } else {
    // Proceed with deletion
    await axios.delete(`http://localhost:5000/api/sprints/${sprintId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    fetchSprints();
    success("Sprint Deleted!", { title: "Deleted" });
  }
};
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

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  transform: scaleY(0.95);
}

.expand-enter-to,
.expand-leave-from {
  max-height: 1000px;
  opacity: 1;
  transform: scaleY(1);
}
</style>
