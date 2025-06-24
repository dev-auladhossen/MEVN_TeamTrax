<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold">Overdue Tasks Report</h2>
      <button
        @click="switchType"
        class="px-3 py-1 bg-blue-500 text-white rounded text-sm"
      >
        Switch to {{ chartType === "project" ? "Assignee" : "Project" }} View
      </button>
    </div>

    <Bar
      :data="chartData"
      :options="chartOptions"
      class="max-h-[400px] h-[300px] w-full"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
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
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ChartDataLabels
);

const chartType = ref("project"); // 'project' or 'assignee'
const rawData = ref({ byProject: {}, byAssignee: {} });

const chartData = ref({
  labels: [],
  datasets: [
    {
      label: "Overdue Tasks",
      backgroundColor: "#f87171",
      data: [],
    },
  ],
});

const chartOptions = {
  responsive: true,
  plugins: {
    datalabels: {
      color: "white", // ✅ label color
      anchor: "end",
      align: "start",
      font: {
        weight: "bold",
        size: 12,
      },
      formatter: Math.round,
    },
    legend: { display: false },
    title: {
      display: true,
      text: "Overdue Tasks",
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: "Number of Overdue Tasks",
      },
      ticks: {
        stepSize: 1,
      },
    },
    x: {
      title: {
        display: true,
        text: "Project or Assignee",
      },
    },
  },
};
watch(chartType, () => {
  console.log("rawData.value", rawData.value);
  updateChart();
});

const fetchData = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/reports/overdue-tasks");
    const data = await res.json();
    console.log("Fetched Overdue Tasks:", data);
    rawData.value = data;
    updateChart(); // initial render
  } catch (err) {
    console.error("Failed to fetch overdue tasks:", err);
  }
};

const updateChart = () => {
  const source =
    chartType.value === "project"
      ? rawData.value.byProject
      : rawData.value.byAssignee;

  if (!source || Object.keys(source).length === 0) {
    chartData.value = {
      labels: [],
      datasets: [
        {
          label: "Overdue Tasks",
          backgroundColor: "#f87171",
          data: [],
        },
      ],
    };
    return;
  }

  chartData.value = {
    labels: Object.keys(source),
    datasets: [
      {
        label: "Overdue Tasks",
        backgroundColor: "#f87171",
        data: Object.values(source),
      },
    ],
  };
};

const switchType = () => {
  chartType.value = chartType.value === "project" ? "assignee" : "project";
  updateChart();
};

onMounted(fetchData);
</script>
