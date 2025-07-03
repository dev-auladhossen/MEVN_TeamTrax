<template>
  <div
    class="max-w-md bg-gray-50 p-3 rounded-lg border border-gray-200 shadow-sm"
  >
    <h2 class="text-lg font-bold text-gray-800 mb-3">Backlog</h2>

    <!-- Buttons -->
    <div class="flex flex-wrap gap-3 mb-5">
      <button
        @click="$emit('create-task')"
        class="flex-1 px-3 py-2 rounded-md font-medium text-white bg-blue-600 hover:bg-blue-700 transition"
      >
        + Task
      </button>
      <button
        @click="showSprintModal = true"
        class="flex-1 px-3 py-2 rounded-md font-medium text-white bg-green-600 hover:bg-green-700 transition"
      >
        + Sprint
      </button>
    </div>

    <!-- Backlog List -->
    <div
      class="max-h-[400px] overflow-y-auto pr-1 pb-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
    >
      <!-- Skeleton -->
      <ul v-if="loading" class="space-y-3 animate-pulse">
        <li v-for="n in 5" :key="n" class="bg-gray-200 h-10 rounded-md"></li>
      </ul>

      <!-- Actual Tasks -->
      <ul v-else-if="backlogTasks.length" class="space-y-3">
        <li
          @click="$emit('open-task', task)"
          v-for="task in backlogTasks"
          :key="task._id"
          class="bg-white border border-gray-200 rounded-md p-3 shadow-sm hover:shadow-md transition cursor-move"
          draggable="true"
          @dragstart="onDragStart(task)"
          @dragend="onDragEnd(task)"
        >
          <div class="text-sm font-medium text-gray-800 truncate">
            {{ task.title }}
          </div>
        </li>
      </ul>

      <!-- Empty State -->
      <div v-else class="text-center text-gray-500 text-sm py-10">
        No backlog tasks yet. Add one to get started!
      </div>
    </div>

    <!-- Sprint Modal -->
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

const emit = defineEmits([
  "create-task",
  "create-sprint",
  "task-moved",
  "open-task",
]);

const props = defineProps({ projectId: String, backlogTasks: Array });
// const backlogTasks = ref([]);

const showSprintModal = ref(false);
const loading = ref(true);

watch(() => props.projectId, fetchTasks, {
  immediate: true,
});

const backlogTasks = ref(props.backlogTasks || []);

async function fetchTasks() {
  loading.value = true;
  try {
    const res = await axios.get("http://localhost:5000/api/sprint-tasks", {
      params: { projectId: props.projectId, sprintId: "null" },
    });
    backlogTasks.value = res.data;
  } catch (error) {
    console.error("Failed to fetch backlog tasks:", error);
  } finally {
    loading.value = false;
  }
}

function onDragStart(task) {
  event.dataTransfer.setData("application/json", JSON.stringify(task));
}
async function onDragEnd(task) {
  await fetchTasks();
}
defineExpose({ fetchTasks });
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
