import { Handler, HandlerType, MethodType } from "../interfaces/handler";

export default function getSwaggerPaths(handlers: Array<Handler>) {
  const endPoints = handlers
    .filter((h) => h.type == HandlerType.endpoint)
    .filter((h) => h.method != MethodType.ALL)
    .map(({ type, ...h }) => h);

  let openApiPaths: any = {};

  endPoints.forEach((handler) => {
    const swaggerishPath = swaggerify(handler.path);

    if (!openApiPaths[swaggerishPath]) {
      openApiPaths[swaggerishPath] = {};
    }

    openApiPaths[swaggerishPath][handler.method.toLowerCase()] = {
      tags: ["Books"],
      description: "",
      parameters: parameterizePath(handler.path),
    };
  });

  return openApiPaths;
}

const swaggerify = (path: string) =>
  path
    .split("/")
    .map((seg) => (seg.startsWith(":") ? `{${seg.slice(1)}}` : seg))
    .join("/");

const parameterizePath = (path: string) => {
  return path
    .split("/")
    .filter((a) => a.includes(":"))
    .map((a) => a.slice(1))
    .map((a) => ({
      name: a,
      in: "path",
      required: true,
      type: "string",
    }));
};
