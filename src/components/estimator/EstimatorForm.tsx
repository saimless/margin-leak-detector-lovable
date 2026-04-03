import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Check, ChevronsUpDown, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
  const [sectorMenuOpen, setSectorMenuOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const sectorMenuRef = useRef<HTMLDivElement | null>(null);

  const parsedRevenue = useMemo(() => parseRevenueInput(annualRevenue), [annualRevenue]);
  const parsedCogs = useMemo(() => parseRevenueInput(annualCogs, { allowZero: true }), [annualCogs]);
  const selectedBenchmark = sector ? getSectorBenchmark(sector) : null;
  const selectedSectorLabel = SECTOR_OPTIONS.find((option) => option.value === sector)?.label;
  const revenuePreview = parsedRevenue ? previewCurrency(parsedRevenue) : null;
  const cogsPreview = parsedCogs ? previewCurrency(parsedCogs) : null;
  const cogsExceedsRevenue = Boolean(parsedRevenue && parsedCogs && parsedCogs > parsedRevenue);

  useEffect(() => {
    if (!sectorMenuOpen) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (sectorMenuRef.current && target && !sectorMenuRef.current.contains(target)) {
        setSectorMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSectorMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [sectorMenuOpen]);

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
    <div className="card-shell">
      <div className="card-header-accent" />
      <div className="card-section pb-4 pt-6 xs:pt-7 sm:pt-9">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <div className="h-[2px] w-5 rounded-full bg-primary" />
          Revenue After Direct Costs Calculator
        </div>
        <h2 className="font-display mb-1.5 text-xl font-700 text-foreground sm:text-2xl">
          Percentage of revenue remaining after direct product costs
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          We calculate how much of your annual revenue remains after subtracting the direct costs of delivering your
          product or service.
        </p>
      </div>

      <div className="card-section pb-2">
        <div className="h-px bg-border" />
      </div>

      <form onSubmit={handleSubmit} className="card-section space-y-6 py-5 xs:space-y-7 xs:py-6 sm:py-8">
        <div className="rounded-xl border border-primary/15 bg-primary/[0.04] px-4 py-4">
          <p className="text-sm font-semibold text-foreground">What this calculates</p>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            Annual revenue minus direct product-related costs (COGS), expressed as a percentage of annual revenue.
          </p>
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="revenue" className="text-sm font-semibold text-foreground">
            Step 1: Expected annual revenue
          </Label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">€</div>
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
              className={`touch-target h-12 rounded-xl border-border bg-surface pl-8 text-base transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                errors.revenue && touched.revenue ? "border-destructive ring-destructive/10" : ""
              }`}
            />
          </div>
          <div className="flex flex-col gap-2 xs:flex-row xs:items-center xs:justify-between">
            <p className="text-xs text-muted-foreground">Your estimated total revenue over a full year.</p>
            {revenuePreview ? (
              <p className="w-fit rounded-md border border-primary/10 bg-highlight-soft px-2.5 py-1 text-xs font-semibold text-primary">
                ≈ {revenuePreview}
              </p>
            ) : null}
          </div>
          {errors.revenue && touched.revenue ? (
            <p className="flex items-center gap-1.5 text-xs text-destructive">
              <Info className="h-3 w-3 shrink-0" />
              {errors.revenue}
            </p>
          ) : null}
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <Label htmlFor="cogs" className="text-sm font-semibold text-foreground">
              Step 2: Estimated annual COGS
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="touch-target inline-flex min-w-11 items-center justify-center text-muted-foreground transition-colors hover:text-primary"
                  aria-label="COGS explanation"
                >
                  <Info className="h-3.5 w-3.5" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="max-w-sm text-sm leading-relaxed">
                COGS (Cost of Goods Sold) are all costs directly tied to producing or delivering what you sell. This
                typically includes raw materials, production costs, supplier or purchase costs, and direct labor
                involved in creating the product or service. It does not include overhead such as marketing, rent,
                software, or administrative salaries.
              </PopoverContent>
            </Popover>
          </div>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">€</div>
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
              className={`touch-target h-12 rounded-xl border-border bg-surface pl-8 text-base transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                errors.cogs && touched.cogs ? "border-destructive ring-destructive/10" : ""
              }`}
            />
          </div>
          <div className="flex flex-col gap-2 xs:flex-row xs:items-center xs:justify-between">
            <p className="text-xs text-muted-foreground">
              These are the costs directly tied to delivering your product or service (e.g. materials, production,
              supplier costs). Do not include general business expenses like marketing or rent.
            </p>
            {cogsPreview ? (
              <p className="w-fit rounded-md border border-primary/10 bg-highlight-soft px-2.5 py-1 text-xs font-semibold text-primary">
                ≈ {cogsPreview}
              </p>
            ) : null}
          </div>
          {errors.cogs && touched.cogs ? (
            <p className="flex items-center gap-1.5 text-xs text-destructive">
              <Info className="h-3 w-3 shrink-0" />
              {errors.cogs}
            </p>
          ) : null}
          {cogsExceedsRevenue && !errors.cogs ? (
            <p className="flex items-center gap-1.5 text-xs text-destructive">
              <Info className="h-3 w-3 shrink-0" />
              Annual COGS cannot be higher than annual revenue for this calculation.
            </p>
          ) : null}
        </div>

        <div className="space-y-2.5">
          <div className="flex flex-col gap-2 xs:flex-row xs:items-center xs:justify-between">
            <Label htmlFor="sector" className="text-sm font-semibold text-foreground">
              Step 3: Sector
            </Label>
            {selectedSectorLabel ? (
              <p className="w-fit rounded-md border border-primary/10 bg-highlight-soft px-2.5 py-1 text-xs font-semibold text-primary">
                {selectedSectorLabel}
              </p>
            ) : null}
          </div>
          <div ref={sectorMenuRef} className="relative">
            <button
              id="sector"
              type="button"
              aria-expanded={sectorMenuOpen}
              aria-haspopup="listbox"
              onClick={() => setSectorMenuOpen((open) => !open)}
              className={`touch-target flex h-12 w-full items-center justify-between rounded-xl border bg-surface px-4 text-left text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                errors.sector && touched.sector
                  ? "border-destructive/40 ring-1 ring-destructive/10"
                  : "border-border hover:border-primary/40"
              }`}
            >
              <span className={sector ? "text-foreground" : "text-muted-foreground"}>
                {selectedSectorLabel ?? "Select your sector"}
              </span>
              <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground/80" />
            </button>
            {sectorMenuOpen ? (
              <div
                role="listbox"
                aria-labelledby="sector"
                className="mt-2 rounded-xl border border-border bg-card p-1 shadow-premium"
              >
                <div className="max-h-72 overflow-y-auto pr-1">
                  {SECTOR_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setSector(option.value);
                        setTouched((current) => ({ ...current, sector: true }));
                        setErrors((current) => ({ ...current, sector: "" }));
                        setSectorMenuOpen(false);
                      }}
                      className={`flex min-h-11 w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                        sector === option.value
                          ? "bg-primary/[0.08] text-primary"
                          : "text-foreground hover:bg-primary/[0.04]"
                      }`}
                    >
                      <span className="min-w-0">{option.label}</span>
                      {sector === option.value ? <Check className="h-4 w-4 shrink-0" /> : null}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          <p className="text-xs text-muted-foreground">Benchmark ranges remain specific to the sector you select.</p>
          {selectedBenchmark ? (
            <div className="rounded-lg border border-primary/15 bg-primary/5 px-3.5 py-2.5">
              <p className="text-xs leading-relaxed text-muted-foreground">
                <span className="font-semibold text-primary">Benchmark:</span> Anchor at{" "}
                {formatBenchmarkAnchor(selectedBenchmark.anchor)}. Typical range{" "}
                {formatBenchmarkRange(selectedBenchmark.bandLow, selectedBenchmark.bandHigh)}.
              </p>
            </div>
          ) : null}
          {errors.sector && touched.sector ? (
            <p className="flex items-center gap-1.5 text-xs text-destructive">
              <Info className="h-3 w-3 shrink-0" />
              {errors.sector}
            </p>
          ) : null}
        </div>

        <div className="pt-1">
          <Button
            type="submit"
            size="lg"
            className="group min-h-12 h-auto w-full rounded-xl bg-primary px-5 py-3 text-center text-[0.95rem] font-semibold leading-snug text-primary-foreground whitespace-normal shadow-elevated transition-all duration-300 hover:bg-primary/90 hover:shadow-highlight sm:h-13 sm:px-6 sm:text-base sm:whitespace-nowrap"
          >
            <span className="min-w-0">Calculate revenue remaining after direct product costs</span>
            <ArrowRight className="hidden h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 xs:block" />
          </Button>
        </div>

        <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
          Benchmark-based estimate · No data is stored · This is not net profit
        </p>
      </form>
    </div>
  );
};
