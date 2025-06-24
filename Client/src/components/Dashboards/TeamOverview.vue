<template>
  <div class="bg-white rounded-2xl shadow-md p-6 h-full">
    <h2 class="text-lg font-semibold text-gray-700 mb-4">Team Overview</h2>
    <ul class="divide-y divide-gray-100">
      <li
        v-for="member in team"
        :key="member.id"
        class="flex items-center justify-between py-3"
      >
        <div class="flex items-center space-x-3">
          <img
            :src="member.avatar"
            alt="avatar"
            class="w-10 h-10 rounded-full border border-gray-300"
          />
          <div>
            <p class="text-sm font-medium text-gray-800">{{ member.name }}</p>
            <p class="text-xs text-gray-500">{{ member.role }}</p>
          </div>
        </div>
        <span
          class="inline-block px-2 py-1 text-xs rounded-full font-semibold"
          :class="member.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'"
        >
          {{ member.status }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup>
const team = [
  {
    id: 1,
    name: 'Tanvir A.',
    role: 'Project Manager',
    status: 'Active',
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
  {
    id: 2,
    name: 'Fatema R.',
    role: 'Frontend Developer',
    status: 'Active',
    avatar: 'https://i.pravatar.cc/150?img=5',
  },
  {
    id: 3,
    name: 'Hasan I.',
    role: 'Backend Developer',
    status: 'Inactive',
    avatar: 'https://i.pravatar.cc/150?img=9',
  },
  {
    id: 4,
    name: 'Shuvo K.',
    role: 'QA Engineer',
    status: 'Active',
    avatar: 'https://i.pravatar.cc/150?img=14',
  },
];
</script>
