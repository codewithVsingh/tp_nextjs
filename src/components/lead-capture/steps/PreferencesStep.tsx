import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import OptionChip from "../OptionChip";
import { type StepProps } from "../types";
import { Clock, Users, IndianRupee, Zap } from "lucide-react";

const TIME_OPTIONS = ["Morning", "Afternoon", "Evening", "Late Evening", "Any Time"];
const GENDER_OPTIONS = ["Male", "Female", "No Preference"];
const URGENCY_OPTIONS = ["Immediate", "Within a week", "Just exploring"];

const PreferencesStep = ({ data, onChange }: StepProps) => {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-3 text-primary/80">
          <Clock className="w-3.5 h-3.5" />
          <Label className="block text-xs font-bold uppercase tracking-widest mb-0">Preferred Time *</Label>
        </div>
        <div className="flex flex-wrap gap-2">
          {TIME_OPTIONS.map(opt => (
            <OptionChip
              key={opt}
              selected={data.preferred_time === opt}
              onClick={() => onChange({ preferred_time: opt })}
              className="px-3 py-1.5 text-[11px] md:text-xs"
            >
              {opt}
            </OptionChip>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3 text-primary/80">
          <Users className="w-3.5 h-3.5" />
          <Label className="block text-xs font-bold uppercase tracking-widest mb-0">Tutor Preference *</Label>
        </div>
        <div className="flex flex-wrap gap-2">
          {GENDER_OPTIONS.map(opt => (
            <OptionChip
              key={opt}
              selected={data.preferred_tutor_gender === opt}
              onClick={() => onChange({ preferred_tutor_gender: opt })}
              className="px-3 py-1.5 text-[11px] md:text-xs"
            >
              {opt}
            </OptionChip>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2 text-primary">
            <IndianRupee className="w-4 h-4" />
            <Label className="block text-sm font-semibold mb-0">Monthly Budget</Label>
          </div>
          <Input 
            placeholder="e.g. ₹3000 - ₹5000"
            value={data.budget || ""}
            onChange={e => onChange({ budget: e.target.value })}
            className="h-11"
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2 text-primary">
            <Zap className="w-4 h-4" />
            <Label className="block text-sm font-semibold mb-0">How urgent? *</Label>
          </div>
          <select 
            className="w-full h-11 px-3 rounded-md border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20"
            value={data.urgency || ""}
            onChange={e => onChange({ urgency: e.target.value })}
          >
            <option value="">Select urgency</option>
            {URGENCY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
};

export default PreferencesStep;
