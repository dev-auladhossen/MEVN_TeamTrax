<template>
  <div class="flex overflow-x-auto space-x-1 max-w-5xl mx-auto max-h-96">
    <div
      v-for="status in statuses"
      :key="status"
      class="min-w-[250px] p-1 flex flex-col"
    >
      <div
        class="flex justify-between items-center text-md font-bold mb-3 bg-white px-2"
      >
        <div class="flex items-center text-md font-bold bg-white px-2">
          <span
            :style="{ backgroundColor: status.color }"
            class="rounded-full w-4 h-4"
          >
          </span>
          <h3 class="text-md font-bold bg-white p-2">{{ status.name }}</h3>
        </div>
        <font-awesome-icon
          @click="createNewProject(status.name)"
          class="mx-1 text-xs text-gray-500 hover:text-gray-800 cursor-pointer"
          icon="add"
        />
      </div>

      <div class="space-y-2 overflow-y-auto px-1 pb-1">
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
import { defineEmits, inject } from "vue";

const emit = defineEmits(["create"]);

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  statuses: {
    type: Array,
    default: () => ["Pending", "In Progress", "Completed"],
    required: true,
  },
});

const filteredItems = (status) => {
  return props.items.filter((item) => item.status === status.name);
};

const createNewProject = (status) => {
  openModal(status);
};

const openModal = inject("openCreateModal");
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
