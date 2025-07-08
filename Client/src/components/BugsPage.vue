<template>
  <Layout>
    <div class="max-w-7xl mx-auto p-4 sm:p-6">
      <!-- Header -->
      <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3 sm:gap-0"
      >
        <h1 class="text-2xl font-bold text-gray-800">My Bugs</h1>
        <button
          @click="openModal = true"
          class="bg-pink-600 hover:bg-pink-700 text-white px-5 py-2 rounded-md shadow w-full sm:w-auto"
        >
          Submit Bug
        </button>
      </div>

      <!-- Filter + Stats -->
      <div class="flex flex-col sm:flex-row flex-wrap gap-4 mb-6">
        <select
          v-model="selectedStatus"
          class="border px-8 py-2 rounded text-sm h-[50%] w-full sm:w-auto"
        >
          <option value="All">All</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Blocked">Blocked</option>
          <option value="Failed QA">Failed QA</option>
          <option value="Complete">Complete</option>
        </select>

        <div
          class="flex flex-wrap gap-3 flex-grow justify-start sm:justify-end"
        >
          <StatCard
            color="bg-green-100"
            text="Open Bugs"
            :value="countByStatus('Open')"
            class="w-full sm:w-auto"
          />
          <StatCard
            color="bg-blue-100"
            text="Closed Bugs"
            :value="countByStatus('Complete')"
            class="w-full sm:w-auto"
          />
          <StatCard
            color="bg-pink-300"
            text="Blocked"
            :value="countByStatus('Blocked')"
            class="w-full sm:w-auto"
          />
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-2 mb-4 text-xs">
        <span class="bg-green-200 text-green-800 px-2 py-1 rounded">
          80% Efficiency
        </span>
        <span class="bg-red-100 text-red-800 px-2 py-1 rounded">
          20% Inefficiency
        </span>
        <button class="text-pink-600 underline ml-auto sm:ml-0">Refresh</button>
      </div>

      <!-- Bug List -->
      <div class="max-h-[300px] overflow-y-auto overflow-x-hidden">
        <table class="w-full table-auto border-t border-gray-200 min-w-[600px]">
          <thead class="text-sm text-left text-gray-500">
            <tr>
              <th class="py-2 px-4">BUG</th>
              <th class="py-2 px-4">STATUS</th>
              <th class="py-2 px-4">CREATED</th>
              <th class="py-2 px-4">DUE</th>
              <th class="py-2 px-4">REPORTER</th>
            </tr>
          </thead>
          <tbody class="text-sm">
            <tr
              v-for="bug in filteredBugs"
              :key="bug.id"
              class="border-b border-gray-100 hover:bg-gray-50"
            >
              <td class="px-4 py-3">
                <div class="font-semibold text-pink-700 uppercase text-xs">
                  {{ bug.code }}
                </div>
                <div class="text-gray-800">{{ bug.title }}</div>
                <div class="text-gray-400 text-xs mt-1">{{ bug.project }}</div>
              </td>
              <td class="px-4 py-3">
                <span
                  :class="[
                    'px-2 py-1 rounded-full text-xs font-medium',
                    statusColor(bug.status),
                  ]"
                >
                  {{ bug.status }}
                </span>
              </td>
              <td class="px-4 py-3">{{ formatDate(bug.created) }}</td>
              <td class="px-4 py-3 text-sm text-gray-600">{{ bug.due }}</td>
              <td class="px-4 py-3">
                <div class="flex -space-x-2">
                  <div
                    v-for="user in bug.reporters"
                    :key="user.name"
                    class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ring-2 ring-white"
                    :style="{ backgroundColor: user.color }"
                    :title="user.name"
                  >
                    {{ getInitials(user.name) }}
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal -->
      <div
        v-if="openModal"
        class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      >
        <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <h2 class="text-lg font-semibold mb-4">Submit Bug</h2>
          <form @submit.prevent="submitBug" class="flex flex-col gap-3">
            <input
              v-model="form.title"
              placeholder="Bug Title"
              class="w-full border p-2 rounded"
            />
            <select v-model="form.status" class="w-full border p-2 rounded">
              <option>Open</option>
              <option>In Progress</option>
              <option>Blocked</option>
              <option>Failed QA</option>
              <option>Complete</option>
            </select>
            <input
              v-model="form.due"
              placeholder="Due (e.g., 3 days later)"
              class="w-full border p-2 rounded"
            />
            <div class="flex gap-2 justify-end">
              <button
                class="bg-pink-600 text-white px-4 py-2 rounded"
                type="submit"
              >
                Add Bug
              </button>
              <button
                @click="openModal = false"
                type="button"
                class="text-sm text-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed } from "vue";
import Layout from "./Layout.vue";

const openModal = ref(false);
const selectedStatus = ref("All");

const bugs = ref([
  {
    id: 1,
    code: "MER23",
    title: "Logo redesign",
    project: "Mercury App",
    status: "Failed QA",
    created: "2025-07-03",
    due: "5 days left",
    reporters: [{ name: "Ava Kent", color: "#10b981" }],
  },
  {
    id: 2,
    code: "MER24",
    title: "Fix landing page errors",
    project: "Mercury App",
    status: "Blocked",
    created: "2025-07-01",
    due: "2 days late",
    reporters: [{ name: "John Doe", color: "#f97316" }],
  },
  {
    id: 3,
    code: "MER25",
    title: "Setup staging server",
    project: "Mercury App",
    status: "Open",
    created: "2025-07-02",
    due: "Due tomorrow",
    reporters: [{ name: "Lily Ray", color: "#6366f1" }],
  },
  {
    id: 4,
    code: "MER26",
    title: "QA Testing for new build",
    project: "Mercury App",
    status: "In Progress",
    created: "2025-07-03",
    due: "3 days left",
    reporters: [{ name: "Mike Tee", color: "#3b82f6" }],
  },
  {
    id: 5,
    code: "MER27",
    title: "Implement dark mode",
    project: "Mercury App",
    status: "Complete",
    created: "2025-07-04",
    due: "Done",
    reporters: [{ name: "Sam Yin", color: "#ef4444" }],
  },
]);

const form = ref({ title: "", status: "Open", due: "" });

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB");
}

function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("");
}

function statusColor(status) {
  return (
    {
      "Failed QA": "bg-yellow-100 text-yellow-700",
      Blocked: "bg-red-200 text-red-800",
      "In Progress": "bg-blue-100 text-blue-800",
      Complete: "bg-green-100 text-green-700",
      Open: "bg-pink-100 text-pink-700",
    }[status] || "bg-gray-100 text-gray-700"
  );
}

const filteredBugs = computed(() => {
  return selectedStatus.value === "All"
    ? bugs.value
    : bugs.value.filter((b) => b.status === selectedStatus.value);
});

function countByStatus(status) {
  return bugs.value.filter((b) => b.status === status).length;
}

function submitBug() {
  const newId = bugs.value.length + 1;
  bugs.value.push({
    id: newId,
    code: `MER${20 + newId}`,
    title: form.value.title,
    project: "Mercury App",
    status: form.value.status,
    created: new Date().toISOString(),
    due: form.value.due,
    reporters: [{ name: "You", color: "#0ea5e9" }],
  });
  form.value = { title: "", status: "Open", due: "" };
  openModal.value = false;
}
</script>

<script>
export default {
  components: {
    StatCard: {
      props: ["color", "text", "value"],
      template: `
        <div :class="['rounded-md px-4 py-2 flex flex-col items-center text-center text-sm', color]">
          <div class="font-bold text-lg">{{ value }}</div>
          <div>{{ text }}</div>
        </div>
      `,
    },
  },
};
</script>

<style scoped>
body {
  font-family: "Inter", sans-serif;
}
</style>
