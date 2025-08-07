<script setup>
import { ref } from "vue";
import Layout from "../components/Layout.vue";

const clients = ref([
  {
    id: 1,
    name: "Acme Corp",
    email: "acme@example.com",
    type: "organization",
    projects: [
      {
        id: 101,
        name: "Project Alpha",
        feedback: "The progress is promising. Keep the UI clean.",
      },
      {
        id: 102,
        name: "Project Beta",
        feedback: "We need weekly updates and testing support.",
      },
    ],
  },
  {
    id: 2,
    name: "John Doe",
    email: "john@example.com",
    type: "person",
    projects: [
      {
        id: 103,
        name: "Personal Portfolio Website",
        feedback: "Looks great! Just minor performance issues left.",
      },
    ],
  },
  {
    id: 3,
    name: "John Doe",
    email: "john@example.com",
    type: "person",
    projects: [
      {
        id: 103,
        name: "Personal Portfolio Website",
        feedback: "Looks great! Just minor performance issues left.",
      },
    ],
  },
  {
    id: 4,
    name: "Selim Ahmed",
    email: "selim@example.com",
    type: "person",
    projects: [
      {
        id: 103,
        name: "E-commerce Website",
        feedback: "Looks great! Just minor performance issues left.",
      },
    ],
  },
  {
    id: 5,
    name: "Abir Ahmed",
    email: "abir@example.com",
    type: "person",
    projects: [
      {
        id: 103,
        name: "Mobile APP for shopping business",
        feedback: "Looks great! Just minor performance issues left.",
      },
    ],
  },
  {
    id: 1,
    name: "Grameenphone",
    email: "grammenphone@example.com",
    type: "organization",
    projects: [
      {
        id: 101,
        name: "Project Alpha",
        feedback: "The progress is promising. Keep the UI clean.",
      },
      {
        id: 102,
        name: "Project Beta",
        feedback: "We need weekly updates and testing support.",
      },
    ],
  },
]);

const selectedClient = ref(null);
const showDrawer = ref(false);

function openDrawer(client) {
  selectedClient.value = client;
  showDrawer.value = true;
}

function closeDrawer() {
  showDrawer.value = false;
}
</script>

<template>
  <Layout>
    <div class="p-6">
      <h2 class="text-2xl font-semibold mb-4">Client List</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="client in clients"
          :key="client.id"
          class="p-4 bg-white shadow rounded hover:shadow-lg cursor-pointer transition"
          @click="openDrawer(client)"
        >
          <h3 class="font-semibold text-lg">{{ client.name }}</h3>
          <p class="text-gray-600">{{ client.email }}</p>
          <p class="text-sm capitalize text-gray-500">
            Type: {{ client.type }}
          </p>
        </div>
      </div>

      <!-- Side Drawer -->
      <transition name="slide">
        <div
          v-if="showDrawer"
          class="fixed inset-0 bg-black bg-opacity-50 z-40"
          @click.self="closeDrawer"
        >
          <div
            class="absolute right-0 top-0 h-full w-full sm:w-[400px] bg-white shadow-lg p-6 overflow-y-auto z-50"
          >
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-xl font-bold">Client Details</h3>
              <button
                @click="closeDrawer"
                class="text-gray-500 hover:text-red-500"
              >
                ✕
              </button>
            </div>

            <div v-if="selectedClient">
              <!-- Client Info -->
              <div class="mb-6">
                <p><strong>Name:</strong> {{ selectedClient.name }}</p>
                <p><strong>Email:</strong> {{ selectedClient.email }}</p>
                <p><strong>Type:</strong> {{ selectedClient.type }}</p>
              </div>

              <!-- Projects and Feedback -->
              <div
                v-for="project in selectedClient.projects"
                :key="project.id"
                class="mb-4"
              >
                <div class="border-l-4 border-blue-500 bg-blue-50 p-3 rounded">
                  <h4 class="font-semibold text-blue-800">
                    {{ project.name }}
                  </h4>
                  <p class="text-sm text-gray-700 mt-1">
                    <strong>Feedback:</strong> {{ project.feedback }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </Layout>
</template>

<style scoped>
/* Slide animation */
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
