"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandling = errorHandling;
const AppError_1 = require("../errors/AppError");
function errorHandling(err, req, res, next) {
    console.error(`[${req.cid || 'no-cid'}] Error:`, err); // Should now work directly
    if (err instanceof AppError_1.AppError) {
        return res.status(err.status).json({
            error: err.code,
            msg: err.message,
            cid: req.cid // Should now work directly
        });
    }
    return res.status(500).json({
        error: "INTERNAL_SERVER_ERROR",
        msg: "Ocorreu um erro inesperado no servidor.",
        cid: req.cid // Should now work directly
    });
}
