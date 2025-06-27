<template>
  <Layout>
    <div class="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
      <h2 class="text-2xl font-bold mb-4">Ask Project Insights AI</h2>

      <!-- Prompt input -->
      <form @submit.prevent="submitPrompt" class="flex gap-4 mb-6">
        <input
          v-model="prompt"
          type="text"
          placeholder="e.g., Show all completed tasks by DevOps team"
          class="flex-1 border px-4 py-2 rounded-lg"
        />
        <button
          type="submit"
          class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Ask
        </button>
      </form>

      <!-- Loading -->
      <div v-if="loading" class="text-gray-500">Loading...</div>

      <!-- Error -->
      <div v-if="error" class="text-red-500 mb-4">{{ error }}</div>

      <!-- Results -->
      <div v-if="results.length" class="space-y-6">
        <div
          v-for="(task, index) in results"
          :key="task._id || index"
          class="bg-gray-100 p-4 rounded-xl shadow-sm"
        >
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-lg font-semibold">{{ task.title }}</h3>
            <span
              class="px-2 py-1 text-xs rounded bg-green-200 text-green-800"
              v-if="task.status"
            >
              {{ task.status }}
            </span>
          </div>

          <p class="text-gray-700 mb-2">{{ task.description }}</p>

          <div class="text-sm text-gray-600">
            <p><strong>Priority:</strong> {{ task.priority }}</p>
            <p><strong>Due Date:</strong> {{ formatDate(task.dueDate) }}</p>
            <p><strong>Created At:</strong> {{ formatDate(task.createdAt) }}</p>
          </div>

          <div v-if="task.assignedTo?.length" class="mt-2">
            <p class="text-sm font-medium text-gray-700">Assignees:</p>
            <ul class="flex flex-wrap gap-2 mt-1">
              <li
                v-for="(assignee, i) in cleanAssignees(task.assignedTo)"
                :key="i"
                class="bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded"
              >
                {{ assignee.username }}
                <span class="text-gray-500"
                  >({{ assignee.department || assignee.role || "—" }})</span
                >
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- MongoDB Query -->
      <div v-if="query" class="mt-8">
        <h3 class="font-semibold mb-2">Generated MongoDB Query:</h3>
        <pre class="bg-gray-900 text-green-400 p-4 rounded-xl text-sm">{{
          query
        }}</pre>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import Layout from "../components/Layout.vue";

const prompt = ref("");
const results = ref([]);
const query = ref("");
const error = ref("");
const loading = ref(false);

// Format date to something like "June 27, 2025"
const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Handle mixed 'assignedTo' array (object or just ID)
const cleanAssignees = (arr) => {
  return arr
    .filter((a) => typeof a === "object" && a?.username)
    .map((a) => ({
      username: a.username,
      department: a.department || a.title || a.role || "",
    }));
};

const submitPrompt = async () => {
  error.value = "";
  results.value = [];
  query.value = "";
  loading.value = true;

  try {
    const res = await axios.post("http://localhost:5000/api/analytics", {
      prompt: prompt.value,
    });

    if (res.data.success) {
      results.value = res.data.data || [];
      query.value = res.data.query || "";
    } else {
      error.value = res.data.error || "AI failed to understand your query.";
    }
  } catch (err) {
    error.value = err.message || "Something went wrong.";
  } finally {
    loading.value = false;
  }
};
</script>
