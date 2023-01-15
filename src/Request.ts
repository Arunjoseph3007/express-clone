import { IncomingHttpHeaders, IncomingMessage } from "http";
import getRawBody from "raw-body";
import { parseCookie } from "./utils/parseCookies";

export default class Request {
  public req: IncomingMessage;
  public orginalUrl: string;
  public method: string;
  public url: string;
  public params: any;
  public query: any;
  public headers: IncomingHttpHeaders;
  public body: any;
  public cookies: Record<string, string>;
  private _bodyP: Promise<Buffer>;

  constructor(req: IncomingMessage) {
    const url = new URL(req.url || "", `http://${req.headers.host}`);

    this.req = req;
    this.method = req.method?.toUpperCase() || "";
    this.orginalUrl = req.url || "";
    this.cookies = parseCookie(req.headers.cookie)
    this.headers = req.headers;
    this.url = url.pathname;
    this.query = url.searchParams;
    this.params = {};
    this._bodyP = getRawBody(req);
    this.body = {};
  }

  async init() {
    const rawBody = await this._bodyP;

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
