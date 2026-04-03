import { describe, expect, it } from "vitest";
import {
  calculateBenchmarkBandPosition,
  calculateBenchmarkComparison,
  calculateUpsideEstimate,
  calculateRemainingPercentage,
  calculateRevenueAfterDirectCosts,
  calculateRevenueAfterDirectCostsMetrics,
  getComparisonState,
  getPerformanceState,
  getSectorBenchmark,
} from "@/lib/estimator";

describe("calculateRevenueAfterDirectCosts", () => {
  it("subtracts annual cogs from annual revenue", () => {
    expect(calculateRevenueAfterDirectCosts(12_500_000, 7_200_000)).toBe(5_300_000);
  });
});

describe("calculateRemainingPercentage", () => {
  it("returns the percentage of revenue remaining after direct costs", () => {
    expect(calculateRemainingPercentage(12_500_000, 7_200_000)).toBeCloseTo(0.424, 6);
  });

  it("returns zero when revenue is zero or invalid", () => {
    expect(calculateRemainingPercentage(0, 1_000)).toBe(0);
  });
});

describe("calculateRevenueAfterDirectCostsMetrics", () => {
  it("returns both the remaining revenue and percentage", () => {
    expect(calculateRevenueAfterDirectCostsMetrics(1_000_000, 640_000)).toEqual({
      revenueAfterDirectCosts: 360_000,
      percentageRemaining: 0.36,
    });
  });
});

describe("getComparisonState", () => {
  it("marks values below the benchmark band as below", () => {
    expect(
      getComparisonState({
        percentageRemaining: 0.2,
        sectorBenchmark: getSectorBenchmark("distribution"),
      }),
    ).toBe("below");
  });

  it("marks values inside the benchmark band as within", () => {
    expect(
      getComparisonState({
        percentageRemaining: 0.3,
        sectorBenchmark: getSectorBenchmark("distribution"),
      }),
    ).toBe("within");
  });

  it("marks values above the benchmark band as above", () => {
    expect(
      getComparisonState({
        percentageRemaining: 0.41,
        sectorBenchmark: getSectorBenchmark("distribution"),
      }),
    ).toBe("above");
  });
});

describe("calculateBenchmarkBandPosition", () => {
  it("classifies values below the range", () => {
    expect(
      calculateBenchmarkBandPosition({
        percentageRemaining: 0.2,
        sectorBenchmark: getSectorBenchmark("distribution"),
      }),
    ).toMatchObject({
      label: "Below benchmark range",
      clampedPosition: 0,
    });
  });

  it("classifies values in the lower half of the range", () => {
    const result = calculateBenchmarkBandPosition({
      percentageRemaining: 0.29,
      sectorBenchmark: getSectorBenchmark("distribution"),
    });

    expect(result.label).toBe("Lower half of benchmark band");
    expect(result.clampedPosition).toBeCloseTo(40, 6);
  });

  it("classifies values in the upper quartile of the range", () => {
    const result = calculateBenchmarkBandPosition({
      percentageRemaining: 0.34,
      sectorBenchmark: getSectorBenchmark("distribution"),
    });

    expect(result.label).toBe("Upper quartile of benchmark band");
    expect(result.clampedPosition).toBeCloseTo(90, 6);
  });

  it("classifies values above the range", () => {
    expect(
      calculateBenchmarkBandPosition({
        percentageRemaining: 0.4,
        sectorBenchmark: getSectorBenchmark("distribution"),
      }),
    ).toMatchObject({
      label: "Above benchmark range",
      clampedPosition: 100,
    });
  });
});

describe("getPerformanceState", () => {
  it("returns below benchmark range when under the band", () => {
    expect(
      getPerformanceState({
        percentageRemaining: 0.2,
        sectorBenchmark: getSectorBenchmark("distribution"),
      }),
    ).toBe("below_benchmark_range");
  });

  it("returns within lower half when inside the lower part of the band", () => {
    expect(
      getPerformanceState({
        percentageRemaining: 0.28,
        sectorBenchmark: getSectorBenchmark("distribution"),
      }),
    ).toBe("within_lower_half");
  });

  it("returns within upper half when inside the upper part of the band", () => {
    expect(
      getPerformanceState({
        percentageRemaining: 0.33,
        sectorBenchmark: getSectorBenchmark("distribution"),
      }),
    ).toBe("within_upper_half");
  });

  it("returns above benchmark range when over the band", () => {
    expect(
      getPerformanceState({
        percentageRemaining: 0.38,
        sectorBenchmark: getSectorBenchmark("distribution"),
      }),
    ).toBe("above_benchmark_range");
  });
});

describe("calculateUpsideEstimate", () => {
  it("returns a midpoint-based upside estimate for below-benchmark results", () => {
    const result = calculateUpsideEstimate({
      annualRevenue: 10_000_000,
      percentageRemaining: 0.2,
      sectorBenchmark: getSectorBenchmark("distribution"),
    });

    expect(result.title).toBe("Estimated improvement potential");
    expect(result.targetLabel).toBe("benchmark midpoint");
    expect(result.targetPercentage).toBeCloseTo(0.3, 6);
    expect(result.additionalRevenueRemaining).toBe(1_000_000);
  });

  it("returns non-zero euro upside for above-benchmark results", () => {
    const result = calculateUpsideEstimate({
      annualRevenue: 10_000_000,
      percentageRemaining: 0.38,
      sectorBenchmark: getSectorBenchmark("distribution"),
    });

    expect(result.title).toBe("Additional optimization upside");
    expect(result.targetPercentage).toBeGreaterThan(0.38);
    expect(result.additionalRevenueRemaining).toBeGreaterThan(0);
  });
});

describe("calculateBenchmarkComparison", () => {
  it("returns benchmark context, band position, and euro upside estimate", () => {
    const result = calculateBenchmarkComparison({
      annualRevenue: 10_000_000,
      percentageRemaining: 0.2,
      sectorBenchmark: getSectorBenchmark("distribution"),
    });

    expect(result.benchmarkLower).toBe(0.25);
    expect(result.benchmarkMid).toBe(0.3);
    expect(result.benchmarkUpper).toBe(0.35);
    expect(result.comparisonState).toBe("below");
    expect(result.performanceState).toBe("below_benchmark_range");
    expect(result.benchmarkBandPosition.label).toBe("Below benchmark range");
    expect(result.percentagePointGapToBandLow).toBeCloseTo(0.05, 6);
    expect(result.percentagePointGapToBandMid).toBeCloseTo(0.1, 6);
    expect(result.percentagePointGapToBandHigh).toBeCloseTo(0.15, 6);
    expect(result.upsideEstimate.targetPercentage).toBeCloseTo(0.3, 6);
    expect(result.upsideEstimate.additionalRevenueRemaining).toBe(1_000_000);
  });
});
