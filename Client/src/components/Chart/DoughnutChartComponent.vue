<!-- components/DoughnutChart.vue -->
<template>
  <div class="w-full h-80">
    <Doughnut :data="chartData" :options="chartOptions" plugins="[ChartDataLabels]"s/>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { Chart, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Doughnut } from "vue-chartjs";

// Register required Chart.js elements
Chart.register(ArcElement, Tooltip, Legend, Title);

// Props for reusability
const props = defineProps({
  labels: { type: Array, required: true },
  values: { type: Array, required: true },
  title: { type: String, default: "Doughnut Chart" },
  colors: {
    type: Array,
    default: () => ["#f97316", "#3b82f6", "#10b981", "#8b5cf6", "#f43f5e"],
  },
});

// Dynamically generate chart data
const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      backgroundColor: props.colors.slice(0, props.values.length),
      data: props.values,
    },
  ],
}));

// Chart options with dynamic title
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    datalabels: {
      color: "#fff",
      formatter: (value, context) => {
        const dataset = context.chart.data.datasets[0].data;
        const total = dataset.reduce((a, b) => a + b, 0);
        const percent = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
        return `${percent}%`;
      },
      font: {
        weight: "bold",
        size: 14,
      },
    },
    legend: { position: "top" },
    title: {
      display: true,
      text: props.title,
    },
  },
};
</script>
