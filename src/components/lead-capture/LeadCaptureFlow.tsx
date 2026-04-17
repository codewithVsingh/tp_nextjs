import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Star, Shield, CheckCircle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";
import { CITY_OPTIONS, INITIAL_LEAD_DATA, type LeadData } from "./types";

import PhoneEntry from "./steps/PhoneEntry";
import OtpVerification from "./steps/OtpVerification";
import UserTypeSelect from "./steps/UserTypeSelect";
import SelfSubtype from "./steps/SelfSubtype";
import LocationMode from "./steps/LocationMode";
import DynamicRequirement from "./steps/DynamicRequirement";
import SubjectsGoals from "./steps/SubjectsGoals";
import SchedulePrefs from "./steps/SchedulePrefs";
import ReviewSubmit from "./steps/ReviewSubmit";
import SuccessRedirect from "./steps/SuccessRedirect";

// TODO: Set to true when OTP verification is ready for production
const ENABLE_OTP = false;

interface LeadCaptureFlowProps {
  onClose?: () => void;
  source?: string;
  prefill?: Partial<LeadData>;
  /** When true, shows a desktop side-panel with trust signals next to the form */
  showDesktopPanel?: boolean;
}

type StepId =
  | "phone"
  | "otp"
  | "user_type"
  | "self_subtype"
  | "location"
  | "details"
  | "subjects_goals"
  | "schedule"
  | "review"
  | "done";

const isValidPhone = (p: string) => /^[6-9]\d{9}$/.test(p);

const isValidLocation = (city: string) => {
  const t = city.trim();
  if (!t) return false;
  if (/^\d+$/.test(t)) return /^\d{6}$/.test(t);
  return CITY_OPTIONS.some((c) => c.toLowerCase() === t.toLowerCase());
};

const STEP_TITLES: Record<StepId, string> = {
  phone: "Enter your number",
  otp: "Verify OTP",
  user_type: "Who do you need a tutor for?",
  self_subtype: "What best describes you?",
  location: "Location & Preferences",
  details: "Tell us about your requirement",
  subjects_goals: "Subjects & Goals",
  schedule: "Schedule Preferences",
  review: "Review your details",
  done: "All done!",
};

const TRUST_HIGHLIGHTS = [
  { icon: Star, title: "4.8/5 Parent Rating", subtitle: "Trusted by 10,000+ families" },
  { icon: Shield, title: "Verified Tutors Only", subtitle: "Background-checked & vetted" },
  { icon: CheckCircle, title: "Free Demo Class", subtitle: "Try before you commit" },
  { icon: Clock, title: "Match in 24 Hours", subtitle: "Fast, no waiting around" },
];

const LeadCaptureFlow = ({ onClose, source = "unknown", prefill, showDesktopPanel = false }: LeadCaptureFlowProps) => {
  const [data, setData] = useState<LeadData>({ ...INITIAL_LEAD_DATA, ...prefill });
  const [leadId, setLeadId] = useState<string | null>(null);

  const onChange = useCallback((updates: Partial<LeadData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  // Build dynamic step list based on user_type / self_subtype
  const steps: StepId[] = useMemo(() => {
    const base: StepId[] = ["phone"];
    if (ENABLE_OTP) base.push("otp");
    base.push("user_type");
    if (data.user_type === "self") base.push("self_subtype");
    base.push("location", "details");
    // Subjects+Goals shown only for school students; others jump straight to schedule
    const showSubjects =
      data.user_type === "child" ||
      (data.user_type === "self" && data.self_subtype === "school");
    if (showSubjects) base.push("subjects_goals");
    base.push("schedule", "review", "done");
    return base;
  }, [data.user_type, data.self_subtype]);

  const [stepIndex, setStepIndex] = useState(0);
  const currentStep: StepId = steps[stepIndex];

  // Visible step counter (skip "phone"/"otp" + final "done" from numbering)
  const visibleSteps = steps.filter((s) => s !== "done");
  const currentVisibleIdx = visibleSteps.indexOf(currentStep);
  const totalVisible = visibleSteps.length;
  const progressPct = currentStep === "done" ? 100 : ((currentVisibleIdx + 1) / totalVisible) * 100;

  const canNext = (): boolean => {
    switch (currentStep) {
      case "phone": return isValidPhone(data.phone);
      case "otp": return false;
      case "user_type": return !!data.user_type;
      case "self_subtype": return !!data.self_subtype;
      case "location": {
        const hasMode = !!data.mode;
        const needsArea = data.mode === "home" || data.mode === "both";
        return isValidLocation(data.city) && hasMode && (!needsArea || data.area.trim().length >= 2);
      }
      case "details": {
        const isSchool = data.user_type === "child" || (data.user_type === "self" && data.self_subtype === "school");
        if (isSchool) return !!data.class_level && !!data.board && (data.board !== "Other" || !!data.board_other.trim());
        if (data.user_type === "self" && data.self_subtype === "college") return data.course.trim().length >= 2;
        if (data.user_type === "exam") return !!data.exam && !!data.prep_level;
        if (data.user_type === "skill" || (data.user_type === "self" && data.self_subtype === "adult"))
          return !!data.skill_type && !!data.skill_goal;
        if (data.user_type === "hobby") return !!data.hobby_type && !!data.hobby_goal;
        return false;
      }
      case "subjects_goals": return data.subjects.length > 0 && data.goals.length > 0;
      case "schedule": return !!data.preferred_time && !!data.frequency && !!data.start_time;
      case "review": return true;
      default: return false;
    }
  };

  const persistFields = () => ({
    name: data.name || null,
    user_type: data.user_type || null,
    city: data.city || null,
    area: data.area || null,
    mode: data.mode || null,
    class_level: data.class_level || null,
    board: data.board === "Other" ? (data.board_other || "Other") : (data.board || null),
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
  });

  const saveLead = async (stepReached: number) => {
    if (!leadId) return;
    try {
      await supabase.from("leads").update({ ...persistFields(), step_reached: stepReached }).eq("id", leadId);
    } catch (err) { console.error("Failed to save lead:", err); }
  };

  /** Create lead in DB immediately after phone entry (when OTP is skipped) */
  const createLeadWithoutOtp = async () => {
    try {
      const { data: lead, error } = await supabase
        .from("leads")
        .insert({ phone: data.phone, name: data.name || null, otp_verified: false, step_reached: 2 })
        .select("id")
        .single();
      if (error) { console.error("Failed to create lead:", error); return null; }
      return lead.id;
    } catch (err) { console.error("Failed to create lead:", err); return null; }
  };

  const goTo = (idx: number) => setStepIndex(Math.max(0, Math.min(steps.length - 1, idx)));

  const handleNext = async () => {
    if (currentStep === "review") {
      await saveLead(steps.length);
      trackEvent("lead_submitted", { source, user_type: data.user_type });
      goTo(stepIndex + 1); // → done
      return;
    }

    if (currentStep === "phone" && !ENABLE_OTP) {
      const id = await createLeadWithoutOtp();
      if (id) setLeadId(id);
      trackEvent("lead_step_completed", { step: "phone", source, otp_status: "skipped" });
      goTo(stepIndex + 1); // moves to user_type (otp is excluded from steps)
      return;
    }

    trackEvent("lead_step_completed", { step: currentStep, source });
    if (leadId) saveLead(stepIndex + 1);
    goTo(stepIndex + 1);
  };

  const handleBack = () => {
    // Don't allow going back past user_type
    const userTypeIdx = steps.indexOf("user_type");
    if (stepIndex > userTypeIdx) goTo(stepIndex - 1);
  };

  const handleOtpVerified = (id: string) => {
    setLeadId(id);
    trackEvent("otp_verified", { source });
    goTo(stepIndex + 1);
  };

  const handleEditStep = (target: StepId) => {
    const idx = steps.indexOf(target);
    if (idx >= 0) goTo(idx);
  };

  const renderStep = () => {
    switch (currentStep) {
      case "phone": return <PhoneEntry data={data} onChange={onChange} />;
      case "otp": return <OtpVerification phone={data.phone} onVerified={handleOtpVerified} />;
      case "user_type": return <UserTypeSelect data={data} onChange={onChange} />;
      case "self_subtype": return <SelfSubtype data={data} onChange={onChange} />;
      case "location": return <LocationMode data={data} onChange={onChange} />;
      case "details": return <DynamicRequirement data={data} onChange={onChange} />;
      case "subjects_goals": return <SubjectsGoals data={data} onChange={onChange} />;
      case "schedule": return <SchedulePrefs data={data} onChange={onChange} />;
      case "review": return <ReviewSubmit data={data} onEditStep={(s) => handleEditStep(s as StepId)} />;
      case "done": return <SuccessRedirect data={data} onClose={onClose} />;
    }
  };

  const showNav = currentStep !== "otp" && currentStep !== "done";
  const showStepHeader = currentStep !== "phone" && currentStep !== "otp" && currentStep !== "done";

  const formCard = (
    <div className="w-full max-w-lg mx-auto">
      {showStepHeader && (
        <div className="mb-6">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-xs font-semibold text-primary uppercase tracking-wide">
              Step {currentVisibleIdx + 1} of {totalVisible}
            </span>
            <span className="text-xs text-muted-foreground">{Math.round(progressPct)}%</span>
          </div>
          <h2 className="font-heading font-bold text-xl md:text-2xl text-foreground mb-3">
            {STEP_TITLES[currentStep]}
          </h2>
          <Progress value={progressPct} className="h-1.5" />
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>

      {showNav && (
        <div className="flex gap-3 mt-6">
          {stepIndex > steps.indexOf("user_type") && (
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
            {currentStep === "phone"
              ? "Get Free Demo →"
              : currentStep === "review"
              ? "Submit & Get Demo →"
              : "Continue"}
            {currentStep !== "phone" && currentStep !== "review" && <ArrowRight className="w-4 h-4 ml-1" />}
          </Button>
        </div>
      )}
    </div>
  );

  if (!showDesktopPanel) return formCard;

  // Desktop split layout: left informational panel + right form
  return (
    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
      <aside className="hidden lg:block sticky top-24">
        <div className="space-y-6">
          <div>
            <h1 className="font-heading font-extrabold text-3xl xl:text-4xl text-foreground leading-tight mb-3">
              Find the Right Tutor <span className="text-primary">Near You</span>
            </h1>
            <p className="text-muted-foreground text-base">
              Personalized matching with verified tutors — completely free demo class, no commitment.
            </p>
          </div>

          <ul className="space-y-3">
            {TRUST_HIGHLIGHTS.map((t) => (
              <li key={t.title} className="flex items-start gap-3 bg-accent/40 rounded-xl p-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <t.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{t.title}</p>
                  <p className="text-xs text-muted-foreground">{t.subtitle}</p>
                </div>
              </li>
            ))}
          </ul>

          <blockquote className="border-l-4 border-primary pl-4 py-2 italic text-sm text-muted-foreground">
            "Found the perfect Math tutor for my daughter in just 2 days. Her grades jumped from C to A in one term."
            <footer className="not-italic font-semibold text-foreground text-xs mt-2">— Priya M., Bangalore</footer>
          </blockquote>
        </div>
      </aside>

      <div>{formCard}</div>
    </div>
  );
};

export default LeadCaptureFlow;
