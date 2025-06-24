<template>
  <div class="bg-white rounded-2xl shadow-md p-6 h-full">
    <h2 class="text-lg font-semibold text-gray-700 mb-4">
      Task Status Overview
    </h2>
    <Doughnut :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { Doughnut } from "vue-chartjs";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

// Dummy dataset
const chartData = {
  labels: ["Completed", "In Progress", "Pending", "Overdue"],
  datasets: [
    {
      label: "Tasks",
      backgroundColor: ["#16a34a", "#3b82f6", "#facc15", "#ef4444"],
      data: [40, 25, 20, 5],
      borderRadius: 6,
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        color: "#4b5563",
        boxWidth: 14,
      },
    },
  },
};
</script>
