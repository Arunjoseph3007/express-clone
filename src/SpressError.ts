export default class SpressError extends Error {
  status: number;
  details: any;
  readonly type = "SpressError";

  constructor(status: number = 404, details?: any) {
    super("");
    this.status = status;
    this.details = details;
  }
}

export const throwSpress = (status?: number, details?: any) => {
  throw new SpressError(status, details);
};
