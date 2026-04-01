import { TrendingUp, Shield, Zap } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      {/* Subtle geometric pattern */}
      <div className="absolute inset-0 opacity-[0.12]">
        <div className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, hsl(var(--background)) 1px, transparent 1px),
              radial-gradient(circle at 75% 75%, hsl(var(--background)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.18),transparent_45%,rgba(0,0,0,0.12)_100%)]" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-28 sm:pb-36 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-black/10 px-4 py-1.5 text-sm font-medium mb-8">
          <Zap className="h-3.5 w-3.5" />
          Free gross margin benchmark estimate
        </div>

        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-800 leading-[1.1] tracking-tight mb-6">
          Estimate your
          <span className="block text-white mt-1">gross margin opportunity</span>
        </h1>

        <p className="text-base sm:text-lg text-primary-foreground/88 max-w-2xl mx-auto leading-relaxed mb-10">
          Enter a few inputs to see how your current gross margin compares with typical industry benchmark ranges.
        </p>

        <p className="text-sm sm:text-base text-primary-foreground/72 max-w-2xl mx-auto leading-relaxed mb-10 -mt-5">
          A quick, directional estimate for pricing, product mix, and direct-cost decisions.
        </p>

        <div className="flex flex-wrap justify-center gap-6 sm:gap-10 text-sm text-primary-foreground/80">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-white" />
            <span>No signup required</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-white" />
            <span>Based on industry benchmarks</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-white" />
            <span>Takes less than 60 seconds</span>
          </div>
        </div>
      </div>
    </section>
  );
};
