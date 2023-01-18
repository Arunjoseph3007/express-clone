import Request from "../Request";
import { HandlerFunction } from "../interfaces/handler";

const RESET = "\x1b[0m";
const BLUE_FG = "\x1b[36m";
const YELLOW_FG = "\x1b[33m";
const GREEN_FG = "\x1b[32m";
const RED_FG = "\x1b[31m";
const MAGENTA_FG = "\x1b[35m";
const CYAN_FG = "\x1b[36m";

const TOKENS = new Map<string, (req: Request) => string>([
  ["<time>", () => BLUE_FG + new Date().toTimeString().slice(0, 8)],
  ["<url>", (req) => YELLOW_FG + req.url],
  ["<method>", (req) => GREEN_FG + req.method],
  ["<status>", (req) => MAGENTA_FG + req.req.statusCode],
  ["<status-code>", (req) => MAGENTA_FG + req.req.statusCode],
  ["<status-message>", (req) => CYAN_FG + req.req.statusMessage],
  ["<content-length>", (req) => RED_FG + req.req.headers["content-length"]],
]);

const TOKEN_ENTRIES = [...TOKENS.entries()];

export const Logger = (logPattern: string): HandlerFunction => {
  return (req, _res, next) => {
    const newLog = TOKEN_ENTRIES.reduce(
      (msg, [tk, fn]) => msg.replace(tk, RESET + fn(req) + RESET),
      logPattern
    );

    console.log(newLog);
    next();
  };
};

Logger.DEV = "<time>  <method>  <url>" as const;
Logger.LONG =
  "<time> <method> <status> <status-message> <content-length> <url>" as const;
Logger.SHORT = "<method>  <url>" as const;


// User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36