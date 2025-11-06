"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_services_1 = require("../services/user.services");
const AppError_1 = require("../errors/AppError");
class UserController {
    async getAll(req, res) {
        try {
            const users = user_services_1.UserService.getAll();
            res.json(users);
        }
        catch (err) {
            throw err;
        }
    }
    async getById(req, res) {
        try {
            const id = Number(req.params.id);
            const user = user_services_1.UserService.getById(id);
            if (!user) {
                throw new AppError_1.AppError("Usuário não encontrado", "USER_NOT_FOUND", 404);
            }
            res.json(user);
        }
        catch (err) {
            throw err;
        }
    }
    async create(req, res) {
        try {
            const { nome, email, senha, telefone } = req.body;
            const newUser = await user_services_1.UserService.createUser({ nome, email, senha, telefone });
            res.status(201).json(newUser);
        }
        catch (err) {
            throw err;
        }
    }
    async update(req, res) {
        try {
            const id = Number(req.params.id);
            const updatedUser = await user_services_1.UserService.updateUser(id, req.body);
            res.json(updatedUser);
        }
        catch (err) {
            throw err;
        }
    }
    async delete(req, res) {
        try {
            const id = Number(req.params.id);
            await user_services_1.UserService.deleteUser(id);
            res.status(204).send();
        }
        catch (err) {
            throw err;
        }
    }
    testError(req, res) {
        throw new AppError_1.AppError("Erro padrão de teste", "TEST_ERROR", 401);
    }
}
exports.UserController = UserController;
