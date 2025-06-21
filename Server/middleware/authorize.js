// middlewares/authorize.js
module.exports = function authorize(...allowedRoles) {
  console.log("allowed roles", ...allowedRoles);
  return (req, res, next) => {
    const userRole = req.user?.role;
    console.log("userRole", userRole);

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }

    next();
  };
};
