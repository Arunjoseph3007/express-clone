import { HandlerFunction } from "../interfaces/handler";
import Response from "../Response";

const AllowAccess = "Access-Control-Allow-Origin";
const AllowCredentials = "Access-Control-Allow-Credentials";

const defaultOptions: Required<CorsOptions> = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true,
} as const;

type TOrigin = string | string[] | RegExp;

interface CorsOptions {
  origin?: TOrigin;
  methods?: string;
  preflightContinue?: boolean;
  optionsSuccessStatus?: number;
  credentials?: boolean;
}

const configureOrigin = (res: Response, reqOrigin: string, origin: TOrigin) => {

  if (origin == "*") {
    res.setHeader(AllowAccess, "*");
  } else if (typeof origin == "string") {
    res.setHeader(AllowAccess, origin);
  } else if (origin instanceof RegExp) {
    if (origin.test(reqOrigin)) {
      res.setHeader(AllowAccess, reqOrigin);
    }
  } else if (origin.includes(reqOrigin)) {
    res.setHeader(AllowAccess, reqOrigin);
  }
};

export const CORS = (givenOpts?: CorsOptions): HandlerFunction => {
  const options = { ...defaultOptions, ...givenOpts };

  return function (req, res, next) {
    const reqOrigin = req.headers.origin || "";

    configureOrigin(res, reqOrigin, options.origin);
    res.setHeader(AllowCredentials, options.credentials.toString());

    next();
  };
};
