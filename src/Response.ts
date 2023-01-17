import { OutgoingHttpHeader, OutgoingHttpHeaders, ServerResponse } from "http";
import send from "send";
import contentDisposition from "content-disposition";
import { htmlTemplate } from "./utils/htmlTemplate";
import { Handler } from "./interfaces/handler";

export default class Response {
  public res: ServerResponse;
  public isBrowserRequest: boolean;
  public route?: Handler;

  constructor(res: ServerResponse) {
    this.res = res;
    this.isBrowserRequest =
      this.res.req.headers["sec-fetch-dest"] == "document";
  }

  set(field: string, value: string) {
    this.res.setHeader(field, value);
    return this;
  }

  setHeader(field: string, value: string) {
    this.res.setHeader(field, value);
    return this;
  }

  write(message: any, cb?: (error: Error | null | undefined) => void) {
    this.res.write(message, cb);
    return this;
  }

  end(cb?: () => void) {
    this.res.end(cb);
    return this;
  }

  send(message: any, cb?: (error: Error | null | undefined) => void) {
    if (this.isBrowserRequest) {
      this.setHeader("Content-Type", "text/html");
      this.write(htmlTemplate(this, message), cb);
    } else {
      this.write(message, cb);
    }
    this.end();
    return this;
  }

  status(statusCode: number) {
    this.res.statusCode = statusCode;
    return this;
  }

  writeHead(
    statusCode: number,
    statusMessage?: string,
    headers?: OutgoingHttpHeaders | OutgoingHttpHeader[]
  ) {
    this.res.writeHead(statusCode, statusMessage, headers);
    return this;
  }

  pipe(dest: NodeJS.WritableStream, opt?: { end?: boolean }) {
    return this.res.pipe(dest, opt);
  }

  json(data: any) {
    this.set("content-type", "application/json");
    this.send(JSON.stringify(data));
    return this;
  }

  success(data: any) {
    this.status(200).json(data);
    return this;
  }

  sendFile(path: string, options?: send.SendOptions) {
    const file = send(this.res.req, encodeURI(path), options);
    file.pipe(this.res);
    return this;
  }

  download(filePath: string, options?: send.SendOptions) {
    this.setHeader("content-disposition", contentDisposition(filePath));
    return this.sendFile(filePath, options);
  }
}
