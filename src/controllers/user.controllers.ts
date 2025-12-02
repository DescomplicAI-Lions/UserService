import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { User } from "../interfaces/user.interface"; 
import { UserService } from "../services/user.services";
import {
   validateEmail,
   validateName,
   validatePassword,
   validateCpf,
   validateBornDate
} from "../utils/validators";

export class UserController {
   async getAll(req: Request, res: Response) {
      try {
         const users: User[] = await UserService.getAll(); 
         res.json(users);
      } catch (err) {
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
         const user: User | undefined = await UserService.getById(id); 
         if (!user) {
            throw new AppError("Usuário não encontrado", "USER_NOT_FOUND", 404);
         }
         res.json(user);
      } catch (err) {
         throw err;
      }
   }

   async createOwner(req: Request, res: Response, next: NextFunction) {
      try {
         const { nome, email, senha, telefone, data_nascimento, cpf_usuario } = req.body;

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

         // Valida o cpf
         // Produção
         const cpfValidation = await validateCpf(cpf_usuario);
         if (!cpfValidation.isValid) {
            throw new AppError(
               (await cpfValidation).message,
               "VALIDATION_ERROR",
               400
            )
         }

         // Homologação
         // const cpfHValidation = await validateHCpf(cpf_usuario);
         // if (!cpfHValidation.isValid) {
         //    throw new AppError(
         //       (await cpfHValidation).message,
         //       "VALIDATION_ERROR",
         //       400
         //    )
         // }

         const bornValidate = validateBornDate(data_nascimento);
         if (!bornValidate.isValid) {
            throw new AppError(
               bornValidate.message,
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
            data_nascimento,
            cpf_usuario,
            tipo: "owner"
         });

         res.status(201).json(newUser);
      } catch (err) {
         next(err); // Passa o erro para o middleware de errorHandlin
      }
   }

   async createEmployee(req: Request, res: Response, next: NextFunction) {
      try {
         const { nome, email, senha, telefone, data_nascimento, cpf_usuario } = req.body;

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

         // Valida o cpf
         // Produção
         const cpfValidation = await validateCpf(cpf_usuario);
         if (!cpfValidation.isValid) {
            throw new AppError(
               (await cpfValidation).message,
               "VALIDATION_ERROR",
               400
            )
         }

         // Homologação
         // const cpfHValidation = await validateHCpf(cpf_usuario);
         // if (!cpfHValidation.isValid) {
         //    throw new AppError(
         //       (await cpfHValidation).message,
         //       "VALIDATION_ERROR",
         //       400
         //    )
         // }

         const bornValidate = validateBornDate(data_nascimento);
         if (!bornValidate.isValid) {
            throw new AppError(
               bornValidate.message,
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
            data_nascimento,
            cpf_usuario,
            tipo: "employee"
         });

         res.status(201).json(newUser);
      } catch (err) {
         next(err); // Passa o erro para o middleware de errorHandlin
      }
   }

   async createClient(req: Request, res: Response, next: NextFunction) {
      try {
         const { nome, email, senha, telefone, data_nascimento, cpf_usuario } = req.body;

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

         // Valida o cpf
         // Produção
         const cpfValidation = await validateCpf(cpf_usuario);
         if (!cpfValidation.isValid) {
            throw new AppError(
               (await cpfValidation).message,
               "VALIDATION_ERROR",
               400
            )
         }

         // Homologação
         // const cpfHValidation = await validateHCpf(cpf_usuario);
         // if (!cpfHValidation.isValid) {
         //    throw new AppError(
         //       (await cpfHValidation).message,
         //       "VALIDATION_ERROR",
         //       400
         //    )
         // }

         const bornValidate = validateBornDate(data_nascimento);
         if (!bornValidate.isValid) {
            throw new AppError(
               bornValidate.message,
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
            data_nascimento,
            cpf_usuario,
            tipo: "client"
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
         const updatedUser: User = await UserService.updateUser(id, req.body); 
         res.json(updatedUser);
      } catch (err) {
         throw err;
      }
   }

   async updatePassword(req: Request, res: Response) {
      try {
         const id = Number(req.params.id);
         if (isNaN(id)) {
            throw new AppError(
               "ID de usuário inválido",
               "VALIDATION_ERROR",
               400
            );
         }
         const updatedUser: User = await UserService.updatePasswordUser(id, req.body); 
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
         await UserService.deleteUser(id);
         res.status(204).send();
      } catch (err) {
         throw err;
      }
   }

   async loginUser(req: Request, res: Response) {
      const { email, password } = req.body;
   
      try {
         const user = await UserService.login(email, password);
   
         return res.status(200).json({
            status: "success",
            data: user
         });
   
      } catch (err) {
         throw err;
      }
   }

   testError(req: Request, res: Response) {
      throw new AppError("Erro padrão de teste", "TEST_ERROR", 401);
   }
}
