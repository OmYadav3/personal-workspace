import { describe, it, expect } from "vitest";

describe("Basic Test", () => {
   it("should add two numbers correctly", () => {
      const result = 10 + 20;

      expect(result).toBe(30);
   });
});

/*

* describe() — related tests ko group karta hai.
* it() — ek individual test define karta hai.
* expect() — actual result ko expected result se compare karta hai.

*/
