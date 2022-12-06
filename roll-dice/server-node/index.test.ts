import app from ".";
const request = require("supertest");

describe("index.ts", () => {
  describe("POST /roll-dice", () => {
    it("return an array containing one number", (done) => {
      request(app)
        .post("/roll-dice")
        .send({ count: 1 })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((response) => {
          expect(response.body[0]).toBeGreaterThanOrEqual(1);
          expect(response.body[0]).toBeLessThanOrEqual(6);
          return done();
        });
    });
    it("return an array containing ten number", (done) => {
      request(app)
        .post("/roll-dice")
        .send({ count: 10 })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((response) => {
          for (let i = 0; i < 10; i++) {
            expect(response.body[i]).toBeGreaterThanOrEqual(1);
            expect(response.body[i]).toBeLessThanOrEqual(6);
          }
          return done();
        });
    });
    it("throw an error if count is missing in body", (done) => {
      request(app)
        .post("/roll-dice")
        .set("Accept", "application/json")
        .expect(500)
        .end((_, res) => {
          expect(res.error.text).toEqual("count is missing");
          return done();
        });
    });
  });
});
