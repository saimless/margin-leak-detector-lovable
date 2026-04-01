import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, BarChart3, RotateCcw, ArrowRight, Sparkles, Target } from "lucide-react";
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

const scenarioCopy: Record<ScenarioResult["label"], { title: string; subtitle: string; icon: string }> = {
  conservative: {
    title: "Baseline",
    subtitle: "Lower bound of benchmark",
    icon: "📊",
  },
  midpoint: {
    title: "Expected",
    subtitle: "Midpoint of benchmark",
    icon: "🎯",
  },
  optimized: {
    title: "High-performance",
    subtitle: "Upper bound of benchmark",
    icon: "🚀",
  },
};

export const ResultSection = ({ result, onReset }: ResultSectionProps) => {
  const copy = benchmarkStateCopy[result.marginBenchmarkState];

  return (
    <div className="space-y-5">
      {/* Main results card */}
      <div className="bg-card rounded-2xl shadow-premium border border-border/50 overflow-hidden">
        {/* Header */}
        <div className="bg-hero text-hero-foreground px-6 sm:px-10 py-8 sm:py-10">
          <div className="flex items-center gap-2 text-xs font-medium text-primary mb-4">
            <div className="w-5 h-[2px] bg-primary rounded-full" />
            ANALYSIS RESULTS
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-800 tracking-tight leading-tight text-hero-foreground mb-3">
            Gross margin improvement scenarios
          </h2>
          <p className="text-sm text-hero-muted max-w-xl leading-relaxed">
            Potential gross profit improvement across different performance levels within your selected benchmark range.
          </p>
        </div>

        <div className="px-6 sm:px-10 py-8 space-y-6">
          {/* Input summary */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Revenue", value: formatEuro(result.revenue) },
              { label: "Sector", value: result.sector },
              { label: "Gross margin", value: result.grossMarginRange },
            ].map((item) => (
              <div key={item.label} className="bg-secondary/50 rounded-xl px-4 py-3 border border-border/40">
                <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider mb-1">{item.label}</p>
                <p className="text-sm font-semibold text-foreground truncate">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Scenarios */}
          <div className="grid gap-3 md:grid-cols-3">
            {result.scenarios.map((scenario) => {
              const scenarioMeta = scenarioCopy[scenario.label];
              const isFocused = scenario.label === "midpoint";

              return (
                <div
                  key={scenario.label}
                  className={`rounded-xl border px-5 py-5 text-left transition-all duration-200 ${
                    isFocused
                      ? "border-primary/30 bg-highlight-soft shadow-highlight ring-1 ring-primary/10 relative"
                      : "border-border/50 bg-secondary/30 hover:bg-secondary/50"
                  }`}
                >
                  {isFocused && (
                    <div className="absolute -top-2.5 left-4">
                      <Badge className="bg-primary text-primary-foreground text-[10px] font-semibold px-2 py-0.5 shadow-sm">
                        Recommended focus
                      </Badge>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mb-4 mt-1">
                    <span className="text-base">{scenarioMeta.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{scenarioMeta.title}</p>
                      <p className="text-[11px] text-muted-foreground">{scenarioMeta.subtitle}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Target margin</p>
                      <p className="text-lg font-bold text-foreground tabular-nums">{formatPercent(scenario.targetMargin)}</p>
                    </div>
                    <div className="h-px bg-border/60" />
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Est. gross profit</p>
                      <p className="text-lg font-bold text-foreground tabular-nums">{formatEuro(scenario.grossProfitScenario)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Improvement</p>
                      <p className={`text-base font-bold tabular-nums ${isFocused ? "text-primary" : "text-success"}`}>
                        +{formatEuro(scenario.grossProfitImprovement)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="h-px bg-border/60" />

          {/* Analysis context */}
          <div className="rounded-xl border border-border/50 bg-secondary/30 px-5 py-5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-primary" />
              <p className="text-sm font-semibold text-foreground">{copy.headline}</p>
            </div>
            <div className="space-y-2.5">
              <p className="text-sm leading-relaxed text-muted-foreground">{copy.summary}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{copy.context}</p>
            </div>
          </div>

          {/* How it works */}
          <div className="rounded-xl border border-border/50 bg-secondary/30 px-5 py-5">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-4 w-4 text-primary" />
              <p className="text-sm font-semibold text-foreground">How this works</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm leading-relaxed text-muted-foreground">
                Gross margin is calculated from revenue minus cost of goods sold. COGS is used as the direct cost basis, making this analysis useful for pricing, discounting, mix, and cost structure decisions.
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                The scenario range translates the selected sector benchmark band into gross profit outcomes at conservative, midpoint, and optimized performance levels.
              </p>
            </div>
          </div>

          {/* Benchmark detail */}
          <div className="rounded-xl bg-highlight-soft/60 border border-primary/10 px-5 py-5">
            <div className="flex items-start gap-3">
              <BarChart3 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">Benchmark reference</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Sector anchor: {result.benchmarkGrossMargin} · Band: {result.benchmarkGrossMarginBand}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Current margin midpoint: {formatPercent(result.currentGrossMargin)} · Current gross profit: {formatEuro(result.grossProfitCurrent)} · COGS estimate: {formatEuro(result.estimatedCogs)}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Scenario targets: {formatPercent(result.benchmarkLower)}, {formatPercent(result.benchmarkMid)}, and {formatPercent(result.benchmarkUpper)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA card */}
      <div className="bg-card rounded-2xl shadow-premium border border-border/50 px-6 sm:px-10 py-8 sm:py-10">
        <div className="text-center space-y-5">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary">
            <div className="w-5 h-[2px] bg-primary rounded-full" />
            NEXT STEP
          </div>
          <h3 className="font-display text-lg sm:text-xl font-700 text-foreground">
            Want deeper gross margin insights?
          </h3>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Go beyond benchmarks with AI-driven analysis of your pricing, product mix, and sales performance. Discover where margin is created, where it's lost, and how to improve it.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto h-12 px-8 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90 shadow-elevated hover:shadow-highlight transition-all duration-300 group"
            >
              <a href="https://www.saimless.com" target="_blank" rel="noreferrer">
                Get a deeper margin analysis
                <ArrowRight className="h-4 w-4 ml-1.5 transition-transform group-hover:translate-x-0.5" />
              </a>
            </Button>
            <Button
              onClick={onReset}
              variant="ghost"
              size="lg"
              className="w-full sm:w-auto h-12 text-sm text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
              Try another scenario
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
