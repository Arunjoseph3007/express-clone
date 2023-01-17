import Response from "../Response";
import fs from "fs";

const TMP = fs.readFileSync("src/templates/data.html").toString();

export const htmlTemplate = (res: Response, data: any) => {
  return TMP.replace("<% data %>", JSON.stringify(JSON.parse(data), null, 4))
    .replace("<% url %>", String(res.res.req.url))
    .replace("<% method %>", String(res.res.req.method))
    .replace("<% status %>", String(res.res.statusCode))
    .replace(
      "<% route %>",
      String(res.route?.method) + " " + String(res.route?.path)
    );
};
