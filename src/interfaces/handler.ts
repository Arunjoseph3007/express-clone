import Request from "../Request";
import Response from "../Response";

export enum HandlerType {
  endpoint,
  middleware,
}

export enum MethodType {
  GET = "GET",
  PUT = "PUT",
  PATCH = "PATCH",
  POST = "POST",
  DELETE = "DELETE",
  ALL = "*",
}

export type handlerFunction = (
  req: Request,
  res: Response,
  next: Function
) => any;

export interface Handler {
  path: string;
  type: HandlerType;
  method: MethodType;
  handler: handlerFunction;
}
