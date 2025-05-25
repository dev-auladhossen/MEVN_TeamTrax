//  Global State Approach
import { ref, reactive } from "vue";

// Global state for toasts
const toasts = ref([]);

// Toast management functions
const addToast = (toast) => {
  const id = Date.now() + Math.random();
  const newToast = {
    id,
    type: toast.type || "info",
    title: toast.title || "",
    message: toast.message || "",
    duration: toast.duration || 4000,
    closable: toast.closable !== false,
  };

  toasts.value.push(newToast);

  if (newToast.duration > 0) {
    setTimeout(() => {
      removeToast(id);
    }, newToast.duration);
  }

  return id;
};

const removeToast = (id) => {
  const index = toasts.value.findIndex((toast) => toast.id === id);
  if (index > -1) {
    toasts.value.splice(index, 1);
  }
};

const clearAllToasts = () => {
  toasts.value = [];
};

// Composable function
export function useToast() {
  const showToast = (options) => {
    return addToast(options);
  };

  const success = (message, options = {}) => {
    return addToast({
      type: "success",
      message,
      ...options,
    });
  };

  const error = (message, options = {}) => {
    return addToast({
      type: "error",
      message,
      ...options,
    });
  };

  const warning = (message, options = {}) => {
    return addToast({
      type: "warning",
      message,
      ...options,
    });
  };

  const info = (message, options = {}) => {
    return addToast({
      type: "info",
      message,
      ...options,
    });
  };

  const clear = () => {
    clearAllToasts();
  };

  return {
    toasts,
    showToast,
    success,
    error,
    warning,
    info,
    clear,
    removeToast,
  };
}
