"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.htmlTemplate = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const TMP = fs_1.default
    .readFileSync(path_1.default.join(__dirname, "../../public/templates/data.html"))
    .toString();
const PRISM_CSS = fs_1.default
    .readFileSync(path_1.default.join(__dirname, "../../public/prism.css"))
    .toString();
const PRISM_JS = fs_1.default
    .readFileSync(path_1.default.join(__dirname, "../../public/prism.js"))
    .toString();
const htmlTemplate = (res, data) => {
    var _a, _b;
    return TMP.replace("<% data %>", JSON.stringify(JSON.parse(data), null, 4))
        .replace("<% url %>", String(res.res.req.url))
        .replace("<% method %>", String(res.res.req.method))
        .replace("<% status %>", String(res.res.statusCode))
        .replace("<% route %>", String((_a = res.route) === null || _a === void 0 ? void 0 : _a.method) + " " + String((_b = res.route) === null || _b === void 0 ? void 0 : _b.path))
        .replace("<% prism-css %>", "<style>" + PRISM_CSS + "</style>")
        .replace("<% prism-js %>", "<script>" + PRISM_JS + "</script>");
};
exports.htmlTemplate = htmlTemplate;
