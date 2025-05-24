<template>
  <router-link :to="to" class="flex items-center p-2 hover:bg-gray-200 rounded">
    <span class="text-xl w-8">{{ icon }}</span>
    <span v-if="isOpen">{{ label }}</span>
  </router-link>
</template>

<script setup>
defineProps(["to", "icon", "label", "isOpen"]);
</script>
