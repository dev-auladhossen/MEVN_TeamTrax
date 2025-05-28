<template>
  <div class="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
    <h4 class="text-md font-semibold mb-2">{{ item.title }}</h4>
    <p class="text-sm text-gray-600">{{ item.description }}</p>
  </div>
</template>

<script setup>
defineProps({
  item: {
    type: Object,
    required: true,
  },
});
</script>
