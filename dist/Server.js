"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const Router_1 = __importDefault(require("./Router"));
const Request_1 = __importDefault(require("./Request"));
const Response_1 = __importDefault(require("./Response"));
const handler_1 = require("./interfaces/handler");
const path_to_regexp_1 = require("path-to-regexp");
const docTemplate_1 = require("./utils/docTemplate");
class Server extends Router_1.default {
    constructor() {
        super(...arguments);
        this.isListening = false;
        this.errorHandler = (err, req, res) => {
            return res.status(400).json({ err, message: "Something went wrong" });
        };
    }
    listen(port, callback) {
        if (this.isListening) {
            console.log("Server Already running");
            return;
        }
        this.isListening = true;
        this.compileHandlers();
        this.doc();
        this.server = http_1.default.createServer(this.handle.bind(this));
        this.server.listen(port, callback);
    }
    shutdown() {
        var _a;
        if (this.isListening) {
            (_a = this.server) === null || _a === void 0 ? void 0 : _a.close();
        }
        else {
            console.log("Server not running");
        }
    }
    error(cb) {
        this.errorHandler = cb;
        return this;
    }
    findMatches(req) {
        return this.handlers
            .map((h) => [h, this.match(h, req)])
            .filter((h) => h[1]);
    }
    match(handler, req) {
        const sameMethod = handler.method == req.method;
        const matchAll = handler.method == handler_1.MethodType.ALL;
        const methodMatch = sameMethod || matchAll;
        const pathMatchRegex = (0, path_to_regexp_1.match)(handler.path, { decode: decodeURIComponent });
        const pathMatch = pathMatchRegex(req.url);
        return methodMatch && pathMatch;
    }
    handle(q, s) {
        return __awaiter(this, void 0, void 0, function* () {
            const req = new Request_1.default(q);
            const res = new Response_1.default(s);
            yield req.init();
            const allMatchedHandlers = this.findMatches(req);
            const next = (err) => __awaiter(this, void 0, void 0, function* () {
                const match = allMatchedHandlers.shift();
                if (err || !match) {
                    return yield this.errorHandler(err, req, res);
                }
                const [handler, matchedObject] = match;
                req.params = matchedObject.params;
                res.route = handler;
                return yield handler.handler(req, res, next);
            });
            yield next();
        });
    }
    doc() {
        const compiledDocs = {};
        this.docs.forEach((doc) => {
            if (compiledDocs[doc.group]) {
                compiledDocs[doc.group] = [...compiledDocs[doc.group], doc];
            }
            else {
                compiledDocs[doc.group] = [doc];
            }
        });
        const newCompiled = this.docs.reduce((ac, doc) => (Object.assign(Object.assign({}, ac), { [doc.group]: ac[doc.group] ? [...ac[doc.group], doc] : [doc] })), {});
        this.handlers.push({
            path: "/doc",
            method: handler_1.MethodType.GET,
            type: handler_1.HandlerType.endpoint,
            handler: (_req, res) => {
                res.setHeader("Content-Type", "text/html");
                res.write((0, docTemplate_1.docTemplate)(compiledDocs));
                res.end();
            },
        });
    }
}
exports.default = Server;
