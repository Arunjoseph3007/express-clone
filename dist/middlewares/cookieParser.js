"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieParser = void 0;
const cookieParser = (req, _, next) => {
    const cookieStr = req.req.headers.cookie || "";
    req.cookies = cookieStr
        .replace(" ", "")
        .split(";")
        .reduce((ac, cr) => {
        const [key, value] = cr.split("=");
        return Object.assign(Object.assign({}, ac), { [key]: value });
    }, {});
    next();
};
exports.cookieParser = cookieParser;
