<template lang="">
  <div>User Dashboard</div>
  <button @click="logout" class="bg-red-500 px-4 py-2 rounded text-white">
    Logout
  </button>
</template>
<script setup>
import { useAuth } from "../utils/auth";
const { logout } = useAuth();
</script>
<style lang=""></style>
