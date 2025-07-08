<template>
  <Layout>
    <div class="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-10">
      <!-- Header -->
      <header
        class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6"
      >
        <div class="flex items-center space-x-4">
          <div
            class="w-10 h-10 rounded-full text-white flex items-center justify-center text-xs font-semibold ring-2 ring-white"
            :style="{ backgroundColor: user.color }"
            :title="user.name"
          >
            {{ getInitials(user.name) }}
          </div>
          <div>
            <h1 class="text-2xl font-semibold text-gray-800">
              Welcome, {{ user.name }}
            </h1>
            <p class="text-gray-500 text-sm capitalize">{{ user.role }}</p>
          </div>
        </div>
        <button
          class="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md shadow"
        >
          Go to Task Dashboard
          <font-awesome-icon
            icon="arrow-right"
            class="ms-2"
          ></font-awesome-icon>
        </button>
      </header>

      <!-- Stats Summary -->
      <section class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          color="bg-blue-100 text-blue-800"
          text="Total Tasks"
          :value="stats.total"
        />
        <StatCard
          color="bg-green-100 text-green-800"
          text="Completed"
          :value="stats.completed"
        />
        <StatCard
          color="bg-yellow-100 text-yellow-800"
          text="Pending"
          :value="stats.pending"
        />
      </section>

      <!-- Tasks & Activity feed container -->
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- Assigned Tasks -->
        <div class="flex-1 bg-white rounded-lg shadow p-5">
          <h2 class="text-lg font-semibold mb-4">Your Assigned Tasks</h2>
          <ul class="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            <li
              v-for="task in assignedTasks"
              :key="task.id"
              class="py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center"
            >
              <div>
                <h3 class="font-medium text-gray-900">{{ task.title }}</h3>
                <p class="text-sm text-gray-600">{{ task.project }}</p>
                <p class="text-xs mt-1">
                  Due:
                  <span :class="dueDateClass(task.due)">{{
                    formatDate(task.due)
                  }}</span>
                </p>
              </div>
              <span
                :class="[
                  'mt-2 sm:mt-0 text-xs font-semibold px-3 py-1 rounded-full',
                  statusColor(task.status),
                ]"
              >
                {{ task.status }}
              </span>
            </li>
            <li
              v-if="assignedTasks.length === 0"
              class="text-gray-500 text-center py-6"
            >
              No tasks assigned yet.
            </li>
          </ul>
        </div>

        <!-- Recent Activity -->
        <div class="w-full lg:w-96 bg-white rounded-lg shadow p-5">
          <h2 class="text-lg font-semibold mb-4">Recent Activity</h2>
          <ul class="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            <li
              v-for="item in activityFeed"
              :key="item.id"
              class="py-3 text-sm text-gray-700"
            >
              <span class="font-semibold">{{ item.user }}</span>
              {{ item.action }}
              <span class="text-gray-400 text-xs ml-1">{{
                timeAgo(item.time)
              }}</span>
            </li>
            <li
              v-if="activityFeed.length === 0"
              class="text-gray-500 text-center py-6"
            >
              No recent activity.
            </li>
          </ul>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Layout from "../components/Layout.vue";

// Dummy user info

const user = JSON.parse(localStorage.getItem("current-user"));

// Dummy stats
const stats = ref({
  total: 24,
  completed: 12,
  pending: 8,
});

// Dummy assigned tasks
const assignedTasks = ref([
  {
    id: 1,
    title: "Fix login button bug",
    project: "Project Phoenix",
    due: "2025-07-12",
    status: "In Progress",
  },
  {
    id: 2,
    title: "Update landing page UI",
    project: "Project Orion",
    due: "2025-07-10",
    status: "Pending",
  },
  {
    id: 3,
    title: "Write unit tests for auth",
    project: "Project Phoenix",
    due: "2025-07-15",
    status: "Completed",
  },
]);

// Dummy activity feed
const activityFeed = ref([
  {
    id: 1,
    user: "Bob",
    action: "commented on Task #1",
    time: Date.now() - 60000,
  },
  {
    id: 2,
    user: "Alice",
    action: "completed Task #3",
    time: Date.now() - 3600000,
  },
  {
    id: 3,
    user: "Charlie",
    action: "added new task to Project Orion",
    time: Date.now() - 7200000,
  },
]);

// Helper functions
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString();
}

function dueDateClass(due) {
  const dueDate = new Date(due);
  const now = new Date();
  const diffDays = (dueDate - now) / (1000 * 3600 * 24);
  if (diffDays < 0) return "text-red-600 font-bold"; // overdue
  if (diffDays <= 3) return "text-yellow-600 font-semibold"; // soon due
  return "text-gray-600";
}

function statusColor(status) {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-green-100 text-green-700";
    case "in progress":
      return "bg-blue-100 text-blue-700";
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

// Time ago function (simple)
function timeAgo(timestamp) {
  const diff = (Date.now() - timestamp) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const getInitials = (name) => {
  if (!name || typeof name !== "string") return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};
</script>

<script>
// StatCard component
export default {
  components: {
    StatCard: {
      props: ["color", "text", "value"],
      template: `
        <div :class="['rounded-lg p-5 flex flex-col items-center text-center', color]">
          <div class="font-extrabold text-3xl">{{ value }}</div>
          <div class="mt-2 text-sm font-medium">{{ text }}</div>
        </div>
      `,
    },
  },
};
</script>

<style scoped>
/* Just to add smooth scrollbar for overflow-y */
ul::-webkit-scrollbar {
  width: 6px;
}
ul::-webkit-scrollbar-thumb {
  background-color: rgba(100, 116, 139, 0.4); /* Tailwind gray-500/40 */
  border-radius: 3px;
}
</style>
