import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import OptionChip from "../OptionChip";
import { SUBJECT_OPTIONS, GOAL_OPTIONS, type StepProps } from "../types";

const SubjectsGoals = ({ data, onChange }: StepProps) => {
  const [otherSubject, setOtherSubject] = useState("");

  const toggleSubject = (subject: string) => {
    const updated = data.subjects.includes(subject)
      ? data.subjects.filter((s) => s !== subject)
      : [...data.subjects, subject];
    onChange({ subjects: updated });
  };

  const toggleGoal = (goal: string) => {
    const updated = data.goals.includes(goal)
      ? data.goals.filter((g) => g !== goal)
      : [...data.goals, goal];
    onChange({ goals: updated });
  };

  const addOtherSubject = () => {
    if (otherSubject.trim() && !data.subjects.includes(otherSubject.trim())) {
      onChange({ subjects: [...data.subjects, otherSubject.trim()] });
      setOtherSubject("");
    }
  };

  // Show subjects only for school/self students (exams/skills/hobby may not need this)
  const showSubjects = data.user_type === "child" || data.user_type === "self";

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-1">
          {showSubjects ? "Subjects & Goals" : "What are your goals?"}
        </h2>
        <p className="text-muted-foreground text-sm">
          {showSubjects ? "Select all that apply" : "Select your learning goals"}
        </p>
      </div>

      {showSubjects && (
        <div>
          <Label className="mb-2 block">Subjects *</Label>
          <div className="flex flex-wrap gap-2">
            {SUBJECT_OPTIONS.map((s) => (
              <OptionChip
                key={s}
                selected={data.subjects.includes(s)}
                onClick={() => toggleSubject(s)}
              >
                {s}
              </OptionChip>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <Input
              placeholder="Other subject..."
              value={otherSubject}
              onChange={(e) => setOtherSubject(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addOtherSubject())}
              maxLength={50}
              className="flex-1"
            />
          </div>
        </div>
      )}

      <div>
        <Label className="mb-2 block">Goals *</Label>
        <div className="flex flex-wrap gap-2">
          {GOAL_OPTIONS.map((g) => (
            <OptionChip
              key={g}
              selected={data.goals.includes(g)}
              onClick={() => toggleGoal(g)}
            >
              {g}
            </OptionChip>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubjectsGoals;
