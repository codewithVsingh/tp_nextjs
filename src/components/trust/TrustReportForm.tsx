"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  X, Loader2, AlertCircle, Info, ShieldAlert,
  Activity, Zap, ShieldCheck, Database
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useTrustAuth } from "@/components/trust/TrustAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { trackAgencyActivity } from "@/modules/shared/logic/intelligenceTrackingEngine";

const reportSchema = z.object({
  entity_type: z.enum(["tutor", "parent"]),
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid mobile number is required"),
  city: z.string().min(2, "City is required"),
  category: z.string().min(1, "Please select a category"),
  incident_type: z.string().min(1, "Incident type is required"),
  description: z.string().min(10, "Please provide more details (min 10 chars)"),
  severity: z.enum(["low", "medium", "high", "critical"]),
  has_evidence: z.boolean().default(false),
  amount: z.string().optional(),
});

type ReportFormValues = z.infer<typeof reportSchema>;

interface TrustReportFormProps {
  onClose: () => void;
  onSuccess: () => void;
  defaultType?: "tutor" | "parent";
}

const TrustReportForm = ({ onClose, onSuccess, defaultType = "tutor" }: TrustReportFormProps) => {
  const { user } = useTrustAuth();
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      entity_type: defaultType,
      severity: "medium",
      has_evidence: false,
    }
  });

  const entityType = watch("entity_type");
  const hasEvidence = watch("has_evidence");

  const onSubmit = async (values: ReportFormValues) => {
    if (!user) return;
    setLoading(true);

    try {
      const { error } = await supabase
        .from("entity_reports")
        .insert([{
          entity_type: values.entity_type,
          name: values.name,
          phone: values.phone,
          normalized_phone: values.phone.replace(/\D/g, ""),
          city: values.city,
          category: values.category,
          fraud_type: values.entity_type === "tutor" ? values.incident_type : null,
          issue_type: values.entity_type === "parent" ? values.incident_type : null,
          description: values.description,
          severity: values.severity,
          has_evidence: values.has_evidence,
          amount: values.amount ? parseFloat(values.amount) : 0,
          reported_by_user_id: user.id
        }]);

      if (error) throw error;

      await trackAgencyActivity(user.id, 'report_submission', {
        entity_type: values.entity_type,
        normalized_phone: values.phone.replace(/\D/g, "")
      });

      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err: any) {
      toast.error(err.message || "Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  const tutorIncidents = [
    { value: "fee_theft", label: "Fee Collection & Disappearing" },
    { value: "fake_profile", label: "Fake Profile / Documents" },
    { value: "abrupt_leaving", label: "Left Mid-Session (No Refund)" },
    { value: "misconduct", label: "Misconduct / Unprofessional" },
    { value: "direct_deal", label: "Direct Dealing (Bypassing Agency)" },
  ];

  const parentIncidents = [
    { value: "non_payment", label: "Non-Payment of Dues" },
    { value: "fake_lead", label: "Fake / Spam Inquiry" },
    { value: "abusive", label: "Abusive Behavior" },
    { value: "multiple_agencies", label: "Contacting Multiple Agencies Simultaneously" },
    { value: "unreasonable", label: "Unreasonable Demands / Fraudulent Claim" },
  ];

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center bg-white">
        <motion.div 
          initial={{ scale: 0, rotate: -10 }} 
          animate={{ scale: 1, rotate: 0 }} 
          className="bg-emerald-50 p-6 rounded-full mb-6 border border-emerald-100 shadow-sm"
        >
          <ShieldCheck className="w-16 h-16 text-emerald-500" />
        </motion.div>
        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Signal Transmitted</h3>
        <p className="text-[13px] text-slate-500 mt-3 max-w-sm font-medium leading-relaxed">
          The intelligence matrix has logged your submission. We are cross-referencing this across the Tutors Parliament network.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Entity To Flag</Label>
          <Select 
            onValueChange={(val: any) => setValue("entity_type", val)} 
            defaultValue={entityType}
          >
            <SelectTrigger className="bg-slate-50 border-slate-200 text-slate-900 h-12 rounded-xl focus:ring-tp-institute/20 font-bold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200 shadow-xl rounded-xl">
              <SelectItem value="tutor" className="font-bold text-slate-700">Tutor / Educator</SelectItem>
              <SelectItem value="parent" className="font-bold text-slate-700">Parent / Client</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name / Subject</Label>
          <Input 
            {...register("name")}
            placeholder="Full Name"
            className="bg-slate-50 border-slate-200 text-slate-900 h-12 rounded-xl focus:ring-tp-institute/20 font-bold"
          />
          {errors.name && <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-1 ml-1">{errors.name.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Identification (Mobile)</Label>
          <Input 
            {...register("phone")}
            placeholder="10-digit number"
            className="bg-slate-50 border-slate-200 text-slate-900 h-12 rounded-xl focus:ring-tp-institute/20 font-bold"
          />
          {errors.phone && <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-1 ml-1">{errors.phone.message}</p>}
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Region / City</Label>
          <Input 
            {...register("city")}
            placeholder="e.g. New Delhi"
            className="bg-slate-50 border-slate-200 text-slate-900 h-12 rounded-xl focus:ring-tp-institute/20 font-bold"
          />
          {errors.city && <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-1 ml-1">{errors.city.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Signal Severity</Label>
          <Select 
            onValueChange={(val: any) => setValue("severity", val)} 
            defaultValue="medium"
          >
            <SelectTrigger className="bg-slate-50 border-slate-200 text-slate-900 h-12 rounded-xl focus:ring-tp-institute/20 font-bold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200 shadow-xl rounded-xl">
              <SelectItem value="low" className="font-bold text-slate-700">Low (Policy Issue)</SelectItem>
              <SelectItem value="medium" className="font-bold text-slate-700">Medium (Standard Fraud)</SelectItem>
              <SelectItem value="high" className="font-bold text-slate-700 text-amber-600">High (Significant Risk)</SelectItem>
              <SelectItem value="critical" className="font-bold text-slate-700 text-red-600">Critical (Direct Theft/Safety)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex justify-between">
            Evidence Verification
            {hasEvidence && <span className="text-emerald-500 flex items-center gap-1 animate-pulse"><ShieldCheck className="w-3 h-3" /> 1.5x Multiplier</span>}
          </Label>
          <div className="bg-slate-50 border border-slate-200 h-12 rounded-xl flex items-center justify-between px-4">
             <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Do you have proof? (Docs/Screenshots)</span>
             <Switch 
               checked={hasEvidence}
               onCheckedChange={(val) => setValue("has_evidence", val)}
             />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Context (Category)</Label>
          <Input 
            {...register("category")}
            placeholder="e.g. Mathematics, IIT-JEE"
            className="bg-slate-50 border-slate-200 text-slate-900 h-12 rounded-xl focus:ring-tp-institute/20 font-bold"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Intelligence Incident Type</Label>
          <Select onValueChange={(val) => setValue("incident_type", val)}>
            <SelectTrigger className="bg-slate-50 border-slate-200 text-slate-900 h-12 rounded-xl focus:ring-tp-institute/20 font-bold">
              <SelectValue placeholder="Select specific issue..." />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200 shadow-xl rounded-xl">
              {(entityType === "tutor" ? tutorIncidents : parentIncidents).map(item => (
                <SelectItem key={item.value} value={item.value} className="font-bold text-slate-700">{item.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.incident_type && <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-1 ml-1">{errors.incident_type.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Detailed Narrative</Label>
        <Textarea 
          {...register("description")}
          placeholder="Describe exactly what happened..."
          className="bg-slate-50 border-slate-200 text-slate-900 min-h-[120px] rounded-xl focus:ring-tp-institute/20 font-medium leading-relaxed"
        />
        {errors.description && <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-1 ml-1">{errors.description.message}</p>}
      </div>

      <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex gap-4 shadow-inner">
        <div className="mt-1 flex-shrink-0"><Database className="w-5 h-5 text-tp-institute" /></div>
        <p className="text-[11px] text-slate-500 leading-relaxed font-bold italic opacity-80">
          Reporting is a strategic action. Your institute ID <span className="text-tp-institute font-black">"{user?.email?.split('@')[0]}"</span> is now logged as the source. Unauthorized or false submissions lead to immediate network exclusion.
        </p>
      </div>

      <div className="flex gap-4 pt-4">
        <Button 
          type="button" 
          variant="ghost" 
          className="flex-1 h-12 text-slate-400 hover:bg-slate-100 font-black uppercase text-[10px] tracking-widest rounded-xl"
          onClick={onClose}
        >
          Abort Submission
        </Button>
        <Button 
          className="flex-[2] h-12 bg-tp-institute hover:bg-tp-institute/90 text-white font-black uppercase text-[10px] tracking-widest shadow-lg shadow-tp-institute/20 rounded-xl transition-all"
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Authorize & Commit To Registry"}
        </Button>
      </div>
    </form>
  );
};

export default TrustReportForm;
