<template>
  <Layout>
    <div class="p-6 max-w-6xl mx-auto">
      <h2 class="text-xl font-bold mb-4">Access Control</h2>
      <!-- Filters -->
      <div class="flex gap-4 mb-4">
        <!-- Role Filter -->
        <select
          v-model="searchRole"
          class="mt-1 text-sm bloc px-8 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
          class="mt-1 text-sm block px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div
        class="w-full flex justify-between items-center bg-gray-600 text-white border"
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
          <span class="text-base font-semibold"
            >{{ formatDisplayName(role.name) }}
          </span>
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
        <Transition name="fade">
          <div
            v-if="expandedRoles.includes(role.name)"
            class="overflow-x-auto transition-all duration-300 ease-in-out"
          >
            <table class="w-full text-sm text-left border-t">
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
        </Transition>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end gap-4 mt-4">
        <button
          @click="resetToDefault"
          class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Reset to Default
        </button>
        <button
          @click="saveAllPermissions"
          class="px-6 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
        >
          Save All Permissions
        </button>
      </div>

      <!-- Add New Role Section -->
      <div class="mt-10 border-t pt-6">
        <h3 class="text-lg font-semibold mb-2">Add New Role & Permissions</h3>
        <div class="flex flex-wrap gap-4">
          <input
            v-model="newRoleName"
            type="text"
            placeholder="Role Name (e.g., DevOps)"
            class="mt-1 text-sm block px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            v-model="newSectionName"
            type="text"
            placeholder="Permission Section (e.g., Deployments)"
            class="mt-1 text-sm block px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          <div class="flex items-center gap-2">
            <label
              v-for="action in actions"
              :key="action"
              class="flex items-center"
            >
              <input
                type="checkbox"
                v-model="newSelectedActions"
                :value="action"
                class="custom-checkbox mr-1"
              />
              {{ action }}
            </label>
          </div>
        </div>

        <button
          @click="addNewRoleWithPermission"
          class="mt-4 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
        >
          Add Role
        </button>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import Layout from "../components/Layout.vue";
import defaultPermissions from "../assets/defaultPermissions.json";
import { useToast } from "../components/Composables/useToast.js";

const { success, error } = useToast();

const searchRole = ref("");
const searchAction = ref("");
const actions = ["View", "Create", "Edit", "Delete"];
const savedPermissions = ref({});
const expandedRoles = ref([]);
const newRoleName = ref("");
const newSectionName = ref("");
const newSelectedActions = ref([]);
const roles = ref([]);
const originalRoles = ref([]);

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
const insertSpaces = (str) => str.replace(/([a-z])([A-Z])/g, "$1 $2");

const fetchPermissionsFromBackend = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/permissions/roles");
    const data = await res.json();
    console.log("fetchPermissionsFromBackend", data);

    const transformed = Object.entries(data).map(([roleName, perms]) => {
      const grouped = {};

      perms.forEach((perm) => {
        const match = perm.match(/^(view|create|edit|delete)([A-Za-z0-9]+)/i);
        if (!match) return;
        const action = capitalize(match[1]);
        const section = insertSpaces(match[2]);

        if (!grouped[section]) grouped[section] = [];
        grouped[section].push(action);
      });

      const permissions = Object.entries(grouped).map(([section, actions]) => ({
        name: section,
        actions,
      }));

      return { name: roleName, permissions };
    });
    console.log("transformed", transformed);

    roles.value = transformed;
    originalRoles.value = JSON.parse(JSON.stringify(transformed));
  } catch (err) {
    console.error("Failed to fetch permissions:", err);
  }
};

const saveAllPermissions = async () => {
  const payload = {};
  roles.value.forEach((role) => {
    const permissionsArray = [];
    role.permissions.forEach((section) => {
      section.actions.forEach((action) => {
        permissionsArray.push(
          `${action.toLowerCase()}${section.name.replace(/\s+/g, "")}`
        );
      });
    });
    payload[role.name] = permissionsArray;
  });

  savedPermissions.value = payload;

  try {
    const res = await fetch(
      "http://localhost:5000/api/permissions/bulk-access-control",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) throw new Error("Failed to save");

    success("Permissions saved successfully!", { title: "Success" });
  } catch (err) {
    console.error(err);
    error("Error saving permissions.");
  }
};

const defaultRoles = ref(JSON.parse(JSON.stringify(defaultPermissions)));

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
    console.log("defaultPermissions", defaultPermissions);
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

const resetToDefault = () => {
  roles.value = JSON.parse(JSON.stringify(defaultPermissions));
  searchRole.value = "";
  searchAction.value = "";
  expandedRoles.value = [];
};

const formatDisplayName = (str) => {
  return str
    .replace(/([A-Z])/g, " $1") // insert space before capital letters
    .replace(/^./, (char) => char.toUpperCase()); // capitalize first letter
};

const toCamelCase = (str) => {
  return str
    .replace(/[^a-zA-Z0-9 ]/g, "") // Remove special characters
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
      index === 0 ? word.toLowerCase() : word.toUpperCase()
    )
    .replace(/\s+/g, "");
};

const addNewRoleWithPermission = () => {
  const rawRoleName = newRoleName.value.trim();
  const sectionName = newSectionName.value.trim();
  const selected = [...newSelectedActions.value];

  if (!rawRoleName || !sectionName || selected.length === 0) {
    alert(
      "Please enter role name, permission section and select at least one action."
    );
    return;
  }

  const roleName = toCamelCase(rawRoleName);

  const existingRole = roles.value.find((r) => r.name === roleName);

  if (existingRole) {
    // If role exists, add new section to it
    existingRole.permissions.push({
      name: sectionName,
      actions: selected,
    });
  } else {
    // Else, create new role
    roles.value.push({
      name: roleName,
      permissions: [
        {
          name: sectionName,
          actions: selected,
        },
      ],
    });
  }

  // Auto-expand the role after adding
  if (!expandedRoles.value.includes(roleName)) {
    expandedRoles.value.push(roleName);
  }

  // Clear form
  newRoleName.value = "";
  newSectionName.value = "";
  newSelectedActions.value = [];
};

onMounted(() => {
  fetchPermissionsFromBackend();
});
</script>

<style scoped>
/* Slightly rounded custom checkbox */
.custom-checkbox {
  appearance: none;
  width: 1rem;
  height: 1rem;
  border: 2px solid #3081df;
  border-radius: 0.2rem; /* slightly rounded */
  background-color: white;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;
  position: relative;
}

.custom-checkbox:checked {
  background-color: #3081df;
  border-color: #3081df;
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
