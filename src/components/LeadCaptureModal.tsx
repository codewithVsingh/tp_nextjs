import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowRight, CheckCircle } from "lucide-react";

interface LeadCaptureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefill?: {
    classLevel?: string;
    subject?: string;
    board?: string;
    exam?: string;
    category?: string;
  };
}

const LeadCaptureModal = ({ open, onOpenChange, prefill }: LeadCaptureModalProps) => {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    classLevel: prefill?.classLevel || "",
    board: prefill?.board || "",
    subject: prefill?.subject || "",
    exam: prefill?.exam || "",
    mode: "",
    pincode: "",
  });

  useEffect(() => {
    if (prefill) {
      setForm(prev => ({
        ...prev,
        classLevel: prefill.classLevel || prev.classLevel,
        subject: prefill.subject || prev.subject,
        board: prefill.board || prev.board,
        exam: prefill.exam || prev.exam,
      }));
    }
  }, [prefill]);

  useEffect(() => {
    if (!open) {
      setTimeout(() => { setStep(1); setSubmitted(false); }, 300);
    }
  }, [open]);

  const update = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));

  const handlePincode = async (pin: string) => {
    update("pincode", pin);
    if (pin.length === 6) {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
        const data = await res.json();
        if (data?.[0]?.Status === "Success") {
          toast.success(`Location: ${data[0].PostOffice[0].District}, ${data[0].PostOffice[0].State}`);
        }
      } catch { /* silent */ }
    }
  };

  const canNext = step === 1
    ? form.name && form.phone.length === 10
    : step === 2
    ? form.classLevel && form.board
    : form.mode;

  const handleSubmit = () => {
    setSubmitted(true);
    toast.success("We'll connect you with the best tutor shortly!");
  };

  if (submitted) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="font-heading font-bold text-2xl text-foreground mb-2">Request Submitted!</h3>
            <p className="text-muted-foreground">Our team will call you within 30 minutes to set up your free demo class.</p>
            <Button className="mt-6" onClick={() => onOpenChange(false)}>Done</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">
            {step === 1 ? "Your Details" : step === 2 ? "Academic Info" : "Preferences"}
          </DialogTitle>
          <div className="flex gap-1 mt-3">
            {[1, 2, 3].map(s => (
              <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors ${s <= step ? "bg-primary" : "bg-muted"}`} />
            ))}
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {step === 1 && (
            <>
              <div>
                <Label>Full Name *</Label>
                <Input placeholder="Enter your name" value={form.name} onChange={e => update("name", e.target.value)} />
              </div>
              <div>
                <Label>Phone Number *</Label>
                <Input placeholder="10-digit mobile" maxLength={10} value={form.phone} onChange={e => update("phone", e.target.value.replace(/\D/g, ""))} />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <Label>Class *</Label>
                <Select value={form.classLevel} onValueChange={v => update("classLevel", v)}>
                  <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                  <SelectContent>
                    {["KG", ...Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`)].map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Board *</Label>
                <Select value={form.board} onValueChange={v => update("board", v)}>
                  <SelectTrigger><SelectValue placeholder="Select board" /></SelectTrigger>
                  <SelectContent>
                    {["CBSE", "ICSE", "State Board", "IB", "Other"].map(b => (
                      <SelectItem key={b} value={b}>{b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Subject / Exam</Label>
                <Input placeholder="e.g. Maths, JEE, NEET" value={form.subject || form.exam} onChange={e => update("subject", e.target.value)} />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div>
                <Label>Tuition Mode *</Label>
                <Select value={form.mode} onValueChange={v => update("mode", v)}>
                  <SelectTrigger><SelectValue placeholder="Select mode" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Home Tuition</SelectItem>
                    <SelectItem value="online">Online Classes</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Pincode</Label>
                <Input placeholder="Enter pincode" maxLength={6} value={form.pincode} onChange={e => handlePincode(e.target.value.replace(/\D/g, ""))} />
              </div>
            </>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(s => s - 1)} className="flex-1">Back</Button>
          )}
          <Button
            disabled={!canNext}
            onClick={() => step < 3 ? setStep(s => s + 1) : handleSubmit()}
            className="flex-1"
            style={step === 3 ? { background: "var(--cta-gradient)" } : undefined}
          >
            {step < 3 ? "Next" : "Get Free Demo"} <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeadCaptureModal;
