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
          @click="createNewItem(status.name)"
          class="mx-1 text-xs text-gray-500 hover:text-gray-800 cursor-pointer"
          icon="add"
        />
      </div>

      <div
        class="space-y-2 overflow-y-auto px-1 pb-1"
        @dragover.prevent
        @drop="onDrop($event, status.name)"
        @dragenter.prevent
      >
        <transition-group
          name="fade"
          tag="ul"
          class="space-y-2 overflow-y-auto pr-1 pb-1"
        >
          <CardView
            v-for="item in filteredItems(status)"
            :key="item._id"
            :item="item"
            :type="type"
            :statusColor="status.color"
            :statusList="props.statuses"
          />
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script setup>
import CardView from "./CardView.vue";
import axios from "axios";
import { defineEmits, inject, computed } from "vue";
import { useToast } from "../Composables/useToast.js";

const { success, error } = useToast();

const emit = defineEmits(["create", "update-task-status"]);

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  statuses: {
    type: Array,
    default: () => [
      "Planning",
      "InProgress",
      "On Hold",
      "Completed",
      "Cancelled",
    ],
    required: true,
  },
});

const filteredItems = (status) => {
  return props.items.filter((item) => item.status === status.name);
};

const openProjectModal = inject("openProjectCreateModal", () => null);
const openTaskModal = inject("openTaskCreateModal", () => null);

const openModal = computed(() => {
  return props.type === "project" ? openProjectModal : openTaskModal;
});

const createNewItem = (status) => {
  if (openModal.value) {
    openModal.value(status);
  } else {
    console.warn("Modal function not available for type:", props.type);
  }
};

async function onDrop(event, targetStatus) {
  console.log("droped targetStatus", targetStatus);
  console.log(event, targetStatus);
  const task = JSON.parse(event.dataTransfer.getData("application/json"));
  if (task.status === targetStatus) return;
  try {
    await axios.patch(`http://localhost:5000/api/sprint-task/${task._id}`, {
      status: targetStatus,
    });
    // fetchTasks();
    emit("update-task-status");
    success(`Task Status has Changed to ${targetStatus}!`, {
      title: "Success",
    });
  } catch (err) {
    console.error("Failed to update task:", err);
  }
}
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
