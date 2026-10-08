const User = require("../models/user");

const adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Admin only.",
      });
    }

    // Keep the latest user information available
    req.user.role = user.role;

    next();
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to verify admin access",
    });
  }
};

module.exports = adminMiddleware;