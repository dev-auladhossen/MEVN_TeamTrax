module.exports = function checkPermission(...requiredPermissions) {
  return (req, res, next) => {
    const userPermissions = req.user?.permissions || [];

    const hasPermission = requiredPermissions.some(permission =>
      userPermissions.includes(permission)
    );

    if (!hasPermission) {
      return res.status(403).json({ message: "Forbidden: Permission denied" });
    }

    next();
  };
};
