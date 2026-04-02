import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Send } from "lucide-react";
import type { EstimatorResult } from "@/pages/Index";

interface LeadCaptureProps {
  result: EstimatorResult;
}

export const LeadCapture = ({ result }: LeadCaptureProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      console.log("Lead captured:", { name, email, company, result });
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="card-shell px-4 py-10 text-center xs:px-5 sm:px-8 sm:py-12 lg:px-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-success/10 mb-5">
          <CheckCircle2 className="h-7 w-7 text-success" />
        </div>
        <h3 className="font-display text-xl font-700 text-foreground mb-2">Thank you, {name}.</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          We'll send your personalized gross margin breakdown to <strong className="text-foreground">{email}</strong> shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="card-shell">
      <div className="card-header-accent" />
      <div className="card-section pb-4 pt-6 xs:pt-7 sm:pt-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-3">
          <div className="w-5 h-[2px] bg-primary rounded-full" />
          Personalized Report
        </div>
        <h3 className="font-display text-lg sm:text-xl font-700 text-foreground mb-1.5">
          Receive your personalized breakdown
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          We'll send a short, tailored analysis based on your inputs — completely free.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card-section space-y-4 py-5 xs:py-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-sm font-semibold">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              className="touch-target h-11 rounded-xl border-border bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-semibold">Work email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              className="touch-target h-11 rounded-xl border-border bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="company" className="text-sm font-semibold">
            Company <span className="text-muted-foreground font-normal">(optional)</span>
          </Label>
          <Input
            id="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Company name"
            className="touch-target h-11 rounded-xl border-border bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="pt-1">
          <Button
            type="submit"
            size="lg"
            className="group h-12 w-full rounded-xl bg-primary text-base font-semibold text-primary-foreground shadow-elevated transition-all duration-300 hover:bg-primary/90 hover:shadow-highlight"
          >
            <Send className="h-4 w-4 mr-2 transition-transform group-hover:-translate-y-0.5" />
            Send my breakdown
          </Button>
        </div>

        <p className="text-[11px] text-center text-muted-foreground leading-relaxed">
          No spam · No sales calls · One-time analysis based on your estimate
        </p>
      </form>
    </div>
  );
};
