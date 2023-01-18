import fs from "fs";
import { MethodType } from "../interfaces/handler";

const TMP = fs.readFileSync("src/templates/doc.html").toString();

export interface DOC {
  method: MethodType;
  path: string;
}

export type DOCS = Array<DOC | Record<string, DOCS>>;

export const docTemplate = (docs: DOCS) => {
  return TMP.replace("<% doc %>", docify(docs));
};

const docify = (docs: DOCS): string => {
  return docs
    .map((route) => {
      if (route.method) {
        return `
        <div class="route ${route.method}">
            <h3 class="button">${route.method}</h3>
            <h3 class="path">${route.path}</h3>
        </div>
        `;
      } else {
        return `
        <div class="route-group">
          <h1>${Object.keys(route)[0]}</h1>
          ${docify(Object.values(route)[0])}
        </div>`;
      }
    })
    .join("");
};
