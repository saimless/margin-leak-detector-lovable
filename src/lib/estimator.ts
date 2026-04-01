export const MAX_GROSS_MARGIN_CAP = 0.8;

export const GROSS_MARGIN_RANGES = [
  "<15%",
  "15–20%",
  "20–25%",
  "25–30%",
  "30–40%",
  "40–50%",
  "50–65%",
  "65%+",
] as const;

export type GrossMarginRange = (typeof GROSS_MARGIN_RANGES)[number];

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

export interface GrossMarginBounds {
  low: number;
  high: number;
  midpoint: number;
}

export interface SectorBenchmark {
  anchor: number;
  bandLow: number;
  bandHigh: number;
}

export interface GrossMarginScenario {
  label: "conservative" | "midpoint" | "optimized";
  targetMargin: number;
  grossProfitScenario: number;
  grossProfitImprovement: number;
}

export interface GrossMarginScenarioResult {
  benchmarkLower: number;
  benchmarkMid: number;
  benchmarkUpper: number;
  grossProfitCurrent: number;
  scenarios: GrossMarginScenario[];
  benchmarkSummary: SectorBenchmark;
}

export type MarginBenchmarkState = "weak" | "average" | "strong";

function clampToZero(value: number): number {
  return Math.max(0, value);
}

function roundValue(value: number): number {
  return Math.round(value);
}

export function parseGrossMarginRange(rangeLabel: string): GrossMarginBounds {
  const normalized = rangeLabel.replace(/\s/g, "").replace(/-/g, "–");

  if (normalized.startsWith("<")) {
    const upperPercent = Number.parseFloat(normalized.replace(/[<%]/g, ""));
    const high = upperPercent / 100;
    return { low: 0, high, midpoint: high / 2 };
  }

  if (normalized.endsWith("+")) {
    const lowerPercent = Number.parseFloat(normalized.replace(/[%+]/g, ""));
    const low = lowerPercent / 100;
    const high = Math.max(low, MAX_GROSS_MARGIN_CAP);
    return { low, high, midpoint: (low + high) / 2 };
  }

  const [lowLabel, highLabel] = normalized.replace(/%/g, "").split("–");
  const low = Number.parseFloat(lowLabel) / 100;
  const high = Number.parseFloat(highLabel) / 100;

  if (!Number.isFinite(low) || !Number.isFinite(high) || high < low) {
    throw new Error(`Unsupported gross margin range: ${rangeLabel}`);
  }

  return { low, high, midpoint: (low + high) / 2 };
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

export function calculateGrossProfit(revenue: number, grossMargin: number): number {
  return revenue * grossMargin;
}

export function calculateCogs(revenue: number, grossMargin: number): number {
  return revenue - calculateGrossProfit(revenue, grossMargin);
}

export function getMarginBenchmarkState({
  currentGrossMargin,
  sectorBenchmark,
}: {
  currentGrossMargin: number;
  sectorBenchmark: SectorBenchmark;
}): MarginBenchmarkState {
  const lowerHalfBoundary = sectorBenchmark.bandLow + (sectorBenchmark.bandHigh - sectorBenchmark.bandLow) * 0.5;
  const meaningfulGap = 0.03;

  if (currentGrossMargin < lowerHalfBoundary - meaningfulGap) {
    return "weak";
  }

  if (currentGrossMargin >= lowerHalfBoundary || currentGrossMargin >= sectorBenchmark.anchor) {
    return "strong";
  }

  return "average";
}

export function calculateGrossMarginScenarios({
  annualRevenue,
  currentGrossMargin,
  sectorBenchmark,
}: {
  annualRevenue: number;
  currentGrossMargin: number;
  sectorBenchmark: SectorBenchmark;
}): GrossMarginScenarioResult {
  const benchmarkLower = sectorBenchmark.bandLow;
  const benchmarkMid = (sectorBenchmark.bandLow + sectorBenchmark.bandHigh) / 2;
  const benchmarkUpper = sectorBenchmark.bandHigh;
  const grossProfitCurrent = roundValue(calculateGrossProfit(annualRevenue, currentGrossMargin));
  const buildScenario = (label: GrossMarginScenario["label"], targetMargin: number): GrossMarginScenario => {
    const grossProfitScenario = roundValue(calculateGrossProfit(annualRevenue, targetMargin));

    return {
      label,
      targetMargin,
      grossProfitScenario,
      grossProfitImprovement: roundValue(clampToZero(grossProfitScenario - grossProfitCurrent)),
    };
  };

  return {
    benchmarkLower,
    benchmarkMid,
    benchmarkUpper,
    grossProfitCurrent,
    scenarios: [
      buildScenario("conservative", benchmarkLower),
      buildScenario("midpoint", benchmarkMid),
      buildScenario("optimized", benchmarkUpper),
    ],
    benchmarkSummary: sectorBenchmark,
  };
}
