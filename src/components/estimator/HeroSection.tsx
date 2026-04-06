import saimlessLogo from "@/assets/saimless-logo.png";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-hero">
      {/* Geometric background pattern */}
      <div className="absolute inset-0 opacity-[0.04]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" className="text-hero-foreground" />
        </svg>
      </div>

      {/* Subtle gradient overlay for depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.02) 0%, transparent 30%, rgba(0,0,0,0.05) 100%)",
        }}
      />

      {/* Navigation bar */}
      <div className="page-shell relative pt-5 sm:pt-6">
        <div className="flex items-center justify-between">
          <a
            href="https://www.saimless.com"
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-3 transition-opacity duration-200 hover:opacity-90"
          >
            <img
              src={saimlessLogo}
              alt="SAImless"
              className="h-9 w-9 shrink-0 rounded-lg bg-primary-foreground/10 object-contain p-0.5 sm:h-10 sm:w-10"
            />
            <span className="font-brand text-[15px] font-bold tracking-tight text-hero-foreground sm:text-base">
              S<span className="opacity-90">AI</span>mless
            </span>
          </a>
          <div className="flex items-center gap-2 rounded-full border border-hero-foreground/10 bg-hero-foreground/[0.07] px-3.5 py-1.5 text-[11px] font-medium text-hero-foreground/70 backdrop-blur-sm xs:text-xs">
            <div className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-hero-foreground/60" />
            <span className="whitespace-nowrap">Free tool · no signup</span>
          </div>
        </div>
      </div>

      {/* Hero content */}
      <div className="page-shell relative pb-24 pt-10 text-center xs:pb-28 sm:pb-32 sm:pt-14">
        <div className="mx-auto flex max-w-3xl flex-col items-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-hero-foreground/15 bg-hero-foreground/[0.08] px-4 py-1.5 text-[11px] font-medium text-hero-foreground/80 backdrop-blur-sm xs:text-xs">
            <span>📊</span>
            <span>AI-Driven Margin Insights</span>
          </div>

          <h1 className="font-display text-[1.75rem] font-extrabold leading-[1.08] tracking-tight text-balance text-hero-foreground xs:text-[2rem] sm:text-[2.5rem] md:text-[2.75rem] lg:text-[3rem]">
            Understand how much revenue remains after direct costs
          </h1>

          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-hero-foreground/75 sm:mt-6 sm:text-base">
            Calculate how much of your annual revenue remains after subtracting direct product costs, and compare with sector benchmarks.
          </p>
        </div>
      </div>
    </section>
  );
};
