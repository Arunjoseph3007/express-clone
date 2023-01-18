import { HandlerFunction } from "../interfaces/handler";

export const cookieParser: HandlerFunction = (req, _, next) => {
  const cookieStr: string = req.req.headers.cookie || "";

  req.cookies = cookieStr
    .replace(" ", "")
    .split(";")
    .reduce<Record<string, string>>((ac, cr) => {
      const [key, value] = cr.split("=");
      return { ...ac, [key]: value };
    }, {});

  next();
};
