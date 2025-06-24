<template>
  <div class="bg-white rounded-2xl shadow-md p-6 h-full">
    <h2 class="text-lg font-semibold text-gray-700 mb-4">GitHub Summary</h2>

    <div class="grid grid-cols-2 gap-4 mb-4">
      <div
        class="p-4 rounded-xl border border-gray-200 hover:shadow transition cursor-pointer flex items-center justify-between"
        @click="$router.push('/github/repositories')"
      >
        <div>
          <p class="text-sm text-gray-500">Total Repositories</p>
          <p class="text-xl font-bold text-gray-700">12</p>
        </div>
        <font-awesome-icon
          icon="fa-solid fa-code-branch"
          class="text-blue-500 text-2xl"
        />
      </div>
      <div
        class="p-4 rounded-xl border border-gray-200 hover:shadow transition cursor-pointer flex items-center justify-between"
        @click="$router.push('/github/commits')"
      >
        <div>
          <p class="text-sm text-gray-500">Total Commits</p>
          <p class="text-xl font-bold text-gray-700">327</p>
        </div>
        <font-awesome-icon
          icon="fa-solid fa-code-commit"
          class="text-green-500 text-2xl"
        />
      </div>
    </div>

    <h3 class="text-sm text-gray-500 font-semibold mb-2">Recent Activity</h3>
    <ul class="space-y-3 max-h-40 overflow-y-auto pr-2">
      <li
        v-for="(item, index) in recentActivities"
        :key="index"
        class="text-sm text-gray-600 border-b pb-2"
      >
        <span class="font-medium text-blue-600">{{ item.user }}</span>
        {{ item.action }}
        <span class="font-mono text-xs text-gray-500">({{ item.repo }})</span>
        <div class="text-xs text-gray-400">{{ item.time }}</div>
      </li>
    </ul>
  </div>
</template>

<script setup>
const recentActivities = [
  {
    user: "nadia-dev",
    action: "pushed 3 commits to",
    repo: "vue-ui-dashboard",
    time: "2h ago",
  },
  {
    user: "reza-tech",
    action: "created a new repository",
    repo: "express-auth-api",
    time: "4h ago",
  },
  {
    user: "tariq99",
    action: "merged a pull request in",
    repo: "project-collab-tracker",
    time: "6h ago",
  },
  {
    user: "nadia-dev",
    action: "opened issue in",
    repo: "dashboard-enhancement",
    time: "9h ago",
  },
];
</script>
