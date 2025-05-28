<template>
  <div class="flex overflow-x-auto space-x-4 p-4 max-w-5xl mx-auto">
    <div
      v-for="status in statuses"
      :key="status"
      class="min-w-[250px] bg-gray-100 rounded-xl shadow p-4 flex flex-col"
    >
      <h3 class="text-lg font-semibold mb-4">{{ status }}</h3>

      <div class="space-y-4">
        <CardView
          v-for="item in filteredItems(status)"
          :key="item.id"
          :item="item"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import CardView from "./CardView.vue";

defineProps({
  items: {
    type: Array,
    required: true,
  },
  statuses: {
    type: Array,
    default: () => ["Pending", "In Progress", "Completed"],
  },
});

const filteredItems = (status) => {
  return items.filter((item) => item.status === status);
};
const items = [
  {
    id: 1,
    title: "Task One",
    description: "First task",
    status: "Not Started",
  },
  {
    id: 2,
    title: "Task Two",
    description: "Second task",
    status: "In Progress",
  },
  {
    id: 3,
    title: "Task Three",
    description: "Third task",
    status: "Completed",
  },
  {
    id: 5,
    title: "Task Three",
    description: "Third task",
    status: "Pending",
  },
  {
    id: 4,
    title: "Task Three",
    description: "Third task",
    status: "Pending",
  },
  // You can replace this with project data as well
];
</script>
