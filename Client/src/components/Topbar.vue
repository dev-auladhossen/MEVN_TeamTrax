<template>
  <header class="bg-white shadow px-4 py-2 flex justify-between items-center">
    <div>
      <button @click="$emit('toggle-sidebar')" class="text-2xl">☰</button>
    </div>
    <div class="relative">
      <button
        @click="toggleDropdown"
        class="rounded-full bg-blue-600 text-white w-10 h-10 flex items-center justify-center"
      >
        TU
      </button>
      <div
        v-if="dropdownOpen"
        class="absolute right-0 mt-2 w-48 bg-white border rounded shadow"
      >
        <button class="w-full px-4 py-2 text-left hover:bg-gray-100">
          👤 Profile
        </button>
        <button class="w-full px-4 py-2 text-left hover:bg-gray-100">
          🔑 Change Password
        </button>
        <button
          @click="$emit('logout')"
          class="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from "vue";
import { useAuth } from "../utils/auth";
const { logout } = useAuth();
const dropdownOpen = ref(false);
const toggleDropdown = () => (dropdownOpen.value = !dropdownOpen.value);
</script>
