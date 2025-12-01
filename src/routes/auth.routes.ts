import { Router } from "express";
import { UserController } from "../controllers/user.controllers";

const authRoutes:  Router = Router();
const loginController = new UserController();

authRoutes.post("/register", loginController.create); //TODO adicionar roles específicas
authRoutes.post("/login", loginController.loginUser);
authRoutes.put("/:id", loginController.updatePassword); 
// TODO
// authRoutes.post("/logout", loginController.TODO);
// authRoutes.post("/refresh-token", loginController.TODO);

export {
    authRoutes
}
