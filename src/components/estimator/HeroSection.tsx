import { TrendingUp, Shield, Zap } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-foreground text-primary-foreground">
      {/* Subtle geometric pattern */}
      <div className="absolute inset-0 opacity-[0.04]">
        <div className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, hsl(var(--primary)) 1px, transparent 1px),
              radial-gradient(circle at 75% 75%, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-28 sm:pb-36 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-sm font-medium mb-8">
          <Zap className="h-3.5 w-3.5" />
          Free benchmark estimator
        </div>

        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-800 leading-[1.1] tracking-tight mb-6">
          How much margin are you
          <span className="block text-primary mt-1">leaving on the table?</span>
        </h1>

        <p className="text-base sm:text-lg text-primary-foreground/70 max-w-2xl mx-auto leading-relaxed mb-10">
          Get a benchmark-based estimate of your annual margin improvement potential in under 60 seconds. No signup required.
        </p>

        <div className="flex flex-wrap justify-center gap-6 sm:gap-10 text-sm text-primary-foreground/50">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary/80" />
            <span>No data stored</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary/80" />
            <span>Industry benchmarks</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary/80" />
            <span>Instant results</span>
          </div>
        </div>
      </div>
    </section>
  );
};
