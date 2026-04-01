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
      <div className="bg-card rounded-2xl shadow-premium border border-border/50 px-6 sm:px-10 py-12 text-center">
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
    <div className="bg-card rounded-2xl shadow-premium border border-border/50 overflow-hidden">
      <div className="px-6 sm:px-10 pt-8 pb-4">
        <div className="flex items-center gap-2 text-xs font-medium text-primary mb-3">
          <div className="w-5 h-[2px] bg-primary rounded-full" />
          PERSONALIZED REPORT
        </div>
        <h3 className="font-display text-lg sm:text-xl font-700 text-foreground mb-1.5">
          Receive your personalized breakdown
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          We'll send a short, tailored analysis based on your inputs — completely free.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="px-6 sm:px-10 py-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-sm font-semibold">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              className="h-11 bg-surface border-border/80 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/10"
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
              className="h-11 bg-surface border-border/80 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/10"
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
            className="h-11 bg-surface border-border/80 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>

        <div className="pt-1">
          <Button
            type="submit"
            size="lg"
            className="w-full h-12 text-base font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-elevated hover:shadow-highlight transition-all duration-300 group"
          >
            <Send className="h-4 w-4 mr-2 transition-transform group-hover:-translate-y-0.5" />
            Send my breakdown
          </Button>
        </div>

        <p className="text-[11px] text-center text-muted-foreground/70 leading-relaxed">
          No spam · No sales calls · One-time analysis based on your estimate
        </p>
      </form>
    </div>
  );
};
