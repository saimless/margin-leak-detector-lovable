import { Shield, TrendingUp, Zap } from "lucide-react";
import saimlessLogo from "@/assets/saimless-logo.png";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-hero">
      {/* Subtle geometric pattern overlay */}
      <div className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Soft gradient overlays for depth */}
      <div className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, rgba(0,0,0,0.08) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)",
        }}
      />

      {/* Navigation bar */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-6">
        <div className="flex items-center justify-between">
          <a href="https://www.saimless.com" target="_blank" rel="noreferrer" className="flex items-center gap-3 group">
            <img src={saimlessLogo} alt="SAImless" className="h-12 w-12 object-contain rounded-full bg-primary-foreground/10 p-0.5" />
            <span className="text-[17px] font-bold tracking-tight text-hero-foreground">
              S<span className="opacity-90">AI</span>mless
            </span>
          </a>
          <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-hero-foreground/70">
            <div className="w-1.5 h-1.5 rounded-full bg-hero-foreground/80 animate-pulse" />
            Free tool — no signup required
          </div>
        </div>
      </div>

      {/* Hero content */}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-28 sm:pb-36 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-hero-foreground/20 bg-hero-foreground/10 px-4 py-1.5 text-xs font-semibold text-hero-foreground mb-8 backdrop-blur-sm">
          <TrendingUp className="h-3 w-3" />
          Gross Margin Benchmark Estimator
        </div>

        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] font-800 leading-[1.08] tracking-tight mb-6 text-balance text-hero-foreground">
          Estimate your{" "}
          <span className="text-hero-foreground underline decoration-hero-foreground/30 decoration-2 underline-offset-4">
            gross margin opportunity
          </span>
        </h1>

        <p className="text-base sm:text-lg text-hero-foreground/85 max-w-xl mx-auto leading-relaxed mb-4">
          See how your current gross margin compares with industry benchmark ranges — in less than 60 seconds.
        </p>

        <p className="text-sm text-hero-foreground/60 max-w-lg mx-auto leading-relaxed mb-12">
          A quick, directional estimate for pricing, product mix, and direct-cost decisions.
        </p>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-[13px] text-hero-foreground/75">
          <div className="flex items-center gap-2">
            <Shield className="h-3.5 w-3.5" />
            <span>No signup required</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Industry benchmarks</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-3.5 w-3.5" />
            <span>Results in 60 seconds</span>
          </div>
        </div>
      </div>
    </section>
  );
};
