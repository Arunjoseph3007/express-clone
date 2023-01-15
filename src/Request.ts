import { IncomingMessage } from "http";
import getRawBody from "raw-body";

export default class Request {
  public req: IncomingMessage;
  public orginalUrl: string;
  public method: string;
  public url: string;
  public params: URLSearchParams;
  public query: any;
  public headers: Object;
  public body: any;
  public cookies: any;
  private _bodyP: Promise<Buffer>;

  constructor(req: IncomingMessage) {
    const url = new URL(req.url || "", "http://localhost:3000");

    this.req = req;
    this.method = req.method?.toUpperCase() || "";
    this.orginalUrl = req.url || "";
    this.cookies = req;
    this.headers = req.headers;
    this.url = url.pathname;
    this.params = url.searchParams;
    this.query = {};
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
