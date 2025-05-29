<template>
  <div class="flex overflow-x-auto space-x-1 max-w-5xl mx-auto max-h-96">
    <div
      v-for="status in statuses"
      :key="status"
      class="min-w-[250px] p-1 flex flex-col"
    >
      <h3 class="text-md font-bold mb-3 bg-white p-2">{{ status }}</h3>

      <div class="space-y-2 overflow-y-auto cursor-pointer p-1">
        <CardView
          v-for="item in filteredItems(status)"
          :key="item._id"
          :item="item"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import CardView from "./CardView.vue";

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  statuses: {
    type: Array,
    default: () => ["Pending", "In Progress", "Completed"],
  },
});

console.log("items", props.items);

const filteredItems = (status) => {
  return props.items.filter((item) => item.status === status);
};
</script>
<style scoped>
::-webkit-scrollbar {
  width: 5px;
  height: 6px;
}
/* Handle */
::-webkit-scrollbar-thumb {
  background-color: #e4e4e4;
  border-radius: 0px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background-color: #b1b1b1;
}

/* Track */
::-webkit-scrollbar-track {
  background: transparent;
}
</style>
