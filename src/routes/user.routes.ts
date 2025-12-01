import { Router } from "express";
import { UserController } from "../controllers/user.controllers";

const userRoutes:  Router = Router();
const userController = new UserController();

userRoutes.get("/", userController.getAll);
userRoutes.get("/:id", userController.getById);
userRoutes.put("/:id", userController.update);
userRoutes.delete("/:id", userController.delete);

export {
    userRoutes
}
