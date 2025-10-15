import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

export function errorHandling(err: any, req: Request, res: Response, next: NextFunction) {
    console.error(`[${req.headers.cid || 'no-cid'}] Error:`, err);

    if (err instanceof AppError) {
        return res.status(err.status).json({
            error: err.code,
            msg: err.message,
            cid: req.headers.cid 
        });
    }

    return res.status(500).json({
        error: "INTERNAL_SERVER_ERROR",
        msg: "Ocorreu um erro inesperado no servidor.",
        cid: req.headers.cid 
    });
}