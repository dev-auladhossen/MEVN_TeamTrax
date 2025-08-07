<template>
  <Layout>
    <!-- Button to open modal -->
    <div class="flex justify-between gap-3 p-3 max-w-5xl mx-auto">
      <div class="text-xl flex items-center justify-center font-bold">
        <span>Team Members</span>
      </div>
      <button
        @click="handleAddUser"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        <font-awesome-icon class="mr-2" icon="add" />
        Add New User
      </button>
    </div>

    <UserList ref="userListRef" @edit="handleEdit" @delete="handleDelete" />

    <!-- Modal -->
    <Dialog
      :isOpen="showModal"
      @close="showModal = false"
      @confirm="handleConfirm"
      @edit="handleEdit"
      @delete="handleDelete"
    >
      <!-- Default slot for main content -->
      <h3 class="text-lg font-bold leading-6 text-center mt-1 text-gray-700">
        {{ mode === "add" ? "ADD NEW USER" : "EDIT USER" }}
      </h3>
      <div class="mt-2">
        <div class="max-w-md mx-auto p-3 bg-white mt-2">
          <form @submit.prevent="handleSubmit" class="space-y-2">
            <!-- Username -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Full Name</label
              >
              <input
                v-model="form.username"
                type="text"
                placeholder="Full Name"
                required
                class="w-full placeholder-gray-300 text-sm px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <!-- Password -->
            <div v-if="mode === 'add'">
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Password</label
              >
              <input
                v-model="form.password"
                type="password"
                placeholder="Password"
                required
                class="w-full placeholder-gray-300 text-sm px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Email Address</label
              >
              <input
                v-model="form.email"
                type="email"
                placeholder="Email Address"
                required
                class="w-full placeholder-gray-300 text-sm px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <!-- Title -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Title</label
              >
              <input
                v-model="form.title"
                type="text"
                placeholder="Title"
                required
                class="w-full placeholder-gray-300 text-sm px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <!-- Role & Color Picker -->
            <div class="flex flex-row gap-8">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Color</label
                >
                <input
                  v-model="form.color"
                  type="color"
                  class="w-8 h-8 text-sm border border-gray-300 rounded-lg cursor-pointer outline-none border-none"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Role</label
                >
                <select
                  v-model="form.role"
                  required
                  class="w-full text-sm p-2 border cursor-pointer border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:ring-blue-500"
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="projectManager">Project Manager</option>
                  <option value="teamLeader">Team Leader</option>
                  <option value="developer">Developer</option>
                  <option value="tester">Tester</option>
                  <option value="devOps">DevOps</option>
                  <option value="designer">UI/UX Designer</option>
                  <option value="sales">Sales</option>
                  <option value="businessAnalyst">Business Analyst</option>
                </select>
              </div>
            </div>

            <div v-if="mode == 'edit'">
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Status</label
              >
              <div class="flex flex-row gap-2">
                <label class="cursor-pointer">
                  <input
                    class="cursor-pointer focus:ring-0"
                    type="radio"
                    value="active"
                    v-model="form.status"
                    @change="updateStatus(user)"
                  />
                  Active
                </label>
                <label class="cursor-pointer">
                  <input
                    class="cursor-pointer focus:ring-0"
                    type="radio"
                    value="disabled"
                    v-model="form.status"
                    @change="updateStatus(user)"
                  />
                  Inactive
                </label>
              </div>
            </div>

            <!-- Submit -->
            <div class="mt-4 flex justify-end gap-2">
              <button
                @click="showModal = false"
                type="button"
                class="bg-white text-sm text-gray-500 font-semibold py-2 px-4 rounded-lg hover:text-black transition duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                {{ mode === "add" ? "Submit" : "Update" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  </Layout>
</template>

<script setup>
import { reactive, ref } from "vue";
import axios from "axios";
import Layout from "../components/Layout.vue";
import Dialog from "../components/Task/Dialog.vue";
import UserList from "../components/UserList.vue";
import { useToast } from "../components/Composables/useToast.js";

// Using the composable
const { success, error, warning, info, showToast, clear } = useToast();

// reactive state
const message = ref("");
const showModal = ref(false);
const mode = ref("add");
const selectedUserId = ref(null);
const initialForm = {
  username: "",
  password: "",
  email: "",
  title: "",
  role: "",
  status: "active",
  color: "#0000ff",
};
const updateStatus = () => {
  console.log("form after status change", form);
};
const userListRef = ref(null);

const refreshUserList = () => {
  userListRef.value?.fetchUsers?.();
};
const form = reactive({ ...initialForm });

const handleAddUser = () => {
  mode.value = "add";
  showModal.value = true;
  Object.assign(form, initialForm);
};

// Form Submit
const handleSubmit = async () => {
  console.log(form);
  try {
    const token = localStorage.getItem("token");

    if (mode.value === "add") {
      await axios.post("http://localhost:5000/api/add-user", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.value = "User added successfully!";
      success(message.value);
    } else if (mode.value === "edit" && selectedUserId.value) {
      await axios.put(
        `http://localhost:5000/api/users/${selectedUserId.value}`,
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      message.value = "User updated successfully!";
      success(message, { title: "Success" });
    }
    Object.assign(form, initialForm);
    showModal.value = false;
    selectedUserId.value = null;
    mode.value = "add";
    refreshUserList();
  } catch (error) {
    message.value =
      error.response?.data?.message || "Failed to add user. Try again.";
  }
};

const handleEdit = (row) => {
  mode.value = "edit";
  selectedUserId.value = row._id;
  Object.assign(form, {
    username: row.username,
    email: row.email,
    title: row.title,
    role: row.role,
    color: row.color,
    status: row.status,
    password: "",
  });
  showModal.value = true;
};

const handleDelete = async (row) => {
  const userId = row._id;
  try {
    const token = localStorage.getItem("token");

    const confirmed = await $confirm({
      title: "Delete Item",
      message: "Are you sure you want to delete the selected record?",
    });

    if (!confirmed) {
      return;
    } else {
      // Proceed with deletion
      await axios.delete(`http://localhost:5000/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      refreshUserList();
      success("Deleted Succeussfully!", { title: "Success" });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};
</script>
<style scoped></style>
