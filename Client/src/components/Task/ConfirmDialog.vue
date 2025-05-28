<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isVisible"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      >
        <div class="bg-white p-6 rounded shadow-lg w-96">
          <h3 class="text-lg font-semibold mb-4">{{ title }}</h3>
          <p class="mb-6">{{ message }}</p>
          <div class="flex justify-end gap-3">
            <button @click="cancel" class="px-4 py-2 bg-gray-200 rounded">
              Cancel
            </button>
            <button
              @click="confirm"
              class="px-4 py-2 bg-red-500 text-white rounded"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref } from "vue";

const isVisible = ref(false);
const title = ref("");
const message = ref("");
let resolveFn = null;
let rejectFn = null;

const showDialog = (options) => {
  title.value = options.title || "Confirm";
  message.value = options.message || "Are you sure?";
  isVisible.value = true;

  return new Promise((resolve, reject) => {
    resolveFn = resolve;
    rejectFn = reject;
  });
};

const confirm = () => {
  isVisible.value = false;
  resolveFn(true);
};

const cancel = () => {
  isVisible.value = false;
  rejectFn(false);
};

defineExpose({ showDialog });
</script>

<style scoped>
/* Background fade in/out */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Dialog slide and fade */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}
.slide-fade-leave-active {
  transition: all 0.2s ease;
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}
</style>
