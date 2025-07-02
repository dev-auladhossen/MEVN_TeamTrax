<template>
  <div class="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
    <div class="bg-white p-6 rounded w-full max-w-lg">
      <h2 class="text-lg font-semibold mb-4">
        {{ task == "add" ? "Create Task" : "Edit Task" }}
      </h2>
      <form @submit.prevent="submit">
        <!-- Title -->
        <input
          v-model="form.title"
          class="input mb-2 w-full"
          placeholder="Title"
        />

        <!-- Description -->
        <textarea
          v-model="form.description"
          class="textarea mb-2 w-full"
          placeholder="Description"
        ></textarea>

        <!-- Status -->
        <select v-model="form.status" class="select mb-2 w-full">
          <option value="backlog">Backlog</option>
          <option value="todo">To Do</option>
          <option value="inprogress">In Progress</option>
          <option value="review">Review</option>
          <option value="done">Done</option>
        </select>

        <!-- Priority -->
        <select v-model="form.priority" class="select mb-2 w-full">
          <option disabled value="">Select Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <!-- Assigned To -->
        <select v-model="form.assignedTo" class="select mb-2 w-full">
          <option disabled value="">Assign To</option>
          <option v-for="user in users" :key="user._id" :value="user._id">
            {{ user.username }}
          </option>
        </select>

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

        <!-- Buttons -->
        <div class="flex justify-end gap-2">
          <button type="button" @click="$emit('close')" class="btn">
            Cancel
          </button>
          <button type="submit" class="btn btn-primary">
            {{ task ? "Update" : "Create" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, onMounted } from "vue";
import axios from "axios";

const props = defineProps({ projectId: String, task: Object });
const emit = defineEmits(["close", "saved"]);

const form = reactive({
  title: "",
  description: "",
  status: "backlog",
  priority: "",
  assignedTo: "",
  sprintId: "",
});

const users = reactive([]);
const sprints = reactive([]);

watch(
  () => props.task,
  () => {
    if (props.task == "edit") {
      Object.assign(form, props.task);
    } else {
      Object.assign(form, {
        title: "",
        description: "",
        status: "backlog",
        priority: "",
        assignedTo: "",
        sprintId: "",
      });
    }
  },
  { immediate: true }
);

onMounted(() => {
  fetchUsers();
  fetchSprints();
});

async function fetchUsers() {
  try {
    const res = await axios.get("http://localhost:5000/api/users"); // adapt your backend endpoint
    users.splice(0, users.length, ...res.data);
  } catch (err) {
    console.error("Failed to fetch users", err);
  }
}

async function fetchSprints() {
  try {
    const res = await axios.get(
      `http://localhost:5000/api/sprints?projectId=${props.projectId}`
    ); // or adjust route
    sprints.splice(0, sprints.length, ...res.data);
    console.log("sprints", sprints);
  } catch (err) {
    console.error("Failed to fetch sprints", err);
  }
}

async function submit() {
  console.log("props.task._id", props.task);
  console.log("props.projectId", props.projectId);
  console.log("form", form);
  try {
    if (props.task == "edit") {
      await axios.patch(
        `http://localhost:5000/api/sprint-task/${props.task._id}`,
        form
      );
    } else {
      console.log("...form", { ...form });
      await axios.post("http://localhost:5000/api/add-sprintTasks", {
        ...form,
        projectId: props.projectId,
      });
    }
    emit("saved");
    emit("close");
  } catch (err) {
    console.error("Submit error:", err);
  }
}
</script>
