<template>
  <div class="bg-gray-100 p-4 rounded w-64">
    <h2 class="font-bold mb-4">{{ column.title }}</h2>

    <!-- Make sure item-key is properly set -->
    <draggable
      v-model="column.cards"
      group="kanban"
      item-key="id"
      :clone="cloneCard"
      class="space-y-2"
    >
      <template #item="{ element }">
        <KanbanCard :card="element">
          <template #default="{ card }">
            <slot name="card" :card="card">{{ card.title }}</slot>
          </template>
        </KanbanCard>
      </template>
    </draggable>
  </div>
</template>

<script setup>
import draggable from "vuedraggable";
import KanbanCard from "./KanbanCard.vue";

defineProps({
  column: Object,
});

// Optional clone method to avoid unexpected mutations
const cloneCard = (card) => ({ ...card });
</script>
