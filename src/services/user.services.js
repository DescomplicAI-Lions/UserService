"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_models_1 = require("../models/user.models");
const AppError_1 = require("../errors/AppError");
const bcrypt_1 = __importDefault(require("bcrypt"));
const saltRounds = 10;
class UserService {
    static getAll() {
        return user_models_1.UserModel.getAll();
    }
    static getById(id) {
        return user_models_1.UserModel.getById(id);
    }
    static async createUser(data) {
        if (!data.nome || !data.email || !data.senha) {
            throw new AppError_1.AppError("Nome, email e senha são obrigatórios.", "VALIDATION_ERROR", 400);
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            throw new AppError_1.AppError("Formato de e-mail inválido.", "VALIDATION_ERROR", 400);
        }
        if (data.senha.length < 6) {
            throw new AppError_1.AppError("A senha deve ter no mínimo 6 caracteres.", "VALIDATION_ERROR", 400);
        }
        const existingUser = user_models_1.UserModel.getByEmail(data.email);
        if (existingUser) {
            throw new AppError_1.AppError("E-mail já cadastrado", "EMAIL_ALREADY_EXISTS", 409);
        }
        const hashedPassword = await bcrypt_1.default.hash(data.senha, saltRounds);
        return user_models_1.UserModel.create({ ...data, senha: hashedPassword });
    }
    static async updateUser(id, data) {
        if (Object.keys(data).length === 0) {
            throw new AppError_1.AppError("Nenhum dado fornecido para atualização.", "VALIDATION_ERROR", 400);
        }
        if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            throw new AppError_1.AppError("Formato de e-mail inválido.", "VALIDATION_ERROR", 400);
        }
        if (data.senha && data.senha.length < 6) {
            throw new AppError_1.AppError("A senha deve ter no mínimo 6 caracteres.", "VALIDATION_ERROR", 400);
        }
        const existingUser = user_models_1.UserModel.getById(id);
        if (!existingUser) {
            throw new AppError_1.AppError("Usuário não encontrado", "USER_NOT_FOUND", 404);
        }
        if (data.senha) {
            data.senha = await bcrypt_1.default.hash(data.senha, saltRounds);
        }
        const updatedUser = user_models_1.UserModel.update(id, data);
        if (!updatedUser) {
            throw new AppError_1.AppError("Falha ao atualizar usuário", "UPDATE_FAILED", 500);
        }
        return updatedUser;
    }
    static deleteUser(id) {
        const deleted = user_models_1.UserModel.delete(id);
        if (!deleted) {
            throw new AppError_1.AppError("Usuário não encontrado", "USER_NOT_FOUND", 404);
        }
    }
}
exports.UserService = UserService;
