
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables
dotenv.config();

// Import database connection
const connectDB = require("./config/connectDB");

// Import routes
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const proposalRoutes = require("./routes/proposalRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Freelancing Platform Backend API is running"
    });
});

// User routes
app.use("/api/user", userRoutes);

// Project routes
app.use("/api/projects", projectRoutes);

// Proposal routes
app.use("/api", proposalRoutes);

// Dashboard routes
app.use("/api", dashboardRoutes);

// 404 route
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API route not found"
    });
});

// Server port
const PORT = process.env.PORT || 8000;

// Connect database and start server
const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
};

// Start application
startServer();
