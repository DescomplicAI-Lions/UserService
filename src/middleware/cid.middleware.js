"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cid = cid;
const crypto_1 = __importDefault(require("crypto"));
function cid(req, res, next) {
    const correlationId = crypto_1.default.randomUUID();
    req.cid = correlationId; // Should now work directly
    next();
}
