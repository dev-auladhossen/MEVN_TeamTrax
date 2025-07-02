<template>
  <div>
    <h2 class="text-xl font-semibold mb-4">Backlog</h2>
    <div class="flex gap-3">
      <button
        @click="$emit('create-task')"
        class="px-4 py-2 rounded font-medium text-white bg-blue-600 hover:bg-blue-700 transition bg-blue-600 text-white hover:bg-blue-700"
      >
        + Add Task
      </button>
      <button
        @click="showSprintModal = true"
        class="px-4 py-2 rounded font-medium text-white bg-blue-600 hover:bg-blue-700 transition bg-blue-600 text-white hover:bg-blue-700"
      >
        + Create Sprint
      </button>
    </div>
    <ul class="space-y-2">
      <li
        v-for="task in props.backlogTasks"
        :key="task._id"
        class="bg-white border p-2 rounded shadow cursor-move"
        draggable="true"
        @dragstart="onDragStart(task)"
      >
        {{ task.title }}
      </li>
    </ul>

    <CreateEditSprintModal
      v-if="showSprintModal"
      :project-id="projectId"
      @close="showSprintModal = false"
      @sprint-created="fetchTasks"
    />
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import axios from "axios";
import CreateEditSprintModal from "../CreateEditSprintModal.vue";

const emit = defineEmits(["create-task", "create-sprint", "task-moved"]);

const props = defineProps({ projectId: String, backlogTasks: Array });
// const backlogTasks = ref([]);

const showSprintModal = ref(false);

watch(() => props.projectId, fetchTasks, { immediate: true });

const backlogTasks = ref(props.backlogTasks || []);

async function fetchTasks() {
  const res = await axios.get("http://localhost:5000/api/sprint-tasks", {
    params: { projectId: props.projectId, sprintId: "null" },
  });
  backlogTasks.value = res.data;
}

function onDragStart(task) {
  event.dataTransfer.setData("application/json", JSON.stringify(task));
}
</script>

<!-- <template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-semibold">Product Backlog</h2>
      <div class="flex gap-3">
        <button
          @click="$emit('create-task')"
          class="px-4 py-2 rounded font-medium text-white bg-blue-600 hover:bg-blue-700 transition bg-blue-600 text-white hover:bg-blue-700"
        >
          + Add Task
        </button>
        <button
          @click="showSprintModal = true"
          class="px-4 py-2 rounded font-medium text-white bg-blue-600 hover:bg-blue-700 transition bg-blue-600 text-white hover:bg-blue-700"
        >
          + Create Sprint
        </button>
      </div>
    </div>

  
    <div v-if="backlogTasks.length" class="space-y-4">
      <div
        v-for="task in backlogTasks"
        :key="task._id"
        class="bg-white p-4 rounded shadow hover:shadow-lg cursor-pointer transition"
        @click="$emit('edit-task', task)"
      >
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium">{{ task.title }}</h3>
          <span class="text-sm bg-gray-200 rounded-full px-2 py-1">{{
            task.priority
          }}</span>
        </div>
        <p class="text-sm text-gray-600 mt-1">{{ task.description }}</p>
        <div class="text-xs text-gray-400 mt-2">
          Type: {{ task.type || "feature" }}
        </div>
      </div>
    </div>
    <div v-else class="text-center text-gray-400 py-12">
      No tasks in backlog.
    </div>

 
    <CreateEditSprintModal
      v-if="showSprintModal"
      :project-id="projectId"
      @close="showSprintModal = false"
      @sprint-created="fetchTasks"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import CreateEditSprintModal from "../CreateEditSprintModal.vue";

const props = defineProps({ projectId: String });
const backlogTasks = ref([]);
const showSprintModal = ref(false);

watch(() => props.projectId, fetchTasks, { immediate: true });

async function fetchTasks() {
  const res = await axios.get("http://localhost:5000/api/sprint-tasks", {
    params: { projectId: props.projectId, sprintId: "null" },
  });
  backlogTasks.value = res.data;
  console.log("backlogTasks", backlogTasks);
}
</script>

<style scoped></style> -->
