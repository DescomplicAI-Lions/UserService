import bcrypt from "bcrypt";
import { AppError } from "../errors/AppError";
import {
   CreateUserDTO,
   UpdateUserDTO,
   User,
} from "../interfaces/user.interface";
import { UserModel } from "../models/user.models";
import { EmailService } from "./email.services";
import { EmailConfirmationService } from "./emailConfirmation.services";

const saltRounds = 10;
const emailService = new EmailService();
const emailConfirmationService = new EmailConfirmationService(emailService);

export class UserService {
   static async getAll(): Promise<User[]> {
      return UserModel.getAll();
   }

   static async getById(id: number): Promise<User | undefined> {
      return UserModel.getById(id);
   }

   static async createUser(data: {
      nome: string;
      email: string;
      senha: string;
      telefone?: string;
      data_nascimento: Date;
      cpf_usuario: string;
   }): Promise<User> {
      const { nome, email, senha, telefone, data_nascimento, cpf_usuario } = data;

      // 1. Verifica duplicidade (Lógica de negócio)
      const existingUser = await UserModel.getByEmail(email);
      if (existingUser) {
         throw new AppError(
            "E-mail já cadastrado",
            "EMAIL_ALREADY_EXISTS",
            409
         );
      }

      // 2. Hash da Senha (Lógica de negócio)
      const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "12");
      const hashedPassword = await bcrypt.hash(senha, saltRounds);

      const userToCreate: CreateUserDTO = {
         name_user: nome,
         email: email,
         password_user: hashedPassword,
         phone: telefone,
         is_verified: false,
         born_date: data_nascimento,
         cpf: cpf_usuario
      };

      // 3. Cria no Banco (Lógica de negócio)
      const newUser = await UserModel.create(userToCreate);

      // 4. Envia E-mail de Confirmação (Lógica de negócio
      await emailConfirmationService.initiateEmailConfirmation(newUser.email);

      return newUser;
   }

   static async updateUser(
      id: number,
      data: { nome?: string; email?: string; senha?: string; telefone?: string }
   ): Promise<User> {
      if (Object.keys(data).length === 0) {
         throw new AppError(
            "Nenhum dado fornecido para atualização.",
            "VALIDATION_ERROR",
            400
         );
      }
      if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
         throw new AppError(
            "Formato de e-mail inválido.",
            "VALIDATION_ERROR",
            400
         );
      }
      if (data.senha && data.senha.length < 6) {
         throw new AppError(
            "A senha deve ter no mínimo 6 caracteres.",
            "VALIDATION_ERROR",
            400
         );
      }

      const existingUser = await UserModel.getById(id);
      if (!existingUser) {
         throw new AppError("Usuário não encontrado", "USER_NOT_FOUND", 404);
      }

      const userUpdates: UpdateUserDTO = {};
      if (data.nome !== undefined) userUpdates.name_user = data.nome;
      if (data.email !== undefined) userUpdates.email = data.email;
      if (data.telefone !== undefined) userUpdates.phone = data.telefone;

      if (data.senha) {
         userUpdates.password_user = await bcrypt.hash(data.senha, saltRounds);
      }

      const updatedUser = await UserModel.update(id, userUpdates);
      if (!updatedUser) {
         throw new AppError("Falha ao atualizar usuário", "UPDATE_FAILED", 500);
      }
      return updatedUser;
   }

   static async deleteUser(id: number): Promise<void> {
      const deleted = await UserModel.delete(id);
      if (!deleted) {
         throw new AppError("Usuário não encontrado", "USER_NOT_FOUND", 404);
      }
   }

   static async login(email: string, senhaLogin: string) {
      const user = await UserModel.getByEmail(email);

      if (!user) {
         throw new AppError("Email ou senha incorretos", "AUTH_ERROR", 401);
      }

      const isPasswordValid = await bcrypt.compare(senhaLogin, user.password_user);

      if (!isPasswordValid) {
         throw new AppError("Email ou senha incorretos", "AUTH_ERROR", 401);
      }

      const { password_user, ...userWithoutPassword } = user;
      
      return userWithoutPassword; 
   }
}
