import { match } from "path-to-regexp";

const m = match("/abcd(.*)", { decode: encodeURIComponent });

console.log(m("/"));
console.log(m("/abcd"));
console.log(m("/abcd/"));
console.log(m("/abcd/123"));
console.log(m("/abcd/123/erw"));
console.log(m("/abc/123/erw"));
