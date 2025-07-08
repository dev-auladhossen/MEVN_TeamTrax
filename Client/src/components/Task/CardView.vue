<template>
  <div
    class="bg-white project-card p-3 rounded-lg shadow hover:shadow-md transition"
    draggable="true"
    @dragstart="onDragStart"
  >
    <div class="card-header flex justify-between">
      <h4 v-if="type === 'project'" class="text-md font-semibold mb-2">
        {{ item.name }}
      </h4>
      <h4 v-else class="text-md font-semibold mb-2">
        {{ item.title }}
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
            @click="handleEditItem(item)"
            class="w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            <font-awesome-icon class="text-black mr-2" icon="pencil" />
            Edit
          </button>
          <button
            @click="handleDeleteItem(item)"
            class="w-full px-4 py-2 text-left hover:bg-gray-100 text-red-600"
          >
            <font-awesome-icon class="mr-2" icon="trash-can" />
            Delete
          </button>
        </div>
      </div></transition
    >

    <div class="text-xs flex justify-between gap-2 mb-2 items-center">
      <span v-if="item.startDate">{{ item?.startDate }}</span>
      <span
        v-else
        class="text-xs px-2 py-0.5 rounded"
        :class="{
          'bg-red-100 text-red-600': item.priority === 'High',
          'bg-yellow-50 text-yellow-500': item.priority === 'Medium',
          'bg-green-100 text-green-600': item.priority === 'Low',
        }"
      >
        {{ item.priority }}
      </span>
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

    <div v-if="type === 'project'">
      <div class="progress-section">
        <div class="flex justify-between text-xs text-gray-600 mb-1">
          <span>Progress</span>
          <span>{{ item.progress }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded h-2 overflow-hidden">
          <div
            class="bg-blue-500 h-full"
            :style="{ width: item.progress + '%' }"
          ></div>
        </div>
      </div>
    </div>
    <div
      v-if="type === 'project'"
      class="flex justify-between text-xs my-2 text-gray-600"
    >
      <span
        ><font-awesome-icon icon="clock-rotate-left" /> Due:
        {{ item.endDate }}</span
      >
    </div>
    <div v-else class="flex justify-between text-xs my-2 text-gray-600">
      <span
        ><font-awesome-icon icon="calendar-days" /> Due:
        {{ item.dueDate }}</span
      >
    </div>

    <div v-if="type === 'task'">
      <hr class="my-3 border-gray-200" />
      <div class="flex justify-between items-center text-sm text-gray-600">
        <!-- Left: Assigned users' initials -->
        <div v-if="item.assignedTo?.length > 0" class="flex -space-x-2">
          <div
            v-for="member in item?.assignedTo"
            :key="member?._id"
            class="cursor-pointer w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white hover:scale-105 transition"
            :title="member"
          >
            {{ getInitials(member.username) }}
          </div>
        </div>
        <div v-else>No Assignees Yet</div>
        <!-- <div class="flex -space-x-2">
          <div
            v-for="(user, index) in item?.assignedTo"
            :key="index"
            class="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold"
            :title="user.name"
          >
            {{
              user.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
            }}
          </div>
        </div> -->

        <!-- Right: Attachments and comments -->
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-1">
            <font-awesome-icon icon="paperclip" />
            <span>{{ item.attachments?.length || 0 }}</span>
          </div>
          <div class="flex items-center gap-1">
            <font-awesome-icon icon="comment" />
            <span>{{ item.comments?.length || 0 }}</span>
          </div>
        </div>
      </div>
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
  type: {
    type: String,
    default: "project",
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

const onDragStart = (e) => {
  e.dataTransfer.setData("application/json", JSON.stringify(props.item));
};

const toggleDropdown = (projectId) => {
  dropdownOpen.value = !dropdownOpen.value;
  openMenuId.value = openMenuId.value === projectId ? null : projectId;
};

// Injecting Edit & delete function
const deleteProject = inject("deleteProject", () => null);
const deleteTask = inject("deleteTask", () => null);
const editProject = inject("editProject", () => null);
const editTask = inject("editTask", () => null);

const deleteHandler = computed(() =>
  props.type === "project" ? deleteProject : deleteTask
);

const editHandler = computed(() =>
  props.type === "project" ? editProject : editTask
);

const handleDeleteItem = (item) => {
  if (deleteHandler.value) {
    deleteHandler.value(item);
  } else {
    console.warn("Delete handler not provided for type:", props.type);
  }
};

const handleEditItem = (item) => {
  if (editHandler.value) {
    editHandler.value(item);
  } else {
    console.warn("Edit handler not provided for type:", props.type);
  }
};

const goToDetails = () => {
  const routePrefix = props.type === "project" ? "project" : "task";
  router.push(`/${routePrefix}-details/${props.item._id}`);
};

const truncate = (text, length = 20) => {
  return text.length > length ? text.slice(0, length) + "..." : text;
};

const getFirstName = (fullName) => {
  if (!fullName) return "";
  return fullName.trim().split(" ")[0];
};

const getInitials = (name) => {
  if (!name || typeof name !== "string") return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
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
