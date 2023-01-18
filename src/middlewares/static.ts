import { HandlerFunction } from "../interfaces/handler";
import { getAllFilesSync } from "../utils/ls";

export const publicFiles = (
  publicDir: string,
  basePath: string = "/"
): HandlerFunction => {
  const allFiles = getAllFilesSync(publicDir).map((f) => "/" + f);

  return async (req, res, next) => {
    const urlFilePath = req.url;
    const actualPath = urlFilePath.replace(basePath, publicDir);

    if (allFiles.includes(actualPath)) {
      return res.sendFile(actualPath.slice(1));
    } else {
      next();
    }
  };
};
