<template>
  <Layout>
    <div class="p-6 max-w-6xl mx-auto">
      <h2 class="text-xl font-bold mb-4">Access Control</h2>

      <!-- Filters -->
      <div class="grid sm:grid-cols-2 md:flex gap-4 mb-4">
        <!-- Role Filter -->
        <select
          v-model="searchRole"
          class="mt-1 text-sm block w-full px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Roles</option>
          <option v-for="role in roles" :key="role.name" :value="role.name">
            {{ role.name }}
          </option>
        </select>

        <!-- Action Filter -->
        <input
          v-model="searchAction"
          type="text"
          placeholder="Search permission action..."
          class="mt-1 text-sm block w-full px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div
        class="w-full flex justify-between items-center bg-teal-600 text-white border"
      >
        <!-- Left: Permissions label -->
        <div class="p-3 min-w-[40%] font-semibold text-sm sm:text-base">
          Permissions
        </div>

        <!-- Right: Action Headers -->
        <div class="flex justify-around flex-grow min-w-[60%]">
          <div
            v-for="action in actions"
            :key="action"
            class="p-2 sm:p-3 text-center min-w-[60px] text-xs sm:text-sm font-semibold"
          >
            {{ action }}
          </div>
        </div>
      </div>

      <!-- Role Permission Table -->
      <div
        v-for="role in filteredRoles"
        :key="role.name"
        class="mb-1 border rounded-lg transition-all duration-300 ease-in-out"
      >
        <button
          @click="toggleExpand(role.name)"
          class="w-full text-left px-4 py-2 bg-white text-gray-500 flex justify-between items-center"
        >
          <span class="text-lg font-semibold">{{ role.name }}</span>
          <svg
            class="w-4 h-4 transform transition-transform duration-300"
            :class="{ 'rotate-180': expandedRoles.includes(role.name) }"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        <transition name="fade">
          <div
            v-if="expandedRoles.includes(role.name)"
            class="overflow-x-auto transition-all duration-300 ease-in-out"
          >
            <table class="w-full text-sm text-left border-t">
              <!-- <thead>
              <tr class="bg-gray-50">
                <th class="p-3 border">Permissions</th>
                <th
                  v-for="action in actions"
                  :key="action"
                  class="p-3 border text-center"
                >
                  {{ action }}
                </th>
              </tr>
            </thead> -->
              <tbody>
                <tr
                  v-for="(section, sectionIndex) in role.permissions"
                  :key="sectionIndex"
                  class="border-t"
                >
                  <td class="py-1 px-4 font-medium w-[40%]">
                    <!-- Select All Checkbox -->
                    <div class="text-xs text-gray-500 mt-1">
                      <label class="inline-flex items-center space-x-3 gap-2">
                        <input
                          type="checkbox"
                          class="custom-checkbox"
                          :checked="isAllSelected(section)"
                          @change="toggleSelectAll(role.name, section.name)"
                        />
                        {{ section.name }}
                      </label>
                    </div>
                  </td>
                  <td
                    v-for="action in actions"
                    :key="action"
                    class="text-center p-2 border min-w-[60px]"
                  >
                    <input
                      type="checkbox"
                      class="custom-checkbox"
                      :checked="section.actions.includes(action)"
                      @change="
                        togglePermission(role.name, section.name, action)
                      "
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </transition>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end gap-4 mt-4">
        <button
          @click="resetToDefault"
          class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Reset to Default
        </button>
        <button
          @click="saveAllPermissions"
          class="px-6 py-2 bg-teal-600 text-white rounded hover:bg-blue-700"
        >
          Save All Permissions
        </button>
      </div>

      <!-- Output Debug -->
      <pre class="bg-gray-100 p-4 text-sm mt-4 rounded overflow-auto"
        >{{ JSON.stringify(savedPermissions, null, 2) }}
    </pre
      >
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import Layout from "../components/Layout.vue";

const searchRole = ref("");
const searchAction = ref("");
const actions = ["View", "Create", "Edit", "Delete"];
const savedPermissions = ref({});
const expandedRoles = ref([]);

const originalRoles = [
  {
    name: "Developer",
    permissions: [
      { name: "Tasks", actions: ["View", "Create", "Edit"] },
      { name: "Commits", actions: ["View"] },
    ],
  },
  {
    name: "Designer",
    permissions: [
      { name: "Design Assets", actions: ["View", "Create"] },
      { name: "Comments", actions: ["View", "Edit"] },
    ],
  },
  {
    name: "Tester",
    permissions: [
      { name: "Bugs", actions: ["View", "Create"] },
      { name: "Reports", actions: ["View"] },
    ],
  },
];

const roles = ref(JSON.parse(JSON.stringify(originalRoles))); // deep copy

const filteredRoles = computed(() => {
  return roles.value.filter((role) => {
    const matchRole = !searchRole.value || role.name === searchRole.value;
    const matchPermission = !searchAction.value
      ? true
      : role.permissions.some((section) =>
          section.name.toLowerCase().includes(searchAction.value.toLowerCase())
        );
    return matchRole && matchPermission;
  });
});

// Watch searchAction to auto expand only matching tabs
watch(searchAction, (val) => {
  if (val) {
    expandedRoles.value = roles.value
      .filter((role) =>
        role.permissions.some((section) =>
          section.name.toLowerCase().includes(val.toLowerCase())
        )
      )
      .map((r) => r.name);
  } else {
    expandedRoles.value = [];
  }
});

const toggleExpand = (roleName) => {
  const index = expandedRoles.value.indexOf(roleName);
  if (index === -1) {
    expandedRoles.value.push(roleName);
  } else {
    expandedRoles.value.splice(index, 1);
  }
};

const togglePermission = (roleName, sectionName, action) => {
  const role = roles.value.find((r) => r.name === roleName);
  const section = role.permissions.find((p) => p.name === sectionName);
  const index = section.actions.indexOf(action);
  if (index === -1) {
    section.actions.push(action);
  } else {
    section.actions.splice(index, 1);
  }
};

const isAllSelected = (section) => {
  return actions.every((a) => section.actions.includes(a));
};

const toggleSelectAll = (roleName, sectionName) => {
  const role = roles.value.find((r) => r.name === roleName);
  const section = role.permissions.find((s) => s.name === sectionName);
  section.actions = isAllSelected(section) ? [] : [...actions];
};

const saveAllPermissions = () => {
  savedPermissions.value = {};
  roles.value.forEach((role) => {
    const permissionsArray = [];
    role.permissions.forEach((section) => {
      section.actions.forEach((action) => {
        permissionsArray.push(
          `${action.toLowerCase()}${section.name.replace(/\s+/g, "")}`
        );
      });
    });
    savedPermissions.value[role.name] = permissionsArray;
  });
};

const resetToDefault = () => {
  roles.value = JSON.parse(JSON.stringify(originalRoles));
  searchRole.value = "";
  searchAction.value = "";
  expandedRoles.value = [];
};
</script>

<style scoped>
/* Slightly rounded custom checkbox */
.custom-checkbox {
  appearance: none;
  width: 1rem;
  height: 1rem;
  border: 2px solid #058581;
  border-radius: 0.2rem; /* slightly rounded */
  background-color: white;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;
  position: relative;
}

.custom-checkbox:checked {
  background-color: #058581;
  border-color: #058581;
}

.custom-checkbox:checked::after {
  content: "";
  position: absolute;
  top: 1px;
  left: 4px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

/* Fade Transition */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
