import Request from "./Request";
import Router from "./Router";
import Server from "./Server";
import { handlerFunction } from "./interfaces/handler";

const app = new Server();

const authMiddleare: handlerFunction = (req, res, next) => {
  const username = req.query.username;
  const password = req.query.password;

  console.log({ username, password });

  if (username && password && username == password) {
    next();
  } else {
    return res.json({ greet: "Unauthenticated" });
  }
};

//@ Error Handling
app.error((err, req, res) => {
  res.json({ err, message: "something went wrong" });
});

//@ Error handleing
app.get("/error", (_q, _s, next) => {
  next("heyeyeyey");
});

//@ Support Generic Requests
app.get(
  "/generic",
  (req: Request<{ hey: string }, {}, { search: string }>, res) => {
    const hey = req.body.hey; //? Vaild Typescript
    //? const yeh=req.body.yeh; (InVaild Typescript)
    const search = req.query.search; //? Valid Typescript
    //? const hcraes = req.query.hcraes (InValid Typescript)
    return res.json({ hey, search });
  }
);

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

//@ Works with router as well
const myRouter = new Router();

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
