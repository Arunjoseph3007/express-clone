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
  const jsonData = JSON.stringify(JSON.parse(data), null, 4);
  const route = String(res.route?.method) + " " + String(res.route?.path);
  const method = String(res.res.req.method);
  const url = String(res.res.req.url);
  const status = String(res.res.statusCode);
  const prismCss = "<style>" + PRISM_CSS + "</style>";
  const prismJs = "<script>" + PRISM_JS + "</script>";
  const appName = res.app?.name || "Spress App";

  return TMP.replace("<% data %>", jsonData)
    .replace("<% url %>", url)
    .replace("<% method %>", method)
    .replace("<% status %>", status)
    .replace("<% route %>", route)
    .replace("<% prism-css %>", prismCss)
    .replace("<% prism-js %>", prismJs)
    .replace("<% app-name %>", appName)
    .replace("<% app-name %>", appName);
};
