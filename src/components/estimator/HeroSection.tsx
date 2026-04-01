import { Shield, TrendingUp, Zap } from "lucide-react";
import saimlessLogo from "@/assets/saimless-logo.png";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-hero">
      {/* Geometric triangular mesh pattern inspired by saimless.com */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="geo-pattern" x="0" y="0" width="120" height="104" patternUnits="userSpaceOnUse">
            <path d="M0 52 L60 0 L120 52 L60 104 Z" fill="none" stroke="hsl(0 0% 0%)" strokeWidth="0.5" />
            <path d="M0 0 L60 52 L0 104" fill="none" stroke="hsl(0 0% 0%)" strokeWidth="0.3" />
            <path d="M120 0 L60 52 L120 104" fill="none" stroke="hsl(0 0% 0%)" strokeWidth="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#geo-pattern)" />
      </svg>

      {/* Subtle blue radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full opacity-[0.04]"
        style={{
          background: "radial-gradient(ellipse, hsl(207 100% 50%) 0%, transparent 70%)",
        }}
      />

      {/* Navigation bar */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-6">
        <div className="flex items-center justify-between">
          <a href="https://www.saimless.com" target="_blank" rel="noreferrer" className="flex items-center gap-2.5 group">
            <img src={saimlessLogo} alt="SAImless" className="h-10 w-10 object-contain" />
            <span className="text-[15px] font-bold tracking-tight text-foreground">
              S<span className="text-primary">AI</span>mless
            </span>
          </a>
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <div className="w-1.5 h-1.5 rounded-full bg-success" />
            Free tool — no signup required
          </div>
        </div>
      </div>

      {/* Hero content */}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-28 sm:pb-36 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary mb-8">
          <TrendingUp className="h-3 w-3" />
          Gross Margin Benchmark Estimator
        </div>

        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] font-800 leading-[1.08] tracking-tight mb-6 text-balance text-foreground">
          Estimate your{" "}
          <span className="text-primary">
            gross margin opportunity
          </span>
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed mb-4">
          See how your current gross margin compares with industry benchmark ranges — in less than 60 seconds.
        </p>

        <p className="text-sm text-muted-foreground/70 max-w-lg mx-auto leading-relaxed mb-12">
          A quick, directional estimate for pricing, product mix, and direct-cost decisions.
        </p>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-[13px] text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="h-3.5 w-3.5 text-primary" />
            <span>No signup required</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
            <span>Industry benchmarks</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-primary" />
            <span>Results in 60 seconds</span>
          </div>
        </div>
      </div>
    </section>
  );
};
