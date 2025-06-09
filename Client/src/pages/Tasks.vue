<template scoped>
  <Layout>
    <button
      @click="showModal = true"
      class="mt-4 md:mt-0 bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition"
    >
      + Add Task
    </button>

    <!-- Task Form Modal -->
    <Dialog :isOpen="showModal" @close="showModal = false">
      <div class="max-w-xl mx-auto bg-white">
        <h3 class="text-lg font-bold leading-6 text-center mb-2 text-gray-700">
          {{ mode === "add" ? "ADD NEW TASK" : "EDIT TASK" }}
        </h3>

        <form @submit.prevent="submitTask" class="space-y-3">
          <div>
            <label class="block text-sm font-medium text-gray-700">Title</label>
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

          <div class="flex gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Status</label
              >
              <select
                v-model="newTask.status"
                class="w-40 px-4 py-1 border rounded text-sm cursor-pointer"
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
                class="w-40 px-4 py-1 border rounded text-sm cursor-pointer"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <!-- Assignees & Project Selection  -->
          <div class="flex gap-4">
            <!-- Project Selection Dropdown -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Project</label
              >
              <select
                v-model="newTask.projectId"
                class="w-48 px-4 py-1 border rounded text-sm cursor-pointer"
                required
              >
                <option disabled value="">-- Select Project --</option>
                <option
                  v-for="project in projects"
                  :key="project._id"
                  :value="project._id"
                >
                  {{ project.name }}
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
                  class="w-full border border-gray-300 bg-white px-4 py-1 rounded-md shadow-sm text-left text-sm"
                >
                  <span v-if="newTask.assignedTo?.length">
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
                        class="flex items-center px-4 py-2 hover:bg-gray-50 text-sm cursor-pointer"
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
  </Layout>
</template>
<script setup>
import Layout from "../components/Layout.vue";
import Dialog from "../components/Task/Dialog.vue";
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useToast } from "../components/Composables/useToast.js";

const showModal = ref(false);
const showAssigneeDropdown = ref(false);
const assigneeDropdownRef = ref(null);
const expandedDepts = ref([]);
const message = ref("");
const mode = ref("add");
const taskStatuses = ["Todo", "In Progress", "Review", "Done"];
const projects = ref([]);
const users = ref([]);
const { success, error } = useToast();

const initialTask = {
  title: "",
  description: "",
  status: taskStatuses[0],
  priority: "Medium",
  dueDate: "",
  assignedTo: [],
  projectId: "",
};

const newTask = ref({ ...initialTask.value });

const toggleAssigneeDropdown = () => {
  showAssigneeDropdown.value = !showAssigneeDropdown.value;
};

async function submitTask() {
  try {
    const token = localStorage.getItem("token");
    const payLoad = { ...newTask.value };
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
    Object.assign(newTask, initialTask);
  } catch (error) {
    message.value =
      error.response?.data?.message || "Failed to add Task. Try again.";
  }

  newTask.value = { title: "", description: "", projectId: "" };
}
const dummyUsers = [
  { id: 1, fullName: "Alice", department: "Design" },
  { id: 2, fullName: "Bob Johnson", department: "Design" },
  { id: 3, fullName: "Charlie Brown", department: "Development" },
  { id: 4, fullName: "David Lee", department: "Development" },
  { id: 5, fullName: "Eva Green", department: "QA" },
];

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
    newTask.value.assignedTo?.some((u) => u.id === user.id)
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

async function fetchProjects() {
  const res = await axios.get("http://localhost:5000/api/projects");
  projects.value = res.data;
  console.log(" projects.value ", projects.value);
}
const fetchUsers = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5000/api/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    users.value = res.data;
    console.log(users.value);
  } catch (error) {
    console.error("Failed to fetch users:", error);
  }
};
onMounted(() => {
  fetchProjects();
  fetchUsers();
});
</script>
<style scoped></style>
