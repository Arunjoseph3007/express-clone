import Request from "../Request";
import Response from "../Response";

export type NextFunction = (err?: any) => any;

export type ErrorHandler = (err: any, req: Request, res: Response) => any;

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
  ALL = "ALL",
}

export type handlerFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => any;

export interface Handler {
  path: string;
  type: HandlerType;
  method: MethodType;
  handler: handlerFunction;
}
