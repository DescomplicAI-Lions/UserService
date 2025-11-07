"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExampleController = void 0;
const AppError_1 = require("../errors/AppError");
class ExampleController {
    async example(req, res) {
        console.log("cid", req.headers.cid);
        return res.send("Hello Typescript!");
    }
    testError(req, res) {
        try {
            throw new AppError_1.AppError("Erro padrão", "APP_INFO", 401);
        }
        catch (err) {
            // throw new AppError("Erro padrão", "APP_INFO", 402, req.body, { cause: err as Error });
        }
    }
}
exports.ExampleController = ExampleController;
