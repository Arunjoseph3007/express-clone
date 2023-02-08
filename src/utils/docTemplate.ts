import fs from "fs";
import path from "path";
import { TDoc } from "../interfaces/doc";

const TMP = fs
  .readFileSync(path.join(__dirname, "../../public/templates/doc.html"))
  .toString();

export const docTemplate = (docs: Record<string, Array<TDoc>>) => {
  return TMP.replace("<% doc %>", docify(Object.entries(docs)));
};

const docify = (docs: Array<[string, TDoc[]]>) =>
  docs
    .map(
      ([route, docs]) => `
        <div class="route-group">
          <div>
            <h1>${route}</h1>
          </div>
          ${docs.map(documentRoute).join("")}
        </div>`
    )
    .join();

const documentRoute = (doc: TDoc) => `
  <div>  
    <div class="route ${doc.method}">
      <h3 class="button">${doc.method}</h3>
      <h3 class="path">${swaggerifyRoute(doc.path)}</h3>
    </div>
  </div>
`;

const swaggerifyRoute = (path: string) =>
  path
    .split("/")
    .map((seg) => (seg.startsWith(":") ? `{${seg.slice(1)}}` : seg))
    .join("/");
