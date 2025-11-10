"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
// src/app.ts
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes/routes");
const cors_1 = __importDefault(require("cors"));
const log_middleware_1 = require("./middleware/log.middleware");
const error_handling_middleware_1 = require("./middleware/error-handling.middleware");
// import { database } from './database/database'; 
const cid_middleware_1 = require("./middleware/cid.middleware");
const app = (0, express_1.default)();
exports.app = app;
app.use(cid_middleware_1.cid);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Middleware Morgan
app.use(log_middleware_1.log);
// Configurações das rotas
app.use(routes_1.routes);
// (async () => {
//     console.log(await database.query('select now() as data_atual', []));
// })();
// Tratativa de Erros 
app.use(error_handling_middleware_1.errorHandling);
