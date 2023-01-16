import { handlerFunction } from "../interfaces/handler";

export const logger: handlerFunction = (req, _, next) => {
  console.log(
    "\x1b[0m",
    "\x1b[36m",
    `[${new Date().toTimeString().slice(0, 8)}]`,
    "\x1b[33m",
    req.method,
    "\x1b[32m",
    req.url,
    "\x1b[0m"
  );
  next();
};
