<template>
  <Layout>
    <div class="p-2 space-y-1">
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
        class="bg-white p-4 space-y-5 w-full rounded-lg shadow flex flex-col md:flex-row md:justify-between items-start md:items-center"
      >
        <div class="w-full space-y-3">
          <div class="w-full flex justify-between gap-8">
            <div class="w-full flex gap-1">
              <h1 class="text-xl font-bold text-gray-800 w-full">
                <template v-if="!editMode">{{ task.title }}</template>
                <template v-else>
                  <input v-model="task.title" class="input text-sm" />
                </template>
              </h1>
            </div>

            <!-- Status -->
            <div class="flex gap-1 items-start">
              <div class="flex w-full">
                <!-- Priority  -->
                <div class="flex gap-1 w-full">
                  <div
                    v-if="!editMode"
                    class="text-sm px-2 py-0.5 rounded h-7 mx-1"
                    :class="{
                      'bg-red-100 text-red-600': task.priority === 'High',
                      'bg-yellow-50 text-yellow-500':
                        task.priority === 'Medium',
                      'bg-green-100 text-green-600': task.priority === 'Low',
                    }"
                  >
                    {{ task.priority }}
                  </div>
                  <div v-else>
                    <select
                      v-model="task.priority"
                      class="px-4 pr-8 py-1 border rounded text-sm cursor-pointer"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>
                <div class="flex gap-2 text-sm text-gray-600">
                  <template v-if="!editMode">
                    <span
                      class="text-white text-sm h-7 text-nowrap"
                      :class="[
                        'py-0.5 px-2 border rounded text-sm',
                        `bg-[${getStatusColor(
                          task.status
                        )}] bg-opacity-10 text-[${getStatusColor(
                          task.status
                        )}]`,
                      ]"
                    >
                      {{ task.status }}
                    </span>
                  </template>
                  <template v-else>
                    <select
                      v-model="task.status"
                      class="px-4 pr-8 py-1 border rounded text-sm cursor-pointer"
                    >
                      <option
                        v-for="option in taskStatuses"
                        :key="option._id"
                        :value="option.name"
                      >
                        {{ option.name }}
                      </option>
                    </select>
                  </template>
                </div>
              </div>
              <button v-if="editMode" @click="editMode = false" class="w-8 h-8">
                <font-awesome-icon class="text-black font-xl" icon="xmark" />
              </button>
              <button
                v-if="editMode"
                @click="updateTask"
                class="bg-blue-600 text-white w-14 h-7 hover:bg-blue-700 border rounded px-3"
              >
                Save
              </button>
              <button
                v-else
                @click="toggleEditMode"
                class="bg-blue-600 text-white w-14 h-7 hover:bg-blue-700 border rounded px-3"
              >
                Edit
              </button>
              <!-- Save Button -->
              <button
                class="bg-red-600 text-white text-center w-14 h-7 hover:bg-red-500 border rounded px-2"
                @click="handleDelete"
              >
                <font-awesome-icon
                  class="text-white font-xl"
                  icon="trash-can"
                />
              </button>
            </div>
          </div>
          <!-- Description  -->
          <div class="text-sm text-gray-600">
            <template v-if="!editMode">
              <span class="font-medium">{{ task.description }}</span>
            </template>
            <template v-else>
              <textarea
                v-model="task.description"
                class="textarea mt-2 text-sm"
                rows="1"
              ></textarea>
            </template>
          </div>

          <div class="flex justify-between items-center">
            <!-- Project  -->
            <div class="flex gap-1 items-center">
              <span class="text-sm text-gray-600 font-bold"
                >Parent Project:</span
              >
              <span>{{ task.projectId?.name }}</span>
            </div>
            <!-- Deadline-->
            <div class="flex text-sm text-gray-600">
              <div class="flex items-center mx-1">
                <font-awesome-icon
                  class="text-gray-500 mr-1"
                  icon="calendar-days"
                />
                Deadline:
              </div>

              <span v-if="!editMode">{{ task.dueDate }}</span>

              <VueDatePicker
                v-else
                input-class="text-sm px-3 py-2 border rounded w-full"
                v-model="task.dueDate"
                :teleport="true"
                :clearable="false"
                :month-change-on-arrows="true"
                placeholder="Pick a date"
              ></VueDatePicker>
            </div>
          </div>
          <!-- Assignees Dropdown -->
          <div class="relative mt-4 w-full">
            <label class="block mb-1 font-semibold">Assigned To</label>
            <div
              v-if="!editMode"
              class="border rounded px-3 py-2 cursor-pointer bg-white shadow-sm"
            >
              <span
                v-for="(value, idx) in task.assignedTo"
                :key="idx"
                class="bg-gray-100 text-gray-800 h-6 text-sm font-medium me-1 px-2.5 py-0.5 rounded"
              >
                {{ value.username }}
              </span>
            </div>
            <div
              v-else
              @click="toggleDropdown"
              class="border rounded px-3 py-2 cursor-pointer bg-white shadow-sm"
            >
              <div v-if="task.assignedTo.length === 0">
                <span>Select assignees</span>
              </div>

              <div v-else class="flex overflow-x-scroll">
                <span
                  v-for="(user, idx) in task.assignedTo"
                  :key="idx"
                  class="bg-gray-100 text-nowrap text-gray-800 text-sm font-medium me-1 px-2.5 py-0.5 rounded"
                >
                  {{ user.username }}
                </span>
              </div>
            </div>

            <!-- Dropdown Menu -->
            <div
              v-if="dropdownOpen"
              class="absolute z-10 mt-1 w-full bg-white border rounded shadow-lg max-h-48 overflow-y-auto"
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
                      v-model="task.assignedTo"
                      class="mr-4 p-2 cursor-pointer border rounded-sm focus:ring-0"
                    />
                    {{ user.username }}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="flex-col justify-between">
            <!-- Attachments -->
            <div>
              <div class="flex justify-between items-start my-2">
                <label class="block"
                  ><font-awesome-icon
                    class="text-gray-500 mr-1"
                    icon="paperclip"
                  />Attachments</label
                >
                <label
                  class="block font-bold cursor-pointer hover:text-gray-400"
                  @click="addAttachment = !addAttachment"
                  ><font-awesome-icon
                    class="text-gray-500 mr-1 font-bold"
                    icon="paperclip"
                  />Add</label
                >
              </div>

              <!-- <input type="file" multiple @change="handleFiles" /> -->

              <FileUpload
                v-if="addAttachment"
                :multiple="true"
                accept=""
                @files-selected="handleFileUpload"
              />
              <div class="text-gray-400 tex-sm my-2" v-if="!task.attatchment">
                <span>No attachments yet</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Right Section: Comment Box -->
      <div v-if="task.id" class="w-full">
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
import FileUpload from "../FileUpload.vue";
import { useToast } from "../Composables/useToast.js";
import axios from "axios";
import moment from "moment";

const route = useRoute();
const router = useRouter();
const goBack = () => router.back();
const { success, error } = useToast();
const files = ref([]);
const selectedUsers = ref([]);
const dropdownOpen = ref(false);

const task = ref({
  id: "",
  name: "",
  status: "",
  startDate: "",
  dueDate: "",
  projectId: "",
  assignedTo: [],
});
const addAttachment = ref(false);
const taskStatuses = ref([]);
const mode = ref("edit");
const editMode = ref(false);
const expandedDepts = ref([]);
const statuses = ref([]);
const message = ref("");
const currentTaskId = route.params.id;
const users = ref([]);
const selectedMember = ref(null);
const currentUser = JSON.parse(localStorage.getItem("current-user") || "{}");

const handleFileUpload = (files) => {
  console.log("files", files); // You can now send to backend or handle preview
  files.value = files;
};

const groupedUsers = computed(() => {
  const map = {};
  users.value.forEach((user) => {
    if (!map[user.department]) map[user.department] = [];
    map[user.department].push(user);
  });
  return map;
});
const isUserSelected = (user) => {
  return task.value.assignedTo.some((u) => u._id === user._id);
};

const toggleEditMode = async () => {
  editMode.value = !editMode.value;
};
const toggleDept = (dept) => {
  if (expandedDepts.value.includes(dept)) {
    expandedDepts.value = expandedDepts.value.filter((d) => d !== dept);
  } else {
    expandedDepts.value.push(dept);
  }
};

const isAllSelected = (members) => {
  console.log("task.value.assignedTo", task.value.assignedTo);
  return members.every((user) =>
    task.value.assignedTo.some((u) => u.id === user.id)
  );
};

const toggleSelectAll = (members) => {
  const allSelected = isAllSelected(members);
  if (allSelected) {
    // Remove all users from that dept
    task.value.assignedTo = task.value.assignedTo.filter(
      (u) => !members.some((depUser) => depUser.id === u.id)
    );
  } else {
    // Add missing users
    members.forEach((user) => {
      if (!task.value.assignedTo.some((u) => u.id === user.id)) {
        task.value.assignedTo.push(user);
      }
    });
  }
};

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

const getSelectedNames = () => {
  console.log(users.value);
  console.log(task.value.assignedTo);
  return users.value
    .filter((u) => task.value.assignedTo.includes(u._id))
    .map((u) => u.username);
};

// Optional: Close dropdown on outside click
const closeDropdownOnOutsideClick = (e) => {
  if (!e.target.closest(".relative")) {
    dropdownOpen.value = false;
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
  const matchedStatus = taskStatuses.value.find(
    (status) => status.name === statusName
  );
  return matchedStatus ? matchedStatus.color : "#d1d5db"; // fallback color if not found
};

const refreshTask = () => {
  fetchTask();
};

// const handleFiles = (e) => {
//   files.value = [...e.target.files];
// };

const editTask = () => {
  mode.value = "edit";
};

const updateTask = async () => {
  if (editMode.value) {
    console.log("task", task.value);
    console.log("assignedTo", task.value.assignedTo);
    const formData = new FormData();
    formData.append("title", task.value.title);
    formData.append("description", task.value.description);
    formData.append("status", task.value.status);
    formData.append("priority", task.value.priority);
    formData.append("dueDate", new Date(task.value.dueDate).toISOString());
    formData.append("assignedTo", JSON.stringify(task.value.assignedTo));
    files.value.forEach((file) => formData.append("attachments", file));
    console.log("task value", task.value);
    for (let [key, value] of formData.entries()) {
      console.log("key value ", key, value);
    }
    await axios.put(
      `http://localhost:5000/api/task/${route.params.id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    success("Task edited successfully!", { title: "Success" });
    editMode.value = false;
    refreshTask();
  }
};

const handleDelete = async () => {
  try {
    const token = localStorage.getItem("token");

    const confirmed = await $confirm({
      title: "Delete Item",
      message: "Are you sure you want to delete the selected record?",
    });

    if (!confirmed) {
      return;
    } else {
      await axios.delete(`http://localhost:5000/api/task/${currentTaskId}`, {
        headers: {
          Authorization: `Berear${token}`,
        },
      });
      refreshTask();
      success("Task Deleted Succeussfully!", { title: "Success" });
      router.push("/tasks");
    }
  } catch (err) {
    console.error("Error deleting task:", err.message);
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
    selectedUsers.value = res.data.assignedTo.map((u) => u._id);
    task.value = {
      ...t,
      id: t._id,
      dueDate: moment(t.dueDate).format("LL"),
    };
  } catch (error) {
    console.error("Failed to fetch task:", error);
  }
};
const fetchStatuses = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5000/api/task/status", {
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
  document.addEventListener("click", closeDropdownOnOutsideClick);
});
onBeforeMount(() => {
  fetchTask();
});

onBeforeUnmount(() => {
  document.removeEventListener("click", closeDropdownOnOutsideClick);
});
defineExpose({ fetchUsers });
</script>

<style scoped>
body {
  font-family: "Inter", sans-serif;
}
.input,
.textarea,
.select {
  border: 1px solid #ccc;
  padding: 4px;
  width: 100%;
  border-radius: 6px;
}
.btn {
  padding: 10px 20px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
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
