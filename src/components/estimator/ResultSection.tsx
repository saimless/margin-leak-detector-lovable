import {
  ArrowRight,
  CheckCircle2,
  Gauge,
  MoveRight,
  RotateCcw,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  BarChart3,
  Zap,
  Shield,
  ArrowUpRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { EstimatorResult } from "@/pages/Index";
import type { Sector } from "@/lib/estimator";

interface ResultSectionProps {
  result: EstimatorResult;
  onReset: () => void;
}

const formatEuro = (value: number) =>
  new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

const formatPercent = (value: number) => `${Math.round(value * 100)}%`;

const formatPercentDetailed = (value: number) => `${(value * 100).toFixed(1).replace(/\.0$/, "")}%`;

const formatGap = (value: number) => `${Math.abs(value * 100).toFixed(1).replace(/\.0$/, "")} pts`;

const resultVisuals: Record<
  EstimatorResult["performanceState"],
  {
    hero: string;
    benchmark: string;
    position: string;
    upside: string;
    levers: string;
    interpret: string;
    summary: [string, string, string, string];
  }
> = {
  below_benchmark_range: {
    hero: "🧭",
    benchmark: "📏",
    position: "🔎",
    upside: "🌱",
    levers: "🛠️",
    interpret: "📘",
    summary: ["💶", "🏭", "🧾", "📉"],
  },
  within_lower_half: {
    hero: "⚖️",
    benchmark: "📏",
    position: "🎯",
    upside: "🚀",
    levers: "🛠️",
    interpret: "📘",
    summary: ["💶", "📦", "✨", "📈"],
  },
  within_upper_half: {
    hero: "✨",
    benchmark: "📏",
    position: "🥇",
    upside: "🚀",
    levers: "🛠️",
    interpret: "📘",
    summary: ["💶", "⚙️", "💚", "📈"],
  },
  above_benchmark_range: {
    hero: "🏆",
    benchmark: "📏",
    position: "🚀",
    upside: "🌟",
    levers: "🛠️",
    interpret: "📘",
    summary: ["💶", "⚙️", "🏅", "📈"],
  },
};

const sectorLeverContext: Record<
  Sector,
  {
    unitLabel: string;
    leakageLabel: string;
    costDriverLabel: string;
    decisionLabel: string;
  }
> = {
  distribution: {
    unitLabel: "products, customers, or transactions",
    leakageLabel: "discount leakage and buy-sell margin erosion across accounts and SKUs",
    costDriverLabel: "supplier pricing, freight, and handling costs",
    decisionLabel: "price corridors and customer-level margin controls",
  },
  manufacturing_commodity: {
    unitLabel: "products, production runs, or customers",
    leakageLabel: "margin leakage in commodity pricing, scrap, and input pass-through",
    costDriverLabel: "raw materials, yield loss, and supplier cost drift",
    decisionLabel: "pass-through discipline and plant-level cost analytics",
  },
  manufacturing_industrial: {
    unitLabel: "products, quotes, or customer segments",
    leakageLabel: "margin leakage in engineered quotes, change orders, and production variance",
    costDriverLabel: "component sourcing, labor efficiency, and rework",
    decisionLabel: "quote analytics and product-family pricing discipline",
  },
  manufacturing_specialty: {
    unitLabel: "product lines, orders, or customer segments",
    leakageLabel: "margin leakage in specialty pricing, customization, and small-batch production",
    costDriverLabel: "specialist materials, setup cost, and direct labor intensity",
    decisionLabel: "value-based pricing and mix-quality analytics",
  },
  retail_general: {
    unitLabel: "categories, stores, or customer baskets",
    leakageLabel: "margin leakage in promotions, markdowns, and channel mix",
    costDriverLabel: "buying costs, shrink, and fulfillment expense",
    decisionLabel: "promotion analytics and category-level pricing rules",
  },
  retail_specialty: {
    unitLabel: "categories, products, or customer segments",
    leakageLabel: "margin leakage in markdowns, premium assortment mix, and fulfillment exceptions",
    costDriverLabel: "supplier cost, inventory turns, and service-intensive sales",
    decisionLabel: "premium pricing precision and assortment analytics",
  },
  professional_services: {
    unitLabel: "services, projects, or clients",
    leakageLabel: "margin leakage in project scoping, discounting, and write-offs",
    costDriverLabel: "delivery effort, utilization, and direct labor mix",
    decisionLabel: "engagement pricing and client-segment performance analytics",
  },
  it_services: {
    unitLabel: "services, contracts, or customers",
    leakageLabel: "margin leakage in over-servicing, scope creep, and discounting",
    costDriverLabel: "delivery hours, subcontractor spend, and support intensity",
    decisionLabel: "contract pricing precision and service-line performance analytics",
  },
  software_saas: {
    unitLabel: "plans, customer segments, or accounts",
    leakageLabel: "margin leakage in discounting, onboarding intensity, and support-heavy accounts",
    costDriverLabel: "cloud infrastructure, service effort, and third-party tooling",
    decisionLabel: "packaging, pricing, and account-segment analytics",
  },
  logistics_transport: {
    unitLabel: "lanes, customers, or shipment types",
    leakageLabel: "margin leakage in route pricing, empty miles, and service exceptions",
    costDriverLabel: "carrier spend, fuel, and operational inefficiency",
    decisionLabel: "lane-level pricing controls and routing analytics",
  },
  construction_services: {
    unitLabel: "projects, change orders, or customer segments",
    leakageLabel: "margin leakage in estimating, scope drift, and procurement variance",
    costDriverLabel: "materials, subcontractors, and site productivity",
    decisionLabel: "bid pricing discipline and project-level profitability analytics",
  },
};

const getDynamicLevers = (sectorKey: Sector, performanceState: EstimatorResult["performanceState"]) => {
  const context = sectorLeverContext[sectorKey];

  switch (performanceState) {
    case "below_benchmark_range":
      return [
        `Find underpriced ${context.unitLabel} using data-driven analysis and raise prices where direct costs are too high.`,
        `Detect high direct costs in ${context.costDriverLabel} and fix the biggest cost problems first.`,
        `Uncover margin leakage in ${context.leakageLabel} and stop value from slipping away.`,
        `Flag low-margin ${context.unitLabel} early so your team can act faster.`,
        `Tighten ${context.decisionLabel} with simple alerts and benchmark tracking.`,
      ];
    case "within_lower_half":
      return [
        `Find inconsistent pricing across ${context.unitLabel} and bring prices closer together where it makes sense.`,
        `Detect weak mix and shift more volume toward stronger ${context.unitLabel}.`,
        `Uncover margin leakage in ${context.leakageLabel} that is holding you back.`,
        `Flag rising costs in ${context.costDriverLabel} before they pull performance down.`,
        `Improve ${context.decisionLabel} with clearer rules and faster alerts.`,
      ];
    case "within_upper_half":
      return [
        `Find small pricing gaps across ${context.unitLabel} and improve price precision.`,
        `Detect hidden leakage in ${context.leakageLabel} that still costs you money.`,
        `Uncover mix changes that can lift the quality of your revenue.`,
        `Flag slippage in ${context.costDriverLabel} so strong performance stays steady.`,
        `Sharpen ${context.decisionLabel} with better tracking and simpler actions.`,
      ];
    case "above_benchmark_range":
      return [
        `Continuously monitor ${context.leakageLabel} so strong performance does not slip as you grow.`,
        `Find advanced pricing opportunities across ${context.unitLabel} to keep more value.`,
        `Detect small inefficiencies in ${context.costDriverLabel} before they grow into bigger losses.`,
        `Uncover mix improvements across ${context.unitLabel} to stay ahead of the benchmark.`,
        `Keep ${context.decisionLabel} strong with ongoing alerts and benchmark checks.`,
      ];
  }
};

const analysisContent: Record<
  EstimatorResult["performanceState"],
  {
    badge: string;
    headline: string;
    benchmarkSummary: string;
    practicalMeaning: string;
    drivers: string;
    improvementWhy: string;
    levers: string[];
    performerIndicatorLabel: string;
    icon: typeof TrendingDown;
    iconClassName: string;
  }
> = {
  below_benchmark_range: {
    badge: "Below benchmark range",
    headline: "You are keeping less revenue after direct costs than the typical range in your sector.",
    benchmarkSummary:
      "Compared with similar companies, less of your revenue stays after direct product costs.",
    practicalMeaning:
      "This can mean prices are too low, direct costs are too high, or both.",
    drivers:
      "Common reasons are heavy discounting, high supplier or delivery costs, or too much revenue coming from weaker products, services, or customers.",
    improvementWhy:
      "Improving this can free up more money each year for the rest of the business.",
    levers: [
      "Pricing optimization to better reflect value and reduce underpricing.",
      "Reducing discount leakage through tighter approval rules and clearer pricing guardrails.",
      "Sourcing or supplier optimization to lower direct input costs.",
      "Production or delivery efficiency improvements to reduce waste, rework, or service cost.",
      "Identifying low-margin products, services, or customer segments that dilute retained revenue.",
    ],
    performerIndicatorLabel: "Needs improvement",
    icon: TrendingDown,
    iconClassName: "text-destructive",
  },
  within_lower_half: {
    badge: "Within benchmark, lower half",
    headline: "You are within the benchmark range, but closer to the lower end of the sector range.",
    benchmarkSummary:
      "Your result is in range, but stronger companies in your sector keep more revenue after direct product costs.",
    practicalMeaning:
      "Your pricing and cost control are fairly close to the market, but there is still clear room to improve.",
    drivers:
      "This often comes from pricing that is not always consistent, some discount leakage, or too much volume in lower-value work.",
    improvementWhy:
      "Moving toward the stronger end of the range can leave much more revenue to support growth.",
    levers: [
      "Pricing optimization across products, services, or customer segments.",
      "Product mix optimization toward higher-value and higher-retained-revenue offers.",
      "Reducing discount leakage and non-standard commercial concessions.",
      "Forecasting and demand planning to improve purchasing, capacity, and delivery economics.",
      "Supplier and sourcing reviews to recover direct-cost efficiency without harming service levels.",
    ],
    performerIndicatorLabel: "Developing",
    icon: Target,
    iconClassName: "text-primary",
  },
  within_upper_half: {
    badge: "Within benchmark, upper half",
    headline: "You are in the stronger half of the benchmark range.",
    benchmarkSummary:
      "A healthy share of your revenue stays after direct product costs, and you are closer to stronger sector performance.",
    practicalMeaning:
      "Your pricing and direct cost control look solid, but there is still room to tighten and protect performance.",
    drivers:
      "The gap that remains is often caused by small pricing gaps, mix shifts, or cost leakage that is easy to miss.",
    improvementWhy:
      "Even small gains here can add up to real money over a full year.",
    levers: [
      "Sharper pricing precision by segment, deal type, or customer profile.",
      "Product and customer mix optimization to emphasize stronger retained-revenue offerings.",
      "Leakage reduction in discounts, rebates, service exceptions, or fulfillment cost.",
      "Production or delivery efficiency improvements at the workflow level.",
      "More precise analytics to identify where strong performance is slipping at the edge.",
    ],
    performerIndicatorLabel: "Strong",
    icon: CheckCircle2,
    iconClassName: "text-primary",
  },
  above_benchmark_range: {
    badge: "Above benchmark range",
    headline: "You are keeping more revenue after direct costs than the typical range in your sector.",
    benchmarkSummary:
      "More of your revenue stays after direct product costs than is typical in your sector.",
    practicalMeaning:
      "This usually means strong pricing, efficient delivery or sourcing, and a good mix of products or customers.",
    drivers:
      "Even strong results can hide missed value in some deals, segments, or cost areas.",
    improvementWhy:
      "Strong performance does not mean there is no more upside, especially as the business grows.",
    levers: [
      "Sharper pricing decisions at the deal, customer, and segment level.",
      "Better segmentation to avoid giving away value where willingness to pay is stronger.",
      "Product and customer mix optimization toward the highest retained-revenue business.",
      "Leakage reduction in discounts, rebates, and non-standard commercial terms.",
      "More precise analytics and decision-making to scale what is already working.",
    ],
    performerIndicatorLabel: "Leading",
    icon: TrendingUp,
    iconClassName: "text-success",
  },
};

export const ResultSection = ({ result, onReset }: ResultSectionProps) => {
  const content = analysisContent[result.performanceState];
  const visuals = resultVisuals[result.performanceState];
  const AnalysisIcon = content.icon;
  const dynamicLevers = getDynamicLevers(result.sectorKey, result.performanceState);

  return (
    <div className="space-y-6">
      {/* Main results card */}
      <div className="card-shell">
        <div className="card-section border-b border-border/50 py-8 sm:py-10">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <BarChart3 className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Analysis Results
            </p>
          </div>
          <h2 className="font-display text-xl font-bold leading-tight tracking-tight text-foreground sm:text-2xl">
            Revenue remaining after direct product costs
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            This shows how much revenue is left after the direct costs of what you sell, before operating costs like
            marketing, salaries, rent, or overhead.
          </p>
        </div>

        <div className="card-section space-y-7 py-7 sm:py-9">
          {/* Primary metric + side panels */}
          <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
            {/* Primary metric */}
            <div className="rounded-xl border border-primary/15 bg-gradient-to-br from-highlight-soft/80 to-highlight-soft/40 p-7">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                    Your calculated percentage
                  </p>
                  <p className="mt-4 text-5xl font-extrabold tracking-tight text-foreground tabular-nums sm:text-6xl">
                    {formatPercent(result.percentageRemaining)}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    You keep {formatEuro(result.revenueAfterDirectCosts)} from{" "}
                    {formatEuro(result.annualRevenue)} in annual revenue after direct costs.
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="shrink-0 border-primary/20 bg-card text-xs font-medium text-primary"
                >
                  <span className="mr-1.5" aria-hidden="true">
                    {visuals.hero}
                  </span>
                  {content.badge}
                </Badge>
              </div>
            </div>

            {/* Side metrics */}
            <div className="grid gap-3.5 sm:grid-cols-3 xl:grid-cols-1">
              <div className="rounded-xl border border-border/60 bg-card p-4 transition-shadow duration-200 hover:shadow-soft">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {visuals.benchmark} Sector benchmark range
                </p>
                <p className="mt-2.5 text-2xl font-bold text-foreground tabular-nums">{result.benchmarkRange}</p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                  Anchor: {result.benchmarkAnchor}
                </p>
              </div>
              <div className="rounded-xl border border-border/60 bg-card p-4 transition-shadow duration-200 hover:shadow-soft">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {visuals.position} Relative position
                </p>
                <p className="mt-2.5 text-xl font-bold text-foreground">{content.performerIndicatorLabel}</p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                  {result.benchmarkBandPositionLabel}
                </p>
                {result.benchmarkBandPositionRaw >= 0 && result.benchmarkBandPositionRaw <= 100 && (
                  <div className="mt-3">
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${result.benchmarkBandPositionClamped}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="rounded-xl border border-primary/12 bg-highlight-soft/50 p-4 transition-shadow duration-200 hover:shadow-soft">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-primary">
                  {visuals.upside} {result.upsideEstimate.title}
                </p>
                <p className="mt-2.5 text-2xl font-bold text-foreground tabular-nums">
                  {formatEuro(result.upsideEstimate.additionalRevenueRemaining)}
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                  If your result moves toward {result.upsideEstimate.targetLabel} at{" "}
                  {formatPercent(result.upsideEstimate.targetPercentage)}.
                </p>
              </div>
            </div>
          </div>

          {/* Summary stats row */}
          <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Annual revenue", value: formatEuro(result.annualRevenue), icon: visuals.summary[0] },
              { label: "Annual COGS", value: formatEuro(result.annualCogs), icon: visuals.summary[1] },
              {
                label: "Revenue after direct costs",
                value: formatEuro(result.revenueAfterDirectCosts),
                icon: visuals.summary[2],
              },
              {
                label: "Benchmark comparison",
                value:
                  result.benchmarkBandPositionRaw < 0 || result.benchmarkBandPositionRaw > 100
                    ? result.benchmarkBandPositionLabel
                    : `${Math.round(result.benchmarkBandPositionClamped)}% relative position`,
                icon: visuals.summary[3],
              },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-border/50 bg-card p-4 transition-shadow duration-200 hover:shadow-soft">
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {item.icon} {item.label}
                </p>
                <p className="text-sm font-bold text-foreground">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Analysis narrative */}
          <div className="rounded-xl border border-border/50 bg-card p-6">
            <div className="mb-4 flex items-center gap-2.5">
              <AnalysisIcon className={`h-4.5 w-4.5 ${content.iconClassName}`} />
              <p className="text-sm font-bold text-foreground">{content.headline}</p>
            </div>
            <div className="space-y-3.5 text-[13px] leading-relaxed text-muted-foreground">
              <p>
                We calculated annual revenue minus annual COGS, then showed the remainder as a percentage of annual
                revenue. Your result is {formatPercentDetailed(result.percentageRemaining)}. The typical sector range
                is {result.benchmarkRange}.
              </p>
              <p>{content.benchmarkSummary}</p>
              <p>{content.practicalMeaning}</p>
              <p>{content.drivers}</p>
              <p>{result.upsideEstimate.summary}</p>
              <p>{content.improvementWhy}</p>
            </div>
          </div>

          {/* Levers + interpretation */}
          <div className="grid gap-5 xl:grid-cols-[1fr_0.95fr]">
            <div className="rounded-xl border border-border/50 bg-card p-6">
              <div className="mb-4 flex items-center gap-2.5">
                <Sparkles className="h-4 w-4 text-primary" />
                <p className="text-sm font-bold text-foreground">Where you can improve (and how we help)</p>
              </div>
              <div className="grid gap-2.5">
                {dynamicLevers.map((lever, i) => (
                  <div
                    key={lever}
                    className="flex items-start gap-3 rounded-lg border border-border/40 bg-muted/20 px-4 py-3 text-[13px] leading-relaxed text-muted-foreground transition-colors duration-150 hover:bg-muted/40"
                  >
                    <span className="mt-0.5 text-xs text-primary/60 font-semibold">{String(i + 1).padStart(2, '0')}</span>
                    <span>{lever}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border/50 bg-card p-6">
              <div className="mb-4 flex items-center gap-2.5">
                <Gauge className="h-4 w-4 text-primary" />
                <p className="text-sm font-bold text-foreground">How to interpret this result</p>
              </div>
              <div className="space-y-3 text-[13px] leading-relaxed text-muted-foreground">
                <p>This shows the share of revenue left after direct product costs (COGS).</p>
                <p>This is often called gross margin, but here we show it in a simpler business view.</p>
                <p>
                  COGS are the direct costs of making or delivering what you sell, like materials, production,
                  supplier costs, and direct labor.
                </p>
                <p>
                  It does not include costs like marketing, salaries, rent, or overhead. Net margin includes those
                  costs too, but this result focuses only on direct cost performance.
                </p>
                <p>
                  This is a directional estimate, not a full finance report. It helps you see how your business
                  compares with similar companies in your sector.
                </p>
              </div>
            </div>
          </div>

          {/* Upside callout */}
          <div className="rounded-xl border border-primary/12 bg-gradient-to-r from-highlight-soft/70 to-highlight-soft/30 p-6">
            <div className="flex items-start gap-3.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <MoveRight className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0 space-y-2">
                <p className="text-sm font-bold text-foreground">📈 Estimated upside</p>
                <p className="text-[13px] leading-relaxed text-muted-foreground">
                  {result.upsideEstimate.summary} At your current revenue level, that translates to about{" "}
                  {formatEuro(result.upsideEstimate.additionalRevenueRemaining)} more revenue kept after direct costs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA card — conversion-optimized */}
      <div className="card-shell overflow-hidden">
        <div className="relative">
          {/* Subtle gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-primary/[0.02]" />

          <div className="card-section relative py-10 sm:py-14">
            <div className="mx-auto max-w-2xl space-y-8 text-center">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/[0.06] px-4 py-1.5 text-xs font-semibold text-primary">
                  <Zap className="h-3.5 w-3.5" />
                  Go beyond static estimates
                </div>

                <h3 className="font-display text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-[1.75rem]">
                  See how expected demand can change your margins
                </h3>

                <p className="mx-auto max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                  This calculator shows where you stand today. Our platform connects predicted sales volumes with your
                  cost data to show how margins can change, so you can make better pricing, cost, and planning
                  decisions.
                </p>
              </div>

              {/* Value props */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-border/50 bg-card p-5 text-left transition-shadow duration-200 hover:shadow-soft">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <BarChart3 className="h-4.5 w-4.5 text-primary" />
                  </div>
                  <p className="text-[13px] font-bold text-foreground">Modeled projections</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    See how predicted sales volumes and costs can affect future margins.
                  </p>
                </div>
                <div className="rounded-xl border border-border/50 bg-card p-5 text-left transition-shadow duration-200 hover:shadow-soft">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <Target className="h-4.5 w-4.5 text-primary" />
                  </div>
                  <p className="text-[13px] font-bold text-foreground">Built around your business</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    Combine your own sales and cost data for a clearer view than sector benchmarks alone.
                  </p>
                </div>
                <div className="rounded-xl border border-border/50 bg-card p-5 text-left transition-shadow duration-200 hover:shadow-soft">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <Shield className="h-4.5 w-4.5 text-primary" />
                  </div>
                  <p className="text-[13px] font-bold text-foreground">Clear decision support</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    Use data-driven insights to act on pricing, cost, mix, and planning with more confidence.
                  </p>
                </div>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col items-center gap-3 pt-2 sm:flex-row sm:justify-center">
                <Button
                  asChild
                  size="lg"
                  className="group h-auto min-h-12 w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold leading-snug text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90 hover:shadow-md sm:min-h-[52px] sm:w-auto sm:px-8 sm:text-[15px]"
                >
                  <a href="https://www.saimless.com" target="_blank" rel="noreferrer">
                    Explore the platform
                    <ArrowUpRight className="ml-1.5 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </Button>
                <Button
                  onClick={onReset}
                  variant="outline"
                  size="lg"
                  className="h-auto min-h-12 w-full px-4 py-3 border-border/60 text-sm leading-snug text-muted-foreground transition-all duration-200 hover:border-border hover:text-foreground sm:min-h-[52px] sm:w-auto"
                >
                  <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                  Try another scenario
                </Button>
              </div>

              <p className="text-[11px] text-muted-foreground/60">
                No commitment required · Simple first look · See how it works
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
