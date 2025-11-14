import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { User } from "../interfaces/user.interface"; // Import User interface
import { UserService } from "../services/user.services";
import {
   validateEmail,
   validateName,
   validatePassword,
} from "../utils/validators";

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
            throw new AppError(
               "ID de usuário inválido",
               "VALIDATION_ERROR",
               400
            );
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

   async create(req: Request, res: Response, next: NextFunction) {
      // <-- Adicionei o 'next'
      try {
         const { nome, email, senha, telefone } = req.body;

         // Valida o Nome
         const nameValidation = validateName(nome);
         if (!nameValidation.isValid) {
            throw new AppError(nameValidation.message, "VALIDATION_ERROR", 400);
         }

         // Valida o Email
         const emailValidation = validateEmail(email);
         if (!emailValidation.isValid) {
            throw new AppError(
               emailValidation.message,
               "VALIDATION_ERROR",
               400
            );
         }

         // Valida a Senha
         const passwordValidation = validatePassword(senha);
         if (!passwordValidation.isValid) {
            throw new AppError(
               passwordValidation.message,
               "VALIDATION_ERROR",
               400
            );
         }

         // 2. Chama o Serviço (que agora só faz a lógica de negócio)
         const newUser: User = await UserService.createUser({
            nome,
            email,
            senha,
            telefone,
         });

         res.status(201).json(newUser);
      } catch (err) {
         next(err); // Passa o erro para o middleware de errorHandlin
      }
   }

   async update(req: Request, res: Response) {
      try {
         const id = Number(req.params.id);
         if (isNaN(id)) {
            throw new AppError(
               "ID de usuário inválido",
               "VALIDATION_ERROR",
               400
            );
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
            throw new AppError(
               "ID de usuário inválido",
               "VALIDATION_ERROR",
               400
            );
         }
         await UserService.deleteUser(id); // Await
         res.status(204).send();
      } catch (err) {
         throw err;
      }
   }

   testError(req: Request, res: Response) {
      throw new AppError("Erro padrão de teste", "TEST_ERROR", 401);
   }
}
