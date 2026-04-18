import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Props {
  defaultType?: "Student Counselling" | "Parent Counselling" | "Personal Counselling" | "";
  heading?: string;
  subheading?: string;
}

const CounsellingCallbackForm = ({
  defaultType = "",
  heading = "Request a Counselling Callback",
  subheading = "Share your concern and our expert will call you back shortly.",
}: Props) => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<{
    name: string;
    phone: string;
    classAge: string;
    concern: string;
    type: string;
  }>({
    name: "",
    phone: "",
    classAge: "",
    concern: "",
    type: defaultType,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!form.name.trim() || form.name.trim().length < 2) newErrors.name = "Please enter your name";
    const cleanedPhone = form.phone.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(cleanedPhone)) newErrors.phone = "Enter a valid 10-digit phone number";
    if (!form.type) newErrors.type = "Please select a counselling type";
    if (!form.concern.trim()) newErrors.concern = "Please share your concern";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      const message = form.classAge.trim()
        ? `Class/Age: ${form.classAge.trim()}\n\n${form.concern.trim()}`
        : form.concern.trim();
      const { error } = await supabase.from("contact_messages").insert({
        name: form.name.trim(),
        email: null,
        phone: cleanedPhone,
        inquiry_type: `Counselling - ${form.type}`,
        subject: `Counselling Request: ${form.type}`,
        message,
      });
      if (error) throw error;
      setSubmitted(true);
      toast({ title: "Request received", description: "Our counsellor will call you shortly." });
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl border border-border bg-card p-8 text-center space-y-3"
      >
        <CheckCircle2 className="w-12 h-12 text-primary mx-auto" />
        <h3 className="font-bold text-xl text-foreground">Request Received</h3>
        <p className="text-muted-foreground">
          Thank you. Our counsellor will reach out to you within 24 hours.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 md:p-8 space-y-4">
      <div className="text-center mb-2">
        <h3 className="font-heading font-bold text-xl md:text-2xl text-foreground">{heading}</h3>
        <p className="text-muted-foreground text-sm mt-1">{subheading}</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="cb-name">Name *</Label>
          <Input
            id="cb-name"
            placeholder="Your full name"
            value={form.name}
            onChange={(e) => {
              setForm({ ...form, name: e.target.value });
              setErrors({ ...errors, name: "" });
            }}
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <Label htmlFor="cb-phone">Phone Number *</Label>
          <Input
            id="cb-phone"
            type="tel"
            inputMode="numeric"
            placeholder="10-digit mobile number"
            maxLength={10}
            value={form.phone}
            onChange={(e) => {
              setForm({ ...form, phone: e.target.value.replace(/\D/g, "") });
              setErrors({ ...errors, phone: "" });
            }}
            className={errors.phone ? "border-destructive" : ""}
          />
          {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone}</p>}
        </div>

        <div>
          <Label htmlFor="cb-classage">Class / Age (if applicable)</Label>
          <Input
            id="cb-classage"
            placeholder="e.g. Class 10, Age 16, Working professional"
            value={form.classAge}
            onChange={(e) => setForm({ ...form, classAge: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="cb-type">Counselling Type *</Label>
          <Select
            value={form.type}
            onValueChange={(v) => {
              setForm({ ...form, type: v });
              setErrors({ ...errors, type: "" });
            }}
          >
            <SelectTrigger id="cb-type" className={errors.type ? "border-destructive" : ""}>
              <SelectValue placeholder="Select counselling type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Student Counselling">Student Counselling</SelectItem>
              <SelectItem value="Parent Counselling">Parent Counselling</SelectItem>
              <SelectItem value="Personal Counselling">Personal Counselling</SelectItem>
              <SelectItem value="Not Sure">Not sure — help me decide</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && <p className="text-destructive text-xs mt-1">{errors.type}</p>}
        </div>

        <div>
          <Label htmlFor="cb-concern">Your Concern *</Label>
          <Textarea
            id="cb-concern"
            placeholder="Briefly describe what you'd like guidance on"
            rows={4}
            value={form.concern}
            onChange={(e) => {
              setForm({ ...form, concern: e.target.value });
              setErrors({ ...errors, concern: "" });
            }}
            className={errors.concern ? "border-destructive" : ""}
          />
          {errors.concern && <p className="text-destructive text-xs mt-1">{errors.concern}</p>}
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full font-bold"
          style={{ background: "var(--cta-gradient)" }}
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Request Callback"} <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          Your information is private and confidential.
        </p>
      </form>
    </div>
  );
};

export default CounsellingCallbackForm;
