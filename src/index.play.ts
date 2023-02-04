import { z } from "zod";
import Server, { Router } from ".";
import { Logger } from "./middlewares";

const app = new Server({
  name: "Link Test App",
  port: 8000,
  description: "A test app for building with link",
  host: "localhost:8000",
  version: "1.2.3",
});

app.use(Logger(Logger.DEV));

app.get("/", (req, res) => {
  return res.status(201).json({ hey: "buddy its working" });
});

app.rpc("/rpc", {
  inp: z.object({
    hey: z.string(),
    number: z.number(),
    array: z.array(z.string()),
    bools: z.boolean(),
  }),
  out: z.object({
    hey: z.string(),
  }),
  handler: (req, res) => {
    return { hey: "is it working" };
  },
});

const r = new Router();

r.post("/post", (req, res) => res.json({ foo: "bar" }));
r.get("/get", (req, res) => res.json({ foo: "bar" }));
r.get("/:id", (req, res) => res.json({ foo: "bar" }));
r.put("/put", (req, res) => res.json({ foo: "bar" }));
r.patch("/patch", (req, res) => res.json({ foo: "bar" }));
r.delete("/delete", (req, res) => res.json({ foo: "bar" }));

app.addRouter("/route", r);

app.post("/hey", (req, res) => res.json({ foo: "bar" }));
app.get("/hey", (req, res) => res.json({ foo: "bar" }));
app.put("/hey", (req, res) => res.json({ foo: "bar" }));
app.patch("/hey", (req, res) => res.json({ foo: "bar" }));
app.delete("/hey", (req, res) => res.json({ foo: "bar" }));

app.get("/dyn/:id", (req, res) => {
  return res.json({ hey: 0 });
});

app.listen();
