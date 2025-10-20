import express, { Express, NextFunction, Request, Response }  from "express";
import { routes } from "./routes/routes";
import cors from "cors";
import swagger from "swagger-ui-express";

import { log } from "./middleware/log.middleware";
import { errorHandling } from "./middleware/error-handling.middleware";
// import { database } from './database/database'; 
import { cid } from "./middleware/cid.middleware";
import * as swaggerDocument from "./docs/swagger.json"


const app: Express = express();

app.use(cid); 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware Morgan
app.use(log);

app.get("/swagger.json", (req, res) => {
    res.send(swaggerDocument);
});

app.get("/health", (req, res)=> {
    res.status(200).send("API está funcionando!");
});

app.use("/api-docs", swagger.serve, swagger.setup(null, {
    swaggerOptions: {
        url: "/swagger.json"
    }
}))

// Configurações das rotas
app.use(routes);


// (async () => {
//     console.log(await database.query('select now() as data_atual', []));
// })();

// Tratativa de Erros 
app.use(errorHandling);

export { app };