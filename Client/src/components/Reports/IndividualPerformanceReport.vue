<template>
  <div class="bg-white p-6 rounded shadow mt-6">
    <h2 class="text-lg font-semibold mb-4">Team Member Performance</h2>

    <Bar :data="chartData" :options="chartOptions" v-if="report?.length" />

    <p v-else class="text-center text-gray-500">No performance data found.</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import axios from "axios";

// Register chart components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const report = ref([]);
// Create chart data dynamically
const chartData = computed(() => {
  return {
    labels: report.value.map((m) => m.name),
    datasets: [
      {
        label: "Completed",
        backgroundColor: "#10b981", // Tailwind emerald-500
        data: report.value.map((m) => m.completed),
      },
      {
        label: "Overdue",
        backgroundColor: "#ef4444", // Tailwind red-500
        data: report.value.map((m) => m.overdue),
      },
    ],
  };
});

// Chart config
const chartOptions = {
  responsive: true,
  plugins: {
    legend: { position: "top" },
    title: { display: true, text: "Completed vs Overdue Tasks by Member" },
  },
  scales: {
    x: { stacked: true },
    y: { stacked: true, beginAtZero: true },
  },
};

const fetchReport = async () => {
  const res = await axios.get("http://localhost:5000/api/member-performance");
  report.value = res.data.performance;
  console.log("report value", report.value);
};

onMounted(() => {
  fetchReport();
});
</script>
