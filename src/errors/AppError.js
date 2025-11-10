"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
class AppError extends Error {
    constructor(message, code, status = 500, details) {
        super(message);
        this.name = 'AppError'; // Nome do error
        this.status = status;
        this.code = code;
        this.details = details;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
exports.AppError = AppError;
