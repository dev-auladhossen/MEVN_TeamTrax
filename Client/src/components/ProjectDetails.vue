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

      <div>
        <GithubRepoInfo :project="testProj"></GithubRepoInfo>
      </div>

      <!-- Top Section: Project Info -->
      <div
        class="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row md:justify-between items-start md:items-center"
      >
        <div class="w-full space-y-3">
          <div class="flex justify-between">
            <h1 class="text-xl font-bold text-gray-800">
              {{ project.name }}
            </h1>
            <div class="flex gap-2">
              <div class="progress-section">
                <div
                  class="flex justify-between gap-1 text-xs text-gray-600 mb-1"
                >
                  <span>Progress: </span>
                  <span class="text-black font-semibold"
                    >{{ project.progress }}%</span
                  >
                </div>
                <div class="w-full bg-gray-200 rounded h-2 overflow-hidden">
                  <div
                    class="bg-blue-500 h-full"
                    :style="{ width: project.progress + '%' }"
                  ></div>
                </div>
              </div>
              <button
                @click="showModal = true"
                class="mt-4 md:mt-0 bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition"
              >
                + Add Task
              </button>
            </div>
          </div>

          <div class="text-sm text-gray-600">
            <span class="font-medium">{{ project.description }}</span>
          </div>
          <div class="flex w-full justify-between my-2">
            <div class="text-sm text-gray-600">
              Status:
              <span
                class="px-2 py-1 rounded text-white text-sm"
                :style="{ backgroundColor: getStatusColor(project.status) }"
              >
                {{ project.status }}
              </span>
            </div>

            <div class="flex gap-1 items-center">
              <span class="text-sm text-gray-600">Owner:</span>
              <div
                @click="openMemberModal(project.createdBy)"
                class="flex justify-between gap-1 items-center border rounded-full pr-3 bg-gray-200 cursor-pointer"
              >
                <span
                  class="cursor-pointer text-xs w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold hover:scale-105 transition"
                >
                  {{ getInitials(project?.createdBy?.username) }}
                </span>
                <span>{{ project.createdBy.username }}</span>
              </div>
            </div>
          </div>

          <div class="flex gap-4 justify-between">
            <div class="flex gap-1 text-sm text-gray-600">
              Teams:
              <span
                v-for="(value, idx) in project.teams"
                :key="idx"
                class="bg-gray-100 text-gray-800 h-6 w-16 text-sm font-medium me-1 px-2.5 py-0.5 rounded"
              >
                {{ value }}
              </span>
            </div>
            <div class="text-sm text-gray-600">
              <font-awesome-icon class="text-gray-500" icon="calendar-days" />
              Due Date: {{ project.endDate }}
            </div>
          </div>
        </div>
      </div>

      <!-- Status Switch Bar -->
      <div class="flex justify-between gap-4 overflow-x-auto pb-2">
        <div
          class="w-full sm:w-auto flex flex-wrap gap-2 sm:gap-0 sm:inline-flex rounded-md overflow-hidden shadow-sm border border-gray-200"
        >
          <button
            v-for="status in ['All Tasks', ...taskStatuses]"
            :key="status"
            @click="selectedStatus = status"
            :class="[
              'flex-1 sm:flex-none px-3 py-0.5 text-sm font-medium text-center border-gray-300',
              selectedStatus === status
                ? 'bg-white text-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
              'transition-colors duration-200 ease-in-out',
              'border sm:border-r last:sm:border-r-0 rounded sm:rounded-none',
            ]"
          >
            {{ status }}
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
      </div>

      <!-- Task Cards by Statuses -->
      <div
        class="flex gap-2 overflow-x-auto space-x-1 max-w-5xl mx-auto max-h-96"
      >
        <div
          v-for="status in filteredColumns"
          :key="status"
          v-show="selectedStatus === 'All Tasks' || selectedStatus === status"
          class="bg-gray-50 rounded-2xl p-2 shadow min-w-[250px] flex flex-col space-y-2 overflow-y-auto"
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
                    {{ task.title }}
                  </div>
                  <span
                    class="text-xs px-2 py-0.5 rounded"
                    :class="{
                      'bg-red-100 text-red-600': task.priority === 'High',
                      'bg-yellow-100 text-yellow-600':
                        task.priority === 'Medium',
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
                    :title="member.username"
                  >
                    {{ getInitials(member?.username) }}
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
          <h3
            class="text-lg font-bold leading-6 text-center mb-2 text-gray-700"
          >
            {{ mode === "add" ? "ADD NEW TASK" : "EDIT TASK" }}
          </h3>

          <form @submit.prevent="createTask" class="space-y-3">
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
} from "vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import draggable from "vuedraggable";
import Dialog from "../components/Task/Dialog.vue";
import GithubRepoInfo from "./GithubRepoInfo.vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import Layout from "../components/Layout.vue";
import { useToast } from "../components/Composables/useToast.js";
import axios from "axios";
import moment from "moment";
import { useFetchStatus } from "../components/Composables/useFetchStatus";
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
const testProj = reactive({
  _id: "project123",
  name: "TeamTrax",
  githubRepo: {
    owner: "dev-auladhossen",
    repo: "MEVN_TeamTrax",
  },
});

const project = ref({
  name: "",
  status: "",
  startDate: "",
  endDate: "",
  createdBy: { username: "" },
  teams: [],
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

const taskStatuses = ["Todo", "In Progress", "Review", "Completed"];
const selectedStatus = ref("All Tasks");
const filterPriority = ref("");
const filterDueDate = ref("");
const showModal = ref(false);
const showAssigneeDropdown = ref(false);
const mode = ref("add");
const expandedDepts = ref([]);
const statuses = ref([]);
const users = ref([]);
const message = ref("");
const currentProjectId = route.params.id;

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
    project.value = {
      ...p,
      createdBy: p.createdBy || "Unknown",
      startDate: moment(p.startDate).format("LL"),
      endDate: moment(p.endDate).format("LL"),
    };
    console.log("project.value", project.value);
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
    console.log("users.value", users.value);
  } catch (error) {
    console.error("Failed to fetch users:", error);
  }
};

onMounted(() => {
  fetchTaskStatus();
  fetchProject();
  fetchStatuses();
  fetchUsers();
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
  if (!name || typeof name !== "string") return "";
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
        console.log("filterDueDate.value", filterDueDate.value);
        console.log("task.dueDate", task.dueDate);
        return false;
      }
      return true;
    });
  // return tasks.value.filter((task) => task.status === status);
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
  console.log("newTask.value", newTask.value);
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

const refreshProjectList = () => {
  if (currentProjectId) {
    fetchTasks(currentProjectId);
  }
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

const fetchStatuses = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5000/api/project/status", {
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
</style>
