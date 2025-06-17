<template>
  <div
    class="max-w-md h-[450px] min-h-auto space-y-4 p-4 justify-items-center bg-white border rounded"
  >
    <h2 class="text-xl font-semibold mb-1">Task Statuses</h2>
    <div class="w-full flex gap-2 items-center justify-end my-4">
      <button
        class="h-8 w-16 text-sm bg-blue-600 text-white rounded"
        @click="addStatus"
      >
        <font-awesome-icon icon="plus" />
        Add
      </button>
      <button
        class="h-8 w-16 text-sm bg-blue-600 text-white rounded"
        @click="saveAllStatuses"
      >
        <font-awesome-icon icon="floppy-disk" />
        Save
      </button>
    </div>
    <TransitionGroup
      name="status-move"
      tag="div"
      class="space-y-2 max-h-[75%] overflow-y-auto"
    >
      <DraggableStatusItem
        v-for="(status, index) in statuses"
        :key="status.id"
        :status="status"
        :index="index"
        @dragstart="onDragStart"
        @drop="onDrop"
        @enter="onDragEnter"
        @dragend="onDragEnd"
        @update="updateStatus"
        @delete="deleteStatus"
      />
    </TransitionGroup>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import DraggableStatusItem from "../components/DraggableStatusItem.vue";
import { useToast } from "../components/Composables/useToast.js";
import axios from "axios";
const { success, error, info } = useToast();

const statuses = ref([]);

const draggedIndex = ref(null);

onMounted(fetchStatuses);

async function fetchStatuses() {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5000/api/task/status", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    statuses.value = res.data;
  } catch (err) {
    console.error("Failed to fetch statuses", err);
  }
}

function onDragEnter(hoverIndex) {
  if (draggedIndex.value === null || draggedIndex.value === hoverIndex) return;

  const dragged = statuses.value[draggedIndex.value];
  statuses.value.splice(draggedIndex.value, 1); // remove
  statuses.value.splice(hoverIndex, 0, dragged); // insert
  draggedIndex.value = hoverIndex;
}

function onDragEnd() {
  draggedIndex.value = null;
}

function onDragStart(index) {
  draggedIndex.value = index;
}

async function onDrop(dropIndex) {
  const draggedItem = statuses.value[draggedIndex.value];
  statuses.value.splice(draggedIndex.value, 1);
  statuses.value.splice(dropIndex, 0, draggedItem);
}

function updateStatus({ index, status }) {
  statuses.value[index] = { ...status };
}

async function addStatus() {
  const newStatus = {
    name: "New Status",
    color: "#60a5fa",
    order: statuses.value.length,
  };

  try {
    const res = await axios.post(
      "http://localhost:5000/api/task/status",
      newStatus
    );
    statuses.value.push(res.data);
    info("New Status Added!", { title: "Status Added" });
  } catch (err) {
    console.error("Failed to add status", err);
  }
}

async function saveAllStatuses() {
  const formatted = statuses.value.map((status, index) => ({
    _id: status._id, // keep for update reference
    name: status.name.trim(),
    color: status.color,
    order: index,
  }));

  try {
    await axios.put("http://localhost:5000/api/task/status-reorder", formatted);
    success("Statuses updated successfully!", { title: "Success" });
  } catch (err) {
    console.error("Failed to save statuses", err);
  }
}

const deleteStatus = async (statusId) => {
  console.log(statusId);

  try {
    const token = localStorage.getItem("token");

    const confirmed = await $confirm({
      title: "Delete Item",
      message: "Are you sure you want to delete the selected record?",
    });

    if (!confirmed) {
      return;
    } else {
      await axios.delete(`http://localhost:5000/api/task/status/${statusId}`, {
        headers: {
          Authorization: `Berear${token}`,
        },
      });
      fetchStatuses();
      success("Status Deleted successfully!", { title: "Success" });
    }
  } catch (err) {
    console.error("Failed to delete status", err);
  }
};
</script>
<style scoped>
.status-move-move {
  transition: transform 0.3s ease;
}
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
