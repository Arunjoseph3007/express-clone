"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const send_1 = __importDefault(require("send"));
const content_disposition_1 = __importDefault(require("content-disposition"));
const htmlTemplate_1 = require("./utils/htmlTemplate");
class Response {
    constructor(res) {
        this.res = res;
        this.isBrowserRequest =
            this.res.req.headers["sec-fetch-dest"] == "document";
    }
    set(field, value) {
        this.res.setHeader(field, value);
        return this;
    }
    setHeader(field, value) {
        this.res.setHeader(field, value);
        return this;
    }
    write(message, cb) {
        this.res.write(message, cb);
        return this;
    }
    end(cb) {
        this.res.end(cb);
        return this;
    }
    send(message, cb) {
        if (this.isBrowserRequest) {
            this.setHeader("Content-Type", "text/html");
            this.write((0, htmlTemplate_1.htmlTemplate)(this, message), cb);
        }
        else {
            this.write(message, cb);
        }
        this.end();
        return this;
    }
    status(statusCode) {
        this.res.statusCode = statusCode;
        return this;
    }
    writeHead(statusCode, statusMessage, headers) {
        this.res.writeHead(statusCode, statusMessage, headers);
        return this;
    }
    pipe(dest, opt) {
        return this.res.pipe(dest, opt);
    }
    json(data) {
        this.set("content-type", "application/json");
        this.send(JSON.stringify(data));
        return this;
    }
    success(data) {
        this.status(200).json(data);
        return this;
    }
    sendFile(path, options) {
        const file = (0, send_1.default)(this.res.req, encodeURI(path), options);
        file.pipe(this.res);
        return this;
    }
    download(filePath, options) {
        this.setHeader("content-disposition", (0, content_disposition_1.default)(filePath));
        return this.sendFile(filePath, options);
    }
}
exports.default = Response;
