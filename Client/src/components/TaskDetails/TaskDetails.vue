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
              class="px-3 py-2 cursor-pointer bg-white shadow-sm"
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
                  v-if="editMode"
                  class="block font-bold cursor-pointer hover:text-gray-400"
                  @click="addAttachment = !addAttachment"
                  ><font-awesome-icon
                    class="text-gray-500 mr-1 font-bold"
                    icon="paperclip"
                  />Add</label
                >
              </div>

              <FileUpload
                v-if="addAttachment && editMode"
                :multiple="true"
                accept=""
                @files-selected="handleFileUpload"
              />
              <div v-else>
                <div v-if="task.files.length" class="attachments flex gap-2">
                  <div
                    v-for="file in task.attachments"
                    :key="file"
                    class="attachment-item flex items-center gap-2 p-2 rounded bg-gray-100"
                  >
                    <img
                      v-if="isImage(file)"
                      :src="getFileUrl(file)"
                      alt="preview"
                      class="w-12 h-12 object-cover rounded cursor-pointer"
                      @click="
                        openImageModal(`http://localhost:5000/uploads/${file}`)
                      "
                    />
                    <a
                      v-else
                      :href="`http://localhost:5000/uploads/${file}`"
                      target="_blank"
                      class="text-blue-600 underline"
                    >
                      <img
                        :src="`/src/assets/${getFileIcon(file)}`"
                        alt="preview"
                        class="w-12 h-12 object-cover rounded cursor-pointer"
                    /></a>

                    <button
                      @click="deleteAttachment(file)"
                      class="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <div v-else class="text-gray-400 tex-sm my-2">
                  <span>No attachments yet</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Image Modal -->
      <transition name="fade-zoom">
        <div
          v-if="showImageModal"
          class="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
          @click.self="closeImageModal"
        >
          <img
            v-if="previewImageUrl"
            :src="previewImageUrl"
            class="max-w-[90%] max-h-[90%] rounded shadow-lg"
          />

          <button
            @click="closeImageModal"
            class="absolute top-4 right-4 bg-white text-black px-3 py-1 rounded shadow"
          >
            ✕
          </button>
        </div>
      </transition>
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
const { success, error, info } = useToast();
const files = ref([]);
const selectedUsers = ref([]);
const dropdownOpen = ref(false);
const showImageModal = ref(false);
const previewImageUrl = ref("");

const task = ref({
  id: "",
  name: "",
  status: "",
  startDate: "",
  dueDate: "",
  projectId: "",
  files: [],
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

const isAllSelected = (users) => {
  return users.every((user) =>
    task.value.assignedTo.some((u) => u.id === user.id)
  );
};

const toggleSelectAll = (users) => {
  console.log("users", users);
  const allSelected = isAllSelected(users);
  if (allSelected) {
    // Remove all users from that dept
    task.value.assignedTo = task.value.assignedTo.filter(
      (u) => !users.some((depUser) => depUser.id === u.id)
    );
  } else {
    // Add missing users
    users.forEach((user) => {
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

const handleFileUpload = (files) => {
  console.log("files", files); // You can now send to backend or handle preview
  task.value.files = files;
  console.log("Files before upload", task.value.files);
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
    task.value?.files?.forEach((file) => formData.append("attachments", file));
    console.log("task value", task.value);
    for (let [key, value] of formData.entries()) {
      console.log("key value ", key, value);
    }
    await axios.put(
      `http://localhost:5000/api/sprint-task/${route.params.id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    success("Task edited successfully!", { title: "Success" });
    editMode.value = false;
    addAttachment.value = false;
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
      await axios.delete(
        `http://localhost:5000/api/sprint-task/${currentTaskId}`,
        {
          headers: {
            Authorization: `Berear${token}`,
          },
        }
      );
      refreshTask();
      success("Task Deleted Succeussfully!", { title: "Success" });
      // router.push("/tasks");
      router.back();
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
    users.value = res.data.map((u) => ({
      id: u._id,
      username: u.username,
      department: u.department,
    }));
  } catch (error) {
    console.error("Failed to fetch users:", error);
  }
};

const fetchTask = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `http://localhost:5000/api/sprintTask-details/${route.params.id}`,
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
      files: t.attachments,
      dueDate: moment(t.dueDate).format("LL"),
    };
  } catch (error) {
    console.error("Failed to fetch task:", error);
  }
};
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

const openImageModal = (url) => {
  previewImageUrl.value = url;
  showImageModal.value = true;
};

const closeImageModal = () => {
  showImageModal.value = false;
  previewImageUrl.value = "";
};

const getFileUrl = (filename) => {
  return `http://localhost:5000/uploads/${filename}`;
};

const isImage = (filename) => {
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(filename);
};
const isPdf = (filename) => {
  return /\.pdf$/i.test(filename);
};

const getFileIcon = (filename) => {
  const ext = filename.split(".").pop().toLowerCase();
  switch (ext) {
    case "pdf":
      return "pdf-icon.webp";
    case "doc":
    case "docx":
      return "doc-icon.webp";
    case "xls":
    case "xlsx":
      return "doc-icon.png";
    case "zip":
    case "rar":
      return "zip-icon.png";
    case "mp4":
    case "mov":
      return "mp4-icon.png";
    case "mp3":
      return "mp3-icon.png";
    default:
      return "file-icon.png";
  }
};

const deleteAttachment = async (filename) => {
  try {
    await axios.delete(
      `http://localhost:5000/api/task/${task.value._id}/attachment/${filename}`
    );
    task.value.attachments = task.value.attachments.filter(
      (f) => f !== filename
    );
    info("Attachment deleted successfully!", { title: "Deleted" });
  } catch (error) {
    console.error("Failed to delete", error);
  }
};

const userSpecificTasks = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5000/api/dev/tasks", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("userSpecificTasks", res.data);
  } catch (error) {
    console.error("Failed to fetch statuses:", error);
  }
};

onMounted(() => {
  userSpecificTasks();
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

.fade-zoom-enter-active,
.fade-zoom-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-zoom-enter-from,
.fade-zoom-leave-to {
  opacity: 0;
  transform: scale(0.9);
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
