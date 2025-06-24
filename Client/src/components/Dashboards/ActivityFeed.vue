<template>
  <div class="bg-white rounded-2xl shadow-md p-6 h-full flex flex-col">
    <h2 class="text-lg font-semibold text-gray-700 mb-4">Recent Activities</h2>
    <div class="space-y-4 overflow-y-auto max-h-80 pr-2">
      <div
        v-for="(activity, index) in activities"
        :key="index"
        class="flex items-start gap-3 border-b pb-3 last:border-b-0 last:pb-0"
      >
        <div class="p-2 rounded-full text-white" :class="activity.color">
          <font-awesome-icon :icon="activity.icon" />
        </div>
        <div>
          <p class="text-sm text-gray-700">
            <span class="font-medium">{{ activity.user }}</span>
            {{ activity.action }}
            <span class="font-medium text-gray-600">{{ activity.target }}</span>
          </p>
          <p class="text-xs text-gray-400">{{ activity.time }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const activities = [
  {
    user: "Nadia",
    action: " created task ",
    target: '"UI Design for Dashboard"',
    time: "2 minutes ago",
    icon: "clipboard-list",
    color: "bg-blue-500",
  },
  {
    user: "Reza",
    action: " marked task ",
    target: '"Database Setup"',
    time: "15 minutes ago",
    icon: "circle-check",
    color: "bg-green-500",
  },
  {
    user: "Admin",
    action: " deleted project ",
    target: '"Old CRM Migration"',
    time: "1 hour ago",
    icon: "trash-can",
    color: "bg-red-500",
  },
  {
    user: "Tariq",
    action: " commented on ",
    target: '"Frontend Task"',
    time: "2 hours ago",
    icon: "comment",
    color: "bg-yellow-500",
  },
];
</script>
