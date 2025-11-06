"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = void 0;
const pg_1 = require("pg");
const env_1 = require("../config/env");
class Database {
    constructor() {
        const poolConfig = {
            host: env_1.config.db_host,
            port: Number(env_1.config.db_port),
            database: env_1.config.db_database,
            user: env_1.config.db_user,
            password: env_1.config.db_password,
            ssl: {
                rejectUnauthorized: false
            },
            max: 20,
            idleTimeoutMillis: 30000
        };
        this.pool = new pg_1.Pool(poolConfig);
    }
    async query(sql, values) {
        try {
            const result = await this.pool.query(sql, values);
            return {
                status: true,
                data: result.rows
            };
        }
        catch (error) {
            return {
                status: false,
                data: [],
                error: error
            };
        }
    }
    async end() {
        await this.pool.end();
        console.log("Conexão com bancode ddados encerrada!");
    }
}
const database = new Database();
exports.database = database;
