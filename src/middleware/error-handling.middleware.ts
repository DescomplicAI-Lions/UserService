import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

export function errorHandling(err: any, req: Request, res: Response, next: NextFunction) {
    console.error(`[${req.cid || 'no-cid'}] Error:`, err); // Should now work directly

    if (err instanceof AppError) {
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