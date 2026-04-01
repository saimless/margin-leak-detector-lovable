import { describe, expect, it } from "vitest";
import {
  MAX_GROSS_MARGIN_CAP,
  calculateGrossMarginScenarios,
  getMarginBenchmarkState,
  getSectorBenchmark,
  parseGrossMarginRange,
} from "@/lib/estimator";

describe("parseGrossMarginRange", () => {
  it("parses less-than ranges", () => {
    expect(parseGrossMarginRange("<15%")).toEqual({ low: 0, high: 0.15, midpoint: 0.075 });
  });

  it("parses finite ranges", () => {
    expect(parseGrossMarginRange("20–25%")).toEqual({ low: 0.2, high: 0.25, midpoint: 0.225 });
    expect(parseGrossMarginRange("50–65%")).toEqual({ low: 0.5, high: 0.65, midpoint: 0.575 });
  });

  it("caps open-ended ranges for stable calculations", () => {
    expect(parseGrossMarginRange("65%+")).toEqual({
      low: 0.65,
      high: MAX_GROSS_MARGIN_CAP,
      midpoint: (0.65 + MAX_GROSS_MARGIN_CAP) / 2,
    });
  });
});

describe("calculateGrossMarginScenarios", () => {
  it("builds lower, midpoint, and upper benchmark scenarios", () => {
    const result = calculateGrossMarginScenarios({
      annualRevenue: 12_500_000,
      currentGrossMargin: 0.225,
      sectorBenchmark: getSectorBenchmark("manufacturing_industrial"),
    });

    expect(result.benchmarkLower).toBe(0.28);
    expect(result.benchmarkMid).toBe(0.34);
    expect(result.benchmarkUpper).toBe(0.4);
    expect(result.grossProfitCurrent).toBe(2_812_500);
    expect(result.scenarios).toEqual([
      {
        label: "conservative",
        targetMargin: 0.28,
        grossProfitScenario: 3_500_000,
        grossProfitImprovement: 687_500,
      },
      {
        label: "midpoint",
        targetMargin: 0.34,
        grossProfitScenario: 4_250_000,
        grossProfitImprovement: 1_437_500,
      },
      {
        label: "optimized",
        targetMargin: 0.4,
        grossProfitScenario: 5_000_000,
        grossProfitImprovement: 2_187_500,
      },
    ]);
  });

  it("never returns negative gross profit improvement", () => {
    const result = calculateGrossMarginScenarios({
      annualRevenue: 5_000_000,
      currentGrossMargin: 0.725,
      sectorBenchmark: getSectorBenchmark("software_saas"),
    });

    expect(result.grossProfitCurrent).toBe(3_625_000);
    expect(result.scenarios).toEqual([
      {
        label: "conservative",
        targetMargin: 0.65,
        grossProfitScenario: 3_250_000,
        grossProfitImprovement: 0,
      },
      {
        label: "midpoint",
        targetMargin: 0.7250000000000001,
        grossProfitScenario: 3_625_000,
        grossProfitImprovement: 0,
      },
      {
        label: "optimized",
        targetMargin: 0.8,
        grossProfitScenario: 4_000_000,
        grossProfitImprovement: 375_000,
      },
    ]);
  });
});

describe("getMarginBenchmarkState", () => {
  it("marks materially below-band performance as weak", () => {
    expect(
      getMarginBenchmarkState({
        currentGrossMargin: 0.12,
        sectorBenchmark: getSectorBenchmark("distribution"),
      }),
    ).toBe("weak");
  });

  it("marks margins near the middle of the band as strong", () => {
    expect(
      getMarginBenchmarkState({
        currentGrossMargin: 0.33,
        sectorBenchmark: getSectorBenchmark("distribution"),
      }),
    ).toBe("strong");
  });

  it("marks remaining in-band cases as average", () => {
    expect(
      getMarginBenchmarkState({
        currentGrossMargin: 0.28,
        sectorBenchmark: getSectorBenchmark("distribution"),
      }),
    ).toBe("average");
  });
});
