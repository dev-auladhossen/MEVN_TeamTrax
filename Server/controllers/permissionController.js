// controllers/permissionController.js
import User from '../models/User.js';
import { defaultPermissions } from '../config/permissions.js';

export const getDefaultPermissions = (req, res) => {
  res.json(defaultPermissions);
};

export const getUserPermissions = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const permissions = user.customPermissions.length > 0
    ? user.customPermissions
    : defaultPermissions[user.role] || [];

  res.json({ role: user.role, permissions });
};

export const updateUserPermissions = async (req, res) => {
  const { userId } = req.params;
  const { permissions } = req.body;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.customPermissions = permissions;
  await user.save();

  res.json({ message: 'Permissions updated successfully' });
};
