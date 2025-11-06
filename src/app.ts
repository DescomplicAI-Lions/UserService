import express, { Express, NextFunction, Request, Response } from "express";
import { database } from './database/database'; // Your database instance
import { routes } from "./routes/routes"; // Your main router
import cors from "cors";
import swagger from "swagger-ui-express";

import { log } from "./middleware/log.middleware"; // Your logging middleware
import { errorHandling } from "./middleware/error-handling.middleware"; // Your error handling middleware
import { cid } from "./middleware/cid.middleware"; // Your correlation ID middleware
import * as swaggerDocument from "./docs/swagger.json"; // Your Swagger JSON

import { config } from "./config/env"; // Import your config

const app: Express = express();

// --- Middleware Setup ---
app.use(cid);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging Middleware (Morgan-like)
app.use(log);

// --- Swagger Setup ---
app.get("/swagger.json", (req, res) => {
    res.json(swaggerDocument); // Use res.json for JSON objects
});

app.use("/api-docs", swagger.serve, swagger.setup(null, {
    swaggerOptions: {
        url: "/swagger.json"
    }
}));

// --- Health Check ---
app.get("/health", async (req, res) => {
    try {
        // Test database connection
        const dbCheck = await database.query('SELECT 1 as status');
        if (dbCheck.status) {
            res.status(200).json({
                status: "UP",
                database: "Connected",
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(500).json({
                status: "DOWN",
                database: "Disconnected",
                error: dbCheck.error?.message,
                timestamp: new Date().toISOString()
            });
        }
    } catch (error) {
        console.error("Health check error:", error);
        res.status(500).json({
            status: "DOWN",
            database: "Error",
            error: (error as Error).message,
            timestamp: new Date().toISOString()
        });
    }
});

// --- Main Application Routes ---
app.use(routes);

// --- Global Error Handling Middleware ---
// This should be the last middleware added
app.use(errorHandling);

// --- Server Start Logic ---
const startServer = async () => {
    const PORT = Number(config.app_port) || 3000;

    // Optional: Test database connection on startup
    try {
        const dbTest = await database.query('SELECT NOW()');
        if (dbTest.status) {
            console.log('Database connection successful!');
        } else {
            console.error('Failed to connect to database on startup:', dbTest.error);
            // Depending on criticality, you might want to exit here
            // process.exit(1);
        }
    } catch (err) {
        console.error('Error during database startup test:', err);
        // process.exit(1);
    }

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`App Name: ${config.app_name}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`API Docs available at /api-docs`);
    });
};

// --- Graceful Shutdown ---
const gracefulShutdown = async () => {
    console.log('Shutting down server...');
    try {
        await database.end(); // Close the database connection pool
        console.log('Database pool closed.');
    } catch (error) {
        console.error('Error closing database pool:', error);
    }
    process.exit(0);
};

process.on('SIGINT', gracefulShutdown); // Ctrl+C
process.on('SIGTERM', gracefulShutdown); // kill command

// Start the server
startServer();

export { app };