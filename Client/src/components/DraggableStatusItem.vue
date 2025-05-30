<template>
  <div
    class="flex items-center gap-2 p-2 border rounded cursor-move"
    draggable="true"
    @dragstart="onDragStart"
    @dragover.prevent
    @drop="onDrop"
    @dragenter.prevent
  >
    <div
      :style="{ backgroundColor: status.color }"
      class="w-4 h-4 rounded-full"
    ></div>
    <input
      class="flex-1 border-b outline-none"
      v-model="editableStatus.name"
      @change="emitUpdate"
    />
    <input
      type="color"
      v-model="editableStatus.color"
      @change="emitUpdate"
      class="w-6 h-6 p-0 border-none bg-transparent"
    />
    <button
      @click="$emit('delete', status._id)"
      class="ml-2 text-red-600 hover:underline"
    >
      Delete
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
const props = defineProps({
  status: Object,
  index: Number,
});
const emit = defineEmits(["dragstart", "drop", "update"]);

const editableStatus = ref({ ...props.status });

watch(
  () => props.status,
  (newVal) => {
    editableStatus.value = { ...newVal };
  }
);

function onDragStart(e) {
  emit("dragstart", props.index);
}

function onDrop() {
  emit("drop", props.index);
}

function emitUpdate() {
  emit("update", { index: props.index, status: editableStatus.value });
}
</script>

<style scoped>
input[type="color"] {
  cursor: pointer;
}
</style>
