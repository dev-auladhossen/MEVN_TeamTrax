// plugins/toast.js
import { createApp } from "vue";
import Toast from "../Task/Toast.vue";

let toastInstance = null;

const ToastPlugin = {
  install(app, options = {}) {
    // Create toast methods
    const toast = {
      show(options) {
        if (!toastInstance) {
          console.error("Toast not initialized");
          return;
        }
        return toastInstance.addToast(options);
      },

      success(message, options = {}) {
        return this.show({
          type: "success",
          message,
          ...options,
        });
      },

      error(message, options = {}) {
        return this.show({
          type: "error",
          message,
          ...options,
        });
      },

      warning(message, options = {}) {
        return this.show({
          type: "warning",
          message,
          ...options,
        });
      },

      info(message, options = {}) {
        return this.show({
          type: "info",
          message,
          ...options,
        });
      },

      clear() {
        if (toastInstance) {
          toastInstance.clearAll();
        }
      },
    };

    // Make toast available globally
    app.config.globalProperties.$toast = toast;
    app.provide("toast", toast);
  },

  setInstance(instance) {
    toastInstance = instance;
  },
};

export default ToastPlugin;
