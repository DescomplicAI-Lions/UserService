import { app } from "./app";
import { config } from "./config/env";
import { database } from "./database/database";

const PORT = Number(config.app_port) || 3000;

const startServer = async () => {
   try {
      const dbTest = await database.query("SELECT NOW()");
      if (dbTest.status) {
         console.log("Database connection successful!");
      }
   } catch (err) {
      console.error("Error during database startup test:", err);
   }

   app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
   });
};

startServer();
