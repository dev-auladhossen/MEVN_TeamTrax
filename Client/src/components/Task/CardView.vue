<template>
  <div
    class="bg-white project-card p-3 rounded-lg shadow hover:shadow-md transition"
  >
    <div class="card-header flex justify-between">
      <h4 class="text-md font-semibold mb-2">
        {{ item.name }}
      </h4>

      <div ref="menuRef" class="flex gap-2">
        <font-awesome-icon
          class="menu-wrapper text-black cursor-pointer"
          icon="ellipsis-h"
          @click="toggleDropdown(item._id)"
        />
        <font-awesome-icon
          class="text-gray-600 cursor-pointer text-xs"
          icon="arrow-up-right-from-square"
          @click="goToDetails"
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
        class="absolute right-0 w-36 border rounded-md bg-white shadow-2xl transform opacity-100 scale-100 z-50"
      >
        <div class="p-1">
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
            <font-awesome-icon class="text-black mr-2" icon="pencil" />
            Edit
          </button>
          <button
            @click="handleDeleteProject(item)"
            class="w-full px-4 py-2 text-left hover:bg-gray-100 text-red-600"
          >
            <font-awesome-icon class="mr-2" icon="trash-can" />
            Delete
          </button>
        </div>
      </div></transition
    >

    <div class="text-xs flex justify-between gap-2 mb-2 items-center">
      <span>{{ item.startDate }}</span>
      <span
        :class="[
          'py-0.5 px-2 border rounded-full text-xs',
          `bg-[${statusColor}]/10 text-[${statusColor}]`,
        ]"
      >
        {{ item.status }}
      </span>
    </div>
    <div class="my-2">
      <span class="text-sm text-gray-600">
        {{ truncate(item.description, 50) }}
      </span>
    </div>

    <!-- <div class="flex gap-1 justify-between items-center my-2">
      <div class="flex gap-1 items-center">
        <button
          @click=""
          class="rounded-full bg-blue-600 text-white w-6 h-6 text-xs flex items-center justify-center"
        >
          {{ getInitials(item.createdBy) }}
        </button>
        <span>{{ getFirstName(item.createdBy) }}</span>
      </div>
    </div> -->
    <div>
      <div class="progress-section">
        <div class="flex justify-between text-xs text-gray-600 mb-1">
          <span>Progress</span>
          <span>{{ progressPercentage }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded h-2 overflow-hidden">
          <div
            class="bg-blue-500 h-full"
            :style="{ width: progressPercentage + '%' }"
          ></div>
        </div>
      </div>
    </div>
    <div class="flex justify-between text-xs my-2 text-gray-600">
      <span>0 Tasks</span>
      <span
        ><font-awesome-icon icon="calendar-days" /> Due:
        {{ item.endDate }}</span
      >
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { inject, ref, onMounted, onBeforeUnmount, computed } from "vue";
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  statusList: {
    type: Object,
    required: true,
  },
  statusColor: {
    type: String,
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

// Progress Percentage
const progressPercentage = computed(() => {
  const total = props.statusList.length;
  console.log("total", total);

  const currentIndex = props.statusList.findIndex(
    (status) => status.name === props.item.status
  );
  console.log("currentIndex", currentIndex);
  console.log("props.statusList", props.statusList);
  console.log("props.item.status", props.item.status);

  if (currentIndex === -1 || total <= 1) return 0;

  const percentage = (currentIndex / (total - 1)) * 100;
  return Math.round(percentage);
});

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

.dropdown-menu {
  position: absolute;
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
