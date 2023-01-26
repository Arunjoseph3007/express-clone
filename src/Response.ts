import { OutgoingHttpHeader, OutgoingHttpHeaders, ServerResponse } from "http";
import send from "send";
import contentDisposition from "content-disposition";
import { htmlTemplate } from "./utils/htmlTemplate";
import { Handler } from "./interfaces/handler";
import Server from "./Server";

/**
 * A wrapper around the `http.ServerResponse`
 */
export default class Response {
  public res: ServerResponse;
  public isBrowserRequest: boolean;
  public route?: Handler;
  public app?: Server;

  constructor(res: ServerResponse) {
    this.res = res;
    this.isBrowserRequest =
      this.res.req.headers["sec-fetch-dest"] == "document";
  }

  /**
   * A simple utility to set any Header
   * @param field The header that you want to set
   * @param value The value
   * @returns
   */
  set(field: string, value: string) {
    this.res.setHeader(field, value);
    return this;
  }

  /**
   * A simple utility to set any Header
   * @param field The header that you want to set
   * @param value The value
   * @returns
   */
  setHeader(field: string, value: string) {
    this.res.setHeader(field, value);
    return this;
  }

  /**
   * Send anything as response
   * @param message The content you want to send
   * @param cb Error handler (if anything goes wrong)
   * @returns
   */
  write(message: any, cb?: (error: Error | null | undefined) => void) {
    this.res.write(message, cb);
    return this;
  }

  /**
   * End the response and return once called nothing can be send to the client
   * @param cb
   * @returns
   */
  end(cb?: () => void) {
    this.res.end(cb);
    return this;
  }

  /**
   * Send the provided message and end the response.
   * Also auto detects if the client is browser and nicely formats the output
   * @param message Content to be sent
   * @param cb
   * @returns
   */
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

  /**
   * Set statuscode of the response
   * @param statusCode The status code
   * @returns
   */
  status(statusCode: number) {
    this.res.statusCode = statusCode;
    return this;
  }

  /**
   * Set status and optionally write some response geaders
   * @param statusCode
   * @param statusMessage
   * @param headers
   * @returns
   */
  writeHead(
    statusCode: number,
    statusMessage?: string,
    headers?: OutgoingHttpHeaders | OutgoingHttpHeader[]
  ) {
    this.res.writeHead(statusCode, statusMessage, headers);
    return this;
  }

  /**
   * Pipe any stream data to the client
   * @param dest A stream to you want to pipe
   * @param opt
   * @returns
   */
  pipe(dest: NodeJS.WritableStream, opt?: { end?: boolean }) {
    return this.res.pipe(dest, opt);
  }

  /**
   * Return data as JSON
   * @param data
   * @returns
   */
  json(data: any) {
    this.set("content-type", "application/json");
    this.send(JSON.stringify(data));
    return this;
  }

  /**
   * Utility to send json and set status success
   * @param data
   * @returns
   */
  success(data: any) {
    this.status(200).json(data);
    return this;
  }

  /**
   * Send any files to the client
   * @param path Path of the file to be sent
   * @param options Any options
   * @returns
   */
  sendFile(path: string, options?: send.SendOptions) {
    const file = send(this.res.req, encodeURI(path), options);
    file.pipe(this.res);
    return this;
  }

  /**
   * Send and download any file to the client
   * @param filePath Path to the file to be downloaded
   * @param options
   * @returns
   */
  download(filePath: string, options?: send.SendOptions) {
    this.setHeader("content-disposition", contentDisposition(filePath));
    return this.sendFile(filePath, options);
  }
}
