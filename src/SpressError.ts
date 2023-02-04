export default class SpressError extends Error {
  constructor(satus: number, msg?: string) {
    super(msg);
  }
}

export const throwSpress = (status: number, msg?: string) => {
  throw new SpressError(status, msg);
};
