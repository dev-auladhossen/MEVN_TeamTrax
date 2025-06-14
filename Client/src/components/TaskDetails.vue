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

      <!-- Top Section: Project Info -->
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
                <span>{{ task.ProjectId.name }}</span>
              </div>
            </div>
          </div>

          <div class="flex gap-4 justify-between">
            <div class="flex gap-1 text-sm text-gray-600">
              Assigned to:
              <span
                v-for="(value, idx) in task.assignedTo"
                :key="idx"
                class="bg-gray-100 text-gray-800 h-6 w-16 text-sm font-medium me-1 px-2.5 py-0.5 rounded"
              >
                {{ value }}
              </span>
            </div>
            <div class="text-sm text-gray-600">
              <font-awesome-icon class="text-gray-500" icon="calendar-days" />
              Due Date: {{ task.dueDate }}
            </div>
          </div>
        </div>
      </div>

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
            {{ selectedMember.username }}
          </h3>
          <p class="text-sm text-gray-600">
            Name: {{ selectedMember.fullName }}
          </p>
          <p class="text-sm text-gray-600">
            Department: {{ selectedMember.department }}
          </p>
        </div>
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
import Dialog from "../components/Task/Dialog.vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import Layout from "../components/Layout.vue";
import { useToast } from "../components/Composables/useToast.js";
import axios from "axios";
import moment from "moment";

const route = useRoute();
const router = useRouter();
const goBack = () => router.back();
const { success, error } = useToast();

const project = ref({
  name: "",
  status: "",
  startDate: "",
  endDate: "",
  createdBy: { username: "" },
  teams: [],
});
const task = ref({
  name: "",
  status: "",
  startDate: "",
  dueDate: "",
  project: { name: "" },
  assignedTo: [],
});

const initialForm = {
  name: "",
  description: "",
  startDate: "",
  endDate: "",
  teams: [],
  status: "Planning",
  createdBy: "",
};

const form = reactive({ ...initialForm });

const taskStatuses = ["Todo", "In Progress", "Review", "Done"];
const selectedStatus = ref("All Tasks");
const filterPriority = ref("");
const filterDueDate = ref("");
const showModal = ref(false);
const showAssigneeDropdown = ref(false);
const mode = ref("add");
const expandedDepts = ref([]);
const statuses = ref([]);
const message = ref("");
const currentProjectId = route.params.id;

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
const handleClickOutside = (e) => {
  if (
    assigneeDropdownRef.value &&
    !assigneeDropdownRef.value.contains(e.target)
  ) {
    showAssigneeDropdown.value = false;
  }
};

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
    console.log("p", p);
    task.value = {
      ...p,
      createdBy: p.createdBy || "Unknown",
      startDate: moment(p.startDate).format("LL"),
      endDate: moment(p.endDate).format("LL"),
    };
    console.log("project.value", task.value);
  } catch (error) {
    console.error("Failed to fetch project:", error);
  }
};

onMounted(() => {
  fetchProject();
  fetchStatuses();
  if (currentProjectId) {
    fetchTasks(currentProjectId);
  }

  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

const dummyUsers = [
  { id: 1, fullName: "Alice", department: "Design" },
  { id: 2, fullName: "Bob Johnson", department: "Design" },
  { id: 3, fullName: "Charlie Brown", department: "Development" },
  { id: 4, fullName: "David Lee", department: "Development" },
  { id: 5, fullName: "Eva Green", department: "QA" },
];

const tasks = ref([]);

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
  if (selectedStatus.value === "All Tasks") return taskStatuses;
  return [selectedStatus.value];
});

const filteredTasksByStatus = (status) => {
  return tasks.value.filter((task) => task.status === status);
};

const newTask = ref({
  title: "",
  description: "",
  status: taskStatuses[0],
  priority: "Medium",
  dueDate: "",
  assignedTo: [],
  projectId: project.value._id,
});

const createTask = async () => {
  try {
    const token = localStorage.getItem("token");
    const payLoad = { ...newTask.value, projectId: project.value._id };
    console.log("payLoad", payLoad);
    if (mode.value === "add") {
      await axios.post("http://localhost:5000/api/create-task", payLoad, {
        headers: { Authorization: `Bearer ${token}` },
      });

      message.value = "Task Created Successfully!";
      success(message.value, { title: "Success" });
    } else if (mode.value === "edit") {
      // await axios.put(
      //   `http://localhost:5000/task/${}`,
      //   form,
      //   {
      //     headers: { Authorization: `Bearer ${token}` },
      //   }
      // );
      message.value = "Task updated successfully!";
      success(message.value, { title: "Success" });
    }
    mode.value = "add";
    // refreshProjectList();
    showModal.value = false;
    Object.assign(form, initialForm);
  } catch (error) {
    message.value =
      error.response?.data?.message || "Failed to add Task. Try again.";
  }
  // tasks.value.push({
  //   id: tasks.value.length + 1,
  //   ...newTask.value,
  // });
  newTask.value = {
    title: "",
    description: "",
    status: taskStatuses[0],
    priority: "Medium",
    dueDate: "",
    assignedTo: [],
    projectId: "",
  };
  showModal.value = false;
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

// Progress Percentage
const progressPercentage = computed(() => {
  const tasks = project.tasks || [];
  const total = tasks.length;
  if (total === 0) return 0;

  const completed = tasks.filter((task) => task.isCompleted).length;
  return Math.round((completed / total) * 100);
});

const updateTaskStatus = (task) => {
  console.log(`Task ID ${task.id} status updated to ${task.status}`);
};

const fetchStatuses = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5000/api/status", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    statuses.value = res.data;

    console.log("clg from statuses ", statuses.value);
  } catch (error) {
    console.error("Failed to fetch statuses:", error);
  }
};
const fetchTasks = async (currentProjectId) => {
  try {
    console.log("project.value._id", project.value);
    console.log("currentProjectId", currentProjectId);
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `http://localhost:5000/api/tasks/project/${currentProjectId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    tasks.value = res.data;

    console.log("clg from tasks", tasks.value);
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
  }
};

const getStatusColor = (statusName) => {
  const matchedStatus = statuses.value.find(
    (status) => status.name === statusName
  );
  return matchedStatus ? matchedStatus.color : "#d1d5db"; // fallback color if not found
};
</script>

<style scoped>
body {
  font-family: "Inter", sans-serif;
}
</style>
