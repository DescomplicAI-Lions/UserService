import { Router } from "express";
import { exampleRoutes } from "./example.routes";
import { userRoutes } from "./user.routes"

const routes: Router = Router();

routes.use(exampleRoutes); 
routes.use("/users", userRoutes);

export {
    routes
}