import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Info, ChevronRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatRevenueDisplayInput, parseRevenueInput } from "@/lib/revenue";
import {
  GROSS_MARGIN_RANGES,
  SECTOR_OPTIONS,
  getSectorBenchmark,
  formatBenchmarkAnchor,
  formatBenchmarkRange,
  type GrossMarginRange,
  type Sector,
} from "@/lib/estimator";

interface EstimatorFormProps {
  onCalculate: (revenue: number, sector: Sector, grossMarginRange: GrossMarginRange) => void;
}

export const EstimatorForm = ({ onCalculate }: EstimatorFormProps) => {
  const [revenue, setRevenue] = useState("");
  const [sector, setSector] = useState<Sector | "">("");
  const [grossMarginRange, setGrossMarginRange] = useState<GrossMarginRange | "">("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const parsedRevenue = useMemo(() => parseRevenueInput(revenue), [revenue]);
  const selectedBenchmark = sector ? getSectorBenchmark(sector) : null;
  const revenuePreview = parsedRevenue
    ? new Intl.NumberFormat("en", {
        style: "currency",
        currency: "EUR",
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(parsedRevenue)
    : null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!parsedRevenue) errs.revenue = "Please enter a valid annual revenue";
    if (!sector) errs.sector = "Please select your sector";
    if (!grossMarginRange) errs.margin = "Please select the gross margin range that best matches your business";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ revenue: true, sector: true, margin: true });
    if (validate() && sector && grossMarginRange && parsedRevenue) {
      onCalculate(parsedRevenue, sector, grossMarginRange);
    }
  };

  return (
    <div className="bg-card rounded-2xl shadow-premium border border-border/50 overflow-hidden">
      {/* Header */}
      <div className="px-6 sm:px-10 pt-8 sm:pt-10 pb-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-3">
          <div className="w-5 h-[2px] bg-primary rounded-full" />
          Margin Estimator
        </div>
        <h2 className="font-display text-xl sm:text-2xl font-700 text-foreground mb-1.5">
          Estimate your gross margin opportunity
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Enter a few inputs to see how your current gross margin compares with typical industry benchmark ranges.
        </p>
      </div>

      <div className="px-6 sm:px-10 pb-2">
        <div className="h-px bg-border/70" />
      </div>

      <form onSubmit={handleSubmit} className="px-6 sm:px-10 py-6 sm:py-8 space-y-7">
        {/* Revenue */}
        <div className="space-y-2.5">
          <Label htmlFor="revenue" className="text-sm font-semibold text-foreground">
            Estimated annual revenue (€)
          </Label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">€</div>
            <Input
              id="revenue"
              type="text"
              inputMode="decimal"
              value={revenue}
              onChange={(e) => {
                const formattedValue = formatRevenueDisplayInput(e.target.value);
                setRevenue(formattedValue);
                if (touched.revenue) {
                  setErrors((current) => ({
                    ...current,
                    revenue: parseRevenueInput(formattedValue) ? "" : "Please enter a valid annual revenue",
                  }));
                }
              }}
              onBlur={() => {
                setTouched((current) => ({ ...current, revenue: true }));
                setErrors((current) => ({
                  ...current,
                  revenue: parseRevenueInput(revenue) ? "" : "Please enter a valid annual revenue",
                }));
              }}
              placeholder="e.g. 12.500.000 or 12.5M"
              className={`h-12 pl-8 text-base bg-surface border-border/80 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all ${errors.revenue && touched.revenue ? "border-destructive ring-destructive/10" : ""}`}
            />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Enter your best estimate of annual revenue.</p>
            {revenuePreview && (
              <p className="text-xs font-medium text-primary bg-highlight-soft px-2 py-0.5 rounded-md">
                ≈ {revenuePreview}
              </p>
            )}
          </div>
          {errors.revenue && touched.revenue && (
            <p className="text-xs text-destructive flex items-center gap-1.5">
              <Info className="h-3 w-3 shrink-0" />{errors.revenue}
            </p>
          )}
        </div>

        {/* Sector */}
        <div className="space-y-2.5">
          <Label className="text-sm font-semibold text-foreground">Sector</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {SECTOR_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setSector(option.value);
                  setTouched((current) => ({ ...current, sector: true }));
                  setErrors((e) => ({ ...e, sector: "" }));
                }}
                className={`group px-4 py-3.5 rounded-xl border text-sm font-medium text-left transition-all duration-200 flex items-center justify-between
                  ${sector === option.value
                    ? "border-primary bg-highlight-soft text-primary shadow-soft ring-1 ring-primary/15"
                    : "border-border/80 bg-card text-foreground hover:border-primary/30 hover:bg-highlight-soft/40"
                  } ${errors.sector && touched.sector ? "border-destructive/30" : ""}`}
              >
                <span>{option.label}</span>
                <ChevronRight className={`h-3.5 w-3.5 transition-all duration-200 ${
                  sector === option.value ? "text-primary opacity-100" : "text-muted-foreground opacity-0 group-hover:opacity-50"
                }`} />
              </button>
            ))}
          </div>
          {selectedBenchmark && (
            <div className="bg-highlight-soft/50 rounded-lg px-3.5 py-2.5 border border-primary/10">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="font-semibold text-primary">Benchmark:</span>{" "}
                Anchor at {formatBenchmarkAnchor(selectedBenchmark.anchor)} · Band {formatBenchmarkRange(selectedBenchmark.bandLow, selectedBenchmark.bandHigh)}
              </p>
            </div>
          )}
          {errors.sector && touched.sector && (
            <p className="text-xs text-destructive flex items-center gap-1.5">
              <Info className="h-3 w-3 shrink-0" />{errors.sector}
            </p>
          )}
        </div>

        {/* Margin */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-semibold text-foreground">
              Estimated gross margin
            </Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Gross margin explanation">
                  <Info className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-sm">
                Gross margin reflects the share of revenue left after direct product costs (COGS). It is the core metric used in this analysis.
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="text-xs text-muted-foreground">
            Select the range that best reflects your current business performance.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {GROSS_MARGIN_RANGES.map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => {
                  setGrossMarginRange(range);
                  setTouched((current) => ({ ...current, margin: true }));
                  setErrors((e) => ({ ...e, margin: "" }));
                }}
                className={`px-3 py-3 rounded-xl border text-sm font-medium text-center transition-all duration-200
                  ${grossMarginRange === range
                    ? "border-primary bg-highlight-soft text-primary shadow-soft ring-1 ring-primary/15"
                    : "border-border/80 bg-card text-foreground hover:border-primary/30 hover:bg-highlight-soft/40"
                  } ${errors.margin && touched.margin ? "border-destructive/30" : ""}`}
              >
                {range}
              </button>
            ))}
          </div>
          {errors.margin && touched.margin && (
            <p className="text-xs text-destructive flex items-center gap-1.5">
              <Info className="h-3 w-3 shrink-0" />{errors.margin}
            </p>
          )}
        </div>

        <div className="pt-1">
          <Button
            type="submit"
            size="lg"
            className="w-full h-13 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90 shadow-elevated hover:shadow-highlight transition-all duration-300 group"
          >
            Calculate my gross margin estimate
            <ArrowRight className="h-4 w-4 ml-1.5 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </div>

        <p className="text-[11px] text-center text-muted-foreground/70 leading-relaxed">
          Benchmark-based estimate · No data is stored · Results are directional
        </p>
      </form>
    </div>
  );
};
