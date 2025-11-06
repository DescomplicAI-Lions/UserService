import { Request, Response } from "express";
import { UserService } from "../services/user.services";
import { AppError } from "../errors/AppError";
import { verifyEmailDeliverability } from "../middleware/emailValidator.middlewares";
import { User } from "../interfaces/user.interface"; // Import User interface

export class UserController {
  async getAll(req: Request, res: Response) {
    try {
      const users: User[] = await UserService.getAll(); // Await the async call
      res.json(users);
    } catch (err) {
      // It's better to pass the error to a global error handler middleware
      // For now, re-throw or handle here
      throw err;
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        throw new AppError("ID de usuário inválido", "VALIDATION_ERROR", 400);
      }
      const user: User | undefined = await UserService.getById(id); // Await
      if (!user) {
        throw new AppError("Usuário não encontrado", "USER_NOT_FOUND", 404);
      }
      res.json(user);
    } catch (err) {
      throw err;
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { nome, email, senha, telefone } = req.body;

      // Assuming verifyEmailDeliverability is also async
      const isValid = await verifyEmailDeliverability(email);

      if (isValid) {
        const newUser: User = await UserService.createUser({ nome, email, senha, telefone }); // Await
        res.status(201).json(newUser);
      } else {
        throw new AppError("Email não encontrado ou inválido", "EMAIL_NOT_FOUND", 400); // Changed to 400
      }
    } catch (err) {
      throw err;
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        throw new AppError("ID de usuário inválido", "VALIDATION_ERROR", 400);
      }
      const updatedUser: User = await UserService.updateUser(id, req.body); // Await
      res.json(updatedUser);
    } catch (err) {
      throw err;
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        throw new AppError("ID de usuário inválido", "VALIDATION_ERROR", 400);
      }
      await UserService.deleteUser(id); // Await
      res.status(204).send();
    } catch (err) {
      throw err;
    }
  }

  testError (req: Request, res: Response) {
    throw new AppError("Erro padrão de teste", "TEST_ERROR", 401);
  }
}