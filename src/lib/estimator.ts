export const sectorBenchmarks = {
  distribution: { anchor: 0.3057, bandLow: 0.25, bandHigh: 0.35 },
  manufacturing_commodity: { anchor: 0.1584, bandLow: 0.1, bandHigh: 0.25 },
  manufacturing_industrial: { anchor: 0.347, bandLow: 0.28, bandHigh: 0.4 },
  manufacturing_specialty: { anchor: 0.3512, bandLow: 0.35, bandHigh: 0.5 },
  retail_general: { anchor: 0.3318, bandLow: 0.28, bandHigh: 0.38 },
  retail_specialty: { anchor: 0.353, bandLow: 0.3, bandHigh: 0.4 },
  professional_services: { anchor: 0.3338, bandLow: 0.28, bandHigh: 0.4 },
  it_services: { anchor: 0.2426, bandLow: 0.2, bandHigh: 0.3 },
  software_saas: { anchor: 0.7172, bandLow: 0.65, bandHigh: 0.8 },
  logistics_transport: { anchor: 0.241, bandLow: 0.18, bandHigh: 0.28 },
  construction_services: { anchor: 0.1546, bandLow: 0.12, bandHigh: 0.22 },
} as const;

export type Sector = keyof typeof sectorBenchmarks;

export const SECTOR_OPTIONS: Array<{ value: Sector; label: string }> = [
  { value: "distribution", label: "Distribution" },
  { value: "manufacturing_commodity", label: "Manufacturing, commodity" },
  { value: "manufacturing_industrial", label: "Manufacturing, industrial" },
  { value: "manufacturing_specialty", label: "Manufacturing, specialty" },
  { value: "retail_general", label: "Retail, general" },
  { value: "retail_specialty", label: "Retail, specialty" },
  { value: "professional_services", label: "Professional services" },
  { value: "it_services", label: "IT services" },
  { value: "software_saas", label: "Software / SaaS" },
  { value: "logistics_transport", label: "Logistics & transport" },
  { value: "construction_services", label: "Construction services" },
] as const;

export interface SectorBenchmark {
  anchor: number;
  bandLow: number;
  bandHigh: number;
}

export interface RevenueAfterDirectCostsMetrics {
  revenueAfterDirectCosts: number;
  percentageRemaining: number;
}

export interface BenchmarkBandPosition {
  rawPosition: number;
  clampedPosition: number;
  label: BenchmarkBandPositionLabel;
}

export interface UpsideEstimate {
  title: string;
  targetLabel: string;
  targetPercentage: number;
  additionalRevenueRemaining: number;
  summary: string;
}

export interface RevenueComparisonResult {
  benchmarkLower: number;
  benchmarkMid: number;
  benchmarkUpper: number;
  benchmarkSummary: SectorBenchmark;
  comparisonState: ComparisonState;
  performanceState: PerformanceState;
  benchmarkBandPosition: BenchmarkBandPosition;
  percentagePointGapToBandLow: number;
  percentagePointGapToBandMid: number;
  percentagePointGapToBandHigh: number;
  upsideEstimate: UpsideEstimate;
}

export type ComparisonState = "below" | "within" | "above";

export type PerformanceState =
  | "below_benchmark_range"
  | "within_lower_half"
  | "within_upper_half"
  | "above_benchmark_range";

export type BenchmarkBandPositionLabel =
  | "Below benchmark range"
  | "Near lower end of benchmark band"
  | "Lower half of benchmark band"
  | "Upper half of benchmark band"
  | "Upper quartile of benchmark band"
  | "Above benchmark range";

function roundCurrency(value: number): number {
  return Math.round(value);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function getSectorBenchmark(sector: Sector): SectorBenchmark {
  return sectorBenchmarks[sector];
}

export function getSectorLabel(sector: Sector): string {
  return SECTOR_OPTIONS.find((option) => option.value === sector)?.label ?? sector;
}

export function formatBenchmarkRange(low: number, high: number): string {
  return `${Math.round(low * 100)}%–${Math.round(high * 100)}%`;
}

export function formatBenchmarkAnchor(anchor: number): string {
  return `${Math.round(anchor * 100)}%`;
}

export function calculateRevenueAfterDirectCosts(annualRevenue: number, annualCogs: number): number {
  return roundCurrency(annualRevenue - annualCogs);
}

export function calculateRemainingPercentage(annualRevenue: number, annualCogs: number): number {
  if (!Number.isFinite(annualRevenue) || annualRevenue <= 0) {
    return 0;
  }

  return (annualRevenue - annualCogs) / annualRevenue;
}

export function calculateRevenueAfterDirectCostsMetrics(
  annualRevenue: number,
  annualCogs: number,
): RevenueAfterDirectCostsMetrics {
  return {
    revenueAfterDirectCosts: calculateRevenueAfterDirectCosts(annualRevenue, annualCogs),
    percentageRemaining: calculateRemainingPercentage(annualRevenue, annualCogs),
  };
}

export function getComparisonState({
  percentageRemaining,
  sectorBenchmark,
}: {
  percentageRemaining: number;
  sectorBenchmark: SectorBenchmark;
}): ComparisonState {
  if (percentageRemaining < sectorBenchmark.bandLow) {
    return "below";
  }

  if (percentageRemaining > sectorBenchmark.bandHigh) {
    return "above";
  }

  return "within";
}

export function calculateBenchmarkBandPosition({
  percentageRemaining,
  sectorBenchmark,
}: {
  percentageRemaining: number;
  sectorBenchmark: SectorBenchmark;
}): BenchmarkBandPosition {
  const bandWidth = sectorBenchmark.bandHigh - sectorBenchmark.bandLow;
  const rawPosition = bandWidth <= 0 ? 0 : ((percentageRemaining - sectorBenchmark.bandLow) / bandWidth) * 100;
  const clampedPosition = clamp(rawPosition, 0, 100);

  if (rawPosition < 0) {
    return { rawPosition, clampedPosition, label: "Below benchmark range" };
  }

  if (rawPosition <= 15) {
    return { rawPosition, clampedPosition, label: "Near lower end of benchmark band" };
  }

  if (rawPosition < 50) {
    return { rawPosition, clampedPosition, label: "Lower half of benchmark band" };
  }

  if (rawPosition < 75) {
    return { rawPosition, clampedPosition, label: "Upper half of benchmark band" };
  }

  if (rawPosition <= 100) {
    return { rawPosition, clampedPosition, label: "Upper quartile of benchmark band" };
  }

  return { rawPosition, clampedPosition, label: "Above benchmark range" };
}

export function getPerformanceState({
  percentageRemaining,
  sectorBenchmark,
}: {
  percentageRemaining: number;
  sectorBenchmark: SectorBenchmark;
}): PerformanceState {
  const comparisonState = getComparisonState({ percentageRemaining, sectorBenchmark });

  if (comparisonState === "below") {
    return "below_benchmark_range";
  }

  if (comparisonState === "above") {
    return "above_benchmark_range";
  }

  return percentageRemaining < (sectorBenchmark.bandLow + sectorBenchmark.bandHigh) / 2
    ? "within_lower_half"
    : "within_upper_half";
}

export function calculateUpsideEstimate({
  annualRevenue,
  percentageRemaining,
  sectorBenchmark,
}: {
  annualRevenue: number;
  percentageRemaining: number;
  sectorBenchmark: SectorBenchmark;
}): UpsideEstimate {
  const performanceState = getPerformanceState({ percentageRemaining, sectorBenchmark });
  const bandWidth = sectorBenchmark.bandHigh - sectorBenchmark.bandLow;
  const benchmarkMid = (sectorBenchmark.bandLow + sectorBenchmark.bandHigh) / 2;
  const benchmarkUpperQuartile = sectorBenchmark.bandLow + bandWidth * 0.75;
  const stretchAboveBand = sectorBenchmark.bandHigh + bandWidth * 0.1;

  let title = "Estimated improvement potential";
  let targetLabel = "";
  let targetPercentage = percentageRemaining;
  let summary = "";

  switch (performanceState) {
    case "below_benchmark_range":
      targetLabel = "benchmark midpoint";
      targetPercentage = benchmarkMid;
      summary =
        "This uses the midpoint of the sector benchmark as a practical improvement target from your current position.";
      break;
    case "within_lower_half":
      targetLabel = "upper half of the benchmark band";
      targetPercentage = benchmarkUpperQuartile;
      summary =
        "This estimates the value of moving from the lower half of the benchmark band toward stronger in-band performance.";
      break;
    case "within_upper_half":
      targetLabel = "top of the benchmark band";
      targetPercentage = sectorBenchmark.bandHigh;
      summary =
        "This estimates the value of tightening pricing and leakage enough to move toward the top end of the benchmark band.";
      break;
    case "above_benchmark_range":
      title = "Additional optimization upside";
      targetLabel = "stretch performance above the benchmark";
      targetPercentage = Math.max(percentageRemaining + bandWidth * 0.08, stretchAboveBand);
      summary =
        "This uses a modest stretch target above the benchmark band to reflect further gains from sharper pricing, mix, and decision precision.";
      break;
  }

  return {
    title,
    targetLabel,
    targetPercentage,
    additionalRevenueRemaining: roundCurrency(
      annualRevenue * Math.max(targetPercentage - percentageRemaining, 0),
    ),
    summary,
  };
}

export function calculateBenchmarkComparison({
  annualRevenue,
  percentageRemaining,
  sectorBenchmark,
}: {
  annualRevenue: number;
  percentageRemaining: number;
  sectorBenchmark: SectorBenchmark;
}): RevenueComparisonResult {
  const benchmarkLower = sectorBenchmark.bandLow;
  const benchmarkMid = (sectorBenchmark.bandLow + sectorBenchmark.bandHigh) / 2;
  const benchmarkUpper = sectorBenchmark.bandHigh;

  return {
    benchmarkLower,
    benchmarkMid,
    benchmarkUpper,
    benchmarkSummary: sectorBenchmark,
    comparisonState: getComparisonState({ percentageRemaining, sectorBenchmark }),
    performanceState: getPerformanceState({ percentageRemaining, sectorBenchmark }),
    benchmarkBandPosition: calculateBenchmarkBandPosition({ percentageRemaining, sectorBenchmark }),
    percentagePointGapToBandLow: benchmarkLower - percentageRemaining,
    percentagePointGapToBandMid: benchmarkMid - percentageRemaining,
    percentagePointGapToBandHigh: benchmarkUpper - percentageRemaining,
    upsideEstimate: calculateUpsideEstimate({
      annualRevenue,
      percentageRemaining,
      sectorBenchmark,
    }),
  };
}
