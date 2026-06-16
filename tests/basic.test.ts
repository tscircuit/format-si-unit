import { expect, test, describe } from "bun:test";
import { formatSiUnit, getSiPrefixMultiplier, parseSiUnit } from "../index";

describe("formatSiUnit", () => {
  test("handles basic cases", () => {
    expect(formatSiUnit(1000)).toBe("1k");
    expect(formatSiUnit(1500)).toBe("1.5k");
    expect(formatSiUnit(1_000_000)).toBe("1M");
  });

  test("handles small numbers", () => {
    expect(formatSiUnit(0.001)).toBe("1m");
    expect(formatSiUnit(0.000001)).toBe("1µ");
    expect(formatSiUnit(0.0001)).toBe("100µ")
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

describe("parseSiUnit", () => {
  test("handles basic cases", () => {
    expect(parseSiUnit("1k")).toBe(1000);
    expect(parseSiUnit("1K")).toBe(1000);
    expect(parseSiUnit("1.5k")).toBe(1500);
    expect(parseSiUnit("1M")).toBe(1_000_000);
  });

  test("handles small numbers", () => {
    expect(parseSiUnit("1m")).toBe(0.001);
    expect(parseSiUnit("1µ")).toBe(0.000001);
    expect(parseSiUnit("1u")).toBe(0.000001);
    expect(parseSiUnit("100µ")).toBeCloseTo(0.0001);
    expect(parseSiUnit("1n")).toBe(0.000000001);
    expect(parseSiUnit("1f")).toBe(0.000000000000001);
  });

  test("handles signed and decimal inputs", () => {
    expect(parseSiUnit("-2.2k")).toBe(-2200);
    expect(parseSiUnit("+.5M")).toBe(500_000);
    expect(parseSiUnit("1e3m")).toBe(1);
  });

  test("handles edge cases", () => {
    expect(parseSiUnit("0")).toBe(0);
    expect(parseSiUnit()).toBeUndefined();
    expect(parseSiUnit(null)).toBeUndefined();
    expect(parseSiUnit("")).toBeUndefined();
    expect(parseSiUnit("   ")).toBeUndefined();
  });

  test("returns NaN for invalid inputs", () => {
    expect(parseSiUnit("abc")).toBeNaN();
    expect(parseSiUnit("1kk")).toBeNaN();
    expect(parseSiUnit("1 k")).toBeNaN();
    expect(parseSiUnit("10mA")).toBeNaN();
  });
});

describe("getSiPrefixMultiplier", () => {
  test("handles common SI prefixes", () => {
    expect(getSiPrefixMultiplier("f")).toBe(1e-15);
    expect(getSiPrefixMultiplier("p")).toBe(1e-12);
    expect(getSiPrefixMultiplier("n")).toBe(1e-9);
    expect(getSiPrefixMultiplier("u")).toBe(1e-6);
    expect(getSiPrefixMultiplier("µ")).toBe(1e-6);
    expect(getSiPrefixMultiplier("m")).toBe(1e-3);
    expect(getSiPrefixMultiplier("k")).toBe(1e3);
    expect(getSiPrefixMultiplier("K")).toBe(1e3);
    expect(getSiPrefixMultiplier("M")).toBe(1e6);
    expect(getSiPrefixMultiplier("G")).toBe(1e9);
    expect(getSiPrefixMultiplier("T")).toBe(1e12);
  });

  test("keeps prefixes case-sensitive", () => {
    expect(getSiPrefixMultiplier("m")).toBe(1e-3);
    expect(getSiPrefixMultiplier("M")).toBe(1e6);
  });

  test("returns undefined for unknown prefixes", () => {
    expect(getSiPrefixMultiplier("")).toBe(1);
    expect(getSiPrefixMultiplier("x")).toBeUndefined();
    expect(getSiPrefixMultiplier("MM")).toBeUndefined();
    expect(getSiPrefixMultiplier("meg")).toBeUndefined();
    expect(getSiPrefixMultiplier("milli")).toBeUndefined();
  });
});
