import Server from "./Server";

const app = new Server();

app.get("/", (req, res, next) => {
  req.body = { hey: "body" };
  next();
});

app.get("/", (req, res) => {
  return res.json({ sec: "from second endpoint", hey: req.body.hey });
});

app.get("/hey", (req, res) => {
  res.json({ hello: 12345 });
});

app.get("/hey/:id", (req, res) => {
  res.json({ params: req.query.id });
});

app.listen(8080, () => console.log("Server Started..."));
