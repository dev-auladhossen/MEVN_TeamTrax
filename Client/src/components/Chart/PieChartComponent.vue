<template>
  <Pie :data="chartData" :options="options" />
</template>

<script setup>
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { computed } from "vue";
import { Pie } from "vue-chartjs";

Chart.register(ArcElement, Tooltip, Legend);

// Props for reusability
const props = defineProps({
  labels: { type: Array, required: true },
  values: { type: Array, required: true },
  title: { type: String, default: "Doughnut Chart" },
  colors: {
    type: Array,
    default: () => ["#E46651", "#00D8FF", "#DD1B16", "#41B883"],
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

const options = {
  responsive: true,
  maintainAspectRatio: false,
  height: 300,
};
</script>
