import saimlessLogo from "@/assets/saimless-logo.png";

export const Footer = () => {
  return (
    <footer className="border-t border-border/60 bg-secondary/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col items-center gap-4">
          <a href="https://www.saimless.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 group">
            <img src={saimlessLogo} alt="SAImless" className="h-6 w-6 object-contain opacity-70 group-hover:opacity-100 transition-opacity" />
            <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
              S<span className="text-primary">AI</span>mless
            </span>
          </a>
          <div className="text-center space-y-1.5">
            <p className="text-xs text-muted-foreground/70 max-w-md leading-relaxed">
              This tool provides directional estimates based on benchmark data. Actual results depend on your business
              model, execution, and market conditions.
            </p>
            <p className="text-xs text-muted-foreground/50">
              © {new Date().getFullYear()} SAImless. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
