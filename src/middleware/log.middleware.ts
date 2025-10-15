import morgan from "morgan";
import fs from "fs";
import path from "path";
import { Request } from "express";

const storageDir = path.join(__dirname, "..", "storage");
if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
}

const filelog = fs.createWriteStream(path.join(storageDir, "acess.log"), { flags: "a" });

morgan.token('cid', function getCid (req: Request) { // Should now work directly
  return req.cid || 'no-cid'; // Should now work directly
});

const customLogFormat = ":remote-addr - :remote-user [:date[clf]] \":method :url HTTP/:http-version\" :status :res[content-length] \":referrer\" \":user-agent\" cid=:cid";

export const log = morgan(customLogFormat, { stream: filelog });