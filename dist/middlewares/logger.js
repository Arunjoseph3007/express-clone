"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const on_finished_1 = __importDefault(require("on-finished"));
const RESET = "\x1b[0m";
const BLUE_FG = "\x1b[36m";
const YELLOW_FG = "\x1b[33m";
const GREEN_FG = "\x1b[32m";
const RED_FG = "\x1b[31m";
const MAGENTA_FG = "\x1b[35m";
const CYAN_FG = "\x1b[36m";
const Logger = function (logPattern) {
    return function (req, _res, next) {
        const sTime = now();
        const logRequest = (err, res) => {
            const logMessage = logPattern
                .replace("<now>", reset(BLUE_FG + sTime))
                .replace("<url>", reset(YELLOW_FG + String(res.req.url)))
                .replace("<method>", reset(GREEN_FG + res.req.method))
                .replace("<status>", colorCodeStatus(res.statusCode))
                .replace("<status-code>", colorCodeStatus(res.statusCode))
                .replace("<status-message>", reset(CYAN_FG + res.statusMessage))
                .replace("<response-time>", colorCodeResponse(sTime))
                .replace("<time>", colorCodeResponse(sTime));
            if (!err) {
                console.log(logMessage);
            }
            else {
                console.log(RESET + RED_FG + err + RESET);
            }
        };
        (0, on_finished_1.default)(_res.res, logRequest);
        next();
    };
};
exports.Logger = Logger;
exports.Logger.DEV = "<method>  <status>  <response-time>  <url>";
exports.Logger.LONG =
    "[<now>] <method> <status> <status-message> <content-length> <url>";
exports.Logger.SHORT = "<method> <status> <url>";
const reset = (str = "-") => RESET + str + RESET;
const now = () => performance.now();
const colorCodeStatus = (no) => {
    let color = BLUE_FG;
    const firstLetter = no.toString().slice(0, 1);
    if (firstLetter == "2")
        color = GREEN_FG;
    if (firstLetter == "3")
        color = BLUE_FG;
    if (firstLetter == "4")
        color = RED_FG;
    if (firstLetter == "5")
        color = RED_FG;
    return reset(color + no);
};
const colorCodeResponse = (start) => {
    let diff = now() - start;
    let color = GREEN_FG + "  ";
    if (diff > 5)
        color = YELLOW_FG + "  ";
    if (diff > 10)
        color = BLUE_FG + " ";
    if (diff > 25)
        color = MAGENTA_FG + " ";
    if (diff > 100)
        color = RED_FG;
    return reset(color + diff.toFixed(4) + "ms");
};
