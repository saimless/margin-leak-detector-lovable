import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeroSection } from "@/components/estimator/HeroSection";
import { EstimatorForm } from "@/components/estimator/EstimatorForm";
import { ResultSection } from "@/components/estimator/ResultSection";
import { Footer } from "@/components/estimator/Footer";
import {
  calculateBenchmarkComparison,
  calculateRevenueAfterDirectCostsMetrics,
  formatBenchmarkAnchor,
  formatBenchmarkRange,
  getSectorBenchmark,
  getSectorLabel,
  type BenchmarkBandPositionLabel,
  type ComparisonState,
  type PerformanceState,
  type Sector,
} from "@/lib/estimator";

export interface UpsideEstimateResult {
  title: string;
  targetLabel: string;
  targetPercentage: number;
  additionalRevenueRemaining: number;
  summary: string;
}

export interface EstimatorResult {
  annualRevenue: number;
  annualCogs: number;
  sectorKey: Sector;
  sector: string;
  revenueAfterDirectCosts: number;
  percentageRemaining: number;
  benchmarkAnchor: string;
  benchmarkRange: string;
  benchmarkLower: number;
  benchmarkMid: number;
  benchmarkUpper: number;
  comparisonState: ComparisonState;
  performanceState: PerformanceState;
  benchmarkBandPositionLabel: BenchmarkBandPositionLabel;
  benchmarkBandPositionRaw: number;
  benchmarkBandPositionClamped: number;
  percentagePointGapToBandLow: number;
  percentagePointGapToBandMid: number;
  percentagePointGapToBandHigh: number;
  upsideEstimate: UpsideEstimateResult;
}

const Index = () => {
  const [result, setResult] = useState<EstimatorResult | null>(null);

  const handleCalculate = (annualRevenue: number, annualCogs: number, sector: Sector) => {
    const sectorBenchmark = getSectorBenchmark(sector);
    const metrics = calculateRevenueAfterDirectCostsMetrics(annualRevenue, annualCogs);
    const comparison = calculateBenchmarkComparison({
      annualRevenue,
      percentageRemaining: metrics.percentageRemaining,
      sectorBenchmark,
    });

    setResult({
      annualRevenue,
      annualCogs,
      sectorKey: sector,
      sector: getSectorLabel(sector),
      revenueAfterDirectCosts: metrics.revenueAfterDirectCosts,
      percentageRemaining: metrics.percentageRemaining,
      benchmarkAnchor: formatBenchmarkAnchor(comparison.benchmarkSummary.anchor),
      benchmarkRange: formatBenchmarkRange(
        comparison.benchmarkSummary.bandLow,
        comparison.benchmarkSummary.bandHigh,
      ),
      benchmarkLower: comparison.benchmarkLower,
      benchmarkMid: comparison.benchmarkMid,
      benchmarkUpper: comparison.benchmarkUpper,
      comparisonState: comparison.comparisonState,
      performanceState: comparison.performanceState,
      benchmarkBandPositionLabel: comparison.benchmarkBandPosition.label,
      benchmarkBandPositionRaw: comparison.benchmarkBandPosition.rawPosition,
      benchmarkBandPositionClamped: comparison.benchmarkBandPosition.clampedPosition,
      percentagePointGapToBandLow: comparison.percentagePointGapToBandLow,
      percentagePointGapToBandMid: comparison.percentagePointGapToBandMid,
      percentagePointGapToBandHigh: comparison.percentagePointGapToBandHigh,
      upsideEstimate: comparison.upsideEstimate,
    });
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
                <ResultSection result={result} onReset={() => setResult(null)} />
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
