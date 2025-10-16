import { Router } from "express";
import { exampleRoutes } from "./example.routes";
import { userRoutes } from "./user.routes"
import { magicLinkRoutes } from "./magicLink.routes"

const routes: Router = Router();

routes.use(exampleRoutes); 
routes.use("/users", userRoutes);
routes.use('/auth', magicLinkRoutes);

export {
    routes
}