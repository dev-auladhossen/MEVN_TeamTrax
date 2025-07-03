<template>
  <!-- Backdrop -->
  <transition name="fade">
    <div
      v-if="task"
      class="fixed inset-0 bg-black/30 z-40"
      @click.self="emit('close')"
    ></div>
  </transition>

  <!-- Drawer -->
 <transition name="slide-fade">
  <div
    v-if="task"
    :key="task._id"
    class="fixed top-0 right-0 w-[400px] h-full bg-white z-50 shadow-lg p-6 overflow-y-auto"
  >
      <!-- Close Button -->
      <button
        class="text-gray-500 hover:text-red-500 absolute top-2 left-4"
        @click="emit('close')"
      >
        ✖
      </button>

      <!-- Header -->
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold">
          <span v-if="!isEditing">{{ task.title }}</span>
          <input
            v-else
            v-model="editedTask.title"
            class="border rounded px-2 py-1 w-full"
          />
        </h2>
        <div class="space-x-2">
          <button
            v-if="!isEditing"
            @click="enableEdit"
            class="text-sm text-blue-600 hover:underline"
          >
            Edit
          </button>
          <div v-else class="space-x-2">
            <button
              @click="saveChanges"
              class="text-sm text-green-600 hover:underline"
            >
              Save
            </button>
            <button
              @click="cancelEdit"
              class="text-sm text-gray-500 hover:underline"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <!-- Description -->
      <div class="mt-4">
        <h3 class="font-medium">Description</h3>
        <div
          v-if="!isEditing"
          class="text-sm text-gray-700 mt-1 whitespace-pre-line"
        >
          {{ task.description || "No description." }}
        </div>
        <textarea
          v-else
          v-model="editedTask.description"
          class="border rounded w-full mt-1 p-2 text-sm"
          rows="4"
        ></textarea>
      </div>

      <!-- Assignees -->
      <div class="mt-4">
        <h3 class="font-medium mb-1">Assignees</h3>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="user in task.assignedTo"
            :key="user._id"
            class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
          >
            {{ user.username }}
          </div>
        </div>
      </div>

      <!-- Attachments -->
      <div class="mt-4">
        <h3 class="font-medium mb-1">Attachments</h3>
        <div class="text-sm text-gray-600">
          <p>No files attached yet.</p>
        </div>
      </div>

      <!-- Comments -->
      <div class="mt-4">
        <h3 class="font-medium mb-1">Comments</h3>
        <div class="text-sm text-gray-600">
          <p>💬 Comment section placeholder</p>
        </div>
      </div>

      <!-- GitHub Integration -->
      <div class="mt-4">
        <h3 class="font-medium mb-1">GitHub Activity</h3>
        <div class="text-sm text-gray-600">
          <p>🔗 GitHub repo connected: {{ task.githubRepo || "None" }}</p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, reactive, watch, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  task: Object,
});
const emit = defineEmits(["taskEdited", "taskDeleted", "close"]);

const isEditing = ref(false);
const editedTask = reactive({
  title: "",
  description: "",
});

watch(
  () => props.task,
  (newTask) => {
    if (newTask) {
      editedTask.title = newTask.title;
      editedTask.description = newTask.description;
    }
  },
  { immediate: true }
);

function enableEdit() {
  isEditing.value = true;
}
function cancelEdit() {
  isEditing.value = false;
}
function saveChanges() {
  emit("taskEdited", { ...props.task, ...editedTask });
  isEditing.value = false;
}

// Optional: Close on ESC key
function handleKeydown(e) {
  if (e.key === "Escape") emit("close");
}
onMounted(() => {
  document.addEventListener("keydown", handleKeydown);
});
onBeforeUnmount(() => {
  document.removeEventListener("keydown", handleKeydown);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.slide-fade-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-fade-enter-to {
  transform: translateX(0%);
  opacity: 1;
}
.slide-fade-leave-from {
  transform: translateX(0%);
  opacity: 1;
}
.slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
