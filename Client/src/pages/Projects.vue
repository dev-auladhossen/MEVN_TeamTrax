<template>
  <Layout>
    <div class="flex justify-between gap-3 p-3 max-w-5xl mx-auto">
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
    <ProjectList
      ref="projectListRef"
      @edit="handleEdit"
      @delete="handleDelete"
    />
    <Dialog :isOpen="showModal" @close="showModal = false">
      <div class="max-w-xl mx-auto bg-white">
        <h3 class="text-lg font-bold leading-6 text-center mb-2 text-gray-700">
          {{ mode === "add" ? "ADD NEW PROJECT" : "EDIT PROJECT" }}
        </h3>

        <form @submit.prevent="createProject" class="space-y-4">
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
              rows="3"
              class="mt-1 text-sm block w-full px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Start Date</label
              >
              <input
                v-model="form.startDate"
                type="date"
                class="mt-1 text-sm block w-full px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >End Date</label
              >
              <input
                v-model="form.endDate"
                type="date"
                class="mt-1 text-sm block w-full px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Select Teams</label
            >
            <div class="grid grid-cols-4 gap-4">
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

          <div class="pt-4">
            <button
              type="submit"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-200"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </Dialog>
  </Layout>
</template>

<script setup>
import { reactive, ref } from "vue";
import axios from "axios";
import Layout from "../components/Layout.vue";
import ProjectList from "../components/ProjectList.vue";
import Dialog from "../components/Task/Dialog.vue";
import { useToast } from "../components/Composables/useToast.js";

// Using the composable
const { success, error } = useToast();
const showModal = ref(false);
const mode = ref("add");
const message = ref("");
const projectListRef = ref(null);

const user = JSON.parse(localStorage.getItem("current-user"));
const projectCreatorId = user.id;
console.log("user", user);

const initialForm = {
  name: "",
  description: "",
  startDate: "",
  endDate: "",
  teams: [],
  status: "Not Started",
  createdBy: projectCreatorId, // Replace with logged-in user ID
};

const form = reactive({ ...initialForm });

const handleAddProject = () => {
  mode.value = "add";
  showModal.value = true;
  Object.assign(form, initialForm);
};

const createProject = async () => {
  console.log("form", form);
  try {
    const res = await axios.post("http://localhost:5000/api/projects", form);
    refreshProjectList();
    showModal.value = false;
    message.value = "Project Created Successfully!";
    success(message.value, { title: "Success" });
    Object.assign(form, initialForm);
  } catch (err) {
    console.error(err);
    message.value = "Failed to create project";
    error(message.value, { title: "Error" });
  }
};

const handleDelete = async (row) => {
  console.log(row);
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
};
</script>
