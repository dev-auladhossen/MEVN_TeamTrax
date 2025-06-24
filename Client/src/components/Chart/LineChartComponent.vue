<template>
  <Line :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { computed } from "vue";
import { Line } from "vue-chartjs";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const props = defineProps({
  labels: Array,
  values: Array,
  title: {
    type: String,
    default: "",
  },
  colors: {
    type: Array,
    default: () => ["#10b981"],
  },
});

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: props.title,
      data: props.values,
      fill: false,
      borderColor: props.colors[0],
      backgroundColor: props.colors[0],
      tension: 0.3,
    },
  ],
}));

const chartOptions = computed(() => ({
  responsive: true,
  plugins: {
    legend: {
      display: true,
    },
    title: {
      display: !!props.title,
      text: props.title,
    },
  },
  scales: {
    y: {
      // beginAtZero: true,
      max: 100,

      title: {
        display: true,
        text: "Progress (%)",
      },
    },
    y: {
      beginAtZero: true,
      max: 100,
      stepSize: 10,
      title: {
        display: true,
        text: "Progress (%)",
      },
      ticks: {
        callback: function (value) {
          return value + "%"; // ✅ add % sign to each tick label
        },
        stepSize: 10, // ✅ force steps of 10%
      },
    },
    x: {
      title: {
        display: true,
        text: "Date",
      },
    },
  },
}));
</script>
