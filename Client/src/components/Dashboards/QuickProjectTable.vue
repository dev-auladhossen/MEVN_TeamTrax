<template>
  <div class="bg-white rounded-2xl shadow-md p-6 h-full">
    <h2 class="text-lg font-semibold text-gray-700 mb-4">Active Projects</h2>
    <div class="overflow-x-auto">
      <table class="min-w-full text-sm text-left text-gray-600">
        <thead class="bg-gray-100 text-gray-700 text-xs uppercase">
          <tr>
            <th class="px-4 py-3">Project</th>
            <th class="px-4 py-3">Status</th>
            <th class="px-4 py-3">Members</th>
            <th class="px-4 py-3">Updated</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(project, index) in projects"
            :key="index"
            class="border-b hover:bg-gray-50 transition"
          >
            <td class="px-4 py-2 font-medium">{{ project.name }}</td>
            <td class="px-4 py-2">
              <span
                class="px-2 py-1 rounded-full text-xs font-semibold"
                :class="project.statusColor"
              >
                {{ project.status }}
              </span>
            </td>
            <td class="px-4 py-2">
              <div class="flex -space-x-2">
                <img
                  v-for="(member, mIndex) in project.members"
                  :key="mIndex"
                  :src="member.avatar"
                  class="w-6 h-6 rounded-full border-2 border-white"
                  :alt="member.name"
                />
              </div>
            </td>
            <td class="px-4 py-2 text-xs text-gray-400">{{ project.updated }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
const projects = [
  {
    name: 'Student Portal Revamp',
    status: 'In Progress',
    statusColor: 'bg-blue-100 text-blue-600',
    updated: '3 hours ago',
    members: [
      { name: 'Nadia', avatar: 'https://i.pravatar.cc/40?img=1' },
      { name: 'Reza', avatar: 'https://i.pravatar.cc/40?img=2' },
    ],
  },
  {
    name: 'Library System Upgrade',
    status: 'Completed',
    statusColor: 'bg-green-100 text-green-600',
    updated: '1 day ago',
    members: [
      { name: 'Ali', avatar: 'https://i.pravatar.cc/40?img=3' },
      { name: 'Rumi', avatar: 'https://i.pravatar.cc/40?img=4' },
    ],
  },
  {
    name: 'AI Research Tools',
    status: 'Pending',
    statusColor: 'bg-yellow-100 text-yellow-600',
    updated: '5 days ago',
    members: [{ name: 'Tariq', avatar: 'https://i.pravatar.cc/40?img=5' }],
  },
];
</script>
