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
      // Client-side only — no backend
      console.log("Lead captured:", { name, email, company, result });
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="bg-card rounded-2xl shadow-card border border-border/60 px-6 sm:px-10 py-10 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-success/10 mb-5">
          <CheckCircle2 className="h-7 w-7 text-success" />
        </div>
        <h3 className="font-display text-xl font-700 text-foreground mb-2">Thank you, {name}.</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          We'll send your personalized margin improvement breakdown to <strong className="text-foreground">{email}</strong> shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl shadow-card border border-border/60 overflow-hidden">
      <div className="px-6 sm:px-10 pt-8 pb-2">
        <h3 className="font-display text-lg sm:text-xl font-700 text-foreground mb-1">
          Receive your personalized breakdown
        </h3>
        <p className="text-sm text-muted-foreground">
          We'll send a short, tailored analysis based on your inputs — completely free.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="px-6 sm:px-10 py-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-sm font-medium">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              className="h-11 bg-surface border-border"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-medium">Work email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              className="h-11 bg-surface border-border"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="company" className="text-sm font-medium">Company <span className="text-muted-foreground">(optional)</span></Label>
          <Input
            id="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Company name"
            className="h-11 bg-surface border-border"
          />
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full h-12 text-base font-semibold rounded-xl bg-foreground text-background hover:bg-foreground/90 transition-all duration-200"
        >
          <Send className="h-4 w-4 mr-2" />
          Send my breakdown
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          No spam. No sales calls. Just a one-time analysis based on your estimate.
        </p>
      </form>
    </div>
  );
};
