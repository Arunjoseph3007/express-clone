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

  addHandler(handler: Handler) {
    this.stack.push({ ...handler, isRouter: false });
  }

  addRouter(path: string, router: Router) {
    this.stack.push({ path, router, isRouter: true });

    router.docs.forEach((doc) =>
      this.addDoc({ ...doc, group: path + doc.group, path: path + doc.path })
    );
    return this;
  }

  use(middleware: HandlerFunction) {
    this.addHandler({
      path: "/(.*)",
      method: MethodType.ALL,
      handler: middleware,
      type: HandlerType.middleware,
    });

    return this;
  }

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

  all(path: string, ...handlers: Array<HandlerFunction>) {
    this.addEndPointAndDocument(path, MethodType.ALL, ...handlers);
    return this;
  }

  get(path: string, ...handlers: Array<HandlerFunction>) {
    this.addEndPointAndDocument(path, MethodType.GET, ...handlers);

    return this;
  }

  post(path: string, ...handlers: Array<HandlerFunction>) {
    this.addEndPointAndDocument(path, MethodType.POST, ...handlers);

    return this;
  }

  put(path: string, ...handlers: Array<HandlerFunction>) {
    this.addEndPointAndDocument(path, MethodType.PUT, ...handlers);

    return this;
  }

  patch(path: string, ...handlers: Array<HandlerFunction>) {
    this.addEndPointAndDocument(path, MethodType.PATCH, ...handlers);

    return this;
  }

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
