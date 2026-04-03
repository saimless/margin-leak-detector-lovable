import saimlessLogo from "@/assets/saimless-logo.png";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-hero">
      {/* Subtle gradient overlay for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, rgba(0,0,0,0.03) 0%, transparent 40%, rgba(0,0,0,0.06) 100%)",
        }}
      />

      {/* Navigation bar */}
      <div className="page-shell relative pt-5 sm:pt-6">
        <div className="flex items-center justify-between">
          <a
            href="https://www.saimless.com"
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-3"
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
      <div className="page-shell relative pb-28 pt-12 text-center xs:pb-32 sm:pb-36 sm:pt-16">
        <div className="mx-auto flex max-w-3xl flex-col items-center">
          <h1 className="font-display text-[1.75rem] font-extrabold leading-[1.08] tracking-tight text-balance text-hero-foreground xs:text-[2rem] sm:text-[2.5rem] md:text-[2.75rem] lg:text-[3rem]">
            Understand how much revenue remains after direct costs
          </h1>

          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-hero-foreground/80 sm:mt-6 sm:text-base">
            Calculate how much of your annual revenue remains after subtracting direct product costs, and compare with sector benchmarks.
          </p>
        </div>
      </div>
    </section>
  );
};
