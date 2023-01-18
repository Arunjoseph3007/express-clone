import fs from "fs";
import { TDoc } from "../Router";

const TMP = fs.readFileSync("src/templates/doc.html").toString();

export const docTemplate = (docs: Record<string, Array<TDoc>>) => {
  return TMP.replace("<% doc %>", docify(Object.entries(docs)));
};

const docify = (docs: Array<[string, TDoc[]]>): string =>
  docs
    .map(([route, docs]) => {
      return `
        <div class="route-group">
          <div>
            <h1>${route}</h1>
          </div>
          ${docs.map(documentRoute).join("")}
        </div>`;
    })
    .join("");

const documentRoute = (doc: TDoc): string => `
  <div>  
    <div class="route ${doc.method}">
      <h3 class="button">${doc.method}</h3>
      <h3 class="path">${doc.path}</h3>
    </div>
    </div>
    `;

// <pre class="handler-text">
//   <code>
//     ${doc.handler.toString()}
//   </code>
// </pre>
