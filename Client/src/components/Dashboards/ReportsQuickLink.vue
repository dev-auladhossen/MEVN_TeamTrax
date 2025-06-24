<template>
  <div class="bg-white rounded-2xl shadow-md p-6 h-full">
    <h2 class="text-lg font-semibold text-gray-700 mb-4">Quick Report Access</h2>
    <ul class="space-y-3">
      <li
        v-for="report in reports"
        :key="report.id"
        class="flex items-center justify-between hover:bg-gray-50 p-3 rounded-lg transition cursor-pointer"
        @click="$router.push(report.route)"
      >
        <div class="flex items-center space-x-3">
          <font-awesome-icon :icon="report.icon" class="text-blue-500 text-lg" />
          <span class="text-gray-700 text-sm font-medium">{{ report.label }}</span>
        </div>
        <font-awesome-icon icon="fa-solid fa-arrow-up-right-from-square" class="text-gray-400 text-xs" />
      </li>
    </ul>
  </div>
</template>

<script setup>
const reports = [
  { id: 1, label: 'Project Summary', route: '/reports/summary', icon: 'fa-solid faTableCellsLarge' },
  { id: 2, label: 'Task Progress', route: '/reports/task-progress', icon: 'fa-solid faTimeline' },
  { id: 3, label: 'Team Activity', route: '/reports/team-activity', icon: 'fa-solid faPeopleGroup' },
  { id: 4, label: 'User Allocation', route: '/reports/user-allocation', icon: 'fa-solid faClipboardList' },
  { id: 5, label: 'GitHub Repos', route: '/reports/github', icon: 'fa-solid faCode' },
];
</script>
