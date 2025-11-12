import { UserModel } from "../models/user.models";
import { User, CreateUserDTO, UpdateUserDTO } from "../interfaces/user.interface";
import { AppError } from "../errors/AppError";
import bcrypt from 'bcrypt';
import { EmailConfirmationService } from './emailConfirmation.services'; 
import { EmailService } from './email.services'; 

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

  static async createUser(data: { nome: string, email: string, senha: string, telefone?: string }): Promise<User> {
    if (!data.nome || !data.email || !data.senha) {
      throw new AppError("Nome, email e senha são obrigatórios.", "VALIDATION_ERROR", 400);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      throw new AppError("Formato de e-mail inválido.", "VALIDATION_ERROR", 400);
    }
    if (data.senha.length < 6) {
        throw new AppError("A senha deve ter no mínimo 6 caracteres.", "VALIDATION_ERROR", 400);
    }

    const existingUser = await UserModel.getByEmail(data.email);
    if (existingUser) {
      throw new AppError("E-mail já cadastrado", "EMAIL_ALREADY_EXISTS", 409);
    }

    const hashedPassword = await bcrypt.hash(data.senha, saltRounds);

    const userToCreate: CreateUserDTO = {
        name_user: data.nome,
        email: data.email,
        password_user: hashedPassword,
        phone: data.telefone,
        is_verified: false,
    };

    const newUser = await UserModel.create(userToCreate);

    await emailConfirmationService.initiateEmailConfirmation(newUser.email);

    return newUser;
  }

  static async updateUser(
    id: number,
    data: { nome?: string, email?: string, senha?: string, telefone?: string }
  ): Promise<User> {
    if (Object.keys(data).length === 0) {
        throw new AppError("Nenhum dado fornecido para atualização.", "VALIDATION_ERROR", 400);
    }
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        throw new AppError("Formato de e-mail inválido.", "VALIDATION_ERROR", 400);
    }
    if (data.senha && data.senha.length < 6) {
        throw new AppError("A senha deve ter no mínimo 6 caracteres.", "VALIDATION_ERROR", 400);
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
}