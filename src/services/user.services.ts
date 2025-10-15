import { UserModel, User } from "../models/user.models";
import { AppError } from "../errors/AppError";
import bcrypt from 'bcrypt';

const saltRounds = 10;

export class UserService {
  static getAll(): User[] {
    return UserModel.getAll();
  }

  static getById(id: number): User | undefined {
    return UserModel.getById(id);
  }

  static async createUser(data: Omit<User, "id" | "createdAt">): Promise<User> {
    if (!data.nome || !data.email || !data.senha) {
      throw new AppError("Nome, email e senha são obrigatórios.", "VALIDATION_ERROR", 400);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      throw new AppError("Formato de e-mail inválido.", "VALIDATION_ERROR", 400);
    }
    if (data.senha.length < 6) { 
        throw new AppError("A senha deve ter no mínimo 6 caracteres.", "VALIDATION_ERROR", 400);
    }

    const existingUser = UserModel.getByEmail(data.email);
    if (existingUser) {
      throw new AppError("E-mail já cadastrado", "EMAIL_ALREADY_EXISTS", 409);
    }

    const hashedPassword = await bcrypt.hash(data.senha, saltRounds);

    return UserModel.create({ ...data, senha: hashedPassword });
  }

  static async updateUser(
    id: number,
    data: Partial<Omit<User, "id" | "createdAt">>
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

    const existingUser = UserModel.getById(id);
    if (!existingUser) {
      throw new AppError("Usuário não encontrado", "USER_NOT_FOUND", 404);
    }

    if (data.senha) {
      data.senha = await bcrypt.hash(data.senha, saltRounds);
    }

    const updatedUser = UserModel.update(id, data);
    if (!updatedUser) {
        throw new AppError("Falha ao atualizar usuário", "UPDATE_FAILED", 500);
    }
    return updatedUser;
  }

  static deleteUser(id: number): void {
    const deleted = UserModel.delete(id);
    if (!deleted) {
      throw new AppError("Usuário não encontrado", "USER_NOT_FOUND", 404);
    }
  }
}