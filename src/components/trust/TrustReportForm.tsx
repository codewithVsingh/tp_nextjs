"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  X, 
  Loader2, 
  AlertCircle, 
  Info, 
  ShieldAlert,
  Calendar as CalendarIcon,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useTrustAuth } from "@/components/trust/TrustAuthContext";
import { supabase } from "@/integrations/supabase/client";

const reportSchema = z.object({
  entity_type: z.enum(["tutor", "parent"]),
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid mobile number is required"),
  city: z.string().min(2, "City is required"),
  category: z.string().min(1, "Please select a category"),
  incident_type: z.string().min(1, "Incident type is required"),
  description: z.string().min(10, "Please provide more details (min 10 chars)"),
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
    }
  });

  const entityType = watch("entity_type");

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
          amount: values.amount ? parseFloat(values.amount) : 0,
          reported_by_user_id: user.id
        }]);

      if (error) throw error;

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
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          className="bg-emerald-500/20 p-4 rounded-full mb-4"
        >
          <CheckCircle2 className="w-12 h-12 text-emerald-500" />
        </motion.div>
        <h3 className="text-xl font-bold text-white">Report Submitted</h3>
        <p className="text-slate-400 mt-2">The registry has been updated. Thank you for contributing.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-red-500" />
          Submit Intelligence Report
        </h2>
        <Button variant="ghost" size="icon" onClick={onClose} type="button">
          <X className="w-4 h-4 text-slate-500" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-slate-400">Entity Type</Label>
          <Select 
            onValueChange={(val: any) => setValue("entity_type", val)} 
            defaultValue={entityType}
          >
            <SelectTrigger className="bg-slate-900 border-slate-800 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800 text-white">
              <SelectItem value="tutor">Tutor</SelectItem>
              <SelectItem value="parent">Parent / Lead</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-slate-400">Subject Name</Label>
          <Input 
            {...register("name")}
            placeholder="Full Name"
            className="bg-slate-900 border-slate-800 text-white"
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-slate-400">Mobile Number</Label>
          <Input 
            {...register("phone")}
            placeholder="10-digit number"
            className="bg-slate-900 border-slate-800 text-white"
          />
          {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
        </div>
        <div className="space-y-2">
          <Label className="text-slate-400">City</Label>
          <Input 
            {...register("city")}
            placeholder="e.g. New Delhi"
            className="bg-slate-900 border-slate-800 text-white"
          />
          {errors.city && <p className="text-xs text-red-500">{errors.city.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-slate-400">Category / Subject</Label>
          <Input 
            {...register("category")}
            placeholder="e.g. Mathematics, IIT-JEE"
            className="bg-slate-900 border-slate-800 text-white"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-slate-400">Incident Type</Label>
          <Select onValueChange={(val) => setValue("incident_type", val)}>
            <SelectTrigger className="bg-slate-900 border-slate-800 text-white">
              <SelectValue placeholder="Select issue..." />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800 text-white">
              {(entityType === "tutor" ? tutorIncidents : parentIncidents).map(item => (
                <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.incident_type && <p className="text-xs text-red-500">{errors.incident_type.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-slate-400">Incident Description</Label>
        <Textarea 
          {...register("description")}
          placeholder="Describe exactly what happened..."
          className="bg-slate-900 border-slate-800 text-white min-h-[100px]"
        />
        {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
      </div>

      <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800 flex gap-3">
        <div className="mt-1"><Info className="w-4 h-4 text-blue-500" /></div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Reporting an entity is a serious action. Your institute ID will be recorded. False reports may lead to your account being suspended. 
          The data will be shared across the network to prevent repeat occurrences.
        </p>
      </div>

      <div className="flex gap-3">
        <Button 
          type="button" 
          variant="ghost" 
          className="flex-1 text-slate-400 hover:text-white"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button 
          className="flex-[2] bg-red-600 hover:bg-red-700 text-white font-bold"
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Submit To Registry"}
        </Button>
      </div>
    </form>
  );
};

export default TrustReportForm;
