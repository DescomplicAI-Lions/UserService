"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const env_1 = require("./config/env");
app_1.app.listen(env_1.config.app_port, () => {
    console.log(`Servidor ${env_1.config.app_name} iniciado na porta ${env_1.config.app_port}`);
});
