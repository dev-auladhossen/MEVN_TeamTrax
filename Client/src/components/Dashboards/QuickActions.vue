<template>
  <div class="bg-white rounded-2xl shadow-md p-6 h-full">
    <h2 class="text-lg font-semibold text-gray-700 mb-4">Quick Actions</h2>
    <div class="grid grid-cols-2 gap-4">
      <div
        v-for="action in actions"
        :key="action.id"
        @click="$router.push(action.route)"
        class="flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 text-center p-4 rounded-xl transition cursor-pointer shadow-sm border"
      >
        <font-awesome-icon
          :icon="action.icon"
          class="text-xl text-blue-600 mb-2"
        />
        <span class="text-sm font-medium text-gray-700">{{
          action.label
        }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const actions = [
  {
    id: 1,
    label: "Create Project",
    icon: "cubes",
    route: "/projects",
  },
  {
    id: 2,
    label: "Add Task",
    icon: "tasks",
    route: "/tasks",
  },
  {
    id: 3,
    label: "Invite User",
    icon: "user-plus",
    route: "/add-user",
  },
  { id: 4, label: "Access Control", icon: "key", route: "/access-control" },
];
</script>
