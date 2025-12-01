import { Router } from "express";
import { userRoutes } from "./user.routes";
import { authRoutes } from "./auth.routes";
import { emailConfirmationRoutes } from "./emailConfirmatio.routes"; 
import { magicLinkRoutes } from "./magicLink.routes";

const routes: Router = Router();

routes.use("/users", userRoutes);
routes.use('/auth', authRoutes);
routes.use("/auth", magicLinkRoutes);
routes.use('/email-confirmation', emailConfirmationRoutes); 

export {
    routes
};