import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import OptionChip from "../OptionChip";
import { SUBJECT_OPTIONS, GOAL_OPTIONS, type StepProps } from "../types";

const SubjectsGoals = ({ data, onChange }: StepProps) => {
  const [otherSubject, setOtherSubject] = useState("");
  const [otherGoal, setOtherGoal] = useState("");

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
    const v = otherSubject.trim().replace(/,$/, "").trim();
    if (v && !data.subjects.some((s) => s.toLowerCase() === v.toLowerCase())) {
      onChange({ subjects: [...data.subjects, v] });
    }
    setOtherSubject("");
  };

  const addOtherGoal = () => {
    const v = otherGoal.trim().replace(/,$/, "").trim();
    if (v && !data.goals.some((g) => g.toLowerCase() === v.toLowerCase())) {
      onChange({ goals: [...data.goals, v] });
    }
    setOtherGoal("");
  };

  // Show subjects only for school students (child OR self+school)
  const showSubjects =
    data.user_type === "child" ||
    (data.user_type === "self" && data.self_subtype === "school");

  return (
    <div className="space-y-5">
      <p className="text-muted-foreground text-sm">
        {showSubjects ? "Select all that apply" : "Select your learning goals"}
      </p>

      {showSubjects && (
        <div>
          <Label className="mb-2 block">Subjects *</Label>
          <div className="flex flex-wrap gap-2">
            {SUBJECT_OPTIONS.map((s) => (
              <OptionChip key={s} selected={data.subjects.includes(s)} onClick={() => toggleSubject(s)}>
                {s}
              </OptionChip>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <Input
              placeholder="Other subject (press Enter or , to add)"
              value={otherSubject}
              onChange={(e) => {
                const v = e.target.value;
                if (v.endsWith(",")) {
                  setOtherSubject(v);
                  setTimeout(addOtherSubject, 0);
                } else {
                  setOtherSubject(v);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addOtherSubject();
                }
              }}
              onBlur={addOtherSubject}
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
            <OptionChip key={g} selected={data.goals.includes(g)} onClick={() => toggleGoal(g)}>
              {g}
            </OptionChip>
          ))}
        </div>
        {data.goals.includes("Other") && (
          <Input
            placeholder="Other goal (press Enter or , to add)"
            value={otherGoal}
            onChange={(e) => {
              const v = e.target.value;
              if (v.endsWith(",")) {
                setOtherGoal(v);
                setTimeout(addOtherGoal, 0);
              } else {
                setOtherGoal(v);
              }
              onChange({ goal_other: v.replace(/,$/, "") });
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addOtherGoal();
              }
            }}
            onBlur={addOtherGoal}
            maxLength={120}
            className="mt-2"
          />
        )}
      </div>
    </div>
  );
};

export default SubjectsGoals;
