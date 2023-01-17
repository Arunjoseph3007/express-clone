import Response from "../Response";
import fs from "fs";

const TMP = fs.readFileSync("src/templates/data.html").toString();

export const htmlTemplate = (res: Response, data: any) => {
  return TMP.replace("<% data %>", JSON.stringify(JSON.parse(data), null, 4));
};
