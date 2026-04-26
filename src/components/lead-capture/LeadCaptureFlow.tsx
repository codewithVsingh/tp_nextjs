import { useState, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Star, Shield, CheckCircle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/modules/shared/logic/eventTrackingEngine";
import { INITIAL_LEAD_DATA, type LeadData } from "./types";

import RequirementStep from "./steps/RequirementStep";
import LocationMode from "./steps/LocationMode";
import PreferencesStep from "./steps/PreferencesStep";
import PhoneEntry from "./steps/PhoneEntry";
import SuccessRedirect from "./steps/SuccessRedirect";

// Set to true when OTP verification is ready for production
const ENABLE_OTP = false;

interface LeadCaptureFlowProps {
  onClose?: () => void;
  source?: string;
  prefill?: Partial<LeadData>;
  showDesktopPanel?: boolean;
  sourcePage?: string;
  sourceCta?: string;
}

type StepId = "requirement" | "location" | "preferences" | "verification" | "done";

const STEP_TITLES: Record<StepId, { title: string; subtitle: string }> = {
  requirement: { title: "Tell us your needs", subtitle: "Personalizing your experience" },
  location: { title: "Location & Mode", subtitle: "Where should we meet?" },
  preferences: { title: "Tutor Preferences", subtitle: "Finding your perfect match" },
  verification: { title: "Almost Done!", subtitle: "Verify your number to proceed" },
  done: { title: "All set!", subtitle: "We're matching you now" },
};

const TRUST_HIGHLIGHTS = [
  { icon: Star, title: "4.8/5 Parent Rating", subtitle: "Trusted by 10,000+ families" },
  { icon: Shield, title: "Verified Profiles", subtitle: "Documents reviewed during onboarding" },
  { icon: CheckCircle, title: "Free Demo Class", subtitle: "Try before you commit" },
  { icon: Clock, title: "Match in 24 Hours", subtitle: "Fast, no waiting around" },
];

const LeadCaptureFlow = ({ 
  onClose, 
  source = "unknown", 
  prefill, 
  showDesktopPanel = false, 
  sourcePage, 
  sourceCta 
}: LeadCaptureFlowProps) => {
  const [data, setData] = useState<LeadData>(() => ({
    ...INITIAL_LEAD_DATA, 
    ...prefill,
    source_page: sourcePage || prefill?.source_page || "",
    source_cta: sourceCta || prefill?.source_cta || ""
  }));
  const [stepIndex, setStepIndex] = useState(0);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps: StepId[] = ["requirement", "location", "preferences", "verification", "done"];
  const currentStep = steps[stepIndex];

  const onChange = useCallback((updates: Partial<LeadData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  // Shadow Lead Persistence (Save on every step to track drop-offs)
  useEffect(() => {
    if (currentStep === "done") return;
    
    const persist = async () => {
      const payload: any = {
        name: data.name || null,
        phone: data.phone || null,
        user_type: data.user_type || null,
        state: data.state || null,
        city: data.city || null,
        area: data.area || null,
        mode: data.mode || null,
        class_level: data.class_level || null,
        preferred_time: data.preferred_time || null,
        preferred_tutor_gender: data.preferred_tutor_gender || null,
        budget: data.budget || null,
        urgency: data.urgency || null,
        step_reached: stepIndex + 1,
        source_page: data.source_page,
        source_cta: data.source_cta
      };

      if (!leadId && data.phone.length === 10) {
        // Initial create once phone is available
        const { data: lead } = await supabase.from('leads').insert(payload).select('id').single();
        if (lead) setLeadId(lead.id);
      } else if (leadId) {
        // Update existing
        await supabase.from('leads').update(payload).eq('id', leadId);
      }
    };

    const timer = setTimeout(persist, 1000);
    return () => clearTimeout(timer);
  }, [data, stepIndex, leadId, currentStep]);

  const getButtonText = () => {
    if (stepIndex === steps.length - 2) return "Get Free Demo";
    
    switch (currentStep) {
      case "requirement":
        if (data.user_type === "my-child") return "Great Choice! Next";
        if (data.user_type === "myself") return "Unlock My Potential";
        if (data.user_type === "counselling") return "Get Expert Guidance";
        return "Continue";
      case "location": return "Check Availability";
      case "preferences": return "Almost Done!";
      default: return "Continue";
    }
  };

  const contentRef = useCallback((node: HTMLDivElement) => {
    if (node) {
      node.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [stepIndex]);

  const canNext = () => {
    switch (currentStep) {
      case "requirement": {
        const isCounselling = data.user_type === "counselling";
        const isOptionalSub = data.learning_subcategory === "Early Learning" || data.learning_subcategory === "Special Education";
        const isSchool = data.learning_subcategory?.toLowerCase().includes("school-tuition");
        
        if (isCounselling || isOptionalSub) {
          return !!data.user_type && !!data.learning_subcategory;
        }

        if (isSchool) {
          return !!data.user_type && !!data.learning_subcategory && !!data.class_level && data.subjects.length > 0;
        }

        return !!data.user_type && !!data.learning_subcategory && data.subjects.length > 0;
      }
      case "location": return !!data.mode && !!data.city && (data.mode === 'online' || !!data.area);
      case "preferences": return !!data.preferred_tutor_gender && !!data.preferred_time && !!data.urgency;
      case "verification": return data.phone.length >= 10;
      default: return true;
    }
  };

  const handleNext = async () => {
    if (stepIndex === steps.length - 2) {
      // Final submission (verification step)
      setIsSubmitting(true);
      trackEvent("lead_submitted", { source, user_type: data.user_type });
      setStepIndex(stepIndex + 1);
      setIsSubmitting(false);
      return;
    }
    
    trackEvent("lead_step_completed", { step: currentStep, source });
    setStepIndex(stepIndex + 1);
  };

  const handleBack = () => {
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
  };

  if (currentStep === "done") {
    return <SuccessRedirect data={data} onClose={onClose} />;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-[600px] bg-background overflow-hidden">
      {/* Left Panel - Brand Story & Trust (Desktop Only) */}
      {showDesktopPanel && (
        <div className="hidden md:flex md:w-[40%] bg-slate-50 border-r border-slate-100 flex-col p-10 justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full -ml-32 -mb-32 blur-3xl" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-6">
              <Star className="w-3 h-3 fill-primary" />
              Trusted by 10,000+ Parents
            </div>
            
            <h1 className="text-3xl font-black text-slate-900 leading-[1.1] mb-6 tracking-tight">
              Quality Education, <br />
              <span className="text-primary italic">Right at Your Doorstep.</span>
            </h1>
            
            <div className="space-y-6">
              {TRUST_HIGHLIGHTS.map((item, i) => (
                <div key={i} className="flex gap-4 items-start group">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0 border border-slate-100 group-hover:scale-110 transition-transform">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">{item.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 pt-10 border-t border-slate-200/60">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-50 bg-slate-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?u=${i + 10}`} alt="User" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="text-[10px] font-bold text-slate-400">Join 500+ students active today</div>
            </div>
            <p className="text-[11px] text-slate-400 italic font-medium">
              "Tutors Parliament helped my daughter improve her Math score by 40% in just 3 months. The matching process is seamless!"
              <span className="block mt-1 text-slate-600 font-bold">— Mrs. Sharma, Delhi</span>
            </p>
          </div>
        </div>
      )}

      {/* Right Panel - The Form */}
      <div className="flex-1 flex flex-col relative bg-white">
        <div className="px-5 md:px-8 pt-4 pb-3 border-b border-slate-100 bg-white/90 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-base md:text-lg font-black text-slate-900 tracking-tight leading-none mb-1">{STEP_TITLES[currentStep].title}</h2>
              <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">{STEP_TITLES[currentStep].subtitle}</p>
            </div>
            <span className="text-[10px] font-black text-primary bg-primary/5 px-2 py-1 rounded-md border border-primary/10">
              {stepIndex + 1}/4
            </span>
          </div>
          <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${((stepIndex + 1) / (steps.length - 1)) * 100}%` }}
              className="h-full bg-primary"
            />
          </div>
        </div>

        <div ref={contentRef} className="flex-1 overflow-y-auto px-5 md:px-10 pt-6 pb-24 lead-capture-content max-w-2xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {currentStep === "requirement" && <RequirementStep data={data} onChange={onChange} />}
              {currentStep === "location" && <LocationMode data={data} onChange={onChange} />}
              {currentStep === "preferences" && <PreferencesStep data={data} onChange={onChange} />}
              {currentStep === "verification" && <PhoneEntry data={data} onChange={onChange} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="p-4 md:px-10 border-t bg-white flex gap-3 sticky bottom-0 z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] w-full">
          {stepIndex > 0 && (
            <Button variant="outline" onClick={handleBack} className="h-10 w-10 md:h-11 md:w-11 p-0 rounded-xl border-2 font-bold text-slate-600">
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
          )}
          <Button 
            onClick={handleNext} 
            disabled={!canNext() || isSubmitting}
            className="flex-1 h-10 md:h-11 rounded-xl text-[11px] md:text-xs font-black uppercase tracking-widest transition-all active:scale-[0.98] shadow-lg shadow-primary/20"
          >
            {stepIndex === steps.length - 2 ? "Get Free Demo" : getButtonText()}
            <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LeadCaptureFlow;
