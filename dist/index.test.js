"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ls_1 = require("./utils/ls");
console.log((0, ls_1.getAllFilesSync)("public"));
const Router_1 = __importDefault(require("./Router"));
const Server_1 = __importDefault(require("./Server"));
const middlewares_1 = require("./middlewares");
const zod_1 = require("zod");
const app = new Server_1.default();
const authMiddleare = (req, res, next) => {
    const username = req.query.username;
    const password = req.query.password;
    console.log({ username, password });
    if (username && password && username == password) {
        next();
    }
    else {
        return res.json({ greet: "Unauthenticated" });
    }
};
app.post("/post", () => { });
app.put("/post", () => { });
app.patch("/post", () => { });
app.delete("/post", () => { });
//@ Middlewares
app.use((0, middlewares_1.Logger)(middlewares_1.Logger.DEV));
//@ Serve static files
//! Not Optimized at all
app.use((0, middlewares_1.publicFiles)("public", "media"));
app.get("/hey/:user", (req, res) => {
    req.params.user;
});
//@ Error Handling
app.error((err, req, res) => {
    res.status(404).json({ err, message: "something went wrong" });
});
app.rpc("/rpcEndpoint", {
    inp: zod_1.z.object({
        username: zod_1.z.string().min(8),
        password: zod_1.z.string().min(8),
    }),
    out: zod_1.z.object({
        username: zod_1.z.string().min(8),
        id: zod_1.z.string(),
    }),
    handler: (req, res) => {
        return { username: "works perfectly", id: "123445" };
    },
});
//@ Delay
app.get("/delay", (req, res) => {
    setTimeout(() => res.json({ msg: "too late" }), 100);
});
//@ Error handleing
app.get("/error", (_q, _s, next) => {
    next("heyeyeyey");
});
//@ Support Generic Requests
app.get("/generic", (req, res) => {
    const hey = req.body.hey; //? Vaild Typescript
    //? const yeh=req.body.yeh; (InVaild Typescript)
    const search = req.query.search; //? Valid Typescript
    //? const hcraes = req.query.hcraes (InValid Typescript)
    return res.json({ hey, search });
});
//@ Middleware like pattern
app.get("/", (req, res, next) => {
    req.body = { hey: "body" };
    next();
});
//@ Middleware pattern
app.get("/middle", authMiddleare, (req, res) => {
    res.json({ greet: "You are authenticated" });
});
//@ Simple Routes
app.get("/", (req, res) => {
    return res.json({ sec: "from second endpoint", hey: req.body.hey });
});
//@ Again simple routes
app.get("/hey", (req, res) => {
    res.json({ hello: 12345 });
});
//@ Route with params
app.get("/hey/:params", (req, res) => {
    res.json({ params: req.params.params });
});
//@ Route with query
app.get("/query", (req, res) => {
    res.json({ query: req.query });
});
//@ Send Files
app.get("/file", (_, res) => {
    res.sendFile("public/index.html");
});
//@ Raw html
app.get("/raw", (_, res) => {
    // res.set("content-type", "application/html");
    res.send(`<div>
  <h1>hey</h1>
  <button>hey</button>
  </div>`);
});
//@ Download
app.get("/download", (req, res) => {
    res.download("public/tree.jpg");
});
//@ Works with router as well
const myRouter = new Router_1.default();
myRouter.all("/", (req, res) => {
    res.json({ hey: "default" });
});
myRouter.get("/hey", (req, res) => {
    res.json({ thisIs: "response from router" });
});
myRouter.get("/:id", (req, res) => {
    res.json([1, 2, 3, req.params.id]);
});
app.addRouter("/router", myRouter);
app.listen(8080, () => console.log("Server Started..."));
