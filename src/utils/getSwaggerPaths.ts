import { z } from "zod";
import { TDoc } from "../Router";
import { HandlerType, MethodType } from "../interfaces/handler";
import zodToJsonSchema from "zod-to-json-schema";

export default function getSwaggerPaths(handlers: Array<TDoc>) {
  return handlers
    .filter(removeMiddlewares)
    .filter(removeALLRoutes)
    .map(extractNecessary)
    .reduce<any>(docIt, {});
}

const swaggerify = (path: string) =>
  path
    .split("/")
    .map((seg) => (seg.startsWith(":") ? `{${seg.slice(1)}}` : seg))
    .join("/");

const parameterizePath = (path: string) =>
  path
    .split("/")
    .filter((a) => a[0] == ":")
    .map((a) => a.slice(1))
    .map((a) => ({
      name: a,
      in: "path",
      required: true,
      type: "string",
    }));

const parameterize = (handler: ReturnType<typeof extractNecessary>) => {
  const pars = parameterizePath(handler.path);

  if (handler.input) pars.push(parameterizeBody(handler.input));

  return pars;
};

const parameterizeBody = (inp: z.ZodTypeAny): any => ({
  name: "body",
  in: "body",
  required: true,
  schema: zodToJsonSchema(inp),
});

const removeMiddlewares = (h: TDoc) => h.type == HandlerType.endpoint;

const removeALLRoutes = (h: TDoc) => h.method != MethodType.ALL;

const extractNecessary = ({ type, ...h }: TDoc) => h;

const docIt = (acc: any, doc: ReturnType<typeof extractNecessary>) => {
  const path = swaggerify(doc.path);
  const met = doc.method.toLowerCase();

  if (!acc[path]) acc[path] = {};
  if (!acc[path][met]) acc[path][met] = {};

  acc[path][met].parameters = parameterize(doc);
  acc[path][met].tags = [doc.group.slice(1)];
  acc[path][met].responses = {
    "200": {
      description: "OK",
      schema: {
        type: "array",
        items: {
          $ref: "#/definitions/Book",
        },
        xml: {
          name: "main",
        },
      },
    },
  };

  return acc;
};
