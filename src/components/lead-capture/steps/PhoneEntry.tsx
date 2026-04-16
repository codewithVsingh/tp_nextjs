import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Users, Star } from "lucide-react";
import type { StepProps } from "../types";

const TRUST = [
  { icon: Users, text: "5,000+ Students" },
  { icon: Shield, text: "Verified Tutors" },
  { icon: Star, text: "Free Demo" },
];

const PhoneEntry = ({ data, onChange }: StepProps) => (
  <div className="space-y-5">
    <div>
      <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-1">
        Get Your Free Demo Class
      </h2>
      <p className="text-muted-foreground text-sm">Enter your phone number to get started</p>
    </div>

    <div className="flex flex-wrap gap-2">
      {TRUST.map((t, i) => (
        <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
          <t.icon className="w-3 h-3" /> {t.text}
        </span>
      ))}
    </div>

    <div>
      <Label htmlFor="lead-name">Full Name (optional)</Label>
      <Input
        id="lead-name"
        placeholder="Your name"
        value={data.name}
        onChange={(e) => onChange({ name: e.target.value })}
        maxLength={100}
        className="mt-1"
      />
    </div>

    <div>
      <Label htmlFor="lead-phone">Phone Number *</Label>
      <div className="relative mt-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">+91</span>
        <Input
          id="lead-phone"
          type="tel"
          placeholder="10-digit mobile number"
          maxLength={10}
          value={data.phone}
          onChange={(e) => onChange({ phone: e.target.value.replace(/\D/g, "") })}
          className="pl-12"
        />
      </div>
      {data.phone.length > 0 && data.phone.length < 10 && (
        <p className="text-xs text-destructive mt-1">Enter a valid 10-digit number</p>
      )}
    </div>

    <p className="text-xs text-muted-foreground text-center">
      🔒 Your number is secure & will not be shared.
    </p>
  </div>
);

export default PhoneEntry;
