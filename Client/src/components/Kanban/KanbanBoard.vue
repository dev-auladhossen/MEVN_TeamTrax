<template>
  <div class="flex gap-4 overflow-auto">
    <KanbanColumn v-for="(col, index) in columns" :key="col.id" :column="col">
      <template #card="{ card }">
        <slot name="card" :card="card">
          {{ card.title }}
        </slot>
      </template>
    </KanbanColumn>
  </div>
</template>

<script setup>
import KanbanColumn from "./KanbanColumn.vue";

defineProps({
  columns: Array,
});
</script>
