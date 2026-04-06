import saimlessLogo from "@/assets/saimless-logo.png";

export const Footer = () => {
  return (
    <footer className="border-t border-border/40 bg-card/50">
      <div className="content-shell py-10 sm:py-12">
        <div className="flex flex-col items-center gap-5 text-center">
          <a
            href="https://www.saimless.com"
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-2.5 transition-opacity duration-200 hover:opacity-80"
          >
            <img
              src={saimlessLogo}
              alt="SAImless"
              className="h-8 w-8 object-contain opacity-80 transition-opacity duration-200 group-hover:opacity-100"
            />
            <span className="font-brand text-sm font-bold text-foreground/80 transition-colors duration-200 group-hover:text-foreground">
              S<span className="text-primary">AI</span>mless
            </span>
          </a>
          <div className="max-w-xl space-y-2">
            <p className="text-xs leading-relaxed text-muted-foreground">
              SAImless helps you understand how margins change by connecting predicted sales volumes with your cost
              data and turning them into clear, practical business insights.
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground/70">
              This tool provides directional estimates based on benchmark data. The wider platform uses advanced
              modeling and company data to support deeper pricing, cost, and planning decisions.
            </p>
            <p className="text-[11px] text-muted-foreground/40 pt-1">
              © {new Date().getFullYear()} SAImless. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
