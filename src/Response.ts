import { OutgoingHttpHeader, OutgoingHttpHeaders, ServerResponse } from "http";

export default class Response {
  public res: ServerResponse;

  constructor(res: ServerResponse) {
    this.res = res;
  }

  set(field: string, value: string) {
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
    this.write(message, cb);
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

  pipe(dest: NodeJS.WritableStream, opt?: { end?: boolean | undefined }) {
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
}
