import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import OptionChip from "../OptionChip";
import {
  CLASS_OPTIONS, BOARD_OPTIONS, EXAM_CATEGORIES, PREP_LEVELS,
  SKILL_OPTIONS, HOBBY_OPTIONS, type StepProps,
} from "../types";

const DynamicRequirement = ({ data, onChange }: StepProps) => {
  const [otherExam, setOtherExam] = useState("");
  const [otherSkill, setOtherSkill] = useState("");
  const [otherHobby, setOtherHobby] = useState("");

  // School student flow (child or self)
  if (data.user_type === "child" || data.user_type === "self") {
    return (
      <div className="space-y-5">
        <div>
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-1">
            Academic Details
          </h2>
          <p className="text-muted-foreground text-sm">Select class and board</p>
        </div>

        <div>
          <Label className="mb-2 block">Class *</Label>
          <div className="flex flex-wrap gap-2">
            {CLASS_OPTIONS.map((c) => (
              <OptionChip
                key={c}
                selected={data.class_level === c}
                onClick={() => onChange({ class_level: c })}
              >
                {c}
              </OptionChip>
            ))}
          </div>
        </div>

        <div>
          <Label className="mb-2 block">Board *</Label>
          <div className="flex flex-wrap gap-2">
            {BOARD_OPTIONS.map((b) => (
              <OptionChip
                key={b}
                selected={data.board === b}
                onClick={() => onChange({ board: b })}
              >
                {b}
              </OptionChip>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Competitive exams
  if (data.user_type === "exam") {
    return (
      <div className="space-y-5">
        <div>
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-1">
            Exam Details
          </h2>
          <p className="text-muted-foreground text-sm">Select your target exam</p>
        </div>

        <div>
          <Label className="mb-2 block">Exam Category *</Label>
          {Object.entries(EXAM_CATEGORIES).map(([cat, exams]) => (
            <div key={cat} className="mb-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">{cat}</p>
              <div className="flex flex-wrap gap-2">
                {exams.map((exam) => (
                  <OptionChip
                    key={exam}
                    selected={data.exam === exam}
                    onClick={() => onChange({ exam, exam_category: cat })}
                  >
                    {exam}
                  </OptionChip>
                ))}
              </div>
            </div>
          ))}
          <div className="mt-2">
            <Input
              placeholder="Other exam..."
              value={otherExam}
              onChange={(e) => {
                setOtherExam(e.target.value);
                onChange({ exam: e.target.value, exam_category: "Other" });
              }}
              maxLength={100}
            />
          </div>
        </div>

        <div>
          <Label className="mb-2 block">Preparation Level *</Label>
          <div className="flex flex-wrap gap-2">
            {PREP_LEVELS.map((lvl) => (
              <OptionChip
                key={lvl}
                selected={data.prep_level === lvl}
                onClick={() => onChange({ prep_level: lvl })}
              >
                {lvl}
              </OptionChip>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Skill / Language
  if (data.user_type === "skill") {
    return (
      <div className="space-y-5">
        <div>
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-1">
            What would you like to learn?
          </h2>
          <p className="text-muted-foreground text-sm">Select a skill or language</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {SKILL_OPTIONS.map((s) => (
            <OptionChip
              key={s}
              selected={data.skill_type === s}
              onClick={() => onChange({ skill_type: s })}
            >
              {s}
            </OptionChip>
          ))}
        </div>
        <Input
          placeholder="Other skill..."
          value={otherSkill}
          onChange={(e) => {
            setOtherSkill(e.target.value);
            onChange({ skill_type: e.target.value });
          }}
          maxLength={100}
        />
      </div>
    );
  }

  // Hobby
  if (data.user_type === "hobby") {
    return (
      <div className="space-y-5">
        <div>
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-1">
            Pick Your Interest
          </h2>
          <p className="text-muted-foreground text-sm">Select a hobby or activity</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {HOBBY_OPTIONS.map((h) => (
            <OptionChip
              key={h}
              selected={data.hobby_type === h}
              onClick={() => onChange({ hobby_type: h })}
            >
              {h}
            </OptionChip>
          ))}
        </div>
        <Input
          placeholder="Other hobby..."
          value={otherHobby}
          onChange={(e) => {
            setOtherHobby(e.target.value);
            onChange({ hobby_type: e.target.value });
          }}
          maxLength={100}
        />
      </div>
    );
  }

  return null;
};

export default DynamicRequirement;
