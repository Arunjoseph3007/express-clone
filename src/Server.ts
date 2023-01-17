import http, { IncomingMessage, ServerResponse } from "http";
import Router from "./Router";
import Request from "./Request";
import Response from "./Response";
import {
  ErrorHandler,
  Handler,
  MethodType,
  NextFunction,
} from "./interfaces/handler";
import { match, MatchResult } from "path-to-regexp";

export default class Server extends Router {
  private server?: http.Server;
  private isListening: boolean = false;
  private errorHandler: ErrorHandler = (err, req, res) => {
    return res.status(400).json({ err, message: "Something went wrong" });
  };

  static json() {}

  listen(port: number, callback?: () => void) {
    if (this.isListening) {
      console.log("Server Already running");
      return;
    }

    this.isListening = true;
    this.compileHandlers();
    this.server = http.createServer(this.handle.bind(this));
    this.server.listen(port, callback);
  }

  shutdown() {
    if (this.isListening) {
      this.server?.close();
    } else {
      console.log("Server not running");
    }
  }

  error(cb: ErrorHandler) {
    this.errorHandler = cb;
    return this;
  }

  private findMatches(req: Request): Array<[Handler, MatchResult]> {
    return this.handlers
      .map((h) => [h, this.match(h, req)])
      .filter((h) => Boolean(h[1])) as Array<[Handler, MatchResult]>;
  }

  private match(handler: Handler, req: Request) {
    const sameMethod = handler.method == req.method;
    const matchAll = handler.method == MethodType.ALL;
    const methodMatch = sameMethod || matchAll;
    const pathMatchRegex = match(handler.path, { decode: decodeURIComponent });
    const pathMatch = pathMatchRegex(req.url);
    return methodMatch && pathMatch;
  }

  private async handle(q: IncomingMessage, s: ServerResponse) {
    const req = new Request(q);
    const res = new Response(s);
    await req.init();

    const allMatchedHandlers = this.findMatches(req);

    const next: NextFunction = async (err) => {
      if (err) {
        return await this.errorHandler(err, req, res);
      }
      const match = allMatchedHandlers.shift();

      if (match) {
        const [handler, matchedObject] = match;
        req.params = matchedObject.params;
        await handler.handler(req, res, next);
      }
    };

    await next();
  }
}
