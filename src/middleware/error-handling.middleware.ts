import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

export function errorHandling(err: any, req: Request, res: Response, next: NextFunction) {
    if (err instanceof AppError) {
        return res.status(err.status).json({
            error: err.code,
            msg: err.message,
            cid: req.headers.cid
        })
    }

    return res.status(500).json({
        error: "INTERNAL_ERROR",
        msg: err.message,
        cid: req.headers.cid
    });
}