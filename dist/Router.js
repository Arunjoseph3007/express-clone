"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const handler_1 = require("./interfaces/handler");
const zod_1 = require("zod");
class Router {
    constructor() {
        this.stack = [];
        this.handlers = [];
        this.docs = [];
    }
    addDoc(doc) {
        this.docs.push(doc);
    }
    addEndPointAndDocument(path, method, ...handlers) {
        const type = handler_1.HandlerType.endpoint;
        handlers.forEach((handler) => {
            this.addHandler({ path, method, handler, type });
        });
        this.addDoc({
            path,
            method,
            type,
            handler: handlers.pop(),
            group: "/",
        });
    }
    addHandler(handler) {
        this.stack.push(Object.assign(Object.assign({}, handler), { isRouter: false }));
    }
    addRouter(path, router) {
        this.stack.push({ path, router, isRouter: true });
        router.docs.forEach((doc) => this.addDoc(Object.assign(Object.assign({}, doc), { group: path + doc.group, path: path + doc.path })));
        return this;
    }
    use(middleware) {
        this.addHandler({
            path: "/(.*)",
            method: handler_1.MethodType.ALL,
            handler: middleware,
            type: handler_1.HandlerType.middleware,
        });
        return this;
    }
    rpc(path, { inp = zod_1.z.any(), out = zod_1.z.any(), handler }) {
        const typeSafeHandler = (req, res, next) => {
            try {
                inp.parse(req.body);
                const result = handler(req, res, next);
                out.parse(result);
                res.status(200).json(result);
            }
            catch (e) {
                next(e);
            }
        };
        this.addEndPointAndDocument(path, handler_1.MethodType.POST, typeSafeHandler);
        return this;
    }
    all(path, ...handlers) {
        this.addEndPointAndDocument(path, handler_1.MethodType.ALL, ...handlers);
        return this;
    }
    get(path, ...handlers) {
        this.addEndPointAndDocument(path, handler_1.MethodType.GET, ...handlers);
        return this;
    }
    post(path, ...handlers) {
        this.addEndPointAndDocument(path, handler_1.MethodType.POST, ...handlers);
        return this;
    }
    put(path, ...handlers) {
        this.addEndPointAndDocument(path, handler_1.MethodType.PUT, ...handlers);
        return this;
    }
    patch(path, ...handlers) {
        this.addEndPointAndDocument(path, handler_1.MethodType.PATCH, ...handlers);
        return this;
    }
    delete(path, ...handlers) {
        this.addEndPointAndDocument(path, handler_1.MethodType.DELETE, ...handlers);
        return this;
    }
    compileHandlers() {
        // flush all handlers (if any)
        this.handlers = [];
        this.stack.forEach((elm) => {
            // If it is a router
            if (elm.isRouter) {
                elm.router.compileHandlers().handlers.forEach((handler) => {
                    this.handlers.push(Object.assign(Object.assign({}, handler), { path: elm.path + handler.path }));
                });
            }
            // for handlers
            else {
                const { isRouter } = elm, handler = __rest(elm, ["isRouter"]);
                this.handlers.push(handler);
            }
        });
        return this;
    }
}
exports.default = Router;
