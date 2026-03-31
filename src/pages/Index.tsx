import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeroSection } from "@/components/estimator/HeroSection";
import { EstimatorForm } from "@/components/estimator/EstimatorForm";
import { ResultSection } from "@/components/estimator/ResultSection";
import { LeadCapture } from "@/components/estimator/LeadCapture";
import { Footer } from "@/components/estimator/Footer";

export interface EstimatorResult {
  min: number;
  max: number;
  revenue: number;
  sector: string;
  margin: number;
  sectorBenchmark: string;
}

const SECTOR_FACTORS: Record<string, number> = {
  "Retail & E-commerce": 1.25,
  "Manufacturing & Industry": 1.10,
  "Services": 0.95,
  "Software / SaaS": 0.80,
};

const SECTOR_BENCHMARKS: Record<string, string> = {
  "Retail & E-commerce": "Typical net margins in this broad category are often around 1%–9%, depending on the business model.",
  "Manufacturing & Industry": "Typical net margins in this broad category are often around 5%–10%, depending on complexity and product mix.",
  "Services": "Typical net margins in this broad category are often around 6%–16%, depending on utilization and pricing discipline.",
  "Software / SaaS": "Typical net margins in this broad category are often around 10%–30%, depending on scale and operating leverage.",
};

function getMarginFactor(margin: number): number {
  if (margin < 8) return 1.20;
  if (margin <= 15) return 1.00;
  return 0.85;
}

function roundToThousand(n: number): number {
  return Math.round(n / 1000) * 1000;
}

const Index = () => {
  const [result, setResult] = useState<EstimatorResult | null>(null);
  const [showLeadCapture, setShowLeadCapture] = useState(false);

  const handleCalculate = (revenue: number, sector: string, margin: number) => {
    const sectorFactor = SECTOR_FACTORS[sector];
    const marginFactor = getMarginFactor(margin);

    const min = roundToThousand(revenue * 0.03 * sectorFactor * marginFactor);
    const max = roundToThousand(revenue * 0.08 * sectorFactor * marginFactor);

    setResult({
      min,
      max,
      revenue,
      sector,
      margin,
      sectorBenchmark: SECTOR_BENCHMARKS[sector],
    });
  };

  const handleReset = () => {
    setResult(null);
    setShowLeadCapture(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-background pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-20 pb-16 sm:pb-24">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <EstimatorForm onCalculate={handleCalculate} />
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-8"
              >
                <ResultSection
                  result={result}
                  onReset={handleReset}
                  onGetReport={() => setShowLeadCapture(true)}
                />
                <AnimatePresence>
                  {showLeadCapture && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                    >
                      <LeadCapture result={result} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
