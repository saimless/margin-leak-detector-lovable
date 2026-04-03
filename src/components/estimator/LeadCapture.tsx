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
      <div className="card-shell px-5 py-10 text-center sm:px-8 sm:py-12">
        <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
          <CheckCircle2 className="h-6 w-6 text-success" />
        </div>
        <h3 className="font-display text-lg font-bold text-foreground">Thank you, {name}.</h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          We'll send your personalized breakdown to <strong className="text-foreground">{email}</strong> shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="card-shell">
      <div className="card-section pb-0 pt-7 sm:pt-8">
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-primary">
          Personalized Report
        </p>
        <h3 className="font-display text-lg font-bold text-foreground sm:text-xl">
          Receive your personalized breakdown
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          We'll send a short, tailored analysis based on your inputs — completely free.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card-section space-y-4 py-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-[13px] font-semibold">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              className="touch-target h-11 rounded-lg border-border bg-background text-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-[13px] font-semibold">Work email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              className="touch-target h-11 rounded-lg border-border bg-background text-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="company" className="text-[13px] font-semibold">
            Company <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Company name"
            className="touch-target h-11 rounded-lg border-border bg-background text-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </div>

        <div className="pt-1">
          <Button
            type="submit"
            size="lg"
            className="group h-11 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary/90 sm:h-12 sm:text-[15px]"
          >
            <Send className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
            Send my breakdown
          </Button>
        </div>

        <p className="text-center text-[11px] text-muted-foreground/70">
          No spam · No sales calls · One-time analysis based on your estimate
        </p>
      </form>
    </div>
  );
};
