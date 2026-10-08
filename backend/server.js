const express = require("express");
const cors = require("cors");
const authMiddleware = require("./middleware/authMiddleware");
const adminMiddleware = require("./middleware/adminMiddleware");
require("dotenv").config();
const app = express();


const connectDB = require("./config/db");


// Middlewares
app.use(cors());
app.use(express.json());

connectDB();
const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to KnowledgeHub API!",
  });
});


app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You can access this route",
    user: req.user,
  });
});

app.use("/api/knowledge", require("./routes/knowledgeRoutes"));
app.use("/api/bookmarks", require("./routes/bookmarkRoutes"));
app.use("/api/feedback",require("./routes/feedbackRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/admin" , require("./routes/adminRoutes"));
app.use("/api/credits", require("./routes/creditRoutes"));

app.get(
  "/api/admin",
  authMiddleware,
  adminMiddleware,
  (req, res) => {
    res.json({
      message: "Welcome Admin!",
      user: req.user,
    });
  }
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});