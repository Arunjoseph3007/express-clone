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

app.get("/hey/:params", (req, res) => {
  res.json({ params: req.params.params });
});

app.get("/query", (req, res) => {
  res.json({ query: req.query });
});

app.listen(8080, () => console.log("Server Started..."));
