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
    expect(app).toBeInstanceOf(Server)
  });

  it('should have following methods [get, post, put, patch, delete, rpc]',()=>{
    expect(typeof app.get).toBe('function')
    expect(typeof app.post).toBe('function')
    expect(typeof app.put).toBe('function')
    expect(typeof app.patch).toBe('function')
    expect(typeof app.delete).toBe('function')
    expect(typeof app.rpc).toBe('function')
  })
});
