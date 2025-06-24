<template>
  <div class="p-4">
    <div class="flex justify-between items-center">
      <h2 class="text-lg font-bold mb-4 text-red-600">Delayed Tasks</h2>
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
    <div v-if="delayedTasks.length" class="overflow-x-auto">
      <table
        id="report-content"
        class="w-full border border-gray-300 text-sm text-left"
      >
        <thead class="bg-gray-100">
          <tr>
            <th class="border px-2 py-1">Task</th>
            <th class="border px-2 py-1">Status</th>
            <th class="border px-2 py-1">Assignee</th>
            <th class="border px-2 py-1">Due Date</th>
            <th class="border px-2 py-1 text-red-600">Overdue (days)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in delayedTasks" :key="task._id" class="bg-red-50">
            <td class="border px-2 py-1">{{ task.title }}</td>
            <td class="border px-2 py-1">{{ task.status }}</td>
            <td v-if="task.assignedTo" class="border px-2 py-1">
              <div v-for="(assignee, indx) in task.assignedTo">
                {{ assignee?.username || "Unassigned" }},
                <span> </span>
              </div>
            </td>
            <td class="border px-2 py-1">{{ formatDate(task.dueDate) }}</td>
            <td class="border px-2 py-1 text-red-600 font-semibold">
              {{ calculateOverdueDays(task.dueDate) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="text-green-600 font-semibold">
      ✅ No delayed tasks found globally!
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { isBefore, format, differenceInDays } from "date-fns";
import { useExportReport } from "../Composables/useExportReport";
import { exportToCSV } from "../Composables/useExportToCSV";
const { exportPDF, exportImage, exportExcel } = useExportReport();

const delayedTasks = ref([]);

const exportCSV = async () => {
  exportToCSV(delayedTasks.value, "project-summary.csv");
};

const formatDate = (date) => format(new Date(date), "PP");
const calculateOverdueDays = (dueDate) =>
  Math.max(differenceInDays(new Date(), new Date(dueDate)), 0);

const fetchAllTasks = async () => {
  const { data } = await axios.get("http://localhost:5000/api/tasks/all");
  console.log("data", data);
  const today = new Date();

  delayedTasks.value = data.filter((task) => {
    if (!task.dueDate) return false;
    const due = new Date(task.dueDate);
    return isBefore(due, today) && task.status !== "Completed";
  });
};

onMounted(fetchAllTasks);
</script>
