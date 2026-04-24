import { useState } from "react";
import { z } from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Loader2, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { trackEvent } from "@/modules/shared/logic/eventTrackingEngine";

const INQUIRY_TYPES = [
  { value: "general", label: "General Inquiry" },
  { value: "partnership", label: "Partnership" },
  { value: "tutor", label: "Become a Tutor" },
  { value: "feedback", label: "Feedback / Complaint" },
  { value: "support", label: "Support" },
];

const formatPhone = (raw: string) => {
  const d = raw.replace(/\D/g, "").slice(0, 10);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)} ${d.slice(5)}`;
};

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().refine(
    (p) => p === "" || /^[6-9]\d{9}$/.test(p),
    "Enter a valid 10-digit mobile number",
  ),
  inquiry_type: z.string().min(1, "Select an inquiry type"),
  subject: z.string().trim().min(3, "Subject is required").max(150),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000),
});

type FormState = z.infer<typeof contactSchema>;

interface ContactFormProps {
  sourcePage?: string;
  sourceCta?: string;
}

const ContactForm = ({ sourcePage, sourceCta }: ContactFormProps) => {
  const [form, setForm] = useState<FormState>({
    name: "", email: "", phone: "", inquiry_type: "", subject: "", message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      const errs: Partial<Record<keyof FormState, string>> = {};
      parsed.error.errors.forEach((err) => {
        const key = err.path[0] as keyof FormState;
        if (key) errs[key] = err.message;
      });
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("contact_messages").insert({
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        inquiry_type: parsed.data.inquiry_type,
        subject: parsed.data.subject,
        message: parsed.data.message,
        // @ts-ignore
        source_page: sourcePage || null,
        // @ts-ignore
        source_cta: sourceCta || null,
      });
      if (error) throw error;
      trackEvent("contact_submitted", { 
        inquiry_type: parsed.data.inquiry_type,
        source_page: sourcePage,
        source_cta: sourceCta 
      });
      setSubmitted(true);
      toast({ title: "Inquiry sent!", description: "We'll get back to you within 24 hours." });
    } catch (err) {
      console.error("Contact submit failed", err);
      toast({
        title: "Could not send",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-10"
      >
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="font-heading font-bold text-2xl text-foreground mb-2">Inquiry Sent!</h3>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
          Thanks for reaching out. Our team will get back to you within 24 hours.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setSubmitted(false);
            setForm({ name: "", email: "", phone: "", inquiry_type: "", subject: "", message: "" });
          }}
        >
          Send another inquiry
        </Button>
      </motion.div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      <div>
        <Label htmlFor="contact-name">Name *</Label>
        <Input
          id="contact-name"
          placeholder="Your full name"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          maxLength={100}
          className="mt-1"
        />
        {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
      </div>

      <div>
        <Label htmlFor="contact-email">Email *</Label>
        <Input
          id="contact-email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          maxLength={255}
          className="mt-1"
        />
        {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
      </div>

      <div>
        <Label htmlFor="contact-phone">Phone (optional)</Label>
        <div className="relative mt-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">+91</span>
          <Input
            id="contact-phone"
            type="tel"
            inputMode="numeric"
            placeholder="98765 43210"
            maxLength={11}
            value={formatPhone(form.phone)}
            onChange={(e) => update("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
            className="pl-12"
          />
        </div>
        {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone}</p>}
      </div>

      <div>
        <Label htmlFor="contact-type">I'm contacting for *</Label>
        <Select value={form.inquiry_type} onValueChange={(v) => update("inquiry_type", v)}>
          <SelectTrigger id="contact-type" className="mt-1">
            <SelectValue placeholder="Select inquiry type" />
          </SelectTrigger>
          <SelectContent>
            {INQUIRY_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.inquiry_type && <p className="text-destructive text-xs mt-1">{errors.inquiry_type}</p>}
      </div>

      <div>
        <Label htmlFor="contact-subject">Subject *</Label>
        <Input
          id="contact-subject"
          placeholder="Briefly, what's this about?"
          value={form.subject}
          onChange={(e) => update("subject", e.target.value)}
          maxLength={150}
          className="mt-1"
        />
        {errors.subject && <p className="text-destructive text-xs mt-1">{errors.subject}</p>}
      </div>

      <div>
        <Label htmlFor="contact-message">Message *</Label>
        <Textarea
          id="contact-message"
          placeholder="Tell us how we can help..."
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          maxLength={2000}
          rows={5}
          className="mt-1 resize-none"
        />
        {errors.message && <p className="text-destructive text-xs mt-1">{errors.message}</p>}
      </div>

      <Button type="submit" variant="cta" size="lg" className="w-full" disabled={submitting}>
        {submitting ? (
          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</>
        ) : (
          <>Submit Inquiry <Send className="w-4 h-4 ml-2" /></>
        )}
      </Button>
    </form>
  );
};

export default ContactForm;


