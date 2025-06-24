<template>
  <Layout>
    <h1 class="text-xl font-semibold p-4 text-gray-800">Admin Dashboard</h1>
    <div class="p-4 md:p-6 lg:p-4 space-y-6">
      <!-- Top Stats Cards -->
      <StatCard />

      <!-- Charts & Activity Feed -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <TaskChart />
        <ActivityFeed class="lg:col-span-2" />
        <QuickActions />
      </div>

      <!-- Project & Task Tables -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickProjectTable />
        <QuickTaskTable />
      </div>

      <!-- GitHub Summary & Reports Links -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GithubSummary />
        <ReportsQuickLink />
      </div>

      <!-- Team & Actions -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TeamOverview />
      </div></div
  ></Layout>
</template>

<script setup>
// Import section components
import Layout from "../Layout.vue";
import StatCard from "../Dashboards/StatCard.vue";
import TaskChart from "../Dashboards/TaskChart.vue";
import ActivityFeed from "../Dashboards/ActivityFeed.vue";
import QuickProjectTable from "./QuickProjectTable.vue";
import QuickTaskTable from "./QuickTaskTable.vue";
import GithubSummary from "./GithubSummary.vue";
import ReportsQuickLink from "./ReportsQuickLink.vue";
import TeamOverview from "./TeamOverview.vue";
import QuickActions from "./QuickActions.vue";
</script>

<style scoped>
/* Optional: Scoped layout styling if needed */
</style>
