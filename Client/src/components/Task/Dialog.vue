<template>
  <Transition name="modal">
    <div
      v-show="isOpen"
      class="fixed inset-0 z-50 overflow-y-auto max-w-full"
      aria-labelledby="modal-title"
      aria-modal="true"
      role="dialog"
    >
      <!-- Background overlay -->
      <div
        class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        aria-hidden="true"
        @click="closeModal"
      ></div>

      <!-- Modal container -->
      <div
        class="flex min-h-screen items-center justify-center p-4 text-center sm:block sm:p-0"
      >
        <!-- centering the modal contents -->
        <span
          class="hidden sm:inline-block sm:h-screen sm:align-middle"
          aria-hidden="true"
          >&#8203;</span
        >

        <!-- Modal panel -->
        <div
          class="inline-block w-full max-w-sm transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all sm:my-8 sm:max-w-sm sm:w-full"
        >
          <!-- Modal header -->
          <div
            v-if="$slots.header"
            class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6"
          >
            <button
              type="button"
              class="text-gray-400 hover:text-gray-500 focus:outline-none"
              @click="closeModal"
            >
              <span class="sr-only">Close</span>
              <svg
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <slot name="header"></slot>
          </div>

          <!-- Modal content -->
          <div class="px-4 py-5 sm:p-6">
            <slot></slot>
          </div>

          <!-- Modal footer (optional) -->
          <div
            v-if="$slots.footer"
            class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6"
          >
            <slot name="footer"></slot>
            <div class="mt-4 flex justify-end gap-2">
              <button @click="closeModal" class="px-4 py-2 bg-white rounded">
                Cancel
              </button>
              <button
                @click="confirm"
                class="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["close", "confirm"]);

const closeModal = () => {
  emit("close");
};
function confirm() {
  emit("confirm"); // emit the event to parent
}

const handleEscape = (e) => {
  if (e.key === "Escape" && props.isOpen) {
    closeModal();
  }
};

onMounted(() => {
  document.addEventListener("keydown", handleEscape);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleEscape);
});
</script>

<style scoped>
/* Modal transition effects */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.95);
}
</style>
