import { getRandom } from "./utils";

describe("utils.ts", () => {
  describe("getRandom", () => {
    it("get a number from min and max in call 100 times", () => {
      for (let i = 0; i < 100; i++) {
        expect(getRandom(0, 10)).toBeGreaterThanOrEqual(0);
        expect(getRandom(0, 10)).toBeLessThanOrEqual(10);
      }
    });
  });
});
