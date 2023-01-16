# Worst Idea I ever had

To recreate express library just for fun

## Usage

### Make a simple server

```JS
const app = new Server();

app.get("/", (req, res) => {
  res.json({ foo: "bar" });
});

app.listen(8080, () => console.log("Server Started..."));
```

### Supports all requests types

```JS
app.get("/", (req, res) => {
  res.json({ foo: "bar" });
});

app.post("/", (req, res) => {
  res.json({ method: "POSR" });
});

app.delete("/", (req, res) => {
  res.json({ method: "delete" });
});
```

### Param based routes

```JS
app.get("/:id", (req, res) => {
  const id = req.params.id
  res.json({ foo: "bar" , id:  id });
});
```

### Support for query params

```JS
app.get("/:id", (req, res) => {
  const searchQuery = req.query.search
  res.json({ foo: "bar" , search:  searchQuery });
});
```

### middleware support

```JS
// Simple logger middleware
export const logger = (req, res, next) => {
  console.log(req.method, req.url);
  next();
};

app.use(logger)
```

### Supports Routers

```JS
const myRouter = new Router();

myRouter.all("/", (req, res) => {
  res.json({ hey: "default" });
});

app.addRouter("/router", myRouter);
```

### Typescript support

```TS
app.get(
  "/generic",
  (req: Request<{ hey: string }, {}, { search: string }>, res) => {
    const hey = req.body.hey;           // Vaild Typescript
    const yeh = req.body.yeh;           // InVaild Typescript
    const search = req.query.search;    // Valid Typescript
    const hcraes = req.query.hcraes     // InValid Typescript
    return res.json({ hey, search });
  }
);
```

### Body Parser

```JS
app.get("/", (req, res) => {
  const hey = req.body.hey
  res.json({ foo: "bar" , hey:  hey });
});
```
