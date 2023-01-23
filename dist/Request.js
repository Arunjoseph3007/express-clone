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
const raw_body_1 = __importDefault(require("raw-body"));
const parseCookies_1 = require("./utils/parseCookies");
class Request {
    constructor(req) {
        var _a;
        const url = new URL(req.url || "", `http://${req.headers.host}`);
        this.req = req;
        this.method = ((_a = req.method) === null || _a === void 0 ? void 0 : _a.toUpperCase()) || "";
        this.orginalUrl = req.url || "";
        this.cookies = (0, parseCookies_1.parseCookie)(req.headers.cookie);
        this.headers = req.headers;
        this.url = url.pathname;
        this.isBrowserRequest = req.headers["sec-fetch-dest"] == "document";
        this.query = Object.fromEntries(url.searchParams);
        this.params = {};
        this.body = {};
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const rawBody = yield (0, raw_body_1.default)(this.req);
            try {
                if (this.req.headers["content-type"] == "application/json") {
                    this.body = JSON.parse(rawBody.toString());
                }
            }
            catch (error) {
                console.log("Could parse body");
            }
            return this;
        });
    }
}
exports.default = Request;
