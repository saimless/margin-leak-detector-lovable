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
    headline: "Your retained revenue percentage is below the sector benchmark range.",
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
    headline: "You are inside the benchmark range, but closer to the lower end than the stronger performers in your sector.",
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
    headline: "You are performing in the stronger half of the benchmark band.",
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
    headline: "You are outperforming the sector benchmark range.",
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
  const AnalysisIcon = content.icon;
  const dynamicLevers = getDynamicLevers(result.sectorKey, result.performanceState);
  const benchmarkPositionValue =
    result.benchmarkBandPositionRaw < 0 || result.benchmarkBandPositionRaw > 100
      ? content.badge
      : `${Math.round(result.benchmarkBandPositionClamped)}% through benchmark band`;

  return (
    <div className="space-y-4 xs:space-y-5">
      <div className="card-shell">
        <div className="card-header-accent" />

        <div className="card-section border-b border-border bg-primary/[0.03] py-6 xs:py-7 sm:py-9">
          <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <div className="h-[2px] w-5 rounded-full bg-primary" />
            Analysis Results
          </div>
          <h2 className="font-display mb-3 text-2xl font-800 leading-tight tracking-tight text-foreground sm:text-3xl">
            Percentage of revenue remaining after direct product costs
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            This shows how much revenue remains after covering the direct costs of what you sell, before accounting for
            operating expenses like marketing, salaries, or overhead.
          </p>
        </div>

        <div className="card-section space-y-5 py-5 xs:space-y-6 xs:py-6 sm:py-8">
          <div className="grid gap-3 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-primary/20 bg-primary/[0.05] px-5 py-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                    Your calculated percentage
                  </p>
                  <p className="mt-2 text-4xl font-bold tracking-tight text-foreground tabular-nums">
                    {formatPercent(result.percentageRemaining)}
                  </p>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                    Revenue remaining after direct product costs: {formatEuro(result.revenueAfterDirectCosts)} from{" "}
                    {formatEuro(result.annualRevenue)} annual revenue.
                  </p>
                </div>
                <Badge className="border border-primary/20 bg-background/80 text-primary hover:bg-background/80">
                  {content.badge}
                </Badge>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              <div className="rounded-xl border border-border bg-surface px-4 py-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Sector benchmark range
                </p>
                <p className="mt-2 text-2xl font-bold text-foreground tabular-nums">{result.benchmarkRange}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Sector anchor: {result.benchmarkAnchor}. Stronger sector performance sits closer to the upper end of
                  this band.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-surface px-4 py-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Relative position vs sector benchmark
                </p>
                <p className="mt-2 text-xl font-bold text-foreground">{content.performerIndicatorLabel}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {result.benchmarkBandPositionLabel}. {benchmarkPositionValue}.
                </p>
                {result.benchmarkBandPositionRaw >= 0 && result.benchmarkBandPositionRaw <= 100 ? (
                  <div className="mt-3">
                    <div className="h-2 overflow-hidden rounded-full bg-border">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${result.benchmarkBandPositionClamped}%` }}
                      />
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="rounded-xl border border-primary/15 bg-primary/[0.04] px-4 py-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                  {result.upsideEstimate.title}
                </p>
                <p className="mt-2 text-2xl font-bold text-foreground tabular-nums">{formatEuro(result.upsideEstimate.additionalRevenueRemaining)}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Estimated additional revenue remaining if performance moves toward the{" "}
                  {result.upsideEstimate.targetLabel} at {formatPercent(result.upsideEstimate.targetPercentage)}.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Annual revenue", value: formatEuro(result.annualRevenue) },
              { label: "Annual COGS", value: formatEuro(result.annualCogs) },
              {
                label: "Revenue remaining after direct product costs",
                value: formatEuro(result.revenueAfterDirectCosts),
              },
              {
                label: "Comparison vs benchmark",
                value:
                  result.benchmarkBandPositionRaw < 0 || result.benchmarkBandPositionRaw > 100
                    ? result.benchmarkBandPositionLabel
                    : `${Math.round(result.benchmarkBandPositionClamped)}% relative benchmark position`,
              },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-border bg-surface px-4 py-3">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{item.label}</p>
                <p className="text-sm font-semibold text-foreground">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-border bg-surface px-4 py-4 xs:px-5 xs:py-5">
            <div className="mb-3 flex items-center gap-2">
              <AnalysisIcon className={`h-4 w-4 ${content.iconClassName}`} />
              <p className="text-sm font-semibold text-foreground">{content.headline}</p>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              <p>
                We calculated annual revenue minus annual COGS, then expressed the remainder as a percentage of annual
                revenue. Your result is {formatPercentDetailed(result.percentageRemaining)} versus a sector benchmark
                range of {result.benchmarkRange}.
              </p>
              <p>{content.benchmarkSummary}</p>
              <p>{content.practicalMeaning}</p>
              <p>{content.drivers}</p>
              <p>{result.upsideEstimate.summary}</p>
              <p>{content.improvementWhy}</p>
            </div>
          </div>

          <div className="grid gap-3 xl:grid-cols-[1fr_0.95fr]">
            <div className="rounded-xl border border-border bg-surface px-4 py-4 xs:px-5 xs:py-5">
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold text-foreground">Where you can improve (and how we help)</p>
              </div>
              <div className="grid gap-2">
                {dynamicLevers.map((lever) => (
                  <div key={lever} className="rounded-lg border border-border/70 bg-background px-3 py-2.5 text-sm leading-relaxed text-muted-foreground">
                    {lever}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-surface px-4 py-4 xs:px-5 xs:py-5">
              <div className="mb-3 flex items-center gap-2">
                <Gauge className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold text-foreground">How to interpret this result</p>
              </div>
              <div className="space-y-2.5 text-sm leading-relaxed text-muted-foreground">
                <p>
                  This shows the share of revenue left after direct product costs (COGS).
                </p>
                <p>
                  This is often called gross margin, but we explain it here in a simpler way.
                </p>
                <p>
                  COGS are the direct costs of making or delivering what you sell, like materials, production,
                  supplier costs, and direct labor.
                </p>
                <p>
                  It does not include costs like marketing, salaries, rent, or overhead. Net margin includes all
                  costs, but this metric only looks at direct cost efficiency.
                </p>
                <p>
                  This is not an exact finance report. It is a benchmark-based estimate that shows how your business
                  compares with similar companies in your sector.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-primary/15 bg-primary/[0.04] px-4 py-4 xs:px-5 xs:py-5">
            <div className="flex items-start gap-3">
              <MoveRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div className="min-w-0 space-y-2">
                <p className="text-sm font-semibold text-foreground">Estimated upside</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {result.upsideEstimate.summary} At your current revenue level, that translates to about{" "}
                  {formatEuro(result.upsideEstimate.additionalRevenueRemaining)} of additional revenue remaining after
                  direct product costs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card-shell">
        <div className="card-header-accent" />
        <div className="card-section py-6 xs:py-7 sm:py-9">
          <div className="space-y-5 text-center">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
              <div className="h-[2px] w-5 rounded-full bg-primary" />
              Next Step
            </div>
            <h3 className="font-display text-lg font-700 text-foreground sm:text-xl">
              Want a deeper revenue and direct-cost analysis?
            </h3>
            <p className="mx-auto max-w-lg text-sm leading-relaxed text-muted-foreground">
              Explore which products, services, deals, or customer segments are diluting retained revenue and where
              sharper pricing or cost decisions could create the most value.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 pt-1 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="group h-12 w-full rounded-xl bg-primary px-6 text-base font-semibold text-primary-foreground shadow-elevated transition-all duration-300 hover:bg-primary/90 hover:shadow-highlight sm:w-auto sm:px-8"
              >
                <a href="https://www.saimless.com" target="_blank" rel="noreferrer">
                  Get a deeper analysis
                  <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
              </Button>
              <Button
                onClick={onReset}
                variant="ghost"
                size="lg"
                className="h-12 w-full text-sm text-muted-foreground hover:text-foreground sm:w-auto"
              >
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                Try another scenario
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
