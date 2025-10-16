// src/app.ts
import express, { Express, NextFunction, Request, Response }  from "express";
import { routes } from "./routes/routes";
import cors from "cors";

import { log } from "./middleware/log.middleware";
import { errorHandling } from "./middleware/error-handling.middleware";
// import { database } from './database/database'; 
import { cid } from "./middleware/cid.middleware";
import magicLinkRoutes from './routes/magicLink.routes';

const app: Express = express();

app.use(cid); 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware Morgan
app.use(log);

// Configurações das rotas
app.use(routes);

app.use('/auth', magicLinkRoutes);


// (async () => {
//     console.log(await database.query('select now() as data_atual', []));
// })();

// Tratativa de Erros 
app.use(errorHandling);

export { app };