import { Shield, TrendingUp, Zap } from "lucide-react";
import saimlessLogo from "@/assets/saimless-logo.png";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-hero text-hero-foreground">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--hero-foreground)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--hero-foreground)) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Gradient orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.06]"
        style={{
          background: 'radial-gradient(circle, hsl(207 90% 48%) 0%, transparent 70%)',
        }}
      />

      {/* Top bar with logo */}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src={saimlessLogo} alt="SAImless" className="h-8 w-8 object-contain" />
            <span className="text-sm font-semibold tracking-tight text-hero-foreground">
              SAImless
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-hero-muted">
            <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            Free tool — no signup required
          </div>
        </div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20 pb-28 sm:pb-36 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-hero-foreground/10 bg-hero-foreground/5 backdrop-blur-sm px-4 py-1.5 text-xs font-medium text-hero-muted mb-8">
          <TrendingUp className="h-3 w-3 text-primary" />
          Gross Margin Benchmark Estimator
        </div>

        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] font-800 leading-[1.08] tracking-tight mb-6 text-balance">
          Estimate your
          <br />
          <span className="bg-gradient-to-r from-primary to-[hsl(207,90%,62%)] bg-clip-text text-transparent">
            gross margin opportunity
          </span>
        </h1>

        <p className="text-base sm:text-lg text-hero-muted max-w-xl mx-auto leading-relaxed mb-4">
          See how your current gross margin compares with industry benchmark ranges — in less than 60 seconds.
        </p>

        <p className="text-sm text-hero-muted/70 max-w-lg mx-auto leading-relaxed mb-12">
          A quick, directional estimate for pricing, product mix, and direct-cost decisions.
        </p>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-[13px] text-hero-muted/80">
          <div className="flex items-center gap-2">
            <Shield className="h-3.5 w-3.5 text-primary/70" />
            <span>No signup required</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-3.5 w-3.5 text-primary/70" />
            <span>Industry benchmarks</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-primary/70" />
            <span>Results in 60 seconds</span>
          </div>
        </div>
      </div>
    </section>
  );
};
