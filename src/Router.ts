import {
  Handler,
  HandlerType,
  MethodType,
  handlerFunction,
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
  private stack: Array<HandlerController | RouterController> = [];
  protected handlers: Array<Handler> = [];
  protected docs: Array<any> = [];

  addHandler(handler: Handler) {
    this.stack.push({ ...handler, isRouter: false });
  }

  addRouter(path: string, router: Router) {
    this.stack.push({ path, router, isRouter: true });
  }

  use(middleware: handlerFunction) {
    this.addHandler({
      path: "/(.*)",
      method: MethodType.ALL,
      handler: middleware,
      type: HandlerType.middleware,
    });

    return this;
  }

  all(path: string, ...handlers: handlerFunction[]) {
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

  get(path: string, ...handlers: handlerFunction[]) {
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

  post(path: string, ...handlers: handlerFunction[]) {
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

  put(path: string, ...handlers: handlerFunction[]) {
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

  patch(path: string, ...handlers: handlerFunction[]) {
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