import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, BarChart3, RotateCcw, ArrowRight, Sparkles } from "lucide-react";
import type { EstimatorResult, ScenarioResult } from "@/pages/Index";

interface ResultSectionProps {
  result: EstimatorResult;
  onReset: () => void;
}

const formatEuro = (n: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

const formatPercent = (n: number) =>
  `${Math.round(n * 100)}%`;

const benchmarkStateCopy = {
  weak: {
    headline: "Gross margin opportunity visible",
    summary:
      "Your current gross margin appears to be below the selected benchmark range, which may indicate margin leakage through pricing, discounting, product mix, or cost structure. This suggests a clearer opportunity to improve gross margin performance.",
    context:
      "This analysis estimates your gross margin position based on pricing, direct costs, and expected sales. It highlights where sharper pricing, better product mix, and more informed commercial decisions may improve retained value from revenue.",
  },
  average: {
    headline: "Gross margin is in a workable range",
    summary:
      "Your gross margin appears to be in a workable range, but there may still be meaningful upside. Improvements often come from refining pricing, improving product mix, and focusing sales efforts on higher-margin products.",
    context:
      "Gross margin is driven by pricing, product mix, and direct costs. This analysis highlights where better commercial decisions may improve retained value from sales.",
  },
  strong: {
    headline: "Gross margin position appears strong",
    summary:
      "Your current gross margin position appears strong relative to the selected benchmark. This suggests pricing and cost control are already performing well, though further upside may still exist through mix optimization, forecasting precision, and selective pricing improvements.",
    context:
      "Gross margin remains the key operational metric for pricing, mix, and cost decisions. Even when the benchmark gap is limited, sharper forecasting and selective commercial moves can still improve retained value.",
  },
} as const;

const scenarioCopy: Record<ScenarioResult["label"], { title: string; subtitle: string }> = {
  conservative: {
    title: "Baseline improvement",
    subtitle: "Based on the lower bound of the benchmark range",
  },
  midpoint: {
    title: "Expected improvement",
    subtitle: "Based on the midpoint of the benchmark range",
  },
  optimized: {
    title: "High-performance potential",
    subtitle: "Based on the upper bound of the benchmark range",
  },
};

export const ResultSection = ({ result, onReset }: ResultSectionProps) => {
  const copy = benchmarkStateCopy[result.marginBenchmarkState];

  return (
    <div className="space-y-5">
      <div className="bg-card rounded-2xl shadow-card border border-border/60 overflow-hidden">
        <div className="bg-primary text-primary-foreground px-6 sm:px-10 py-8 sm:py-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-black/10 border border-primary-foreground/20 px-3 py-1 text-xs font-medium mb-5">
            <TrendingUp className="h-3 w-3" />
            Gross margin improvement scenarios
          </div>
          <div className="font-display text-2xl sm:text-3xl md:text-4xl font-800 tracking-tight leading-tight max-w-3xl mx-auto">
            Gross margin improvement scenarios
          </div>
          <p className="text-primary-foreground/85 text-sm mt-3 max-w-2xl mx-auto">
            Based on your selected benchmark range
          </p>
          <p className="text-primary-foreground/75 text-sm mt-3 max-w-2xl mx-auto">
            This shows potential gross profit improvement across different performance levels within your selected benchmark range. It provides directional guidance for pricing, product mix, and margin decisions.
          </p>
        </div>

        <div className="px-6 sm:px-10 py-6 sm:py-8 space-y-5">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Estimated annual revenue</p>
              <p className="text-sm sm:text-base font-semibold text-foreground">{formatEuro(result.revenue)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Sector</p>
              <p className="text-sm sm:text-base font-semibold text-foreground">{result.sector}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Selected gross margin range</p>
              <p className="text-sm sm:text-base font-semibold text-foreground">{result.grossMarginRange}</p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {result.scenarios.map((scenario) => {
              const scenarioMeta = scenarioCopy[scenario.label];
              const isFocused = scenario.label === "midpoint";

              return (
                <div
                  key={scenario.label}
                  className={`rounded-xl border px-5 py-4 text-left ${
                    isFocused
                      ? "border-primary bg-highlight-soft shadow-highlight/20 shadow-md"
                      : "border-border/60 bg-secondary/35"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{scenarioMeta.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{scenarioMeta.subtitle}</p>
                    </div>
                    {isFocused ? (
                      <Badge variant="secondary" className="bg-primary text-primary-foreground">
                        Focus
                      </Badge>
                    ) : null}
                  </div>

                  <div className="space-y-3 mt-4">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Target gross margin</p>
                      <p className="text-lg font-semibold text-foreground">{formatPercent(scenario.targetMargin)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Estimated gross profit</p>
                      <p className="text-xl font-semibold text-foreground">{formatEuro(scenario.grossProfitScenario)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Improvement vs current</p>
                      <p className="text-base font-semibold text-primary">{formatEuro(scenario.grossProfitImprovement)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="h-px bg-border" />

          <div className="rounded-xl border border-border/60 bg-secondary/40 px-5 py-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-highlight-soft text-primary">
                  Benchmark View
                </Badge>
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Analysis Context
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">{copy.headline}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {copy.summary}
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {copy.context}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">How this works</p>
                <p className="text-sm leading-relaxed text-foreground/90">
                  Gross margin is calculated from revenue minus cost of goods sold. COGS is used as the direct cost basis for calculating gross margin, which makes this analysis useful for pricing, discounting, mix, and cost structure decisions.
                </p>
                <p className="text-sm leading-relaxed text-foreground/90">
                  The scenario range translates the selected sector benchmark band into gross profit outcomes at conservative, midpoint, and optimized performance levels. This keeps the output focused on decision support rather than prediction.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-highlight-soft border border-primary/15 px-5 py-4">
            <div className="flex items-start gap-3">
              <BarChart3 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">Gross margin benchmark</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  NYU Stern / Damodaran gross margin anchor for this sector: {result.benchmarkGrossMargin}. User-facing reference band: {result.benchmarkGrossMarginBand}.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  These benchmarks are industry reference points for relative positioning and commercial decision support. They are not Europe-specific forecasts.
                </p>
                <p className="text-sm text-foreground/90 leading-relaxed">
                  Current gross margin midpoint: {formatPercent(result.currentGrossMargin)}. Current gross profit: {formatEuro(result.grossProfitCurrent)}. Estimated direct cost basis: {formatEuro(result.estimatedCogs)} in COGS.
                </p>
                <p className="text-sm text-foreground/90 leading-relaxed">
                  Scenario margins span {formatPercent(result.benchmarkLower)}, {formatPercent(result.benchmarkMid)}, and {formatPercent(result.benchmarkUpper)} to show how pricing, mix, and cost execution can shift retained value from revenue.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-elevated border border-border/60 px-6 sm:px-10 py-6 sm:py-8">
        <div className="text-center space-y-4">
          <h3 className="font-display text-lg sm:text-xl font-700 text-foreground">
            Want deeper gross margin insights?
          </h3>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Go beyond benchmarks with AI-driven analysis of your pricing, product mix, and sales performance. Discover where margin is created, where it&apos;s lost, and how to improve it with precision.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto h-12 px-8 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90 shadow-elevated hover:shadow-highlight transition-all duration-200"
            >
              <a href="https://www.saimless.com" target="_blank" rel="noreferrer">
                Get a deeper margin analysis
                <ArrowRight className="h-4 w-4 ml-1" />
              </a>
            </Button>
            <Button
              onClick={onReset}
              variant="ghost"
              size="lg"
              className="w-full sm:w-auto h-12 text-sm text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Try another scenario
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
