import Response from "../Response";
import fs from "fs";
import path from "path";

const TMP = fs
  .readFileSync(path.join(__dirname, "../../public/templates/data.html"))
  .toString();

const PRISM_CSS = fs
  .readFileSync(path.join(__dirname, "../../public/prism.css"))
  .toString();

const PRISM_JS = fs
  .readFileSync(path.join(__dirname, "../../public/prism.js"))
  .toString();

export const htmlTemplate = (res: Response, data: any) => {
  return TMP.replace("<% data %>", JSON.stringify(JSON.parse(data), null, 4))
    .replace("<% url %>", String(res.res.req.url))
    .replace("<% method %>", String(res.res.req.method))
    .replace("<% status %>", String(res.res.statusCode))
    .replace(
      "<% route %>",
      String(res.route?.method) + " " + String(res.route?.path)
    )
    .replace("<% prism-css %>", "<style>" + PRISM_CSS + "</style>")
    .replace("<% prism-js %>", "<script>" + PRISM_JS + "</script>")
    .replace("<% app-name %>", res.app?.name || "Spress App")
    .replace("<% app-name %>", res.app?.name || "Spress App");
};
