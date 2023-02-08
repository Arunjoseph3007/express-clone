import path from "path";
import { HandlerFunction } from "../interfaces/handler";
import { getAllFilesSync } from "../utils/ls";

export const Static = (
  publicDir: string,
  baseUrl: string = ""
): HandlerFunction => {
  const allFiles = getAllFilesSync(publicDir)
    .map((f) => f.replace(publicDir, ""))
    .map(addSlash)
    .map((f) => path.join(baseUrl, f));

  return async function ServerStaticFiles(req, res, next) {
    if (allFiles.includes(req.url)) {
      const file = removeSlash(publicDir) + req.url.slice(baseUrl.length);

      res.sendFile(file);
    } else {
      next();
    }
  };
};

const addSlash = (p: string) => (p.startsWith("/") ? p : "/" + p);

const removeSlash = (p: string) => (p.endsWith("/") ? p.slice(0, -1) : p);
