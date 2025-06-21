<template>
  <!-- Backdrop -->
  <transition name="fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/10 z-40"
      @click.self="closeDrawer"
    />
  </transition>

  <!-- Drawer with Slide Transition -->
  <transition name="slide">
    <div
      v-if="isOpen"
      class="fixed right-0 top-0 h-full w-full sm:w-[600px] sm:w-[400px] bg-white z-50 shadow-lg flex flex-col"
    >
      <div
        @click="closeDrawer"
        class="text-gray-500 hover:text-black text-xl cursor-pointer mx-4 flex justify-end"
      >
        &times;
      </div>
      <TaskDetailsForDrawer
        :task="task"
        @taskEdited="taskEdited"
        @taskDeleted="taskDeleted"
      ></TaskDetailsForDrawer>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from "vue";
import TaskDetailsForDrawer from "./TaskDetailsForDrawer.vue";

const props = defineProps({
  isOpen: Boolean,
  task: Object,
});
const emit = defineEmits(["close", "taskEdited", "taskDeleted"]);

const newComment = ref("");
const comments = ref([]);

const addComment = () => {
  if (!newComment.value.trim()) return;

  comments.value.push({
    text: newComment.value,
    time: new Date().toLocaleString(),
  });
  newComment.value = "";
};

const closeDrawer = () => {
  emit("close");
};

const taskEdited = (task) => {
  console.log(task._id);
  emit("close");
};

const taskDeleted = (task) => {
  console.log(task._id);
  emit("close");
};

// Optional: Reset comments when a new task is opened
watch(
  () => props.task,
  () => {
    comments.value = []; // load from server if needed
  }
);
</script>

<style scoped>
/* Smooth slide-in animation */
.drawer-enter-active,
.drawer-leave-active {
  transition: transform 0.3s ease;
}
.drawer-enter-from {
  transform: translateX(100%);
}
.drawer-leave-to {
  transform: translateX(100%);
}

/* Fade for backdrop */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide-in from right */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from {
  transform: translateX(100%);
}
.slide-leave-to {
  transform: translateX(100%);
}
</style>
