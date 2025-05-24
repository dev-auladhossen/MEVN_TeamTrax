<template>
  <aside
    :class="[
      'bg-white w-64 transition-all duration-300 border-r',
      { 'w-16': !isOpen },
    ]"
  >
    <div class="p-4 flex justify-between items-center">
      <span v-if="isOpen" class="font-bold text-xl">TaskMe</span>
      <button @click="$emit('toggle')">⋮</button>
    </div>
    <nav class="mt-4 space-y-2">
      <SidebarLink
        v-if="show('all')"
        to="/projects"
        icon="📁"
        label="Project List"
        :isOpen="isOpen"
      />
      <SidebarLink
        v-if="show('all')"
        to="/tasks"
        icon="✅"
        label="Task List"
        :isOpen="isOpen"
      />
      <SidebarLink
        v-if="show('admin', 'projectManager')"
        to="/create-project"
        icon="➕"
        label="Create Project"
        :isOpen="isOpen"
      />
      <SidebarLink
        v-if="show('admin', 'projectManager')"
        to="/create-task"
        icon="📝"
        label="Create Task"
        :isOpen="isOpen"
      />
      <SidebarLink
        v-if="show('admin')"
        to="/add-user"
        icon="👥"
        label="Add User"
        :isOpen="isOpen"
      />
      <SidebarLink
        v-if="show('all')"
        to="/settings"
        icon="⚙️"
        label="Settings"
        :isOpen="isOpen"
      />
      <SidebarLink
        v-if="show('all')"
        to="/add-user"
        icon="⚙️"
        label="Add User"
        :isOpen="isOpen"
      />
    </nav>
  </aside>
</template>

<script setup>
import { computed } from "vue";
import SidebarLink from "./SidebarLink.vue";

defineProps({
  role: String,
  isOpen: Boolean,
});

const show = (...roles) => {
  if (roles.includes("all")) return true;
  //   return roles.includes(props.role)
};
</script>
