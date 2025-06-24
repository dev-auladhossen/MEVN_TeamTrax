<template>
  <div class="bg-white p-6 rounded-xl shadow mt-6 w-full max-w-4xl mx-auto">
    <h2 class="text-xl font-semibold text-gray-800 mb-4">
      Top Performers (by Completed Tasks)
    </h2>

    <!-- Loader -->
    <div v-if="loading" class="text-center py-10 text-gray-500">
      Loading performance data...
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-red-600 text-center">{{ error }}</div>

    <!-- No data -->
    <div v-else-if="!filtered.length" class="text-center text-gray-500">
      No performance data available to display chart.
    </div>

    <!-- Top performer info -->
    <div v-else>
      <div class="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
        <p class="text-green-800 font-medium">
          🏆 Top Performer: <strong>{{ topPerformer.name }}</strong> with
          <strong>{{ topPerformer.completed }}</strong> completed task<span
            v-if="topPerformer.completed > 1"
            >s</span
          >.
        </p>
      </div>

      <!-- Chart -->
      <Pie :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { Pie } from "vue-chartjs";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import axios from "axios";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const performance = ref([]);
const loading = ref(true);
const error = ref(null);

// Fetch data on mount
onMounted(async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/member-performance"); 
    performance.value = res.data.performance;
  } catch (err) {
    error.value = "Failed to load performance data.";
    console.error(err);
  } finally {
    loading.value = false;
  }
});

// Filter: members who have at least one completed task
const filtered = computed(() => {
  return performance.value.filter((m) => m.completed > 0);
});

// Top performer: highest completed tasks
const topPerformer = computed(() => {
  if (!filtered.value.length) return null;
  return [...filtered.value].sort((a, b) => b.completed - a.completed)[0];
});

// Chart data
const chartData = computed(() => ({
  labels: filtered.value.map((m) => m.name),
  datasets: [
    {
      label: "Completed Tasks",
      data: filtered.value.map((m) => m.completed),
      backgroundColor: [
        "#3b82f6",
        "#10b981",
        "#f59e0b",
        "#ef4444",
        "#8b5cf6",
        "#0ea5e9",
        "#14b8a6",
        "#eab308",
        "#22c55e",
        "#f43f5e",
        "#a855f7",
      ],
      borderColor: "#ffffff",
      borderWidth: 2,
    },
  ],
}));

// Chart config
const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "right",
    },
    title: {
      display: true,
      text: "Task Completion Share by Team Member",
      font: {
        size: 16,
      },
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const label = context.label || "";
          const value = context.raw;
          return `${label}: ${value} completed`;
        },
      },
    },
  },
};
</script>
