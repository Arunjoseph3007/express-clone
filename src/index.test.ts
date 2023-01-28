import { readdirSync } from "fs";
import { getAbsoluteFSPath } from "swagger-ui-dist";

const swaggerRoot = getAbsoluteFSPath();

console.log(swaggerRoot);

const files = readdirSync(swaggerRoot);

console.log(files);
