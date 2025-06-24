<template>
  <div class="bg-white rounded-2xl shadow-md p-6 h-full">
    <h2 class="text-lg font-semibold text-gray-700 mb-4">Recent Tasks</h2>
    <div class="overflow-x-auto">
      <table class="min-w-full text-sm text-left text-gray-600">
        <thead class="bg-gray-100 text-gray-700 text-xs uppercase">
          <tr>
            <th class="px-4 py-3">Title</th>
            <th class="px-4 py-3">Priority</th>
            <th class="px-4 py-3">Status</th>
            <th class="px-4 py-3">Assigned To</th>
            <th class="px-4 py-3">Due</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(task, index) in tasks"
            :key="index"
            class="border-b hover:bg-gray-50 transition"
          >
            <td class="px-4 py-2 font-medium">{{ task.title }}</td>
            <td class="px-4 py-2">
              <span
                class="text-xs font-semibold px-2 py-1 rounded-full"
                :class="task.priorityColor"
              >
                {{ task.priority }}
              </span>
            </td>
            <td class="px-4 py-2 text-xs">
              <span
                class="px-2 py-1 rounded-full text-xs font-semibold"
                :class="task.statusColor"
              >
                {{ task.status }}
              </span>
            </td>
            <td class="px-4 py-2">
              <div class="flex items-center gap-2">
                <img
                  :src="task.assigned.avatar"
                  class="w-6 h-6 rounded-full border-2 border-white"
                  :alt="task.assigned.name"
                />
                <span class="text-sm">{{ task.assigned.name }}</span>
              </div>
            </td>
            <td class="px-4 py-2 text-xs text-gray-400">{{ task.due }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
const tasks = [
  {
    title: 'Design login page',
    priority: 'High',
    priorityColor: 'bg-red-100 text-red-600',
    status: 'In Progress',
    statusColor: 'bg-blue-100 text-blue-600',
    assigned: {
      name: 'Nadia',
      avatar: 'https://i.pravatar.cc/40?img=8',
    },
    due: 'Jun 28',
  },
  {
    title: 'API endpoint testing',
    priority: 'Medium',
    priorityColor: 'bg-yellow-100 text-yellow-700',
    status: 'Pending',
    statusColor: 'bg-yellow-100 text-yellow-700',
    assigned: {
      name: 'Reza',
      avatar: 'https://i.pravatar.cc/40?img=9',
    },
    due: 'Jun 30',
  },
  {
    title: 'Setup MongoDB indexes',
    priority: 'Low',
    priorityColor: 'bg-green-100 text-green-600',
    status: 'Completed',
    statusColor: 'bg-green-100 text-green-600',
    assigned: {
      name: 'Tariq',
      avatar: 'https://i.pravatar.cc/40?img=10',
    },
    due: 'Jun 24',
  },
];
</script>
