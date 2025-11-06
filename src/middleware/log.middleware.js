"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
const morgan_1 = __importDefault(require("morgan"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const storageDir = path_1.default.join(__dirname, "..", "storage");
if (!fs_1.default.existsSync(storageDir)) {
    fs_1.default.mkdirSync(storageDir, { recursive: true });
}
const filelog = fs_1.default.createWriteStream(path_1.default.join(storageDir, "acess.log"), { flags: "a" });
morgan_1.default.token('cid', function getCid(req) {
    return req.cid || 'no-cid'; // Should now work directly
});
const customLogFormat = ":remote-addr - :remote-user [:date[clf]] \":method :url HTTP/:http-version\" :status :res[content-length] \":referrer\" \":user-agent\" cid=:cid";
exports.log = (0, morgan_1.default)(customLogFormat, { stream: filelog });
