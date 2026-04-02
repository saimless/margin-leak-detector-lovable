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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const selectedSectorLabel = SECTOR_OPTIONS.find((option) => option.value === sector)?.label;
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
    <div className="card-shell">
      {/* Header with blue accent bar */}
      <div className="card-header-accent" />
      <div className="card-section pb-4 pt-6 xs:pt-7 sm:pt-9">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-3">
          <div className="w-5 h-[2px] bg-primary rounded-full" />
          Margin Estimator
        </div>
        <h2 className="font-display text-xl font-700 text-foreground mb-1.5 sm:text-2xl">
          Estimate your gross margin opportunity
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Enter a few inputs to see how your current gross margin compares with typical industry benchmark ranges.
        </p>
      </div>

      <div className="card-section pb-2">
        <div className="h-px bg-border" />
      </div>

      <form onSubmit={handleSubmit} className="card-section space-y-6 py-5 xs:space-y-7 xs:py-6 sm:py-8">
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
              className={`touch-target h-12 rounded-xl border-border bg-surface pl-8 text-base transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 ${errors.revenue && touched.revenue ? "border-destructive ring-destructive/10" : ""}`}
            />
          </div>
          <div className="flex flex-col gap-2 xs:flex-row xs:items-center xs:justify-between">
            <p className="text-xs text-muted-foreground">Enter your best estimate of annual revenue.</p>
            {revenuePreview && (
              <p className="w-fit text-xs font-semibold text-primary bg-highlight-soft px-2.5 py-1 rounded-md border border-primary/10">
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
          <div className="flex flex-col gap-2 xs:flex-row xs:items-center xs:justify-between">
            <Label htmlFor="sector" className="text-sm font-semibold text-foreground">Sector</Label>
            {selectedSectorLabel && (
              <p className="w-fit rounded-md border border-primary/10 bg-highlight-soft px-2.5 py-1 text-xs font-semibold text-primary">
                {selectedSectorLabel}
              </p>
            )}
          </div>
          <Select
            value={sector}
            onValueChange={(value) => {
              setSector(value as Sector);
              setTouched((current) => ({ ...current, sector: true }));
              setErrors((current) => ({ ...current, sector: "" }));
            }}
          >
            <SelectTrigger
              id="sector"
              className={`touch-target h-12 rounded-xl border bg-surface px-4 text-left text-sm shadow-sm transition-all focus:ring-primary/20 ${
                errors.sector && touched.sector
                  ? "border-destructive/40 ring-1 ring-destructive/10"
                  : "border-border hover:border-primary/40"
              }`}
            >
              <SelectValue placeholder="Select your sector" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border bg-card p-1 shadow-premium">
              {SECTOR_OPTIONS.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="min-h-11 rounded-lg py-2.5 pl-8 pr-3 text-sm font-medium text-foreground focus:bg-primary/[0.06] focus:text-foreground"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedBenchmark && (
            <div className="bg-primary/5 rounded-lg px-3.5 py-2.5 border border-primary/15">
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
                <button type="button" className="touch-target inline-flex min-w-11 items-center justify-center text-muted-foreground transition-colors hover:text-primary" aria-label="Gross margin explanation">
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
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {GROSS_MARGIN_RANGES.map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => {
                  setGrossMarginRange(range);
                  setTouched((current) => ({ ...current, margin: true }));
                  setErrors((e) => ({ ...e, margin: "" }));
                }}
                className={`touch-target rounded-xl border px-3 py-3 text-center text-sm font-medium transition-all duration-200
                  ${grossMarginRange === range
                    ? "border-primary bg-primary/5 text-primary shadow-sm ring-1 ring-primary/20"
                    : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-primary/[0.02]"
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
            className="group h-12 w-full rounded-xl bg-primary text-base font-semibold text-primary-foreground shadow-elevated transition-all duration-300 hover:bg-primary/90 hover:shadow-highlight sm:h-13"
          >
            Calculate my gross margin estimate
            <ArrowRight className="h-4 w-4 ml-1.5 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </div>

        <p className="text-[11px] text-center text-muted-foreground leading-relaxed">
          Benchmark-based estimate · No data is stored · Results are directional
        </p>
      </form>
    </div>
  );
};
