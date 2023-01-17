import fs from "fs";

const TMP = fs.readFileSync("src/templates/doc.html").toString();

export const docTemplate = (docs: any) => {
  return TMP.replace("<% doc %>", docify(docs));
};

const docify = (docs: any): string => {
  return docs
    .map((route: any) => {
      if (route.method) {
        return `
        <div class="route ${route.method}">
            <h3>${route.method + " " + route.path}</h3>
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
