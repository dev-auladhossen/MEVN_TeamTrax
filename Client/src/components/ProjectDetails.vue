<template>
  <div class="p-6 space-y-8">
    <!-- Back Button -->
    <button
      @click="goBack"
      class="flex items-center text-sm text-gray-600 hover:text-blue-600 mb-2"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4 mr-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 19l-7-7 7-7"
        />
      </svg>
      Back
    </button>

    <!-- Top Section: Project Info -->
    <div
      class="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row md:justify-between items-start md:items-center"
    >
      <div class="space-y-2">
        <h1 class="text-2xl font-semibold text-gray-800">{{ project.name }}</h1>
        <div class="text-sm text-gray-600">
          Status:
          <span class="font-medium text-blue-600">{{ project.status }}</span>
        </div>
        <div class="text-sm text-gray-600">
          Start Date: {{ project.startDate }}
        </div>
        <div class="text-sm text-gray-600">End Date: {{ project.endDate }}</div>
        <div class="text-sm text-gray-600">
          Created By: {{ project.createdBy }}
        </div>
        <div class="text-sm text-gray-600">
          Teams: {{ project.teams.join(", ") }}
        </div>
      </div>
      <button
        @click="showModal = true"
        class="mt-4 md:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        + Add Task
      </button>
    </div>

    <!-- Filters -->
    <div class="flex gap-4 flex-wrap items-center">
      <select
        v-model="filterPriority"
        class="px-4 py-2 rounded-lg border text-sm"
      >
        <option value="">All Priorities</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      <input
        type="date"
        v-model="filterDueDate"
        class="px-4 py-2 rounded-lg border text-sm"
      />
    </div>

    <!-- Status Switch Bar -->
    <!-- Status Switch Bar -->
    <div class="flex gap-4 overflow-x-auto pb-2">
      <button
        v-for="status in ['All', ...taskStatuses]"
        :key="status"
        @click="selectedStatus = status"
        :class="[
          selectedStatus === status
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-800',
          'px-4 py-1.5 rounded-full text-sm font-medium transition',
        ]"
      >
        {{ status }}
      </button>
    </div>

    <!-- Task Cards by Status -->
    <div class="grid md:grid-cols-3 gap-6">
      <div
        v-for="status in filteredColumns"
        :key="status"
        v-show="selectedStatus === 'All' || selectedStatus === status"
        class="bg-gray-50 rounded-2xl p-4 shadow"
        :data-status="status"
      >
        <h2 class="text-lg font-semibold mb-4 text-gray-700">{{ status }}</h2>
        <draggable
          v-if="filteredTasksByStatus(status).length"
          :list="filteredTasksByStatus(status)"
          :group="{ name: 'tasks', pull: true, put: true }"
          @change="onTaskDrop($event, status)"
          item-key="id"
        >
          <template #item="{ element: task, index }">
            <div
              class="bg-white p-4 rounded-xl shadow hover:shadow-md transition mb-4"
              :key="task.id"
              :data-id="task.id"
            >
              <div class="flex justify-between items-center mb-2">
                <div class="text-sm font-semibold text-gray-800">
                  {{ task.name }}
                </div>
                <span
                  class="text-xs px-2 py-0.5 rounded"
                  :class="{
                    'bg-red-100 text-red-600': task.priority === 'High',
                    'bg-yellow-100 text-yellow-600': task.priority === 'Medium',
                    'bg-green-100 text-green-600': task.priority === 'Low',
                  }"
                >
                  {{ task.priority }}
                </span>
              </div>
              <div class="text-sm text-gray-500 mb-1">
                Due: {{ task.dueDate }}
              </div>
              <p class="text-sm text-gray-600 mb-3">{{ task.description }}</p>
              <div class="flex -space-x-2">
                <div
                  v-for="member in task.assignedTo"
                  :key="member.id"
                  @click="openMemberModal(member)"
                  class="cursor-pointer w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white hover:scale-105 transition"
                  :title="member.fullName"
                >
                  {{ getInitials(member.fullName) }}
                </div>
              </div>
            </div>
          </template>
        </draggable>
        <div v-else class="text-sm text-gray-500 italic">
          No tasks in this status.
        </div>
      </div>
    </div>

    <!-- Task Form Modal -->
    <Dialog :isOpen="showModal" @close="showModal = false">
      <div class="max-w-xl mx-auto bg-white">
        <h3 class="text-lg font-bold leading-6 text-center mb-2 text-gray-700">
          {{ mode === "add" ? "ADD NEW TASK" : "EDIT TASK" }}
        </h3>

        <form @submit.prevent="createProject" class="space-y-3">
          <div>
            <label class="block text-sm font-medium text-gray-700">Title</label>
            <input
              v-model="newTask.name"
              type="text"
              placeholder="Enter project name"
              required
              class="mt-1 text-sm block w-full px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Description</label
            >
            <textarea
              v-model="newTask.description"
              placeholder="Enter project description"
              rows="2"
              class="mt-1 text-sm block w-full px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>

          <div class="flex gap-8">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Status</label
              >
              <select
                v-model="newTask.status"
                class="w-32 px-4 py-1 border rounded text-sm cursor-pointer"
              >
                <option
                  v-for="status in taskStatuses"
                  :key="status"
                  :value="status"
                >
                  {{ status }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Priority</label
              >
              <select
                v-model="newTask.priority"
                class="w-32 px-4 py-1 border rounded text-sm cursor-pointer"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div class="text-sm">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Due Date</label
              >
              <VueDatePicker
                input-class="text-sm px-3 py-2 border rounded w-full"
                v-model="newTask.dueDate"
                :teleport="true"
                :clearable="false"
                :month-change-on-arrows="true"
                placeholder="Pick a date"
              ></VueDatePicker>
            </div>
          </div>

          <!-- Assignees Multi-Select Dropdown -->
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700"
              >Assign To</label
            >
            <div class="relative" ref="assigneeDropdownRef">
              <button
                type="button"
                @click="showAssigneeDropdown = !showAssigneeDropdown"
                class="w-full border border-gray-300 bg-white px-4 py-2 rounded-md shadow-sm text-left text-sm"
              >
                <span v-if="newTask.assignedTo.length">
                  {{
                    newTask.assignedTo.map((user) => user.fullName).join(", ")
                  }}
                </span>
                <span v-else class="text-gray-400">Select users</span>
              </button>

              <!-- Dropdown above the button -->
              <div
                v-if="showAssigneeDropdown"
                class="absolute bottom-full mb-1 z-10 bg-white border border-gray-200 rounded-md shadow w-full max-h-64 overflow-y-auto"
              >
                <div v-for="(users, dept) in groupedUsers" :key="dept">
                  <div class="flex bg-gray-100 hover:bg-gray-200">
                    <span>
                      <input
                        type="checkbox"
                        :checked="isAllSelected(users)"
                        @change="toggleSelectAll(users)"
                        class="mx-4 my-2 p-2 cursor-pointer border rounded-sm outline-none focus:ring-0"
                    /></span>
                    <button
                      type="button"
                      class="w-full text-left py-2 font-medium text-sm flex justify-between items-center"
                      @click="toggleDept(dept)"
                    >
                      <span>{{ dept }}</span>
                      <span class="mr-2">{{
                        expandedDepts.includes(dept) ? "▲" : "▼"
                      }}</span>
                    </button>
                  </div>

                  <div v-if="expandedDepts.includes(dept)">
                    <!-- Users -->
                    <label
                      v-for="user in users"
                      :key="user.id"
                      class="flex items-center px-4 py-2 hover:bg-gray-50 text-sm"
                    >
                      <input
                        type="checkbox"
                        :value="user"
                        v-model="newTask.assignedTo"
                        class="mr-4 p-2 cursor-pointer border rounded-sm focus:ring-0"
                      />
                      {{ user.fullName }}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="pt-4">
            <button
              type="submit"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-200"
            >
              {{ mode === "add" ? "Create Task" : "Update Task" }}
            </button>
          </div>
        </form>
      </div>
    </Dialog>

    <!-- Member Detail Modal -->
    <div v-if="selectedMember" class="fixed inset-0 z-50">
      <div
        class="absolute inset-0 bg-black bg-opacity-30"
        @click="selectedMember = null"
      ></div>
      <div
        class="relative z-10 bg-white p-6 rounded-2xl w-80 mx-auto mt-24 space-y-4 shadow-xl"
      >
        <button
          type="button"
          @click="selectedMember = null"
          class="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          &times;
        </button>
        <h3 class="text-lg font-semibold text-gray-800">
          {{ selectedMember.fullName }}
        </h3>
        <p class="text-sm text-gray-600">Email: {{ selectedMember.email }}</p>
        <p class="text-sm text-gray-600">Role: {{ selectedMember.role }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import draggable from "vuedraggable";
import Dialog from "../components/Task/Dialog.vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const router = useRouter();
const goBack = () => router.back();

const project = ref({
  name: "Website Redesign",
  status: "In Progress",
  startDate: "2025-06-01",
  endDate: "2025-08-01",
  createdBy: "John Doe",
  teams: ["Design", "Development"],
});

const initialForm = {
  name: "",
  description: "",
  startDate: "",
  endDate: "",
  teams: [],
  status: "Planning",
  createdBy: "", // Replace with logged-in user ID
};

const form = reactive({ ...initialForm });

const taskStatuses = ["Todo", "In Progress", "Review", "Done"];
const selectedStatus = ref("All");
const filterPriority = ref("");
const filterDueDate = ref("");
const showTaskForm = ref(false);
const showModal = ref(false);
const showAssigneeDropdown = ref(false);
const mode = ref("add");
const expandedDepts = ref([]);

const assigneeDropdownRef = ref(null);
const toggleAssigneeDropdown = () => {
  showAssigneeDropdown.value = !showAssigneeDropdown.value;
};

const groupedUsers = computed(() => {
  const map = {};
  dummyUsers.forEach((user) => {
    if (!map[user.department]) map[user.department] = [];
    map[user.department].push(user);
  });
  return map;
});

const toggleDept = (dept) => {
  if (expandedDepts.value.includes(dept)) {
    expandedDepts.value = expandedDepts.value.filter((d) => d !== dept);
  } else {
    expandedDepts.value.push(dept);
  }
};

const isAllSelected = (users) => {
  return users.every((user) =>
    newTask.value.assignedTo.some((u) => u.id === user.id)
  );
};

const toggleSelectAll = (users) => {
  const allSelected = isAllSelected(users);
  if (allSelected) {
    // Remove all users from that dept
    newTask.value.assignedTo = newTask.value.assignedTo.filter(
      (u) => !users.some((depUser) => depUser.id === u.id)
    );
  } else {
    // Add missing users
    users.forEach((user) => {
      if (!newTask.value.assignedTo.some((u) => u.id === user.id)) {
        newTask.value.assignedTo.push(user);
      }
    });
  }
};
const handleClickOutside = (e) => {
  if (
    assigneeDropdownRef.value &&
    !assigneeDropdownRef.value.contains(e.target)
  ) {
    showAssigneeDropdown.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

const dummyUsers = [
  { id: 1, fullName: "Alice Smith", department: "Design" },
  { id: 2, fullName: "Bob Johnson", department: "Design" },
  { id: 3, fullName: "Charlie Brown", department: "Development" },
  { id: 4, fullName: "David Lee", department: "Development" },
  { id: 5, fullName: "Eva Green", department: "QA" },
];

const tasks = ref([
  {
    id: 1,
    name: "Create Wireframes",
    description: "Initial layout and structure",
    status: "Todo",
    priority: "High",
    dueDate: "2025-06-05",
    assignedTo: [
      {
        id: 1,
        fullName: "Alice Smith",
        email: "alice@example.com",
        role: "Designer",
      },
      { id: 2, fullName: "Bob Johnson", email: "bob@example.com", role: "UX" },
    ],
  },
  {
    id: 2,
    name: "Develop Homepage",
    description: "HTML + Tailwind",
    status: "In Progress",
    priority: "Medium",
    dueDate: "2025-06-10",
    assignedTo: [
      {
        id: 3,
        fullName: "Charlie Brown",
        email: "charlie@example.com",
        role: "Frontend Developer",
      },
    ],
  },
  {
    id: 3,
    name: "Code Review",
    description: "Review the latest merge request",
    status: "Review",
    priority: "Low",
    dueDate: "2025-06-12",
    assignedTo: [
      {
        id: 4,
        fullName: "David Lee",
        email: "david@example.com",
        role: "Reviewer",
      },
    ],
  },
]);

const selectedMember = ref(null);

const openMemberModal = (member) => {
  selectedMember.value = member;
};

const getInitials = (name) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

const filteredColumns = computed(() => {
  if (selectedStatus.value === "All") return taskStatuses;
  return [selectedStatus.value];
});

const filteredTasksByStatus = (status) => {
  return tasks.value.filter((task) => task.status === status);
};

const newTask = ref({
  name: "",
  description: "",
  status: taskStatuses[0],
  priority: "Medium",
  dueDate: "",
  assignedTo: [],
  priorities: "Medium",
});

const addTask = () => {
  tasks.value.push({
    id: tasks.value.length + 1,
    ...newTask.value,
  });
  newTask.value = {
    name: "",
    description: "",
    status: taskStatuses[0],
    priority: "Medium",
    dueDate: "",
    assignedTo: [],
  };
  showTaskForm.value = false;
};

const onTaskDrop = (event, newStatus) => {
  console.log(event);
  console.log("onTaskDrop newStatus", newStatus);

  const movedTask = event?.added?.element;
  console.log("movedTask", movedTask);
  if (movedTask) {
    movedTask.status = newStatus;
    // updateTaskStatus(task);
  }
};

const updateTaskStatus = (task) => {
  console.log(`Task ID ${task.id} status updated to ${task.status}`);
};
</script>

<style scoped>
body {
  font-family: "Inter", sans-serif;
}
</style>

<!-- <template>
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
</script> -->
