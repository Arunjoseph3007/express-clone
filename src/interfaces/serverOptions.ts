export default interface ServerOptions {
  name?: string;
  port?: number;
  description?: string;
  version?: string;
  host?: string;
  allowedHosts?: string;
  logPattern?: string;
}
