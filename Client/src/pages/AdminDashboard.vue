<template>
  <Layout>
    <div class="w-full px-4">
      <div class="w-full p-2">
        <div class="bg-white shadow-sm rounded-lg p-4">
          <DelayedTaskReport></DelayedTaskReport>
        </div>
      </div>
      <div class="w-full p-2">
        <div class="bg-white shadow-sm rounded-lg p-4">
          <OverdueTasksReport></OverdueTasksReport>
        </div>
      </div>
      <div class="flex flex-wrap mx-2">
        <div class="w-full sm:w-1/2 lg:w-1/2 p-2">
          <div class="bg-white shadow-sm rounded-lg p-4">
            <BarChartComponent
              :labels="['Completed', 'In Progress', 'Pending']"
              :values="[12, 6, 2]"
              title="Task Distribution"
              :colors="['#10b981', '#3b82f6', '#f59e0b']"
            />
          </div>
        </div>
        <div class="w-full sm:w-1/2 lg:w-1/2 p-2">
          <div class="bg-white shadow-sm rounded-lg p-4">
            <LineChartComponent />
          </div>
        </div>
        <div class="w-full sm:w-1/2 lg:w-1/2 p-2">
          <div class="bg-white shadow-sm rounded-lg p-4">
            <DoughnutChartComponent
              :labels="['Completed', 'In Progress', 'Pending']"
              :values="[12, 6, 2]"
              title="Task Distribution"
              :colors="['#10b981', '#3b82f6', '#f59e0b']"
            />
          </div>
        </div>
        <div class="w-full sm:w-1/2 lg:w-1/2 p-2">
          <div class="bg-white shadow-sm rounded-lg p-4">
            <PieChartComponent />
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
<script setup>
import { useAuth } from "../utils/auth";
const { logout } = useAuth();
import { ref } from "vue";
import Sidebar from "../components/Sidebar.vue";
import Topbar from "../components/Topbar.vue";
import Layout from "../components/Layout.vue";
import ProjectSummaryReport from "../components/Reports/ProjectSummaryReport.vue";
import BarChartComponent from "../components/Chart/BarChartComponent.vue";
import LineChartComponent from "../components/Chart/LineChartComponent.vue";
import DoughnutChartComponent from "../components/Chart/DoughnutChartComponent.vue";
import PieChartComponent from "../components/Chart/PieChartComponent.vue";
import { useRoute } from "vue-router";
import DelayedTaskReport from "../components/Reports/DelayedTaskReport.vue";
import OverdueTasksReport from "../components/Reports/OverdueTasksReport.vue";

const route = useRoute();

const isSidebarOpen = ref(true);
const toggleSidebar = () => (isSidebarOpen.value = !isSidebarOpen.value);

const role = ref("admin"); // 'admin' | 'projectManager' | 'developer'
</script>
<style scoped></style>
