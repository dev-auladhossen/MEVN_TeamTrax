<!-- components/BarChart.vue -->
<template>
  <div class="w-full h-80">
    <Bar
      :data="chartData"
      :options="chartOptions"
      plugins="[ChartDataLabels]"
    />
  </div>
</template>

<script setup>
import { computed } from "vue";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Chart,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Bar } from "vue-chartjs";

// Register Chart.js modules
Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ChartDataLabels,
  Title,
  Tooltip,
  Legend
);

// Props to make it reusable
const props = defineProps({
  labels: { type: Array, required: true },
  values: { type: Array, required: true },
  title: { type: String, default: "Bar Chart" },
  colors: {
    type: Array,
    default: () => ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
  },
});

// Reactive chart data based on props
const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: props.title,
      backgroundColor: props.colors.slice(0, props.values.length),
      data: props.values,
    },
  ],
}));

// Basic chart options
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
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: props.title,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0,
      },
    },
  },
};
</script>
