<script setup>
import { ref } from "vue";
import LayoutForClient from "../components/LayoutForClient.vue";

const projects = ref([
  {
    id: 1,
    name: "TeamTrax Platform",
    status: "In Progress",
    totalTasks: 20,
    completedTasks: 12,
    deadline: "2025-08-15",
    description: "A collaboration tool for project management",
  },
  {
    id: 2,
    name: "Client CRM System",
    status: "Completed",
    totalTasks: 10,
    completedTasks: 10,
    deadline: "2025-06-30",
    description: "Client tracking and communication platform",
  },
]);

const selectedProject = ref(null);
const showDrawer = ref(false);
const feedbackText = ref("");

function openDrawer(project) {
  selectedProject.value = project;
  showDrawer.value = true;
  feedbackText.value = "";
}

function closeDrawer() {
  showDrawer.value = false;
}

function submitFeedback() {
  console.log(
    `Feedback for ${selectedProject.value.name}:`,
    feedbackText.value
  );
  // Here you'd typically POST to backend
  alert("Feedback submitted!");
  feedbackText.value = "";
}
</script>

<template>
  <LayoutForClient>
    <div class="p-6">
      <h2 class="text-2xl font-semibold mb-6">Your Projects</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="project in projects"
          :key="project.id"
          class="p-4 bg-white rounded shadow hover:shadow-md cursor-pointer transition"
          @click="openDrawer(project)"
        >
          <h3 class="text-lg font-semibold text-blue-700">
            {{ project.name }}
          </h3>
          <p class="text-gray-600 text-sm">{{ project.description }}</p>
          <p class="text-sm mt-1 text-gray-500">
            Status: <span class="font-medium">{{ project.status }}</span>
          </p>
        </div>
      </div>

      <!-- Drawer -->
      <transition name="slide">
        <div
          v-if="showDrawer"
          class="fixed inset-0 bg-black bg-opacity-40 z-40"
          @click.self="closeDrawer"
        >
          <div
            class="absolute right-0 top-0 h-full w-full sm:w-[450px] bg-white shadow-lg z-50 p-6 overflow-y-auto"
          >
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-xl font-bold">Project Details</h3>
              <button
                @click="closeDrawer"
                class="text-gray-500 hover:text-red-500"
              >
                ✕
              </button>
            </div>

            <!-- Project Info -->
            <div v-if="selectedProject" class="space-y-3">
              <div>
                <p><strong>Name:</strong> {{ selectedProject.name }}</p>
                <p><strong>Status:</strong> {{ selectedProject.status }}</p>
                <p>
                  <strong>Deadline:</strong>
                  {{ new Date(selectedProject.deadline).toLocaleDateString() }}
                </p>
                <p>
                  <strong>Description:</strong>
                  {{ selectedProject.description }}
                </p>
              </div>

              <!-- Progress Bar -->
              <div>
                <p class="mb-1 text-sm font-medium">Progress:</p>
                <div
                  class="w-full bg-gray-200 rounded-full h-4 overflow-hidden"
                >
                  <div
                    class="h-4 bg-blue-500 text-xs text-white text-center leading-4 rounded-full"
                    :style="{
                      width: `${Math.round(
                        (selectedProject.completedTasks /
                          selectedProject.totalTasks) *
                          100
                      )}%`,
                    }"
                  >
                    {{
                      Math.round(
                        (selectedProject.completedTasks /
                          selectedProject.totalTasks) *
                          100
                      )
                    }}%
                  </div>
                </div>
                <p class="text-xs text-gray-500 mt-1">
                  {{ selectedProject.completedTasks }} /
                  {{ selectedProject.totalTasks }} tasks completed
                </p>
              </div>

              <!-- Feedback -->
              <div class="mt-6">
                <h4 class="text-lg font-semibold mb-2">Submit Feedback</h4>
                <textarea
                  v-model="feedbackText"
                  rows="4"
                  placeholder="Write your feedback..."
                  class="w-full border rounded p-2 focus:outline-none focus:ring focus:ring-blue-300"
                ></textarea>
                <button
                  @click="submitFeedback"
                  class="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </LayoutForClient>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from {
  transform: translateX(100%);
}
.slide-enter-to {
  transform: translateX(0);
}
.slide-leave-from {
  transform: translateX(0);
}
.slide-leave-to {
  transform: translateX(100%);
}
</style>
