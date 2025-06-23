// config/permissions.js
export const defaultPermissions = {
  Developer: ['view_task', 'edit_task'],
  Designer: ['view_task', 'comment_task'],
  DevOps: ['view_task', 'deploy_code'],
  Tester: ['view_task', 'test_task'],
  BusinessAnalyst: ['view_task', 'comment_task', 'create_report'],
  Marketer: ['view_task', 'view_analytics'],
  Sales: ['view_task', 'manage_leads'],
  Admin: ['*'],
  ProjectManager: ['view_task', 'edit_task', 'assign_user', 'create_task'],
};


