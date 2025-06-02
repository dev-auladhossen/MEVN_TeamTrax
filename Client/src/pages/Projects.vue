<template>
  <Layout>
    <div class="flex justify-between gap-3 px-3 py-2 max-w-5xl mx-auto">
      <div class="text-xl flex items-center justify-center font-bold">
        <span>Projects</span>
      </div>
      <button
        @click="handleAddProject"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        <font-awesome-icon class="mr-2" icon="add" />
        Add New Project
      </button>
    </div>

    <!-- switch view  -->
    <div class="flex gap-3 space-x-3 mb-2 max-w-5xl mx-auto">
      <button @click="currentView = 'board'" :class="buttonClass('board')">
        <font-awesome-icon class="mr-2" icon="grip" /> Board View
      </button>
      <button @click="currentView = 'list'" :class="buttonClass('list')">
        <font-awesome-icon class="mr-2" icon="list" /> List View
      </button>
    </div>

    <ProjectList
      v-if="currentView === 'list'"
      ref="projectListRef"
      @edit="handleEdit"
      @delete="handleDelete"
    />
    <ProjectBoard ref="projectBoardRef" v-else />

    <Dialog :isOpen="showModal" @close="showModal = false">
      <div class="max-w-xl mx-auto bg-white">
        <h3 class="text-lg font-bold leading-6 text-center mb-2 text-gray-700">
          {{ mode === "add" ? "ADD NEW PROJECT" : "EDIT PROJECT" }}
        </h3>

        <form @submit.prevent="createProject" class="space-y-3">
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Project Name</label
            >
            <input
              v-model="form.name"
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
              v-model="form.description"
              placeholder="Enter project description"
              rows="2"
              class="mt-1 text-sm block w-full px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Status</label
            >
            <select
              v-model="form.status"
              class="border rounded px-3 py-2 w-full bg-white text-sm cursor-pointer"
            >
              <option
                v-for="option in statusList"
                :key="option._id"
                :value="option.name"
              >
                {{ option.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Select Teams</label
            >
            <div class="grid grid-cols-4 gap-1">
              <label class="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  value="frontend"
                  v-model="form.teams"
                  class="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-0 cursor-pointer"
                />
                <span class="ml-2 text-gray-700">Frontend</span>
              </label>
              <label class="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  value="backend"
                  v-model="form.teams"
                  class="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-0 cursor-pointer"
                />
                <span class="ml-2 text-gray-700">Backend</span>
              </label>

              <label class="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  value="tester"
                  v-model="form.teams"
                  class="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-0 cursor-pointer"
                />
                <span class="ml-2 text-gray-700">Tester</span>
              </label>

              <label class="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  value="ui/ux"
                  v-model="form.teams"
                  class="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-0 cursor-pointer"
                />
                <span class="ml-2 text-gray-700">UI/UX</span>
              </label>
              <label class="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  value="devops"
                  v-model="form.teams"
                  class="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-0 cursor-pointer"
                />
                <span class="ml-2 text-gray-700">DevOps</span>
              </label>
              <label class="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  value="analyst"
                  v-model="form.teams"
                  class="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-0 cursor-pointer"
                />
                <span class="ml-2 text-gray-700">Analyst</span>
              </label>
              <label class="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  value="sales"
                  v-model="form.teams"
                  class="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-0 cursor-pointer"
                />
                <span class="ml-2 text-gray-700">Sales</span>
              </label>
            </div>
          </div>

          <div class="text-sm">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Date Range</label
              >
              <VueDatePicker
                input-class="text-sm px-3 py-2 border rounded w-full"
                v-model="dateRange"
                :range="{ fixedStart: true }"
                :teleport="true"
                :clearable="false"
                :month-change-on-arrows="true"
              ></VueDatePicker>
              <!-- <label class="block text-sm font-medium text-gray-700"
                >Start Date</label
              >
              <input
                v-model="form.startDate"
                type="date"
                class="mt-1 text-sm block w-full px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
              /> -->
            </div>
            <!-- <div>
              <label class="block text-sm font-medium text-gray-700"
                >End Date</label
              >
              <input
                v-model="form.endDate"
                type="date"
                class="mt-1 text-sm block w-full px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
              />
            </div> -->
          </div>

          <div class="pt-4">
            <button
              type="submit"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-200"
            >
              {{ mode === "add" ? "Create Project" : "Update Project" }}
            </button>
          </div>
        </form>
      </div>
    </Dialog>
  </Layout>
</template>

<script setup>
import { reactive, ref, provide, onMounted } from "vue";
import axios from "axios";
import Layout from "../components/Layout.vue";
import ProjectList from "../components/ProjectList.vue";
import Dialog from "../components/Task/Dialog.vue";
import { useToast } from "../components/Composables/useToast.js";
import ProjectBoard from "../components/ProjectBoard.vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

import { useFetchStatus } from "../components/Composables/useFetchStatus";
const { statusList, loading, fetchStatus } = useFetchStatus();

// Using the composable
const { success, error } = useToast();
const dateRange = ref();
const showModal = ref(false);
const mode = ref("add");
const currentView = ref("board");
const message = ref("");
const projectListRef = ref(null);
const projectBoardRef = ref(null);
const selectedProjectId = ref(null);

const user = JSON.parse(localStorage.getItem("current-user"));
const projectCreatorId = user.id;

const initialForm = {
  name: "",
  description: "",
  startDate: "",
  endDate: "",
  teams: [],
  status: "To Do",
  createdBy: projectCreatorId, // Replace with logged-in user ID
};

const form = reactive({ ...initialForm });

const handleAddProject = (status) => {
  initialForm.status = status.name;
  initialForm.startDate = dateRange.value[0]?.toISOString();
  initialForm.endDate = dateRange.value[1]?.toISOString();
  mode.value = "add";
  showModal.value = true;
  Object.assign(form, initialForm);
};

const createProject = async () => {
  const testDate = dateRange.value[0]?.toISOString();
  const newVal = new Date(testDate);
  console.log("testDate", testDate);
  console.log("newVal", newVal);

  try {
    const token = localStorage.getItem("token");
    if (mode.value === "add") {
      await axios.post("http://localhost:5000/api/projects", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.value = "Project Created Successfully!";
      success(message.value, { title: "Success" });
    } else if (mode.value === "edit" && selectedProjectId.value) {
      await axios.put(
        `http://localhost:5000/api/projects/${selectedProjectId.value}`,
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      message.value = "Project updated successfully!";
      success(message.value, { title: "Success" });
    }
    mode.value = "add";
    refreshProjectList();
    showModal.value = false;
    Object.assign(form, initialForm);
  } catch (error) {
    message.value =
      error.response?.data?.message || "Failed to add Project. Try again.";
  }
};

const handleEdit = (row) => {
  console.log("row", row);
  mode.value = "edit";
  selectedProjectId.value = row._id;
  Object.assign(form, {
    name: row.name,
    description: row.description,
    startDate: row.startDate,
    endDate: row.endDate,
    teams: row.teams,
    status: row.status,
    createdBy: projectCreatorId,
  });
  showModal.value = true;
  console.log("form handleEdit", form);
};

const handleDelete = async (row) => {
  const projectId = row._id;
  try {
    const token = localStorage.getItem("token");

    const confirmed = await $confirm({
      title: "Delete Item",
      message: "Are you sure you want to delete the selected record?",
    });

    if (!confirmed) {
      return;
    } else {
      await axios.delete(`http://localhost:5000/api/projects/${projectId}`, {
        headers: {
          Authorization: `Berear${token}`,
        },
      });
      refreshProjectList();
      success("Deleted Succeussfully!", { title: "Success" });
    }
  } catch (err) {
    console.error("Error deleting user:", err.message);
  }
};

const refreshProjectList = () => {
  projectListRef.value?.fetchProjects?.();
  projectBoardRef.value?.fetchProjects?.();
};

const buttonClass = (view) => {
  return [
    "bg-white px-4 py-2 text-sm font-semibold transition-all",
    currentView.value === view
      ? "border-b-2 border-blue-600 text-blue-600"
      : "text-gray-600 hover:text-blue-500",
  ].join(" ");
};

// Provide & Inject Process
provide("openCreateModal", handleAddProject);
provide("deleteProject", handleDelete);
onMounted(() => {
  const startDate = new Date();
  const endDate = new Date(new Date().setDate(startDate.getDate() + 7));
  dateRange.value = [startDate, endDate];
  console.log("date.value", dateRange.value);
  fetchStatus();
  console.log("statusList  from", statusList.value);
});
</script>
<style>
.dp__pointer,
.dp__calendar {
  font-size: 14px;
}
.dp__cell_inner {
  font-size: 13px;
}
</style>
