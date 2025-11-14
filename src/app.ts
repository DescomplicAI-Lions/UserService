import cors from "cors";
import express, { Express } from "express";
import swagger from "swagger-ui-express";
import { database } from "./database/database";
import * as swaggerDocument from "./docs/swagger.json";
import { cid } from "./middleware/cid.middleware";
import { errorHandling } from "./middleware/error-handling.middleware";
import { log } from "./middleware/log.middleware";
import { routes } from "./routes/routes";

const app: Express = express();

// --- Middleware Setup ---
app.use(cid);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(log);

// --- Swagger ---
app.get("/swagger.json", (req, res) => res.json(swaggerDocument));
app.use(
   "/api-docs",
   swagger.serve,
   swagger.setup(null, {
      swaggerOptions: { url: "/swagger.json" },
   })
);

// --- Health Check ---
app.get("/health", async (req, res) => {
   try {
      const dbCheck = await database.query("SELECT 1 as status");
      if (dbCheck.status) {
         res.status(200).json({
            status: "UP",
            database: "Connected",
            timestamp: new Date().toISOString(),
         });
      } else {
         res.status(500).json({
            status: "DOWN",
            database: "Disconnected",
            error: dbCheck.error?.message,
         });
      }
   } catch (error) {
      res.status(500).json({
         status: "DOWN",
         database: "Error",
         error: (error as Error).message,
      });
   }
});

// --- Main Routes ---
app.use(routes);

// --- Global Error Handling ---
app.use(errorHandling);

// --- Export only the app (no listen!) ---
export default app;
