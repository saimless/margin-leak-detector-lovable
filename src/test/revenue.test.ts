import { describe, expect, it } from "vitest";
import { formatRevenueDisplayInput, getCompanyStage, parseRevenueInput } from "@/lib/revenue";

describe("getCompanyStage", () => {
  it("classifies early-stage revenue below 25000", () => {
    expect(getCompanyStage(1_000)).toBe("early_stage");
    expect(getCompanyStage(24_999)).toBe("early_stage");
  });

  it("classifies growth revenue between 25000 and 250000 inclusive", () => {
    expect(getCompanyStage(25_000)).toBe("growth");
    expect(getCompanyStage(250_000)).toBe("growth");
  });

  it("classifies scale revenue above 250000", () => {
    expect(getCompanyStage(250_001)).toBe("scale");
  });
});

describe("parseRevenueInput", () => {
  it("parses plain integer input", () => {
    expect(parseRevenueInput("12500000")).toBe(12_500_000);
  });

  it("parses localized thousands separators", () => {
    expect(parseRevenueInput("12,500,000")).toBe(12_500_000);
    expect(parseRevenueInput("12.500.000")).toBe(12_500_000);
  });

  it("parses suffix-based shorthand input", () => {
    expect(parseRevenueInput("12.5m")).toBe(12_500_000);
    expect(parseRevenueInput("12.5M")).toBe(12_500_000);
  });

  it("returns null for invalid or non-positive values", () => {
    expect(parseRevenueInput("")).toBeNull();
    expect(parseRevenueInput("abc")).toBeNull();
    expect(parseRevenueInput("0")).toBeNull();
  });

  it("can allow zero values for fields like cogs", () => {
    expect(parseRevenueInput("0", { allowZero: true })).toBe(0);
  });
});

describe("formatRevenueDisplayInput", () => {
  it("formats plain numeric input with dot thousand separators", () => {
    expect(formatRevenueDisplayInput("12500000")).toBe("12.500.000");
    expect(formatRevenueDisplayInput("12,500,000")).toBe("12.500.000");
  });

  it("preserves shorthand suffix input", () => {
    expect(formatRevenueDisplayInput("12.5M")).toBe("12.5M");
  });
});
