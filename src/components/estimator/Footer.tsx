import saimlessLogo from "@/assets/saimless-logo.png";

export const Footer = () => {
  return (
    <footer className="border-t border-border/60 bg-secondary/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <img src={saimlessLogo} alt="SAImless" className="h-5 w-5 object-contain opacity-60" />
            <span className="text-xs font-medium text-muted-foreground">SAImless</span>
          </div>
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
