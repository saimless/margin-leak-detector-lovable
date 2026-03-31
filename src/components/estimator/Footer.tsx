export const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="text-center space-y-2">
          <p className="text-xs text-muted-foreground">
            This tool provides directional estimates only. Actual results depend on business-specific factors.
          </p>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Margin Improvement Estimator. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
