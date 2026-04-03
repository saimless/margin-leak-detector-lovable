export const REVENUE_THRESHOLDS = {
  earlyStageMax: 25_000,
  growthMax: 250_000,
} as const;

export type CompanyStage = "early_stage" | "growth" | "scale";

export interface StageContent {
  label: string;
  title: string;
  bodyPrimary: string;
  bodySecondary: string;
}

export const stageContent: Record<CompanyStage, StageContent> = {
  early_stage: {
    label: "Early stage",
    title: "Margins still taking shape",
    bodyPrimary:
      "Early-stage businesses often have unstable or under-optimized margins. Benchmark comparisons are less precise, but still indicate where improvement typically happens first.",
    bodySecondary:
      "Focus on building strong fundamentals early — especially pricing, cost structure, and unit economics — to avoid locking in low margins.",
  },
  growth: {
    label: "Growth stage",
    title: "Clear margin improvement potential",
    bodyPrimary:
      "At your current scale, margin differences are rarely structural — they are often the result of pricing, cost control, or operational inefficiencies.",
    bodySecondary:
      "The gap with industry benchmarks suggests there are concrete opportunities to improve the share of revenue that remains after direct product costs without changing your core business model.",
  },
  scale: {
    label: "Scale",
    title: "Small improvements, large impact",
    bodyPrimary:
      "At your scale, even small differences in margin translate into significant profit impact. Benchmark gaps often point to inefficiencies that compound over time.",
    bodySecondary:
      "Closing even part of this gap can unlock substantial bottom-line improvement.",
  },
};

export function isValidRevenue(revenue: unknown): revenue is number {
  return typeof revenue === "number" && Number.isFinite(revenue) && revenue > 0;
}

function normalizeNumericInput(rawValue: string, hasSuffix: boolean): string | null {
  const value = rawValue.replace(/[\s€]/g, "").replace(/'/g, "");

  if (!value || /[^0-9.,]/.test(value)) {
    return null;
  }

  const lastComma = value.lastIndexOf(",");
  const lastDot = value.lastIndexOf(".");

  if (lastComma !== -1 && lastDot !== -1) {
    const decimalSeparator = lastComma > lastDot ? "," : ".";
    const thousandsSeparator = decimalSeparator === "," ? "." : ",";

    return value.split(thousandsSeparator).join("").replace(decimalSeparator, ".");
  }

  const separator = lastComma !== -1 ? "," : lastDot !== -1 ? "." : null;
  if (!separator) {
    return value;
  }

  const parts = value.split(separator);
  if (parts.some((part) => part.length === 0)) {
    return null;
  }

  if (parts.length > 2) {
    return parts.join("");
  }

  const [whole, fractional] = parts;
  if (hasSuffix) {
    return `${whole}.${fractional}`;
  }

  if (fractional.length === 3) {
    return `${whole}${fractional}`;
  }

  return `${whole}.${fractional}`;
}

export function parseRevenueInput(value: string, options?: { allowZero?: boolean }): number | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const suffixMatch = trimmed.match(/([kmb])$/i);
  const suffix = suffixMatch?.[1]?.toLowerCase();
  const multiplier = suffix === "k" ? 1_000 : suffix === "m" ? 1_000_000 : suffix === "b" ? 1_000_000_000 : 1;
  const coreValue = suffix ? trimmed.slice(0, -1) : trimmed;
  const normalized = normalizeNumericInput(coreValue, Boolean(suffix));

  if (!normalized) {
    return null;
  }

  const parsed = Number.parseFloat(normalized);
  if (!Number.isFinite(parsed)) {
    return null;
  }

  const revenue = parsed * multiplier;
  if (options?.allowZero && revenue === 0) {
    return 0;
  }

  return revenue > 0 ? revenue : null;
}

export function formatRevenueDisplayInput(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  if (/[kmb]$/i.test(trimmed)) {
    return trimmed;
  }

  const digitsOnly = trimmed.replace(/[^\d]/g, "");
  if (!digitsOnly) {
    return value;
  }

  return new Intl.NumberFormat("de-DE").format(Number(digitsOnly));
}

export function getCompanyStage(revenue: number): CompanyStage {
  if (revenue < REVENUE_THRESHOLDS.earlyStageMax) {
    return "early_stage";
  }

  if (revenue <= REVENUE_THRESHOLDS.growthMax) {
    return "growth";
  }

  return "scale";
}
