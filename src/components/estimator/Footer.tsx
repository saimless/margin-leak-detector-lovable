import saimlessLogo from "@/assets/saimless-logo.png";

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="content-shell py-8 sm:py-10">
        <div className="flex flex-col items-center gap-4 text-center">
          <a href="https://www.saimless.com" target="_blank" rel="noreferrer" className="group flex items-center gap-2.5">
            <img src={saimlessLogo} alt="SAImless" className="h-8 w-8 object-contain opacity-80 transition-opacity group-hover:opacity-100" />
            <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors font-brand">
              S<span className="text-primary">AI</span>mless
            </span>
          </a>
          <div className="max-w-2xl space-y-1.5">
            <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
              This tool provides directional estimates based on benchmark data. Actual results depend on your business
              model, execution, and market conditions.
            </p>
            <p className="text-xs text-muted-foreground/70">
              © {new Date().getFullYear()} SAImless. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
