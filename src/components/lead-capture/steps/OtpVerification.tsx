import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface OtpVerificationProps {
  phone: string;
  onVerified: (leadId: string) => void;
}

const OTP_LENGTH = 4;
const RESEND_COOLDOWN = 30;

const OtpVerification = ({ phone, onVerified }: OtpVerificationProps) => {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(RESEND_COOLDOWN);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all digits entered
    if (newOtp.every((d) => d) && newOtp.join("").length === OTP_LENGTH) {
      verifyOtp(newOtp.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (pasted.length === OTP_LENGTH) {
      const newOtp = pasted.split("");
      setOtp(newOtp);
      verifyOtp(pasted);
    }
  };

  const sendOtp = async () => {
    setSending(true);
    setError("");
    try {
      const { data, error: fnError } = await supabase.functions.invoke("send-otp", {
        body: { phone },
      });
      if (fnError || !data?.success) {
        setError(data?.error || "Failed to send OTP. Please try again.");
      } else {
        setResendTimer(RESEND_COOLDOWN);
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setSending(false);
  };

  const verifyOtp = async (code: string) => {
    setVerifying(true);
    setError("");
    try {
      const { data, error: fnError } = await supabase.functions.invoke("verify-otp", {
        body: { phone, code },
      });
      if (fnError || !data?.success) {
        setError(data?.error || "Invalid OTP. Please try again.");
        setOtp(Array(OTP_LENGTH).fill(""));
        inputRefs.current[0]?.focus();
      } else {
        onVerified(data.lead_id);
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setVerifying(false);
  };

  // Send OTP on mount
  useEffect(() => {
    sendOtp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6 text-center">
      <div>
        <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-1">
          Verify Your Number
        </h2>
        <p className="text-muted-foreground text-sm">
          We sent a {OTP_LENGTH}-digit code to <span className="font-semibold text-foreground">+91 {phone}</span>
        </p>
      </div>

      <div className="flex justify-center gap-3" onPaste={handlePaste}>
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="w-14 h-14 text-center text-2xl font-bold rounded-xl border-2 border-border bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-ring outline-none transition-all"
          />
        ))}
      </div>

      {verifying && (
        <div className="flex items-center justify-center gap-2 text-primary text-sm">
          <Loader2 className="w-4 h-4 animate-spin" /> Verifying...
        </div>
      )}

      {error && <p className="text-destructive text-sm">{error}</p>}

      <div>
        {resendTimer > 0 ? (
          <p className="text-muted-foreground text-sm">Resend OTP in {resendTimer}s</p>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={sendOtp}
            disabled={sending}
            className="text-primary"
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
            Resend OTP
          </Button>
        )}
      </div>
    </div>
  );
};

export default OtpVerification;

