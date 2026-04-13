import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, ArrowRight } from "lucide-react";
import { trackCTAClick } from "@/lib/analytics";

interface DemoBookingFormProps {
  source?: string;
  ctaLabel?: string;
  onSubmitSuccess?: () => void;
}

const CLASS_OPTIONS = [
  "KG", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5",
  "Class 6", "Class 7", "Class 8", "Class 9", "Class 10",
  "Class 11", "Class 12",
];

const DemoBookingForm = ({
  source = "unknown",
  ctaLabel = "Get Free Demo Now",
  onSubmitSuccess,
}: DemoBookingFormProps) => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    classLevel: "",
    subject: "",
    area: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = "Name is required";
    if (!form.phone.trim() || !/^[6-9]\d{9}$/.test(form.phone.replace(/\D/g, "")))
      e.phone = "Valid 10-digit phone required";
    if (!form.classLevel) e.classLevel = "Select a class";
    return e;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    trackCTAClick("demo_form_submit", source);
    setSubmitted(true);
    onSubmitSuccess?.();
  };

  const update = (key: string, val: string) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
        <h3 className="font-heading font-bold text-xl text-foreground mb-2">Thank You!</h3>
        <p className="text-muted-foreground">
          We will contact you within 24 hours to schedule your free demo.
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <Label htmlFor={`${source}-name`}>Name *</Label>
        <Input
          id={`${source}-name`}
          placeholder="Your name"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          maxLength={100}
          className={errors.name ? "border-destructive" : ""}
        />
        {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
      </div>
      <div>
        <Label htmlFor={`${source}-phone`}>Phone *</Label>
        <Input
          id={`${source}-phone`}
          type="tel"
          placeholder="10-digit mobile number"
          maxLength={10}
          value={form.phone}
          onChange={(e) => update("phone", e.target.value.replace(/\D/g, ""))}
          className={errors.phone ? "border-destructive" : ""}
        />
        {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone}</p>}
      </div>
      <div>
        <Label htmlFor={`${source}-class`}>Class *</Label>
        <Select value={form.classLevel} onValueChange={(v) => update("classLevel", v)}>
          <SelectTrigger className={errors.classLevel ? "border-destructive" : ""}>
            <SelectValue placeholder="Select class" />
          </SelectTrigger>
          <SelectContent>
            {CLASS_OPTIONS.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.classLevel && <p className="text-destructive text-xs mt-1">{errors.classLevel}</p>}
      </div>
      <div>
        <Label htmlFor={`${source}-subject`}>Subject (optional)</Label>
        <Input
          id={`${source}-subject`}
          placeholder="e.g. Maths, Science"
          value={form.subject}
          onChange={(e) => update("subject", e.target.value)}
          maxLength={100}
        />
      </div>
      <div>
        <Label htmlFor={`${source}-area`}>Area / Pincode</Label>
        <Input
          id={`${source}-area`}
          placeholder="e.g. Rohini, 110085"
          value={form.area}
          onChange={(e) => update("area", e.target.value)}
          maxLength={100}
        />
      </div>
      <Button type="submit" variant="cta" className="w-full h-12 text-base font-bold">
        {ctaLabel} <ArrowRight className="w-4 h-4 ml-1" />
      </Button>
      <p className="text-xs text-muted-foreground text-center">⚡ Takes less than 30 seconds</p>
    </form>
  );
};

export default DemoBookingForm;
