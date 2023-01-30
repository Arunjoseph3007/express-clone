import { Server } from '../index';

describe("Testing Server class", () => {
  let app = new Server();

  beforeAll(() => {
    app = new Server();
  });

  it("should be defined", () => {
    expect(Server).toBeDefined();
  });

  it("should be instantiable", () => {
    expect(app).toBeDefined();
  });
});
