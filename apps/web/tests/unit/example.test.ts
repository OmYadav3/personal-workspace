import { describe, it, expect } from "vitest";

describe("Frontend Basic Test", () => {
   it("should calculate correctly", () => {
      const result = 5 * 5;

      expect(result).toBe(25);
   });
});
