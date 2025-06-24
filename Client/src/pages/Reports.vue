<template>
  <Layout>
    <div class="w-full px-4">
      <div class="w-full p-2">
        <div class="bg-white rounded-lg">
          <MemberPerformanceReport></MemberPerformanceReport>
        </div>
      </div>
      <div class="w-full p-2">
        <div class="bg-white shadow-sm rounded-lg p-4">
          <OverdueTasksReport></OverdueTasksReport>
        </div>
      </div>
      <div class="w-full p-2">
        <div class="bg-white shadow-sm rounded-lg p-4">
          <DelayedTaskReport></DelayedTaskReport>
        </div>
      </div>

      <div class="flex flex-wrap mx-2">
        <div class="w-full sm:w-1/2 lg:w-1/2 p-2">
          <div class="bg-white rounded-lg">
            <TopPerformerReport></TopPerformerReport>
          </div>
        </div>
        <div class="w-full sm:w-1/2 lg:w-1/2 p-2">
          <div class="bg-white rounded-lg">
            <IndividualPerformanceReport></IndividualPerformanceReport>
          </div>
        </div>
        <div class="w-full sm:w-1/2 lg:w-1/2 p-2">
          <div class="bg-white shadow-sm rounded-lg p-4">
            <BarChartComponent
              :labels="['Completed', 'In Progress', 'Pending', 'Review']"
              :values="[80, 6, 20, 30]"
              title="Task Distribution"
              :colors="['#E46651', '#00D8FF', '#DD1B16', '#41B883']"
            />
          </div>
        </div>
        <div class="w-full sm:w-1/2 lg:w-1/2 p-2">
          <div class="bg-white shadow-sm rounded-lg p-4">
            <LineChartComponent
              :labels="['Completed', 'In Progress', 'Pending', 'Review']"
              :values="[20, 6, 80, 30]"
              title="Task Distribution"
              :colors="['#E46651', '#00D8FF', '#DD1B16', '#41B883']"
            />
          </div>
        </div>
        <div class="w-full sm:w-1/2 lg:w-1/2 p-2">
          <div class="bg-white shadow-sm rounded-lg p-4">
            <DoughnutChartComponent
              :labels="['Completed', 'In Progress', 'Pending', 'Review']"
              :values="[20, 6, 80, 30]"
              title="Task Distribution"
              :colors="['#E46651', '#00D8FF', '#DD1B16', '#41B883']"
            />
          </div>
        </div>
        <div class="w-full sm:w-1/2 lg:w-1/2 p-2">
          <div class="bg-white shadow-sm rounded-lg p-4">
            <PieChartComponent
              :labels="['Completed', 'In Progress', 'Pending', 'Review']"
              :values="[20, 6, 80, 30]"
              title="Task Distribution"
              :colors="['#E46651', '#00D8FF', '#DD1B16', '#41B883']"
            />
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
<script setup>
import { ref } from "vue";
import Layout from "../components/Layout.vue";
import BarChartComponent from "../components/Chart/BarChartComponent.vue";
import LineChartComponent from "../components/Chart/LineChartComponent.vue";
import DoughnutChartComponent from "../components/Chart/DoughnutChartComponent.vue";
import PieChartComponent from "../components/Chart/PieChartComponent.vue";
import { useRoute } from "vue-router";
import DelayedTaskReport from "../components/Reports/DelayedTaskReport.vue";
import OverdueTasksReport from "../components/Reports/OverdueTasksReport.vue";
import MemberPerformanceReport from "../components/Reports/MemberPerformanceReport.vue";
import IndividualPerformanceReport from "../components/Reports/IndividualPerformanceReport.vue";
import TopPerformerReport from "../components/Reports/TopPerformerReport.vue";
</script>
<style scoped></style>
