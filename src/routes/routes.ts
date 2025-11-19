import { Router } from "express";
import { userRoutes } from "./user.routes";
import { magicLinkRoutes } from "./magicLink.routes";
import { emailConfirmationRoutes } from "./emailConfirmatio.routes"; 

const routes: Router = Router();

routes.use("/users", userRoutes);
routes.use('/auth', magicLinkRoutes);
routes.use('/email-confirmation', emailConfirmationRoutes); 

export {
    routes
};