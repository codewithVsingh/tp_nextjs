import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";
import { INITIAL_LEAD_DATA, type LeadData } from "./types";

import PhoneEntry from "./steps/PhoneEntry";
import OtpVerification from "./steps/OtpVerification";
import UserTypeSelect from "./steps/UserTypeSelect";
import LocationMode from "./steps/LocationMode";
import DynamicRequirement from "./steps/DynamicRequirement";
import SubjectsGoals from "./steps/SubjectsGoals";
import SchedulePrefs from "./steps/SchedulePrefs";
import ReviewSubmit from "./steps/ReviewSubmit";
import SuccessRedirect from "./steps/SuccessRedirect";

const STEP_LABELS = [
  "Phone", "OTP", "Who", "Location", "Details", "Subjects", "Schedule", "Review", "Done"
];

interface LeadCaptureFlowProps {
  onClose?: () => void;
  source?: string;
  prefill?: Partial<LeadData>;
}

const LeadCaptureFlow = ({ onClose, source = "unknown", prefill }: LeadCaptureFlowProps) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<LeadData>({ ...INITIAL_LEAD_DATA, ...prefill });
  const [leadId, setLeadId] = useState<string | null>(null);

  const onChange = useCallback((updates: Partial<LeadData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  const canNext = (): boolean => {
    switch (step) {
      case 0: return /^[6-9]\d{9}$/.test(data.phone);
      case 1: return false; // OTP handles its own progression
      case 2: return !!data.user_type;
      case 3: {
        const hasCity = data.city.trim().length >= 2;
        const hasMode = !!data.mode;
        const needsArea = data.mode === "home" || data.mode === "both";
        return hasCity && hasMode && (!needsArea || data.area.trim().length >= 2);
      }
      case 4: {
        if (data.user_type === "child" || data.user_type === "self")
          return !!data.class_level && !!data.board;
        if (data.user_type === "exam")
          return !!data.exam && !!data.prep_level;
        if (data.user_type === "skill")
          return !!data.skill_type;
        if (data.user_type === "hobby")
          return !!data.hobby_type;
        return false;
      }
      case 5: return data.goals.length > 0;
      case 6: return !!data.preferred_time && !!data.frequency && !!data.start_time;
      case 7: return true; // review step — always can submit
      default: return false;
    }
  };

  const saveLead = async (stepReached: number) => {
    if (!leadId) return;
    try {
      await supabase
        .from("leads")
        .update({
          name: data.name || null,
          user_type: data.user_type || null,
          city: data.city || null,
          area: data.area || null,
          mode: data.mode || null,
          class_level: data.class_level || null,
          board: data.board || null,
          exam: data.exam || null,
          exam_category: data.exam_category || null,
          prep_level: data.prep_level || null,
          skill_type: data.skill_type || null,
          hobby_type: data.hobby_type || null,
          subjects: data.subjects,
          goals: data.goals,
          preferred_time: data.preferred_time || null,
          frequency: data.frequency || null,
          start_time: data.start_time || null,
          step_reached: stepReached,
        })
        .eq("id", leadId);
    } catch (err) {
      console.error("Failed to save lead:", err);
    }
  };

  const handleNext = async () => {
    if (step === 7) {
      // Final submit
      await saveLead(8);
      trackEvent("lead_submitted", { source, user_type: data.user_type });
      setStep(8);
      return;
    }

    const nextStep = step + 1;
    trackEvent("lead_step_completed", { step, source });
    if (leadId && step >= 2) {
      saveLead(nextStep);
    }
    setStep(nextStep);
  };

  const handleBack = () => {
    if (step > 2) setStep(step - 1); // Can't go back before OTP
  };

  const handleOtpVerified = (id: string) => {
    setLeadId(id);
    trackEvent("otp_verified", { source });
    setStep(2);
  };

  const handleEditStep = (targetStep: number) => {
    setStep(targetStep);
  };

  // Total visible steps (excluding OTP and success)
  const totalVisibleSteps = 7; // steps 2-8 mapped to 1-7
  const visibleProgress = step <= 1 ? 0 : step >= 8 ? 100 : ((step - 1) / totalVisibleSteps) * 100;

  const renderStep = () => {
    switch (step) {
      case 0: return <PhoneEntry data={data} onChange={onChange} />;
      case 1: return <OtpVerification phone={data.phone} onVerified={handleOtpVerified} />;
      case 2: return <UserTypeSelect data={data} onChange={onChange} />;
      case 3: return <LocationMode data={data} onChange={onChange} />;
      case 4: return <DynamicRequirement data={data} onChange={onChange} />;
      case 5: return <SubjectsGoals data={data} onChange={onChange} />;
      case 6: return <SchedulePrefs data={data} onChange={onChange} />;
      case 7: return <ReviewSubmit data={data} onEditStep={handleEditStep} />;
      case 8: return <SuccessRedirect data={data} onClose={onClose} />;
      default: return null;
    }
  };

  const showNav = step !== 1 && step !== 8; // Hide nav on OTP and success steps

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Progress bar */}
      {step >= 2 && step < 8 && (
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            {STEP_LABELS.slice(2, 8).map((label, i) => (
              <div
                key={label}
                className={`text-[10px] font-medium transition-colors ${
                  i + 2 <= step ? "text-primary" : "text-muted-foreground/50"
                }`}
              >
                {label}
              </div>
            ))}
          </div>
          <Progress value={visibleProgress} className="h-1.5" />
        </div>
      )}

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      {showNav && (
        <div className="flex gap-3 mt-6">
          {step > 2 && (
            <Button variant="outline" size="lg" className="flex-1" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
          )}
          <Button
            variant="cta"
            size="lg"
            className="flex-1"
            disabled={!canNext()}
            onClick={handleNext}
          >
            {step === 0
              ? "Get Free Demo →"
              : step === 7
              ? "Submit & Get Demo →"
              : "Continue"}
            {step > 0 && step < 7 && <ArrowRight className="w-4 h-4 ml-1" />}
          </Button>
        </div>
      )}
    </div>
  );
};

export default LeadCaptureFlow;
