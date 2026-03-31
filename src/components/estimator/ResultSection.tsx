import { Button } from "@/components/ui/button";
import { TrendingUp, BarChart3, Info, RotateCcw, ArrowRight } from "lucide-react";
import type { EstimatorResult } from "@/pages/Index";

interface ResultSectionProps {
  result: EstimatorResult;
  onReset: () => void;
  onGetReport: () => void;
}

const formatEuro = (n: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

export const ResultSection = ({ result, onReset, onGetReport }: ResultSectionProps) => {
  const marginLabel =
    result.margin < 8 ? "below average" : result.margin <= 15 ? "within a typical range" : "above average";

  return (
    <div className="space-y-5">
      {/* Main result card */}
      <div className="bg-card rounded-2xl shadow-card border border-border/60 overflow-hidden">
        <div className="bg-foreground text-primary-foreground px-6 sm:px-10 py-8 sm:py-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/15 px-3 py-1 text-xs font-medium mb-5">
            <TrendingUp className="h-3 w-3" />
            Estimated annual margin improvement
          </div>
          <div className="font-display text-3xl sm:text-4xl md:text-5xl font-800 tracking-tight leading-none">
            {formatEuro(result.min)} – {formatEuro(result.max)}
          </div>
          <p className="text-primary-foreground/60 text-sm mt-3">per year, based on benchmark factors</p>
        </div>

        <div className="px-6 sm:px-10 py-6 sm:py-8 space-y-5">
          {/* Inputs summary */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Revenue</p>
              <p className="text-sm sm:text-base font-semibold text-foreground">{formatEuro(result.revenue)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Sector</p>
              <p className="text-sm sm:text-base font-semibold text-foreground">{result.sector}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Net margin</p>
              <p className="text-sm sm:text-base font-semibold text-foreground">{result.margin}%</p>
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Benchmark insight */}
          <div className="rounded-xl bg-highlight-soft/60 border border-primary/10 px-5 py-4">
            <div className="flex items-start gap-3">
              <BarChart3 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">Sector benchmark</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{result.sectorBenchmark}</p>
              </div>
            </div>
          </div>

          {/* Explanation */}
          <div className="rounded-xl bg-muted/50 border border-border/60 px-5 py-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">How this is calculated</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your current net margin of {result.margin}% is {marginLabel} for {result.sector.toLowerCase()}.
                  The estimate combines your revenue with sector-specific improvement benchmarks and a margin sensitivity factor
                  to produce a conservative-to-optimistic range.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA card */}
      <div className="bg-card rounded-2xl shadow-elevated border border-border/60 px-6 sm:px-10 py-6 sm:py-8">
        <div className="text-center space-y-4">
          <h3 className="font-display text-lg sm:text-xl font-700 text-foreground">
            Want to understand what's driving this number?
          </h3>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Get a brief personalized breakdown with actionable next steps — no cost, no obligation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              onClick={onGetReport}
              size="lg"
              className="w-full sm:w-auto h-12 px-8 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90 shadow-elevated hover:shadow-highlight transition-all duration-200"
            >
              Get my free breakdown
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
            <Button
              onClick={onReset}
              variant="ghost"
              size="lg"
              className="w-full sm:w-auto h-12 text-sm text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Start over
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
