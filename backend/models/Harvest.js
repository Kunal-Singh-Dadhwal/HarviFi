const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
const harvestRoutes = require("./routes/harvestRoutes");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Sync Database
sequelize.sync({ force: false }).then(() => {
    console.log("Database connected and tables synced.");
});

// Routes
app.use("/api", harvestRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
