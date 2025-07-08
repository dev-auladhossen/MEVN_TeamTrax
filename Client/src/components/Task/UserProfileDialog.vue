<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center"
  >
    <div
      class="bg-white rounded-xl shadow-xl w-[420px] max-w-full p-6 relative max-h-[90vh] overflow-y-auto"
    >
      <!-- Close Button -->
      <button
        @click="$emit('close')"
        class="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
      >
        ✕
      </button>

      <!-- Avatar + Name -->
      <div class="flex items-center space-x-4 mb-4">
        <div
          class="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold"
          :style="{ backgroundColor: user.color }"
        >
          {{ getInitials(user.name) }}
        </div>
        <div>
          <h2 class="text-xl font-semibold text-gray-800">{{ user.name }}</h2>
          <p
            class="mt-2 inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1 capitalize rounded-full"
          >
            {{ user.role }}
          </p>
        </div>
      </div>

      <!-- User Details -->
      <div class="space-y-2 text-sm text-gray-700">
        <div class="flex justify-between">
          <span class="font-medium">Email:</span>
          <span>{{ user.email }}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-medium">Department:</span>
          <span>{{ user.department }}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-medium">Status:</span>
          <span class="capitalize text-green-600 font-semibold">{{
            user.status
          }}</span>
        </div>
      </div>

      <!-- Divider -->
      <hr class="my-4 border-gray-200" />

      <!-- Permissions Section -->
      <div>
        <h3 class="text-md font-semibold mb-2 text-gray-800">
          <span class="italic text-gray-600"
            >All permissions granted to this account:</span
          >
        </h3>
        <ul
          class="list-disc list-inside space-y-1 text-sm text-gray-700 max-h-40 overflow-y-auto pr-1"
        >
          <li v-for="(perm, index) in user.permissions" :key="index">
            {{ formatPermission(perm) }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
  visible: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close"]);

// Format camelCase to readable format (e.g., "viewTasks" → "View Tasks")
function formatPermission(permission) {
  return permission
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space between camelCase words
    .replace(/\b\w/g, (c) => c.toUpperCase()); // Capitalize each word
}

const getInitials = (name) => {
  if (!name || typeof name !== "string") return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};
</script>
