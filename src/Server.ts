import http, { IncomingMessage, ServerResponse } from "http";
import Router, { TDoc } from "./Router";
import Request from "./Request";
import Response from "./Response";
import {
  ErrorHandler,
  Handler,
  HandlerType,
  MethodType,
  NextFunction,
} from "./interfaces/handler";
import { match, MatchResult } from "path-to-regexp";
import { docTemplate } from "./utils/docTemplate";
import { ParamsDictionary } from "./interfaces/RouteParameter";
import { getAbsoluteFSPath as getSwagger } from "swagger-ui-dist";
import { readdirSync } from "fs";
import * as swagger from "./utils/swagger";
import getSwaggerPaths from "./utils/getSwaggerPaths";

/**
 * Main Server class. You can create a server by using an instance
 */
export default class Server extends Router {
  public name: string;
  public version: string;
  public description: string;
  public host: string;
  private port: number | undefined;
  private server?: http.Server;
  private isListening: boolean = false;
  private errorHandler: ErrorHandler = (err, req, res) => {
    return res.status(400).json({ err, message: "Something went wrong" });
  };

  constructor(options?: {
    name?: string;
    port?: number;
    description?: string;
    version?: string;
    host?: string;
  }) {
    super();
    this.name = options?.name || "Spress App";
    this.port = options?.port;
    this.description = options?.description || "";
    this.version = options?.version || "1.0.0";
    this.host = options?.host || "0.0.0.0";
  }

  /**
   * Sets up your server for listening on a given port
   * @param port Port where you want your server to be
   * @param callback This will be run after the server started
   * @returns
   */
  listen(port: number = this.port as number, callback?: () => void) {
    if (this.isListening) {
      console.log("Server Already running");
      return;
    }

    this.isListening = true;
    this.compileHandlers();
    this.swagger();
    this.doc();
    this.server = http.createServer(this.handle.bind(this));
    this.server.listen(port, () => {
      console.log(
        "\x1b[0m\x1b[36m`" +
          this.name +
          "`\x1b[0m is starting at port \x1b[0m\x1b[36m`" +
          port +
          "`\x1b[0m"
      );
      callback && callback();
    });
  }

  /**
   * To close your server gracefully
   */
  shutdown() {
    if (this.isListening) {
      this.server?.close();
    } else {
      console.log("Server not running");
    }
  }

  /**
   * Utility method To setup custom error handling
   * @param cb The custom error handler that you provide
   * @returns
   */
  error(cb: ErrorHandler) {
    this.errorHandler = cb;
    return this;
  }

  private findMatches(req: Request): Array<[Handler, MatchResult]> {
    return this.handlers
      .map((h) => [h, this.match(h, req)] as const)
      .filter((h) => h[1]) as Array<[Handler, MatchResult]>;
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
    res.app = this;
    req.app = this;

    const allMatchedHandlers = this.findMatches(req);

    const next: NextFunction = async (err) => {
      const match = allMatchedHandlers.shift();

      if (err || !match) {
        return await this.errorHandler(err, req, res);
      }

      const [handler, matchedObject] = match;
      req.params = matchedObject.params as ParamsDictionary;
      res.route = handler;

      return await handler.handler(req, res, next);
    };

    await next();
  }

  private doc() {
    const compiledDocs: Record<string, Array<TDoc>> = {};

    this.docs.forEach((doc) => {
      if (compiledDocs[doc.group]) {
        compiledDocs[doc.group] = [...compiledDocs[doc.group], doc];
      } else {
        compiledDocs[doc.group] = [doc];
      }
    });

    this.handlers.push({
      path: "/doc",
      method: MethodType.GET,
      type: HandlerType.endpoint,
      handler: (_req, res) => {
        res.setHeader("Content-Type", "text/html");
        res.write(docTemplate(compiledDocs));
        res.end();
      },
    });
  }

  private async swagger() {
    const opts = swagger.DEFAULT_OPTS as any;
    opts.info.description = this.description;
    opts.info.title = this.name;
    opts.info.version = this.version;
    opts.host = this.host;
    this.stack;
    opts.paths = getSwaggerPaths(this.handlers);

    const swaggerRoot = getSwagger();
    const swaggerFiles = readdirSync(swaggerRoot).map((a) => "/" + a);
    const swaggerHtml = swagger.generateHTML();
    const initOptions = { swaggerDoc: opts };
    const stringDocs = swagger.stringify(initOptions);
    const content = swagger.JS_TMPL.replace("<% swaggerOptions %>", stringDocs);

    this.handlers.push({
      path: "/(.*)",
      type: HandlerType.middleware,
      method: MethodType.ALL,
      handler: (req, res, next) => {
        if (req.url == "/swagger-ui-init.js") {
          res.set("Content-Type", "application/javascript");
          res.write(content);
          return res.end();
        } else if (swaggerFiles.includes(req.url)) {
          return res.sendFile(swaggerRoot + req.url);
        }
        next();
      },
    });

    this.handlers.push({
      path: "/swagger",
      method: MethodType.GET,
      type: HandlerType.endpoint,
      handler: (req, res) => {
        console.log("hey");

        res.set("Content-Type", "text/html");
        res.write(swaggerHtml);
        return res.end();
      },
    });
  }
}
