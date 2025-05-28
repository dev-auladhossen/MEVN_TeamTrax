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
