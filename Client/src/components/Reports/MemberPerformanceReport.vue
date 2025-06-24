<template>
  <div class="p-4 bg-white rounded shadow">
    <h2 class="text-xl font-semibold mb-4">Member Performance Report</h2>

    <!-- Filters -->
    <div class="flex flex-wrap justify-between">
      <div class="flex flex-wrap gap-4 mb-6 items-end">
        <div>
          <label class="text-sm font-medium block">Project</label>
          <select
            v-model="filters.projectId"
            class="border px-2 py-1 rounded w-52"
          >
            <option value="">All Projects</option>
            <option v-for="proj in projects" :key="proj._id" :value="proj._id">
              {{ proj.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="text-sm font-medium block">Start Date</label>
          <input
            type="date"
            v-model="filters.startDate"
            class="border px-2 py-1 rounded"
          />
        </div>

        <div>
          <label class="text-sm font-medium block">End Date</label>
          <input
            type="date"
            v-model="filters.endDate"
            class="border px-2 py-1 rounded"
          />
        </div>

        <button
          @click="fetchReport"
          class="bg-blue-600 text-white px-3 py-2 rounded text-sm"
        >
          Apply Filters
        </button>
      </div>

      <div class="flex justify-end gap-2 my-2">
        <button @click="exportCSV" class="p-2">
          <font-awesome-icon class="text-green-500 text-2xl" icon="file-csv" />
        </button>
        <button @click="exportPDF" class="p-2">
          <font-awesome-icon class="text-red-500 text-2xl" icon="file-pdf" />
        </button>
        <button @click="exportImage" class="p-2">
          <font-awesome-icon class="text-blue-500 text-2xl" icon="image" />
        </button>
      </div>
    </div>

    <!-- Table View -->
    <table id="report-content" class="w-full text-sm border mt-4">
      <thead class="bg-gray-100">
        <tr>
          <th class="border px-2 py-2">Name</th>
          <th class="border px-2 py-2">Total Tasks</th>
          <th class="border px-2 py-2">Completed</th>
          <th class="border px-2 py-2">Overdue</th>
          <th class="border px-2 py-2">On-Time %</th>
          <th class="border px-2 py-2">Avg Completion Days</th>
          <th class="border px-2 py-2">Performance</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="member in report" :key="member.name">
          <td class="border px-2 py-2">{{ member.name }}</td>
          <td class="border px-2 py-2">{{ member.totalTasks }}</td>
          <td class="border px-2 py-2">{{ member.completed }}</td>
          <td class="border px-2 py-2">{{ member.overdue }}</td>
          <td class="border px-2 py-2">{{ member.onTimeRate }}%</td>
          <td class="border px-2 py-2">
            {{ member.avgCompletionDays || "N/A" }}
          </td>
          <td class="border px-2 py-2">
            <span
              :class="{
                'text-green-600 font-semibold': member.performance === 'Good',
                'text-yellow-600': member.performance === 'Average',
                'text-red-600': member.performance === 'Poor',
              }"
            >
              {{ member.performance }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- No Results Message -->
    <div v-if="noResult" class="text-center py-8 text-gray-500 italic">
      No member data found for the selected filters.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useExportReport } from "../Composables/useExportReport";
import { exportToCSV } from "../Composables/useExportToCSV";
const { exportPDF, exportImage, exportExcel } = useExportReport();

const report = ref([]);
const projects = ref([]);
const filters = ref({
  projectId: "",
  startDate: "",
  endDate: "",
});
const loading = ref(false);
const noResult = ref(false);

const exportCSV = async () => {
  exportToCSV(report.value, "project-summary.csv");
};

const fetchProjects = async () => {
  const res = await fetch("http://localhost:5000/api/projects");
  const data = await res.json();
  projects.value = data;
};

const fetchReport = async () => {
  loading.value = true;
  noResult.value = false;
  report.value = [];

  try {
    const params = new URLSearchParams();
    if (filters.value.projectId)
      params.append("projectId", filters.value.projectId);
    if (filters.value.startDate)
      params.append("startDate", filters.value.startDate);
    if (filters.value.endDate) params.append("endDate", filters.value.endDate);

    const res = await fetch(
      `http://localhost:5000/api/member-performance?${params}`
    );
    const data = await res.json();

    if (data.performance && data.performance.length > 0) {
      report.value = data.performance;
    } else {
      noResult.value = true;
    }
  } catch (err) {
    console.error("Failed to fetch report:", err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchProjects();
  fetchReport();
});
</script>
