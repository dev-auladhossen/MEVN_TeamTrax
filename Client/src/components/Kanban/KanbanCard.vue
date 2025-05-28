<template>
  <div class="bg-white p-4 rounded shadow cursor-move">
    <slot :card="card">{{ card.title }}</slot>
  </div>
</template>

<script setup>
defineProps({
  card: Object,
});
</script>
