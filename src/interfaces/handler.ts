import Request from "../Request";
import Response from "../Response";
import { ParamsDictionary } from "./RouteParameter";

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

export type HandlerFunction<
  Params extends ParamsDictionary = ParamsDictionary
> = (req: Request<Params>, res: Response, next: NextFunction) => any;

export interface Handler<Params extends ParamsDictionary = ParamsDictionary> {
  path: string;
  type: HandlerType;
  method: MethodType;
  handler: HandlerFunction<Params>;
}
