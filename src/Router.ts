import {
  Handler,
  HandlerType,
  MethodType,
  HandlerFunction,
} from "./interfaces/handler";

interface RouterController {
  path: string;
  router: Router;
  isRouter: true;
}

interface HandlerController extends Handler {
  isRouter: false;
}

export default class Router {
  stack: Array<HandlerController | RouterController> = [];
  protected handlers: Array<Handler> = [];

  addHandler(handler: Handler) {
    this.stack.push({ ...handler, isRouter: false });
  }

  addRouter(path: string, router: Router) {
    this.stack.push({ path, router, isRouter: true });
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

  all(path: string, ...handlers: HandlerFunction[]) {
    handlers.forEach((handler) => {
      this.addHandler({
        path,
        handler,
        method: MethodType.ALL,
        type: HandlerType.endpoint,
      });
    });

    return this;
  }

  get<T extends string>(path: T, ...handlers: Array<HandlerFunction>) {
    handlers.forEach((handler) => {
      this.addHandler({
        path,
        handler,
        method: MethodType.GET,
        type: HandlerType.endpoint,
      });
    });

    return this;
  }

  post(path: string, ...handlers: HandlerFunction[]) {
    handlers.forEach((handler) => {
      this.addHandler({
        path,
        handler,
        method: MethodType.POST,
        type: HandlerType.endpoint,
      });
    });

    return this;
  }

  put(path: string, ...handlers: HandlerFunction[]) {
    handlers.forEach((handler) => {
      this.addHandler({
        path,
        handler,
        method: MethodType.PUT,
        type: HandlerType.endpoint,
      });
    });

    return this;
  }

  patch(path: string, ...handlers: HandlerFunction[]) {
    handlers.forEach((handler) => {
      this.addHandler({
        path,
        handler,
        method: MethodType.PATCH,
        type: HandlerType.endpoint,
      });
    });

    return this;
  }

  delete(path: string, ...handlers: HandlerFunction[]) {
    handlers.forEach((handler) => {
      this.addHandler({
        path,
        handler,
        method: MethodType.DELETE,
        type: HandlerType.endpoint,
      });
    });

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
