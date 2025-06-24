<template>
  <div class="max-w-full mx-auto"> 
    <div class="w-full bg-white shadow rounded-xl p-4">
      <div class="flex justify-between p-6">
        <div>
          <span class="font-bold">Project Title:</span>
          {{ report.projectName }}
        </div>
        <div><span class="font-bold">Status:</span> {{ report.status }}</div>
        <div>
          <span class="font-bold">Manager:</span>
          {{ report?.manager?.name }}
        </div>
        <div>
          <span class="font-bold">Duration:</span>
          {{ formatDate(report.startDate) }} - {{ formatDate(report.endDate) }}
        </div>
      </div>
      <div class="flex flex-wrap mx-2">
        <div class="w-full sm:w-1/2 lg:w-1/2 p-2">
          <div class="bg-white border rounded-lg p-4">
            <DoughnutChartComponent
              :labels="chartLabels"
              :values="chartValues"
              title="Task Status Report"
              :colors="['#60a5fa', '#f87171', '#fbbf24', '#10b981']"
            />
          </div>
        </div>
        <div class="w-full sm:w-1/2 lg:w-1/2 p-2">
          <div class="bg-white border rounded-lg p-4">
            <LineChartComponent
              :labels="progressLabels"
              :values="progressValues"
              title="Project Progress Over Time"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { fetchProjectSummary } from "../Services/projectReport";
import { useRoute } from "vue-router";
import BarChartComponent from "../Chart/BarChartComponent.vue";
import DoughnutChartComponent from "../Chart/DoughnutChartComponent.vue";
import LineChartComponent from "../Chart/LineChartComponent.vue";

const route = useRoute();

const props = defineProps({
  projectId: {
    type: String,
    required: true,
  },
});

const report = ref({});
const chartLabels = ref([]);
const chartValues = ref([]);

const progressLabels = ref([]);
const progressValues = ref([]);

const loadReport = async () => {
  try {
    report.value = await fetchProjectSummary(props.projectId);
    console.log("report.value", report.value);
    chartLabels.value = Object.keys(report.value.taskStatusBreakdown);
    chartValues.value = Object.values(report.value.taskStatusBreakdown);

    // Load progress-over-time line chart data
    const res = await fetch(
      `http://localhost:5000/api/projects/${props.projectId}/progress-history`
    );
    const progressData = await res.json();
    console.log("progressData", progressData);
    progressLabels.value = progressData.map((item) =>
      new Date(item.date).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    );
    progressValues.value = progressData.map((item) => item.progress);
  } catch (err) {
    console.error("Error loading report:", err);
  }
};

const formatDate = (date) => new Date(date).toLocaleDateString();

onMounted(() => {
  loadReport();
});
</script>
