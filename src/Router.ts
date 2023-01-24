import {
  Handler,
  HandlerType,
  MethodType,
  HandlerFunction,
  NextFunction,
} from "./interfaces/handler";
import { z } from "zod";
import Request from "./Request";
import Response from "./Response";

/**
 * Create new subrouters using
 */
export default class Router {
  stack: Array<HandlerController | RouterController> = [];
  protected handlers: Array<Handler> = [];
  protected docs: Array<TDoc> = [];

  private addDoc(doc: TDoc) {
    this.docs.push(doc);
  }

  private addEndPointAndDocument(
    path: string,
    method: MethodType,
    ...handlers: HandlerFunction[]
  ) {
    const type = HandlerType.endpoint;
    handlers.forEach((handler) => {
      this.addHandler({ path, method, handler, type });
    });

    this.addDoc({
      path,
      method,
      type,
      handler: handlers.pop() as HandlerFunction,
      group: "/",
    });
  }

  /**
   * Manually add handler by providing {path, method, type, handler}
   * @param Handler Object with path, type, method and handler
   */
  addHandler({
    path,
    method = MethodType.GET,
    type = HandlerType.endpoint,
    handler,
  }: Handler) {
    this.stack.push({
      path,
      method,
      handler,
      type,
      isRouter: false,
    });
  }

  /**
   * Add sub routers super elegently
   * @param path Path at which you want your router to function
   * @param router The sub router
   * @returns
   */
  addRouter(path: string, router: Router) {
    this.stack.push({ path, router, isRouter: true });

    router.docs.forEach((doc) =>
      this.addDoc({ ...doc, group: path + doc.group, path: path + doc.path })
    );
    return this;
  }

  /**
   * Add middlewares to the data flow chain
   * @param middleware An handler function
   * @returns
   */
  use(middleware: HandlerFunction) {
    this.addHandler({
      path: "/(.*)",
      method: MethodType.ALL,
      handler: middleware,
      type: HandlerType.middleware,
    });

    return this;
  }

  /**
   * Configure an RPC endpoint
   * You can add input and output validation using zod
   * The method would always be POST
   *
   * @param path
   * @param param1
   * @returns
   */
  rpc(path: string, { inp = z.any(), out = z.any(), handler }: TRPC) {
    const typeSafeHandler: HandlerFunction = (req, res, next) => {
      try {
        inp.parse(req.body);
        const result = handler(req, res, next);
        out.parse(result);

        res.status(200).json(result);
      } catch (e) {
        next(e);
      }
    };

    this.addEndPointAndDocument(path, MethodType.POST, typeSafeHandler);
    return this;
  }

  /**
   * A utility method to attach a handler to a path irrespective of the request method
   * @param path The path at which you want to attach the handler
   * @param handlers An array of handlers
   * @returns
   */
  all(path: string, ...handlers: Array<HandlerFunction>) {
    this.addEndPointAndDocument(path, MethodType.ALL, ...handlers);
    return this;
  }

  /**
   * A utility method to attach a `GET` Request handler to a path
   * @param path The path at which you want to attach the handler
   * @param handlers An array of handlers
   * @returns
   */
  get(path: string, ...handlers: Array<HandlerFunction>) {
    this.addEndPointAndDocument(path, MethodType.GET, ...handlers);

    return this;
  }

  /**
   * A utility method to attach a `POST` Request handler to a path
   * @param path The path at which you want to attach the handler
   * @param handlers An array of handlers
   * @returns
   */
  post(path: string, ...handlers: Array<HandlerFunction>) {
    this.addEndPointAndDocument(path, MethodType.POST, ...handlers);

    return this;
  }

  /**
   * A utility method to attach a `PUT` Request handler to a path
   * @param path The path at which you want to attach the handler
   * @param handlers An array of handlers
   * @returns
   */
  put(path: string, ...handlers: Array<HandlerFunction>) {
    this.addEndPointAndDocument(path, MethodType.PUT, ...handlers);

    return this;
  }

  /**
   * A utility method to attach a `PATCH` Request handler to a path
   * @param path The path at which you want to attach the handler
   * @param handlers An array of handlers
   * @returns
   */
  patch(path: string, ...handlers: Array<HandlerFunction>) {
    this.addEndPointAndDocument(path, MethodType.PATCH, ...handlers);

    return this;
  }

  /**
   * A utility method to attach a `DELETE` Request handler to a path
   * @param path The path at which you want to attach the handler
   * @param handlers An array of handlers
   * @returns
   */
  delete(path: string, ...handlers: Array<HandlerFunction>) {
    this.addEndPointAndDocument(path, MethodType.DELETE, ...handlers);

    return this;
  }

  protected compileHandlers() {
    // flush all handlers (if any)
    this.handlers = [];
    this.stack.forEach((elm) => {
      // If it is a router
      if (elm.isRouter) {
        elm.router.compileHandlers().handlers.forEach((handler) => {
          this.handlers.push({ ...handler, path: elm.path + handler.path });
        });
      }
      // for handlers
      else {
        const { isRouter, ...handler } = elm;
        this.handlers.push(handler);
      }
    });

    return this;
  }
}

interface RouterController {
  path: string;
  router: Router;
  isRouter: true;
}

interface HandlerController extends Handler {
  isRouter: false;
}

export interface TDoc extends Handler {
  group: string;
  type: HandlerType.endpoint;
}

export interface TRPC {
  inp: z.ZodTypeAny;
  out: z.ZodTypeAny;
  handler: (req: Request, res: Response, next: NextFunction) => void;
}
