<template>
  <div class="bg-white p-3 rounded-lg shadow hover:shadow-md transition">
    <div class="flex justify-between">
      <h4 class="text-md font-semibold mb-2">{{ item.name }}</h4>
      <font-awesome-icon
        class="text-black cursor-pointer"
        icon="ellipsis-h"
        @click="toggleDropdown"
      />
    </div>

    <div class="text-xs flex justify-between gap-2 my-2">
      <span>{{ item.startDate }}</span>
      <span>{{ item.endDate }}</span>
    </div>
    <p class="text-sm text-gray-600">
      {{ truncate(item.description, 50) }}
    </p>
    <div class="flex gap-1 items-center my-2">
      <button
        @click=""
        class="rounded-full bg-blue-600 text-white w-6 h-6 text-sm flex items-center justify-center"
      >
        {{ getInitials(item.createdBy) }}
      </button>
      <span>{{ getFirstName(item.createdBy) }}</span>
      <button @click="handleDeleteProject(item)">Delete</button>
    </div>
  </div>
  <transition
    enter-active-class="transition ease-out duration-100"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition ease-in duration-150"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div
      v-if="dropdownOpen"
      class="absolute right-0 mt-2 w-52 border rounded-md bg-white shadow-2xl transform opacity-100 scale-100"
    >
      <div class="p-4">
        <button class="w-full px-4 py-2 text-left hover:bg-gray-100">
          <font-awesome-icon class="text-black mr-2" icon="user" />
          Profile
        </button>
        <button class="w-full px-4 py-2 text-left hover:bg-gray-100">
          <font-awesome-icon class="text-black mr-2" icon="key" /> Change
          Password
        </button>
        <button
          @click="logout"
          class="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
        >
          <font-awesome-icon
            class="text-black mr-2"
            icon="right-from-bracket"
          />
          Logout
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { useRouter } from "vue-router";
import { inject, ref } from "vue";
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});
console.log("props", props.item);
const dropdownOpen = ref(false);

const router = useRouter();

const toggleDropdown = () => (dropdownOpen.value = !dropdownOpen.value);

// Injecting delete function
const deleteProject = inject("deleteProject");
const handleDeleteProject = (item) => {
  deleteProject(item);
};

const goToDetails = () => {
  router.push(`/project-details/${props.item._id}`);
};
const truncate = (text, length = 20) => {
  return text.length > length ? text.slice(0, length) + "..." : text;
};
const getFirstName = (fullName) => {
  if (!fullName) return "";
  return fullName.trim().split(" ")[0];
};

const getInitials = (fullName) => {
  const nameParts = fullName.trim().split(" ");
  const initials =
    nameParts.length === 1
      ? nameParts[0][0].toUpperCase()
      : nameParts[0][0].toUpperCase() +
        nameParts[nameParts.length - 1][0].toUpperCase();
  return initials;
};
</script>
