import { useMemo, useState } from "react";
import { ArrowRight, Check, ChevronDown, Info, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { formatRevenueDisplayInput, parseRevenueInput } from "@/lib/revenue";
import {
  SECTOR_OPTIONS,
  formatBenchmarkAnchor,
  formatBenchmarkRange,
  getSectorBenchmark,
  type Sector,
} from "@/lib/estimator";

interface EstimatorFormProps {
  onCalculate: (annualRevenue: number, annualCogs: number, sector: Sector) => void;
}

const previewCurrency = (value: number) =>
  new Intl.NumberFormat("en", {
    style: "currency",
    currency: "EUR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

export const EstimatorForm = ({ onCalculate }: EstimatorFormProps) => {
  const [annualRevenue, setAnnualRevenue] = useState("");
  const [annualCogs, setAnnualCogs] = useState("");
  const [sector, setSector] = useState<Sector | "">("");
  const [isSectorMenuOpen, setIsSectorMenuOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const parsedRevenue = useMemo(() => parseRevenueInput(annualRevenue), [annualRevenue]);
  const parsedCogs = useMemo(() => parseRevenueInput(annualCogs, { allowZero: true }), [annualCogs]);
  const selectedBenchmark = sector ? getSectorBenchmark(sector) : null;
  const selectedSectorLabel = SECTOR_OPTIONS.find((option) => option.value === sector)?.label;
  const revenuePreview = parsedRevenue ? previewCurrency(parsedRevenue) : null;
  const cogsPreview = parsedCogs ? previewCurrency(parsedCogs) : null;
  const cogsExceedsRevenue = Boolean(parsedRevenue && parsedCogs && parsedCogs > parsedRevenue);

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!parsedRevenue) {
      nextErrors.revenue = "Please enter a valid annual revenue greater than zero.";
    }

    if (annualCogs.trim() === "") {
      nextErrors.cogs = "Please enter your estimated annual COGS.";
    } else if (parsedCogs === null) {
      nextErrors.cogs = "Please enter a valid annual COGS amount.";
    } else if (parsedRevenue && parsedCogs > parsedRevenue) {
      nextErrors.cogs = "Annual COGS cannot be higher than annual revenue for this calculation.";
    }

    if (!sector) {
      nextErrors.sector = "Please select your sector.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setTouched({ revenue: true, cogs: true, sector: true });

    if (validate() && sector && parsedRevenue && parsedCogs !== null) {
      onCalculate(parsedRevenue, parsedCogs, sector);
    }
  };

  return (
    <div className="card-shell transition-shadow duration-200 hover:shadow-card">
      <div className="card-section pb-0 pt-8 sm:pt-10">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Calculator className="h-4 w-4 text-primary" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Margin Calculator
          </p>
        </div>
        <h2 className="font-display text-xl font-bold text-foreground sm:text-2xl">
          Revenue remaining after direct product costs
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Calculate how much of your annual revenue remains after subtracting the direct costs of delivering your
          product or service.
        </p>
      </div>

      <div className="card-section py-5">
        <div className="h-px bg-border/50" />
      </div>

      <form onSubmit={handleSubmit} className="card-section space-y-8 pb-9 pt-0 sm:space-y-9">
        <div className="rounded-xl border border-primary/10 bg-highlight-soft/60 px-5 py-4">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 text-base" aria-hidden="true">💡</span>
            <div>
              <p className="text-[13px] font-semibold text-foreground">What this calculates</p>
              <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                Annual revenue minus direct product-related costs (COGS), expressed as a percentage of annual revenue.
              </p>
            </div>
          </div>
        </div>

        {/* Step 1: Revenue */}
        <div className="space-y-2.5">
          <Label htmlFor="revenue" className="text-[13px] font-semibold text-foreground">
            Step 1: Expected annual revenue
          </Label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground/70">€</div>
            <Input
              id="revenue"
              type="text"
              inputMode="decimal"
              value={annualRevenue}
              onChange={(event) => {
                const formattedValue = formatRevenueDisplayInput(event.target.value);
                setAnnualRevenue(formattedValue);
                if (touched.revenue) {
                  setErrors((current) => ({
                    ...current,
                    revenue: parseRevenueInput(formattedValue)
                      ? ""
                      : "Please enter a valid annual revenue greater than zero.",
                    cogs:
                      parseRevenueInput(formattedValue) &&
                      parseRevenueInput(annualCogs, { allowZero: true }) !== null &&
                      parseRevenueInput(annualCogs, { allowZero: true })! > parseRevenueInput(formattedValue)!
                        ? "Annual COGS cannot be higher than annual revenue for this calculation."
                        : current.cogs === "Annual COGS cannot be higher than annual revenue for this calculation."
                          ? ""
                          : current.cogs,
                  }));
                }
              }}
              onBlur={() => {
                setTouched((current) => ({ ...current, revenue: true }));
                setErrors((current) => ({
                  ...current,
                  revenue: parseRevenueInput(annualRevenue)
                    ? ""
                    : "Please enter a valid annual revenue greater than zero.",
                }));
              }}
              placeholder="e.g. 12.500.000 or 12.5M"
              className={`touch-target h-12 rounded-lg border-border/80 bg-background pl-9 text-sm transition-all duration-200 placeholder:text-muted-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/15 ${
                errors.revenue && touched.revenue ? "border-destructive focus:ring-destructive/15" : ""
              }`}
            />
          </div>
          <div className="flex flex-col gap-1.5 xs:flex-row xs:items-center xs:justify-between">
            <p className="text-xs text-muted-foreground/80">Your estimated total revenue over a full year.</p>
            {revenuePreview && (
              <span className="w-fit rounded-md bg-primary/8 px-2.5 py-1 text-xs font-semibold text-primary">
                ≈ {revenuePreview}
              </span>
            )}
          </div>
          {errors.revenue && touched.revenue && (
            <p className="flex items-center gap-1.5 text-xs text-destructive">
              <Info className="h-3 w-3 shrink-0" />
              {errors.revenue}
            </p>
          )}
        </div>

        {/* Step 2: COGS */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <Label htmlFor="cogs" className="text-[13px] font-semibold text-foreground">
              Step 2: Estimated annual COGS
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="touch-target inline-flex min-w-11 items-center justify-center text-muted-foreground/50 transition-colors duration-200 hover:text-primary"
                  aria-label="COGS explanation"
                >
                  <Info className="h-3.5 w-3.5" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="max-w-sm text-[13px] leading-relaxed">
                COGS are the direct costs of producing or delivering what you sell.
                <br />
                <br />
                You can keep this estimate simple (e.g. purchase or material costs) or make it more detailed by
                including labor, production, or other direct costs.
                <br />
                <br />
                The level of detail depends on the data you have and how precise you want your estimate to be.
              </PopoverContent>
            </Popover>
          </div>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground/70">€</div>
            <Input
              id="cogs"
              type="text"
              inputMode="decimal"
              value={annualCogs}
              onChange={(event) => {
                const formattedValue = formatRevenueDisplayInput(event.target.value);
                setAnnualCogs(formattedValue);
                if (touched.cogs) {
                  const nextCogs = parseRevenueInput(formattedValue, { allowZero: true });
                  setErrors((current) => ({
                    ...current,
                    cogs:
                      formattedValue.trim() === ""
                        ? "Please enter your estimated annual COGS."
                        : nextCogs === null
                          ? "Please enter a valid annual COGS amount."
                          : parsedRevenue && nextCogs > parsedRevenue
                            ? "Annual COGS cannot be higher than annual revenue for this calculation."
                            : "",
                  }));
                }
              }}
              onBlur={() => {
                setTouched((current) => ({ ...current, cogs: true }));
                setErrors((current) => ({
                  ...current,
                  cogs:
                    annualCogs.trim() === ""
                      ? "Please enter your estimated annual COGS."
                      : parsedCogs === null
                        ? "Please enter a valid annual COGS amount."
                        : parsedRevenue && parsedCogs > parsedRevenue
                          ? "Annual COGS cannot be higher than annual revenue for this calculation."
                          : "",
                }));
              }}
              placeholder="e.g. 7.200.000 or 7.2M"
              className={`touch-target h-12 rounded-lg border-border/80 bg-background pl-9 text-sm transition-all duration-200 placeholder:text-muted-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/15 ${
                errors.cogs && touched.cogs ? "border-destructive focus:ring-destructive/15" : ""
              }`}
            />
          </div>
          <div className="flex flex-col gap-1.5 xs:flex-row xs:items-center xs:justify-between">
            <p className="text-xs text-muted-foreground/80">
              Direct costs of delivering your product or service (materials, production, suppliers). Exclude marketing, rent, overhead.
            </p>
            {cogsPreview && (
              <span className="w-fit rounded-md bg-primary/8 px-2.5 py-1 text-xs font-semibold text-primary">
                ≈ {cogsPreview}
              </span>
            )}
          </div>
          {errors.cogs && touched.cogs && (
            <p className="flex items-center gap-1.5 text-xs text-destructive">
              <Info className="h-3 w-3 shrink-0" />
              {errors.cogs}
            </p>
          )}
          {cogsExceedsRevenue && !errors.cogs && (
            <p className="flex items-center gap-1.5 text-xs text-destructive">
              <Info className="h-3 w-3 shrink-0" />
              Annual COGS cannot be higher than annual revenue for this calculation.
            </p>
          )}
        </div>

        {/* Step 3: Sector */}
        <div className="space-y-2.5">
          <div className="flex flex-col gap-1.5 xs:flex-row xs:items-center xs:justify-between">
            <Label htmlFor="sector" className="text-[13px] font-semibold text-foreground">
              Step 3: Sector
            </Label>
            {selectedSectorLabel && (
              <span className="w-fit rounded-md bg-primary/8 px-2.5 py-1 text-xs font-semibold text-primary">
                {selectedSectorLabel}
              </span>
            )}
          </div>
          <Popover modal={false} open={isSectorMenuOpen} onOpenChange={setIsSectorMenuOpen}>
            <PopoverTrigger asChild>
              <button
                id="sector"
                type="button"
                aria-invalid={errors.sector && touched.sector ? true : undefined}
                aria-expanded={isSectorMenuOpen}
                aria-haspopup="listbox"
                className={cn(
                  "touch-target flex h-12 w-full items-center justify-between rounded-lg border bg-background px-4 text-left text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:ring-offset-0",
                  errors.sector && touched.sector
                    ? "border-destructive/40 focus:ring-destructive/15"
                    : "border-border/80 hover:border-muted-foreground/30",
                )}
              >
                <span className={cn("truncate pr-4", sector ? "text-foreground" : "text-muted-foreground/60")}>
                  {selectedSectorLabel ?? "Select your sector"}
                </span>
                <ChevronDown
                  className={cn("h-4 w-4 shrink-0 text-muted-foreground/50 transition-transform duration-200", isSectorMenuOpen && "rotate-180")}
                />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              side="bottom"
              sideOffset={8}
              avoidCollisions={false}
              className="max-h-[22rem] w-[min(30rem,var(--radix-popover-trigger-width))] overflow-y-auto rounded-xl border-border/80 bg-card p-1.5 shadow-premium"
            >
              <div role="listbox" aria-labelledby="sector" className="space-y-0.5">
                {SECTOR_OPTIONS.map((option) => {
                  const isSelected = option.value === sector;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      className={cn(
                        "flex min-h-11 w-full items-center gap-3 rounded-lg py-2.5 pl-3 pr-3 text-left text-[13px] transition-colors duration-150 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/15",
                        isSelected && "bg-primary/[0.06] font-medium text-primary",
                      )}
                      onClick={() => {
                        setSector(option.value);
                        setTouched((current) => ({ ...current, sector: true }));
                        setErrors((current) => ({ ...current, sector: "" }));
                        setIsSectorMenuOpen(false);
                      }}
                    >
                      <span className="flex h-4 w-4 items-center justify-center">
                        {isSelected ? <Check className="h-4 w-4" /> : null}
                      </span>
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
          <p className="text-xs text-muted-foreground/80">Benchmark ranges are specific to the sector you select.</p>
          {selectedBenchmark && (
            <div className="rounded-xl border border-primary/10 bg-highlight-soft/60 px-4 py-3">
              <p className="text-xs leading-relaxed text-muted-foreground">
                <span className="font-semibold text-primary">📏 Benchmark:</span> Anchor at{" "}
                {formatBenchmarkAnchor(selectedBenchmark.anchor)}. Typical range{" "}
                {formatBenchmarkRange(selectedBenchmark.bandLow, selectedBenchmark.bandHigh)}.
              </p>
            </div>
          )}
          {errors.sector && touched.sector && (
            <p className="flex items-center gap-1.5 text-xs text-destructive">
              <Info className="h-3 w-3 shrink-0" />
              {errors.sector}
            </p>
          )}
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            size="lg"
            className="group h-12 w-full rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90 hover:shadow-md sm:h-[52px] sm:text-[15px]"
          >
            <span className="min-w-0">Calculate revenue remaining after direct costs</span>
            <ArrowRight className="ml-2 hidden h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 xs:block" />
          </Button>
        </div>

        <p className="text-center text-[11px] text-muted-foreground/60">
          Benchmark-based estimate · No data is stored · This is not net profit
        </p>
      </form>
    </div>
  );
};
