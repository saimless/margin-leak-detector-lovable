import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Info } from "lucide-react";
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
    <div className="bg-card rounded-2xl shadow-card border border-border/60 overflow-hidden">
      <div className="px-6 sm:px-10 pt-8 sm:pt-10 pb-2">
        <h2 className="font-display text-xl sm:text-2xl font-700 text-foreground mb-1">
          Estimate your gross margin opportunity
        </h2>
        <p className="text-sm text-muted-foreground">
          Enter a few inputs to see how your current gross margin compares with typical industry benchmark ranges.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="px-6 sm:px-10 py-6 sm:py-8 space-y-6">
        {/* Revenue */}
        <div className="space-y-2">
          <Label htmlFor="revenue" className="text-sm font-medium text-foreground">
            Estimated annual revenue (€)
          </Label>
          <div className="relative">
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
              className={`h-12 text-base bg-surface border-border focus:border-primary focus:ring-primary/20 ${errors.revenue ? "border-destructive" : ""}`}
            />
          </div>
          <p className="text-xs text-muted-foreground">Enter your best estimate of annual revenue.</p>
          {revenuePreview && <p className="text-xs text-foreground/80">≈ {revenuePreview}</p>}
          {errors.revenue && touched.revenue && <p className="text-xs text-destructive flex items-center gap-1"><Info className="h-3 w-3" />{errors.revenue}</p>}
        </div>

        {/* Sector */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Sector</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SECTOR_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setSector(option.value);
                  setTouched((current) => ({ ...current, sector: true }));
                  setErrors((e) => ({ ...e, sector: "" }));
                }}
                className={`px-4 py-3 rounded-lg border text-sm font-medium text-left transition-all duration-150
                  ${sector === option.value
                    ? "border-primary bg-highlight-soft text-primary ring-1 ring-primary/20"
                    : "border-border bg-surface text-foreground hover:border-primary/40 hover:bg-highlight-soft/50"
                  } ${errors.sector ? "border-destructive/50" : ""}`}
              >
                {option.label}
              </button>
            ))}
          </div>
          {selectedBenchmark && (
            <p className="text-xs text-muted-foreground">
              Benchmark anchor: {formatBenchmarkAnchor(selectedBenchmark.anchor)}. Reference band: {formatBenchmarkRange(selectedBenchmark.bandLow, selectedBenchmark.bandHigh)}.
            </p>
          )}
          {errors.sector && touched.sector && <p className="text-xs text-destructive flex items-center gap-1"><Info className="h-3 w-3" />{errors.sector}</p>}
        </div>

        {/* Margin */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium text-foreground">
              Estimated gross margin
            </Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Gross margin explanation">
                  <Info className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-sm">
                Gross margin reflects the share of revenue left after direct product costs (COGS). It is the core metric used in this analysis.
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="text-xs text-muted-foreground">
            Select the gross margin range that best reflects your current business performance.
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
                className={`px-4 py-3 rounded-lg border text-sm font-medium text-left transition-all duration-150
                  ${grossMarginRange === range
                    ? "border-primary bg-highlight-soft text-primary ring-1 ring-primary/20"
                    : "border-border bg-surface text-foreground hover:border-primary/40 hover:bg-highlight-soft/50"
                  } ${errors.margin ? "border-destructive/50" : ""}`}
              >
                {range}
              </button>
            ))}
          </div>
          {errors.margin && touched.margin && <p className="text-xs text-destructive flex items-center gap-1"><Info className="h-3 w-3" />{errors.margin}</p>}
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full h-13 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90 shadow-elevated hover:shadow-highlight transition-all duration-200"
        >
          Calculate my gross margin estimate
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>

        <p className="text-xs text-center text-muted-foreground pt-1">
          This is a benchmark-based estimate of gross margin opportunity based on your inputs and selected sector benchmarks.
        </p>
      </form>
    </div>
  );
};
