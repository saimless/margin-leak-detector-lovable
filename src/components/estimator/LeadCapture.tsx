import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Send, Mail } from "lucide-react";
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
      <div className="card-shell px-5 py-12 text-center sm:px-8 sm:py-14">
        <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
          <CheckCircle2 className="h-7 w-7 text-success" />
        </div>
        <h3 className="font-display text-lg font-bold text-foreground">Thank you, {name}.</h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          We'll send your personalized breakdown to <strong className="text-foreground">{email}</strong> shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="card-shell transition-shadow duration-200 hover:shadow-card">
      <div className="card-section pb-0 pt-8 sm:pt-10">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Mail className="h-4 w-4 text-primary" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Personalized Report
          </p>
        </div>
        <h3 className="font-display text-lg font-bold text-foreground sm:text-xl">
          Receive your personalized breakdown
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          We'll send a short, tailored analysis based on your inputs — completely free.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card-section space-y-5 py-7">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[13px] font-semibold">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              className="touch-target h-12 rounded-lg border-border/80 bg-background text-sm transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[13px] font-semibold">Work email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              className="touch-target h-12 rounded-lg border-border/80 bg-background text-sm transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="company" className="text-[13px] font-semibold">
            Company <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Company name"
            className="touch-target h-12 rounded-lg border-border/80 bg-background text-sm transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </div>

        <div className="pt-1">
          <Button
            type="submit"
            size="lg"
            className="group h-12 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90 hover:shadow-md sm:h-[52px] sm:text-[15px]"
          >
            <Send className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
            Send my breakdown
          </Button>
        </div>

        <p className="text-center text-[11px] text-muted-foreground/60">
          No spam · No sales calls · One-time analysis based on your estimate
        </p>
      </form>
    </div>
  );
};
