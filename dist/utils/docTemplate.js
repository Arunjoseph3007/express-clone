"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.docTemplate = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const TMP = fs_1.default
    .readFileSync(path_1.default.join(__dirname, "../../public/templates/doc.html"))
    .toString();
const docTemplate = (docs) => {
    return TMP.replace("<% doc %>", docify(Object.entries(docs)));
};
exports.docTemplate = docTemplate;
const docify = (docs) => docs
    .map(([route, docs]) => `
        <div class="route-group">
          <div>
            <h1>${route}</h1>
          </div>
          ${docs.map(documentRoute).join("")}
        </div>`)
    .join();
const documentRoute = (doc) => `
  <div>  
    <div class="route ${doc.method}">
      <h3 class="button">${doc.method}</h3>
      <h3 class="path">${swaggerifyRoute(doc.path)}</h3>
    </div>
  </div>
`;
const swaggerifyRoute = (path) => path
    .split("/")
    .map((seg) => (seg.startsWith(":") ? `{${seg.slice(1)}}` : seg))
    .join("/");
