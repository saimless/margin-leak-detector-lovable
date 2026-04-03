import { Calculator, Shield, TrendingUp, Zap } from "lucide-react";
import saimlessLogo from "@/assets/saimless-logo.png";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-hero">
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, rgba(0,0,0,0.08) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)",
        }}
      />

      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-primary/20 to-transparent sm:h-28" />

      <div className="page-shell relative pt-4 xs:pt-5 sm:pt-6">
        <div className="flex flex-wrap items-center justify-between gap-3 xs:gap-4">
          <a
            href="https://www.saimless.com"
            target="_blank"
            rel="noreferrer"
            className="group flex min-w-0 items-center gap-2.5 xs:gap-3"
          >
            <img
              src={saimlessLogo}
              alt="SAImless"
              className="h-10 w-10 shrink-0 rounded-full bg-primary-foreground/10 object-contain p-0.5 xs:h-11 xs:w-11 sm:h-12 sm:w-12"
            />
            <span className="font-brand truncate text-base font-bold tracking-tight text-hero-foreground xs:text-[17px]">
              S<span className="opacity-90">AI</span>mless
            </span>
          </a>
          <div className="flex items-center gap-2 rounded-full border border-hero-foreground/15 bg-hero-foreground/10 px-3 py-1.5 text-[11px] font-medium text-hero-foreground/75 backdrop-blur-sm xs:text-xs">
            <div className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-hero-foreground/80" />
            <span className="whitespace-nowrap">Free tool · no signup required</span>
          </div>
        </div>
      </div>

      <div className="page-shell relative pb-24 pt-8 text-center xs:pb-28 xs:pt-10 sm:pb-32 sm:pt-14 lg:pb-36">
        <div className="mx-auto flex max-w-4xl flex-col items-center">
          <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-hero-foreground/20 bg-hero-foreground/10 px-3 py-1.5 text-[11px] font-semibold text-hero-foreground backdrop-blur-sm xs:px-4 xs:text-xs sm:mb-8">
            <Calculator className="h-3 w-3" />
            Percentage of revenue remaining after direct product costs
          </div>

          <h1 className="font-display text-[2rem] font-800 leading-[1.02] tracking-tight text-balance text-hero-foreground xs:text-[2.35rem] sm:text-4xl md:text-5xl lg:text-[3.4rem]">
            Understand how much revenue remains after direct product costs
          </h1>

          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-hero-foreground/85 xs:text-base sm:mt-6 sm:text-lg">
            We calculate how much of your annual revenue remains after subtracting the direct costs of delivering your
            product or service.
          </p>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-hero-foreground/65 sm:mt-4">
            Compare your result with similar companies in your sector to see whether your pricing and direct cost
            structure look typical, stretched, or especially strong.
          </p>

          <div className="mt-8 grid w-full max-w-3xl gap-3 text-left text-[13px] text-hero-foreground/80 xs:grid-cols-2 sm:mt-10 sm:grid-cols-3 sm:gap-4">
            <div className="flex min-h-12 items-center gap-2.5 rounded-2xl border border-hero-foreground/12 bg-hero-foreground/10 px-4 py-3 backdrop-blur-sm">
              <Shield className="h-3.5 w-3.5 shrink-0" />
              <span>Not net profit</span>
            </div>
            <div className="flex min-h-12 items-center gap-2.5 rounded-2xl border border-hero-foreground/12 bg-hero-foreground/10 px-4 py-3 backdrop-blur-sm">
              <TrendingUp className="h-3.5 w-3.5 shrink-0" />
              <span>Sector benchmark comparison</span>
            </div>
            <div className="flex min-h-12 items-center gap-2.5 rounded-2xl border border-hero-foreground/12 bg-hero-foreground/10 px-4 py-3 backdrop-blur-sm xs:col-span-2 sm:col-span-1">
              <Zap className="h-3.5 w-3.5 shrink-0" />
              <span>Quick annual estimate</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
