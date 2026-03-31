import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Info } from "lucide-react";

const SECTORS = [
  "Retail & E-commerce",
  "Manufacturing & Industry",
  "Services",
  "Software / SaaS",
];

interface EstimatorFormProps {
  onCalculate: (revenue: number, sector: string, margin: number) => void;
}

export const EstimatorForm = ({ onCalculate }: EstimatorFormProps) => {
  const [revenue, setRevenue] = useState("");
  const [sector, setSector] = useState("");
  const [margin, setMargin] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatRevenue = (val: string) => {
    const num = val.replace(/[^\d]/g, "");
    if (!num) return "";
    return new Intl.NumberFormat("de-DE").format(Number(num));
  };

  const parseRevenue = (val: string) => Number(val.replace(/[^\d]/g, ""));

  const validate = () => {
    const errs: Record<string, string> = {};
    const rev = parseRevenue(revenue);
    if (!rev || rev < 100000) errs.revenue = "Please enter annual revenue (min. €100,000)";
    if (!sector) errs.sector = "Please select your sector";
    const m = parseFloat(margin);
    if (isNaN(m) || m < 0 || m > 100) errs.margin = "Enter a valid margin (0–100%)";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onCalculate(parseRevenue(revenue), sector, parseFloat(margin));
    }
  };

  return (
    <div className="bg-card rounded-2xl shadow-card border border-border/60 overflow-hidden">
      <div className="px-6 sm:px-10 pt-8 sm:pt-10 pb-2">
        <h2 className="font-display text-xl sm:text-2xl font-700 text-foreground mb-1">
          Estimate your margin potential
        </h2>
        <p className="text-sm text-muted-foreground">
          Three inputs. One estimate. Zero commitment.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="px-6 sm:px-10 py-6 sm:py-8 space-y-6">
        {/* Revenue */}
        <div className="space-y-2">
          <Label htmlFor="revenue" className="text-sm font-medium text-foreground">
            Annual revenue
          </Label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">€</span>
            <Input
              id="revenue"
              type="text"
              inputMode="numeric"
              value={revenue}
              onChange={(e) => setRevenue(formatRevenue(e.target.value))}
              placeholder="e.g. 5,000,000"
              className={`pl-8 h-12 text-base bg-surface border-border focus:border-primary focus:ring-primary/20 ${errors.revenue ? "border-destructive" : ""}`}
            />
          </div>
          {errors.revenue && <p className="text-xs text-destructive flex items-center gap-1"><Info className="h-3 w-3" />{errors.revenue}</p>}
        </div>

        {/* Sector */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Sector</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SECTORS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => { setSector(s); setErrors((e) => ({ ...e, sector: "" })); }}
                className={`px-4 py-3 rounded-lg border text-sm font-medium text-left transition-all duration-150
                  ${sector === s
                    ? "border-primary bg-highlight-soft text-primary ring-1 ring-primary/20"
                    : "border-border bg-surface text-foreground hover:border-primary/40 hover:bg-highlight-soft/50"
                  } ${errors.sector ? "border-destructive/50" : ""}`}
              >
                {s}
              </button>
            ))}
          </div>
          {errors.sector && <p className="text-xs text-destructive flex items-center gap-1"><Info className="h-3 w-3" />{errors.sector}</p>}
        </div>

        {/* Margin */}
        <div className="space-y-2">
          <Label htmlFor="margin" className="text-sm font-medium text-foreground">
            Current net profit margin
          </Label>
          <div className="relative">
            <Input
              id="margin"
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={margin}
              onChange={(e) => setMargin(e.target.value)}
              placeholder="e.g. 8"
              className={`pr-8 h-12 text-base bg-surface border-border focus:border-primary focus:ring-primary/20 ${errors.margin ? "border-destructive" : ""}`}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">%</span>
          </div>
          {errors.margin && <p className="text-xs text-destructive flex items-center gap-1"><Info className="h-3 w-3" />{errors.margin}</p>}
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full h-13 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90 shadow-elevated hover:shadow-highlight transition-all duration-200"
        >
          Calculate my estimate
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>

        <p className="text-xs text-center text-muted-foreground pt-1">
          Your data is not stored or shared. This is a directional estimate only.
        </p>
      </form>
    </div>
  );
};
