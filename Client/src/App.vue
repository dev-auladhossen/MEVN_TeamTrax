<template>
  <main>
    <RouterView />
    <Toast />
    <ConfirmDialog ref="confirmDialog" />
  </main>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import Toast from "./components/Task/Toast.vue";
import ConfirmDialog from "./components/Task/ConfirmDialog.vue";

const $route = useRoute();
const confirmDialog = ref(null);
onMounted(() => {
  // Expose globally
  window.$confirm = confirmDialog.value.showDialog;
});
</script>

<style>
@media print {
  body {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  #report-content {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  .no-print {
    display: none !important;
  }
}
</style>
