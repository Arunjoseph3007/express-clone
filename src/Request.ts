import { IncomingHttpHeaders, IncomingMessage } from "http";
import getRawBody from "raw-body";
import { parseCookie } from "./utils/parseCookies";

export default class Request<
  TBody extends any = any,
  TParam extends Record<string, string | number> = any,
  TQuery extends any = any
> {
  public req: IncomingMessage;
  public orginalUrl: string;
  public method: string;
  public url: string;
  public params: TParam;
  public query: TQuery;
  public headers: IncomingHttpHeaders;
  public body: TBody;
  public cookies: Record<string, string>;

  constructor(req: IncomingMessage) {
    const url = new URL(req.url || "", `http://${req.headers.host}`);

    this.req = req;
    this.method = req.method?.toUpperCase() || "";
    this.orginalUrl = req.url || "";
    this.cookies = parseCookie(req.headers.cookie);
    this.headers = req.headers;
    this.url = url.pathname;
    this.query = url.searchParams as TQuery;
    this.params = {} as TParam;
    this.body = {} as TBody;
  }

  async init() {
    const rawBody = await getRawBody(this.req);

    try {
      if (this.req.headers["content-type"] == "application/json") {
        this.body = JSON.parse(rawBody.toString());
      }
    } catch (error) {
      console.log("Could parse body");
    }
    return this;
  }
}
