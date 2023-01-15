import getRawBody from "raw-body";
import { handlerFunction } from "../interfaces/handler";

export const bodyParser: handlerFunction = async (req, _, next) => {
  const _bodyP = getRawBody(req.req);
  const rawBody = await _bodyP;

  try {
    if (req.headers["content-type"] == "application/json") {
      req.body = JSON.parse(rawBody.toString());
    } else {
      req.body = {};
    }
  } catch (error) {
    console.log("Could parse body");
  }
  next();
};
