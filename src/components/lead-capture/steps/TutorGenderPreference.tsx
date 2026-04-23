import { StepProps } from "../types";
import { cn } from "@/lib/utils";
import { User, Users } from "lucide-react";

const GENDER_PREFS = [
  { value: "Male", label: "Male Tutor", icon: User },
  { value: "Female", label: "Female Tutor", icon: User },
  { value: "Any", label: "Any Gender", icon: Users },
];

export default function TutorGenderPreference({ data, onChange }: StepProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-4">
        Do you have a preference for the tutor's gender?
      </p>
      
      <div className="grid grid-cols-1 gap-3">
        {GENDER_PREFS.map((pref) => {
          const isSelected = data.preferred_tutor_gender === pref.value;
          const Icon = pref.icon;
          
          return (
            <button
              key={pref.value}
              type="button"
              onClick={() => onChange({ preferred_tutor_gender: pref.value })}
              className={cn(
                "flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left",
                isSelected
                  ? "border-primary bg-primary/5 ring-2 ring-primary/10"
                  : "border-border hover:border-primary/40 hover:bg-accent/50"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  isSelected ? "bg-primary/20" : "bg-muted"
                )}>
                  <Icon className={cn("w-5 h-5", isSelected ? "text-primary" : "text-muted-foreground")} />
                </div>
                <div>
                  <span className={cn(
                    "block font-bold",
                    isSelected ? "text-primary" : "text-foreground"
                  )}>
                    {pref.label}
                  </span>
                </div>
              </div>
              
              <div className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                isSelected ? "border-primary bg-primary" : "border-muted"
              )}>
                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white animate-in zoom-in-50" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
