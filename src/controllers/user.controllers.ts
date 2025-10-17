import { Request, Response } from "express";
import { UserService } from "../services/user.services";
import { AppError } from "../errors/AppError";
import { runValidation } from "../middleware/emailValidator.middlewares";

export class UserController {
  async getAll(req: Request, res: Response) {
    try {
      const users = UserService.getAll();
      res.json(users);
    } catch (err) {
      throw err;
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const user = UserService.getById(id);
      if (!user) {
        throw new AppError("Usuário não encontrado", "USER_NOT_FOUND", 404);
      }
      res.json(user);
    } catch (err) {
      throw err;
    }
  }

//TODO adicionar validação de email
  async create(req: Request, res: Response) {
    try {
      const { nome, email, senha, telefone } = req.body;
      const newUser = await UserService.createUser({ nome, email, senha, telefone });
      res.status(201).json(newUser);
    } catch (err) {
      throw err;
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const updatedUser = await UserService.updateUser(id, req.body);
      res.json(updatedUser);
    } catch (err) {
      throw err;
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await UserService.deleteUser(id);
      res.status(204).send();
    } catch (err) {
      throw err;
    }
  }

  testError (req: Request, res: Response) {
    throw new AppError("Erro padrão de teste", "TEST_ERROR", 401);
  }
}