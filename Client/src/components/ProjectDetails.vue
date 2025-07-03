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
      <div class="bg-white rounded-2xl shadow p-6 space-y-2">
        <!-- Header -->
        <div
          class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <h1 class="text-xl font-bold text-gray-800">{{ project.name }}</h1>

          <!-- Progress -->
          <div class="w-full md:w-64">
            <div class="flex justify-between text-xs text-gray-600 mb-1">
              <span>Progress</span>
              <span class="text-black font-semibold"
                >{{ project.progress }}%</span
              >
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                class="bg-blue-500 h-full transition-all duration-500 ease-in-out"
                :style="{ width: project.progress + '%' }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div class="text-sm text-gray-600">
          <span class="font-medium">{{ project.description }}</span>
        </div>

        <!-- Status & Owner -->
        <div
          class="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-gray-600"
        >
          <!-- Owner -->
          <div class="flex items-center gap-2">
            <font-awesome-icon icon="user" class="text-gray-500" />
            <span class="font-medium">:</span>
            <div
              @click="openMemberModal(project.createdBy)"
              class="flex items-center gap-1 px-2 py-1 rounded bg-gray-100 text-xs cursor-pointer hover:bg-gray-200 transition"
            >
              <span>{{ project.createdBy.username }}</span>
            </div>
          </div>

          <!-- Status -->
          <div class="flex items-center gap-2">
            <font-awesome-icon icon="circle-info" class="text-gray-500" />
            <span class="font-medium">Status:</span>
            <span
              class="px-2 py-1 border rounded font-semibold text-xs"
              :class="[
                `bg-[${getStatusColor(
                  project.status
                )}]/20 text-[${getStatusColor(project.status)}]`,
              ]"
            >
              {{ project.status }}
            </span>
          </div>

          <!-- Teams -->
          <div class="flex flex-wrap items-center gap-2">
            <font-awesome-icon icon="users" class="text-gray-500" />
            <span class="font-medium">Teams:</span>
            <span
              v-for="(value, idx) in project.teams"
              :key="idx"
              class="bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-xs font-medium"
            >
              {{ value }}
            </span>
          </div>

          <!-- Deadline -->
          <div class="flex items-center gap-2">
            <font-awesome-icon icon="calendar-days" class="text-gray-500" />
            <span class="font-medium">Deadline:</span>
            <span>{{ project.endDate }}</span>
          </div>
        </div>
      </div>

      <!-- Scrum Board  -->
      <div class="p-1 space-y-6">
        <!-- Top Section: Backlog and Sprint Manager (stack on mobile, side-by-side on desktop) -->
        <div v-if="currentProjectId" class="flex gap-4">
          <TaskDrawer
            :isOpen="isDrawerOpen"
            :task="selectedTask"
            @close="isDrawerOpen = false"
          />
          <!-- <SprintTaskDetailsDrawer
            v-if="showDrawer"
            :task="selectedTask"
            @close="showDrawer = false"
          /> -->
          <Backlog
            class="w-[25%]"
            :projectId="currentProjectId"
            @open-task="openTask"
            @create-task="openCreateTaskModal"
            @create-sprint="showSprintModal = true"
            :backlogTasks="backlogTasks"
            ref="backlogRef"
          />

          <SprintBoard
            class="w-[75%]"
            :projectId="currentProjectId"
            @task-moved="onTaskMoved"
            @open-task="openTask"
          ></SprintBoard>
        </div>

        <!-- Bottom Section: Scrumban Board full width -->
        <CreateEditTaskModal
          v-if="showSprintTaskModal"
          :projectId="currentProjectId"
          :task="editingTask"
          @close="closeModal"
          @saved="refresh"
        />
        <CreateEditSprintModal
          v-if="showSprintModal"
          :projectId="currentProjectId"
          @close="closeModal"
          @saved="refresh"
        />
      </div>

      <!-- Report Section  -->
      <div>
        <div
          @click="showReport = !showReport"
          class="flex justify-between items-center cursor-pointer bg-white shadow px-4 py-3 rounded-md hover:bg-gray-200 transition"
        >
          <span class="text-base text-gray-700 font-bold">
            <font-awesome-icon class="text-blue-500 mr-2" icon="file" />{{
              showReport ? "Hide" : "Show"
            }}
            Project Summary Report</span
          >
          <svg
            :class="[
              'w-5 h-5 transition-transform duration-300',
              showReport ? 'rotate-180' : 'rotate-0',
            ]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        <!-- Expandable Report Section -->
        <transition name="expand">
          <div v-if="showReport" class="mt-2">
            <div class="flex justify-end gap-2 my-2">
              <button
                @click="exportPDF"
                class="px-3 py-2 bg-blue-500 text-white rounded"
              >
                Export PDF
              </button>
              <button
                @click="exportImage"
                class="px-3 py-2 bg-green-500 text-white rounded"
              >
                Export Image
              </button>
            </div>
            <div id="report-content" class="bg-white rounded shadow">
              <!-- Your full report section -->
              <ProjectSummaryReport :projectId="route.params.id" />
            </div>
          </div>
        </transition>
      </div>

      <!-- Github Repo Section  -->
      <div class="space-y-2 mb-8">
        <h1 class="text-lg font-bold text-gray-800 mt-8 ms-2">
          Manage Project Repository
        </h1>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Repo Info -->
          <div class="bg-white shadow-md rounded-xl p-6 border">
            <GithubRepoInfo
              :projectRepoInfo="githubRepoData"
              :loading="isLoading"
            />
          </div>

          <!-- Repo Creation + Branch Create -->
          <div class="bg-white shadow-md rounded-xl p-6 border">
            <GithubRepoCreate
              :projectRepoInfo="githubRepoData"
              @refreshRepoInfo="refreshGithubRepoInfo"
            />
          </div>
        </div>
      </div>

      <!-- Task Form Modal -->
      <Dialog :isOpen="showModal" @close="showModal = false">
        <div class="max-w-xl mx-auto bg-white">
          <h3
            class="text-lg font-bold leading-6 text-center mb-2 text-gray-700"
          >
            {{ mode === "add" ? "ADD NEW TASK" : "EDIT TASK" }}
          </h3>

          <form @submit.prevent="addTask" class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Title</label
              >
              <input
                v-model="newTask.title"
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
                    v-for="status in taskStatusList"
                    :key="status"
                    :value="status.name"
                  >
                    {{ status.name }}
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

            <div>
              <!-- Sprint -->
              <select v-model="form.sprintId" class="select mb-4 w-full">
                <option disabled value="">Select Sprint</option>
                <option
                  v-for="sprint in sprints"
                  :key="sprint._id"
                  :value="sprint._id"
                >
                  {{ sprint.name }}
                </option>
              </select>
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
                      newTask.assignedTo.map((user) => user.username).join(", ")
                    }}
                  </span>
                  <span v-else class="text-gray-400">Select users</span>
                </button>

                <!-- Dropdown above the button -->
                <div
                  v-if="showAssigneeDropdown"
                  class="absolute bottom-full mb-1 z-10 bg-white border border-gray-200 rounded-md shadow w-full max-h-64 overflow-y-auto"
                >
                  <div v-for="(members, dept) in groupedUsers" :key="dept">
                    <div class="flex bg-gray-100 hover:bg-gray-200">
                      <span>
                        <input
                          type="checkbox"
                          :checked="isAllSelected(members)"
                          @change="toggleSelectAll(members)"
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
                        v-for="user in members"
                        :key="user._id"
                        class="flex items-center px-4 py-2 hover:bg-gray-50 text-sm cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          :value="user"
                          v-model="newTask.assignedTo"
                          class="mr-4 p-2 cursor-pointer border rounded-sm focus:ring-0"
                        />
                        {{ user.username }}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Due date  -->
            <div class="text-sm">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Due Date</label
                >
                <VueDatePicker
                  required
                  input-class="text-sm px-3 py-2 border rounded w-full"
                  v-model="newTask.dueDate"
                  :teleport="true"
                  :clearable="false"
                  :month-change-on-arrows="true"
                  placeholder="Pick a date"
                ></VueDatePicker>
              </div>
            </div>

            <div class="pt-2">
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
            {{ selectedMember.username }}
          </h3>
          <p class="text-sm text-gray-600">
            Name: {{ selectedMember.username }}
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
  watch,
} from "vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import draggable from "vuedraggable";
import Dialog from "../components/Task/Dialog.vue";
import GithubRepoInfo from "./GithubRepoInfo.vue";
import GithubRepoCreate from "./GithubRepoCreate.vue";
import ProjectSummaryReport from "./Reports/ProjectSummaryReport.vue";
import GithubRepoPanel from "../components/GithubRepoPanel/GithubRepoPanel.vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import Layout from "../components/Layout.vue";
import { useToast } from "../components/Composables/useToast.js";
import axios from "axios";
import moment from "moment";
import { useFetchStatus } from "../components/Composables/useFetchStatus";
import BarChartComponent from "./Chart/BarChartComponent.vue";
import DoughnutChartComponent from "./Chart/DoughnutChartComponent.vue";
import { useExportReport } from "../components/Composables/useExportReport";
import { exportToCSV } from "../components/Composables/useExportToCSV";
import { fetchProjectSummary } from "../components/Services/projectReport";
import ScrumBanBoard from "./ScrumBan/ScrumBanBoard.vue";
import SprintManager from "./ScrumBan/SprintManager.vue";
import Backlog from "./ScrumBan/Backlog.vue";
import CreateEditTaskModal from "../components/CreateEditTaskModal.vue";
import CreateEditSprintModal from "../components/CreateEditSprintModal.vue";
import SprintBoard from "./SprintBoard.vue";
import TaskDrawer from "../components/TaskDetails/TaskDrawer.vue";
import SprintTaskDetailsDrawer from "./ScrumBan/SprintTaskDetailsDrawer.vue";

const { exportPDF, exportImage, exportExcel } = useExportReport();

const {
  taskStatusList,
  projectStatusList,
  loading,
  fetchProjectStatus,
  fetchTaskStatus,
} = useFetchStatus();

const route = useRoute();
const router = useRouter();
const goBack = () => router.back();
const { success, error } = useToast();
const isDrawerOpen = ref(false);
const showDrawer = ref(false);
const selectedTask = ref(null);
const sprints = reactive([]);

const taskStatuses = ["Todo", "In Progress", "Review", "Completed"];
const selectedStatus = ref("All Tasks");
const filterPriority = ref("");
const filterDueDate = ref("");
const showSprintModal = ref(false);
const showModal = ref(false);
const showReport = ref(false);
const showAssigneeDropdown = ref(false);
const mode = ref("add");
const expandedDepts = ref([]);
const statuses = ref([]);
const users = ref([]);
const message = ref("");
const currentProjectId = route.params.id;
const isLoading = ref(false);
const tasks = ref([]);
const selectedMember = ref(null);
const githubSettingsUserName = ref(null);
const githubRepoData = ref(null);
const projectReport = ref({});
const projectProgress = ref({});
const selectedSprint = ref(null);
const backlogTasks = ref([]);
const backlogKey = ref(0);
const backlogRef = ref(null);

const openMemberModal = (member) => {
  selectedMember.value = member;
};

const project = ref({
  name: "",
  status: "",
  startDate: "",
  endDate: "",
  githubRepo: "",
  createdBy: { username: "" },
  teams: [],
});

const newTask = ref({
  title: "",
  description: "",
  status: taskStatuses[0],
  priority: "Medium",
  dueDate: "",
  assignedTo: [],
  projectId: project.value._id,
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

const openTask = async (task) => {
  // console.log("task from backlog", task);
  // selectedTask.value = task;
  // showDrawer.value = true;
  // isDrawerOpen.value = true;
  router.push(`/task-details/${task._id}`);
};

async function fetchSprints() {
  try {
    const res = await axios.get(
      `http://localhost:5000/api/sprints?projectId=${currentProjectId}`
    ); // or adjust route
    sprints.splice(0, sprints.length, ...res.data);
    console.log("sprints", sprints);
  } catch (err) {
    console.error("Failed to fetch sprints", err);
  }
}

async function fetchBacklogTasks() {
  if (!currentProjectId) return;
  const res = await axios.get("http://localhost:5000/api/sprint-tasks", {
    params: { projectId: currentProjectId, sprintId: "null" },
  });
  backlogTasks.value = res.data;
  console.log("backlogTasks.value", backlogTasks.value);
}

function onTaskMoved() {
  console.log("task moved");
  fetchBacklogTasks();
  backlogRef.value?.fetchTasks?.();
}

const toggleShowReport = () => {
  showReport.value = !showReport.value;
};

const sprintSelected = (event) => {
  console.log("event", event);
  selectedSprint.value = event;
};

const showSprintTaskModal = ref(false);
const editingTask = ref(null);

function openCreateTaskModal(task = null) {
  // editingTask.value = "add";
  // showSprintTaskModal.value = true;
  showModal.value = true;
}
function closeModal() {
  showSprintTaskModal.value = false;
  showSprintModal.value = false;
  editingTask.value = null;
}
function refresh() {
  // Optionally reload child components
  backlogKey.value++;
  backlogRef.value?.fetchTasks?.();
}

const exportCSV = async () => {
  const data = [
    { Name: "Alice", Email: "alice@example.com", Progress: 85 },
    { Name: "Bob", Email: "bob@example.com", Progress: 90 },
    { Name: "Charlie", Email: "charlie@example.com", Progress: 70 },
  ];

  exportToCSV(data, "project-summary.csv");
};

const getInitials = (name) => {
  if (!name || typeof name !== "string") return "";
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

const loadReport = async () => {
  try {
    projectReport.value = await fetchProjectSummary(currentProjectId);
  } catch (err) {
    console.error("Error loading report:", err);
  }
};

const assigneeDropdownRef = ref(null);
const toggleAssigneeDropdown = () => {
  showAssigneeDropdown.value = !showAssigneeDropdown.value;
};

const groupedUsers = computed(() => {
  const map = {};
  users.value.forEach((user) => {
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

const refreshGithubRepoInfo = () => {
  fetchProject();
  fetchLatestRepoInfo();
};

const fetchLatestRepoInfo = async () => {
  if (!githubRepoData.value) return;

  isLoading.value = true;
  try {
    const fullName = `${githubRepoData.value.githubRepo.owner}/${githubRepoData.value.githubRepo.repo}`;
    const res = await fetch(
      `http://localhost:5000/api/github/repo-info?fullName=${fullName}`
    );
    const data = await res.json();

    githubRepoData.value.branches = data.branches;
    githubRepoData.value.commits = data.commits;
  } catch (err) {
    console.error("Error fetching repo info", err);
  } finally {
    isLoading.value = false; // Stop loading
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
    project.value = {
      ...p,
      createdBy: p.createdBy || "Unknown",
      startDate: moment(p.startDate).format("LL"),
      endDate: moment(p.endDate).format("LL"),
    };
  } catch (error) {
    console.error("Failed to fetch project:", error);
  }
};

const fetchUsers = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5000/api/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    users.value = res.data.map((u) => ({
      id: u._id,
      username: u.username,
      department: u.department,
    }));
  } catch (error) {
    console.error("Failed to fetch users:", error);
  }
};

const filteredColumns = computed(() => {
  if (selectedStatus.value === "All Tasks") return taskStatuses;
  return [selectedStatus.value];
});

const filteredTasksByStatus = (status) => {
  return tasks.value
    .filter((task) => task.status === status)
    .filter((task) => {
      if (filterPriority.value && task.priority !== filterPriority.value) {
        return false;
      }
      if (
        filterDueDate.value &&
        task.dueDate.slice(0, 10) !== filterDueDate.value
      ) {
        return false;
      }
      return true;
    });
  // return tasks.value.filter((task) => task.status === status);
};

const createTask = async () => {
  try {
    const token = localStorage.getItem("token");
    const payLoad = { ...newTask.value, projectId: project.value._id };
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
  refreshProjectList();
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

const addTask = async (task) => {
  console.log("form", form);
  const token = localStorage.getItem("token");
  const payLoad = { ...newTask.value, projectId: project.value._id };
  console.log("payLoad", payLoad);

  if (mode.value === "add") {
    await axios.post("http://localhost:5000/api/add-sprintTasks", payLoad, {
      headers: { Authorization: `Bearer ${token}` },
    });

    message.value = "Task Created Successfully!";
    success(message.value, { title: "Success" });
  } else {
    await axios.patch(
      `http://localhost:5000/api/sprint-task/${task._id}`,
      form
    );
  }
  // emit("saved");
  // emit("close");
  backlogRef.value?.fetchTasks?.();
  mode.value = "add";
  showModal.value = false;
  Object.assign(form, initialForm);
  // try {
  //   if (mode.value === "edit") {
  //     await axios.patch(
  //       `http://localhost:5000/api/sprint-task/${props?.task?._id}`,
  //       form
  //     );
  //   } else {
  //     console.log("...form", { ...form });
  //     await axios.post("http://localhost:5000/api/add-sprintTasks", {
  //       ...form,
  //       projectId: project.value._id,
  //     });
  //   }
  //   emit("saved");
  //   emit("close");
  //   success(`Task added successfully!`, {
  //     title: "Success",
  //   });
  // } catch (err) {
  //   console.error("Submit error:", err);
  // }
};

const refreshProjectList = () => {
  if (currentProjectId) {
    fetchTasks(currentProjectId);
  }
};

const onTaskDrop = (event, newStatus) => {
  const movedTask = event?.added?.element;
  if (movedTask) {
    movedTask.status = newStatus;
    // updateTaskStatus(task);
  }
};

const fetchStatuses = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5000/api/project/status", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    statuses.value = res.data;
  } catch (error) {
    console.error("Failed to fetch statuses:", error);
  }
};
const fetchTasks = async (currentProjectId) => {
  try {
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
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
  }
};

watch(currentProjectId, () => {
  fetchBacklogTasks();
});

watch(
  () => project.value?.githubRepo,
  (newRepo) => {
    if (!newRepo) return;
    const [owner, repo] = newRepo.split("/");
    githubRepoData.value = {
      _id: project.value._id,
      name: project.value.name,
      githubRepo: { owner, repo },
      branches: [],
      commits: [],
    };
    fetchLatestRepoInfo();
  },
  { immediate: true }
);

const getGithubSettingsData = async () => {
  const { data } = await axios.get(
    "http://localhost:5000/api/user/github-settings",
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  githubSettingsUserName.value = data.githubUsername;
};

onMounted(() => {
  fetchSprints();
  fetchTaskStatus();
  fetchProject();
  fetchStatuses();
  fetchUsers();
  fetchLatestRepoInfo();
  getGithubSettingsData();
  loadReport();
  fetchBacklogTasks();

  if (currentProjectId) {
    fetchTasks(currentProjectId);
  }

  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
body {
  font-family: "Inter", sans-serif;
}
::-webkit-scrollbar {
  width: 5px;
  height: 6px;
}
/* Handle */
::-webkit-scrollbar-thumb {
  background-color: #e4e4e4;
  border-radius: 0px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background-color: #b1b1b1;
}

/* Track */
::-webkit-scrollbar-track {
  background: transparent;
}

/* Smooth expand/collapse animation */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  transform: scaleY(0.95);
  max-height: 0;
}
.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  transform: scaleY(1);
  max-height: 1000px;
}
</style>
