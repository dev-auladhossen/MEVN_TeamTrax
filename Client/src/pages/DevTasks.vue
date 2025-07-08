<template>
  <Layout>
    <div class="p-2 min-h-screen">
      <h4 class="text-xl font-bold mb-4">My Assigned Tasks</h4>

      <!-- Filters Section -->
      <div class="flex flex-wrap gap-4 mb-6">
        <!-- Search Bar -->
        <input
          v-model="searchText"
          type="text"
          placeholder="Search tasks..."
          class="px-4 py-2 border rounded-md text-sm w-full md:w-1/3"
        />
        <!-- Sorting Dropdown -->
        <select
          v-model="sortOption"
          class="px-4 py-2 border rounded-md text-sm placeholder-gray-300 border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Sort By</option>
          <option value="dueDate-asc">Due Date ↑</option>
          <option value="dueDate-desc">Due Date ↓</option>
          <option value="title-asc">Title A-Z</option>
          <option value="title-desc">Title Z-A</option>
        </select>

        <!-- Priority Filter -->
        <select
          v-model="selectedPriority"
          class="px-8 py-2 border rounded-md text-sm"
        >
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <!-- Status Filter -->
        <select
          v-model="selectedStatus"
          class="px-8 py-2 border rounded-md text-sm"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <!-- Task List -->
      <div v-if="loading" class="text-gray-500">Loading tasks...</div>
      <div v-else-if="paginatedTasks.length === 0" class="text-gray-600">
        No matching tasks found.
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" v-else>
        <TaskDrawer
          :isOpen="isDrawerOpen"
          :task="selectedTask"
          @close="isDrawerOpen = false"
          @taskEdited="taskEdited"
        />
        <div
          v-for="task in paginatedTasks"
          :key="task._id"
          @click="openTask(task)"
          class="bg-white p-4 rounded-2xl shadow hover:shadow-md transition cursor-pointer"
        >
          <h3 class="text-xl font-semibold mb-1">{{ task.title }}</h3>
          <p class="text-gray-600 text-sm mb-2">{{ task.description }}</p>

          <div class="flex justify-between text-sm text-gray-500">
            <span
              class="text-sm px-2 py-0.5 rounded h-7 mx-1"
              :class="{
                'bg-red-100 text-red-600': task.priority === 'High',
                'bg-yellow-50 text-yellow-500': task.priority === 'Medium',
                'bg-green-100 text-green-600': task.priority === 'Low',
              }"
              >{{ task.priority }}</span
            >
            <span
              class="text-sm h-7 text-nowrap"
              :class="[
                'py-0.5 px-2 border rounded text-sm',
                `bg-[${getStatusColor(
                  task.status
                )}] bg-opacity-10 text-[${getStatusColor(task.status)}]`,
              ]"
            >
              {{ task.status }}
            </span>
          </div>

          <div class="mt-3 text-xs text-gray-400">
            Deadline: {{ formatDate(task.dueDate) }}
          </div>
        </div>
      </div>
    </div>
    <TaskDrawer
      :isOpen="isDrawerOpen"
      :task="selectedTask"
      @close="isDrawerOpen = false"
    />

    <!-- Pagination Controls -->
    <div class="flex justify-center items-center gap-3">
      <button
        @click="currentPage--"
        :disabled="currentPage === 1"
        class="px-3 py-1 border rounded disabled:opacity-50"
      >
        Prev
      </button>

      <span class="text-sm">Page {{ currentPage }} of {{ totalPages }}</span>

      <button
        @click="currentPage++"
        :disabled="currentPage === totalPages"
        class="px-3 py-1 border rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted, inject } from "vue";
import axios from "axios";
import TaskDrawer from "../components/TaskDetails/TaskDrawer.vue";
import Layout from "../components/Layout.vue";

const tasks = ref([]);
const loading = ref(true);
const sortOption = ref("");
const currentPage = ref(1);
const itemsPerPage = 6;

const selectedPriority = ref("");
const selectedStatus = ref("");
const searchText = ref("");
const taskStatuses = ref([]);
const isDrawerOpen = ref(false);
const selectedTask = ref(null);

const openTask = (task) => {
  selectedTask.value = task;
  isDrawerOpen.value = true;
};

const paginatedTasks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredTasks.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredTasks.value.length / itemsPerPage);
});

const taskEdited = () => {
  alert("clicked");
  fetchTasks();
};

// Fetch tasks from backend
const fetchTasks = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      "http://localhost:5000/api/dev/sprint-tasks",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    tasks.value = response.data;
  } catch (err) {
    console.error("Error fetching tasks:", err);
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Computed: filter + sort tasks
const filteredTasks = computed(() => {
  let filtered = tasks.value.filter((task) => {
    const matchPriority = selectedPriority.value
      ? task.priority === selectedPriority.value
      : true;
    const matchStatus = selectedStatus.value
      ? task.status === selectedStatus.value
      : true;
    const matchSearch =
      searchText.value === "" ||
      task.title.toLowerCase().includes(searchText.value.toLowerCase()) ||
      task.description.toLowerCase().includes(searchText.value.toLowerCase());

    return matchPriority && matchStatus && matchSearch;
  });

  // Apply sorting
  switch (sortOption.value) {
    case "dueDate-asc":
      filtered.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      break;
    case "dueDate-desc":
      filtered.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
      break;
    case "title-asc":
      filtered.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "title-desc":
      filtered.sort((a, b) => b.title.localeCompare(a.title));
      break;
  }

  return filtered;
});

const fetchStatuses = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      "http://localhost:5000/api/task-status/status",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    taskStatuses.value = res.data;

    console.log("clg from statuses ", taskStatuses.value);
  } catch (error) {
    console.error("Failed to fetch statuses:", error);
  }
};

const getStatusColor = (statusName) => {
  const matchedStatus = taskStatuses.value.find(
    (status) => status.name === statusName
  );
  return matchedStatus ? matchedStatus.color : "#d1d5db"; // fallback color if not found
};

onMounted(() => {
  fetchTasks();
  fetchStatuses();
});
</script>
