<template>
  <div class="toast-container">
    <TransitionGroup name="toast" tag="div" class="toast-wrapper">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'toast',
          `toast-${toast.type}`,
          { 'toast-closable': toast.closable },
        ]"
      >
        <div class="toast-content">
          <div class="toast-icon" v-if="toast.type">
            <i :class="getIconClass(toast.type)"></i>
          </div>
          <div class="toast-message">
            <h4 v-if="toast.title" class="toast-title">{{ toast.title }}</h4>
            <p class="toast-text">{{ toast.message }}</p>
          </div>
          <button
            v-if="toast.closable"
            @click="removeToast(toast.id)"
            class="toast-close"
          >
            ×
          </button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useToast } from "../Composables/useToast.js";

const { toasts, removeToast } = useToast();

const getIconClass = (type) => {
  const icons = {
    success: "fas fa-check-circle",
    error: "fas fa-exclamation-circle",
    warning: "fas fa-exclamation-triangle",
    info: "fas fa-info-circle",
  };
  return icons[type] || icons.info;
};
</script>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  pointer-events: none;
}

.toast-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.toast {
  min-width: 300px;
  max-width: 500px;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  pointer-events: auto;
  position: relative;
  backdrop-filter: blur(10px);
}

.toast-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.toast-icon {
  flex-shrink: 0;
  font-size: 20px;
  margin-top: 2px;
}

.toast-message {
  color: #2b2b2b !important;
  flex: 1;
}

.toast-title {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
}

.toast-text {
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
}

.toast-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.toast-close:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

/* Toast Types */
.toast-success {
  background: #7affd557;
  color: #09b309;
  border: 1px solid#09b309;
}

.toast-error {
  background: #ffc6c658;
  color: #dc2626;
  border: 1px solid#dc2626;
}

.toast-warning {
  background: #ffd5a454;
  color: #d97706;
  border: 1px solid#d97706;
}

.toast-info {
  background: #a8c4ff33;
  color: #2563eb;
  border: 1px solid#2563eb;
}

/* Animations */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>
