import crypto from "crypto";
import { NextFunction, Request, Response } from "express";

export function cid(req: Request, res: Response, next: NextFunction) {
    const correlationId = crypto.randomUUID();
    req.cid = correlationId; // Should now work directly
    next();
}