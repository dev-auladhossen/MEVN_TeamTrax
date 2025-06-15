<template>
  <Layout>
    <div class="p-4 space-y-3">
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

      <!-- Top Section: Task Info -->
      <div
        class="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row md:justify-between items-start md:items-center"
      >
        <div class="w-full space-y-3">
          <div class="flex justify-between">
            <h1 class="text-xl font-bold text-gray-800">
              {{ task.title }}
            </h1>
            <div class="flex gap-2">
              <button
                @click="showModal = true"
                class="mt-4 md:mt-0 bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition"
              >
                + Add Task
              </button>
            </div>
          </div>

          <div class="text-sm text-gray-600">
            <span class="font-medium">{{ task.description }}</span>
          </div>
          <div class="flex w-full justify-between my-2">
            <div class="text-sm text-gray-600">
              Status:
              <span
                class="px-2 py-1 rounded text-white text-sm"
                :style="{ backgroundColor: getStatusColor(task.status) }"
              >
                {{ task.status }}
              </span>
            </div>

            <div class="flex gap-1 items-center">
              <span class="text-sm text-gray-600">Project:</span>
              <div
                class="flex justify-between gap-1 items-center border rounded-full pr-3 bg-gray-200 cursor-pointer"
              >
                <span>{{ task.projectId }}</span>
              </div>
            </div>
          </div>

          <div class="flex gap-4 justify-between">
            <div class="flex gap-1 text-sm text-gray-600">
              Assigned to:
              <span
                v-for="(value, idx) in task.assignedTo"
                :key="idx"
                class="bg-gray-100 text-gray-800 h-6 text-sm font-medium me-1 px-2.5 py-0.5 rounded"
              >
                {{ value.fullName }}
              </span>
            </div>
            <div class="text-sm text-gray-600">
              <font-awesome-icon class="text-gray-500" icon="calendar-days" />
              Due Date: {{ task.dueDate }}
            </div>
          </div>
        </div>
      </div>
      <div v-if="task.id">
        <CommentSection :taskId="task.id" :userId="currentUser.id" />
      </div>
    </div>
  </Layout>
</template>

<script setup>
import {
  ref,
  reactive,
  computed,
  onMounted,
  onBeforeUnmount,
  onBeforeMount,
} from "vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import draggable from "vuedraggable";
import Dialog from "../Task/Dialog.vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import Layout from "../Layout.vue";
import CommentSection from "./CommentSection.vue";
import { useToast } from "../Composables/useToast.js";
import axios from "axios";
import moment from "moment";

const route = useRoute();
const router = useRouter();
const goBack = () => router.back();
const { success, error } = useToast();

const task = ref({
  id: "",
  name: "",
  status: "",
  startDate: "",
  dueDate: "",
  project: { name: "" },
  assignedTo: [],
});

const taskStatuses = ref(["To Do", "In Progress"]);
const selectedStatus = ref("All Tasks");
const filterPriority = ref("");
const filterDueDate = ref("");
const showModal = ref(false);
const showAssigneeDropdown = ref(false);
const mode = ref("add");
const expandedDepts = ref([]);
const statuses = ref([]);
const message = ref("");
const currentTaskId = route.params.id;
const users = ref([]);
const selectedMember = ref(null);
const currentUser = JSON.parse(localStorage.getItem("current-user") || "{}");

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
  console.log("newTask.value.assignedTo", newTask.value.assignedTo);
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

const dummyUsers = [
  { id: 1, fullName: "Alice", department: "Design" },
  { id: 2, fullName: "Bob Johnson", department: "Design" },
  { id: 3, fullName: "Charlie Brown", department: "Development" },
  { id: 4, fullName: "David Lee", department: "Development" },
  { id: 5, fullName: "Eva Green", department: "QA" },
];

const openMemberModal = (member) => {
  selectedMember.value = member;
};

const updateTaskStatus = (task) => {
  console.log(`Task ID ${task.id} status updated to ${task.status}`);
};

const getInitials = (name) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

const getStatusColor = (statusName) => {
  const matchedStatus = statuses.value.find(
    (status) => status.name === statusName
  );
  return matchedStatus ? matchedStatus.color : "#d1d5db"; // fallback color if not found
};

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

const fetchTask = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `http://localhost:5000/api/task-details/${route.params.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const t = res.data;
    console.log("task", t);
    task.value = {
      ...t,
      id: t._id,
      dueDate: moment(t.dueDate).format("LL"),
    };
    console.log("task.value", task.value);
    console.log("task.value", task.value.id);
  } catch (error) {
    console.error("Failed to fetch task:", error);
  }
};
const fetchStatuses = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5000/api/status", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    taskStatuses.value = res.data;

    console.log("clg from statuses ", taskStatuses.value);
  } catch (error) {
    console.error("Failed to fetch statuses:", error);
  }
};

onMounted(() => {
  fetchStatuses();
  fetchUsers();
  // document.addEventListener("click", handleClickOutside);
});
onBeforeMount(() => {
  fetchTask();
  // currentUser.value = localStorage.getItem("current-user");
});

onBeforeUnmount(() => {
  // document.removeEventListener("click", handleClickOutside);
});
defineExpose({ fetchUsers });
</script>

<style scoped>
body {
  font-family: "Inter", sans-serif;
}
</style>
