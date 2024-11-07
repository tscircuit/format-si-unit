import { expect, test, describe } from "bun:test";
import { formatSiUnit } from "../index";

describe("formatSiUnit", () => {
  test("handles basic cases", () => {
    expect(formatSiUnit(1000)).toBe("1k");
    expect(formatSiUnit(1500)).toBe("1.5k");
    expect(formatSiUnit(1_000_000)).toBe("1M");
  });

  test("handles small numbers", () => {
    expect(formatSiUnit(0.001)).toBe("1m");
    expect(formatSiUnit(0.000001)).toBe("1µ");
    expect(formatSiUnit(0.000000001)).toBe("1n");
  });

  test("handles edge cases", () => {
    expect(formatSiUnit(0)).toBe("0");
    expect(formatSiUnit()).toBe("");
    expect(formatSiUnit(null)).toBe("");
  });

  test("handles numbers needing rounding", () => {
    expect(formatSiUnit(1234)).toBe("1.23k");
    expect(formatSiUnit(9999999)).toBe("10M");
  });
});
