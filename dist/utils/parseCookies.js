"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCookie = void 0;
const parseCookie = (cookieStr) => (cookieStr || "")
    .replace(" ", "")
    .split(";")
    .reduce((ac, cr) => {
    const [key, value] = cr.split("=");
    return Object.assign(Object.assign({}, ac), { [key]: value });
}, {});
exports.parseCookie = parseCookie;
