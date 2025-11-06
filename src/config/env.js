"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
console.log('NODE_ENV', process.env.NODE_ENV);
dotenv_1.default.config({
    path: process.env.NODE_ENV != "" && process.env.NODE_ENV != undefined ? `.env.${process.env.NODE_ENV}` : ".env"
});
exports.config = {
    app_name: process.env.APP_ENV,
    app_port: process.env.PORT_ENV,
    db_host: process.env.DB_HOST,
    db_port: process.env.DB_PORT,
    db_database: process.env.DB_DATABASE,
    db_user: process.env.DB_USER,
    db_password: process.env.DB_PASSWORD,
};
