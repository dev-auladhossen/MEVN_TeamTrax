<template>
  <div
    class="bg-white project-card p-3 rounded-lg shadow hover:shadow-md transition"
  >
    <div class="card-header flex justify-between">
      <h4 class="text-md font-semibold mb-2">{{ item.name }}</h4>
      <div ref="menuRef">
        <font-awesome-icon
          class="menu-wrapper text-black cursor-pointer"
          icon="ellipsis-h"
          @click="toggleDropdown(item._id)"
        />
      </div>
    </div>
    <!-- Dropdown Menu -->
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
      ><div
        v-if="openMenuId === item._id"
        class="absolute right-0 mt-2 w-52 border rounded-md bg-white shadow-2xl transform opacity-100 scale-100 z-50"
      >
        <div class="p-4">
          <button
            @click="goToDetails"
            class="w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            <font-awesome-icon
              class="text-black mr-2"
              icon="arrow-up-right-from-square"
            />
            Open
          </button>
          <button
            @click="handleEditProject(item)"
            class="w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            <font-awesome-icon class="text-black mr-2" icon="edit" />
            Edit
          </button>
          <button
            @click="handleDeleteProject(item)"
            class="w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            <font-awesome-icon class="text-black mr-2" icon="trash-can" />
            Delete
          </button>
        </div>
      </div></transition
    >

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
</template>

<script setup>
import { useRouter } from "vue-router";
import { inject, ref, onMounted, onBeforeUnmount } from "vue";
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const dropdownOpen = ref(false);
const router = useRouter();

// ID of the menu currently open
const openMenuId = ref(null);
const menuRef = ref(null);

const toggleDropdown = (projectId) => {
  console.log("projectId", projectId);
  dropdownOpen.value = !dropdownOpen.value;
  openMenuId.value = openMenuId.value === projectId ? null : projectId;
};

// Injecting delete function
const deleteProject = inject("deleteProject");
const editProject = inject("editProject");

const handleDeleteProject = (item) => {
  deleteProject(item);
};

const handleEditProject = (item) => {
  editProject(item);
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
// Handle click outside
const handleClickOutside = (event) => {
  if (menuRef.value && !menuRef.value.contains(event.target)) {
    openMenuId.value = null;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
<style scoped>
.project-card {
  position: relative;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
}

/* .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
} */

/* .menu-wrapper {
  position: relative;
} */

.dropdown-menu {
  position: absolute;
  /* Places it below the button */
  right: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 0.5rem 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  width: 150px;
}

.dropdown-menu ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.dropdown-menu li {
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.dropdown-menu li:hover {
  background-color: #f0f0f0;
}
</style>
