import { handlerFunction } from "../interfaces/handler";

export const logger: handlerFunction = (req, _, next) => {
  console.log(
    `[${new Date().toTimeString().slice(0, 8)}] ${req.method} ${req.url}`
  );
  next();
};
