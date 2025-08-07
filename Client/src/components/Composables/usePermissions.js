// composables/usePermissions.js
import { reactive } from 'vue';

const permissions = reactive({
  list: []
});

export function setPermissions(newPermissions) {
  permissions.list = newPermissions;
}

export function usePermissions() {
  function hasPermission(permissionName) {
    return permissions.list.includes(permissionName);
  }

  return {
    permissions,
    hasPermission
  };
}
