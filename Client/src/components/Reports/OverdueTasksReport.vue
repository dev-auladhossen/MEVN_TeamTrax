<template>
  <div class="bg-white p-4 rounded shadow">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-semibold">Overdue Tasks</h2>
      <div>
        <label class="mr-2 font-medium">View by:</label>
        <select v-model="viewMode" class="border px-2 py-1 rounded">
          <option value="project">Project</option>
          <option value="assignee">Assignee</option>
        </select>
      </div>
    </div>

    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

// Dummy data - Replace with real API call logic
const overdueByProject = [
  { name: 'Project A', count: 5 },
  { name: 'Project B', count: 2 },
  { name: 'Project C', count: 7 },
];

const overdueByAssignee = [
  { name: 'Alice', count: 6 },
  { name: 'Bob', count: 2 },
  { name: 'Charlie', count: 4 },
];

const viewMode = ref('project');

const currentData = computed(() => {
  return viewMode.value === 'project' ? overdueByProject : overdueByAssignee;
});

const chartData = computed(() => ({
  labels: currentData.value.map(item => item.name),
  datasets: [
    {
      label: 'Overdue Tasks',
      data: currentData.value.map(item => item.count),
      backgroundColor: '#ef4444',
    },
  ],
}));

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    title: { display: false },
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Tasks',
      },
    },
    x: {
      title: {
        display: true,
        text: viewMode.value === 'project' ? 'Projects' : 'Assignees',
      },
    },
  },
};
</script>

<style scoped>
select:focus {
  outline: none;
  border-color: #3b82f6;
}
</style>
