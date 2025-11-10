import morgan from "morgan";
// import fs from "fs"; // REMOVIDO PARA O VERCEL
// import path from "path"; // REMOVIDO PARA O VERCEL
import { Request, Response } from "express";

// REMOVIDO PARA O VERCEL
// const storageDir = path.join(__dirname, "..", "storage");
// if (!fs.existsSync(storageDir)) {
//     fs.mkdirSync(storageDir, { recursive: true });
// }
// const filelog = fs.createWriteStream(path.join(storageDir, "acess.log"), { flags: "a" });

morgan.token('cid', function  (req: Request, res: Response) {
  return req.headers['x-request-id'] as string || 'no-cid';
});

const customLogFormat = ":remote-addr - :remote-user [:date[clf]] \":method :url HTTP/:http-version\" :status :res[content-length] \":referrer\" \":user-agent\" cid=:cid";

export const log = morgan(customLogFormat, {
  stream: {
    write: (message: string) => console.log(message.trim()),
  },
});