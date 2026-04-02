import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeroSection } from "@/components/estimator/HeroSection";
import { EstimatorForm } from "@/components/estimator/EstimatorForm";
import { ResultSection } from "@/components/estimator/ResultSection";
import { Footer } from "@/components/estimator/Footer";
import {
  calculateGrossMarginScenarios,
  calculateCogs,
  formatBenchmarkRange,
  formatBenchmarkAnchor,
  getSectorBenchmark,
  getMarginBenchmarkState,
  getSectorLabel,
  parseGrossMarginRange,
  calculateGrossProfit,
  type MarginBenchmarkState,
  type GrossMarginRange,
  type Sector,
} from "@/lib/estimator";

type ScenarioLabel = "conservative" | "midpoint" | "optimized";

export interface ScenarioResult {
  label: ScenarioLabel;
  targetMargin: number;
  grossProfitScenario: number;
  grossProfitImprovement: number;
}

export interface EstimatorResult {
  revenue: number;
  sector: string;
  grossMarginRange: GrossMarginRange;
  currentGrossMargin: number;
  grossProfitCurrent: number;
  estimatedCogs: number;
  benchmarkGrossMargin: string;
  benchmarkGrossMarginBand: string;
  benchmarkLower: number;
  benchmarkMid: number;
  benchmarkUpper: number;
  scenarios: ScenarioResult[];
  marginBenchmarkState: MarginBenchmarkState;
}

const Index = () => {
  const [result, setResult] = useState<EstimatorResult | null>(null);

  const handleCalculate = (revenue: number, sector: Sector, grossMarginRange: GrossMarginRange) => {
    const grossMarginBounds = parseGrossMarginRange(grossMarginRange);
    const currentGrossMargin = grossMarginBounds.midpoint;
    const sectorBenchmark = getSectorBenchmark(sector);
    const improvement = calculateGrossMarginScenarios({
      annualRevenue: revenue,
      currentGrossMargin,
      sectorBenchmark,
    });

    setResult({
      revenue,
      sector: getSectorLabel(sector),
      grossMarginRange,
      currentGrossMargin,
      grossProfitCurrent: calculateGrossProfit(revenue, currentGrossMargin),
      estimatedCogs: calculateCogs(revenue, currentGrossMargin),
      benchmarkGrossMargin: formatBenchmarkAnchor(improvement.benchmarkSummary.anchor),
      benchmarkGrossMarginBand: formatBenchmarkRange(
        improvement.benchmarkSummary.bandLow,
        improvement.benchmarkSummary.bandHigh,
      ),
      benchmarkLower: improvement.benchmarkLower,
      benchmarkMid: improvement.benchmarkMid,
      benchmarkUpper: improvement.benchmarkUpper,
      scenarios: improvement.scenarios,
      marginBenchmarkState: getMarginBenchmarkState({
        currentGrossMargin,
        sectorBenchmark,
      }),
    });
  };

  const handleReset = () => {
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />

      <main className="relative isolate">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-primary/8 via-background to-background" />
        <div className="content-shell relative -mt-14 pb-16 xs:-mt-16 xs:pb-20 sm:-mt-20 sm:pb-24 lg:pb-28">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <EstimatorForm onCalculate={handleCalculate} />
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="space-y-6"
              >
                <ResultSection
                  result={result}
                  onReset={handleReset}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
