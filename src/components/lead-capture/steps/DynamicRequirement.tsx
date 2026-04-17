import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import OptionChip from "../OptionChip";
import {
  CLASS_OPTIONS_FULL, CLASS_OPTIONS_SELF_SCHOOL, BOARD_OPTIONS,
  EXAM_CATEGORIES, PREP_LEVELS,
  SKILL_OPTIONS, SKILL_GOALS,
  HOBBY_OPTIONS, HOBBY_GOALS,
  type StepProps,
} from "../types";

const DynamicRequirement = ({ data, onChange }: StepProps) => {
  const [otherExam, setOtherExam] = useState("");

  // === School student flow (My Child OR Myself+School) ===
  const isSchool =
    data.user_type === "child" ||
    (data.user_type === "self" && data.self_subtype === "school");

  if (isSchool) {
    const classes = data.user_type === "child" ? CLASS_OPTIONS_FULL : CLASS_OPTIONS_SELF_SCHOOL;
    return (
      <div className="space-y-5">
        <p className="text-muted-foreground text-sm">Select class and board</p>

        <div>
          <Label className="mb-2 block">Class *</Label>
          <div className="flex flex-wrap gap-2">
            {classes.map((c) => (
              <OptionChip key={c} selected={data.class_level === c} onClick={() => onChange({ class_level: c })}>
                {c}
              </OptionChip>
            ))}
          </div>
        </div>

        <div>
          <Label className="mb-2 block">Board *</Label>
          <div className="flex flex-wrap gap-2">
            {BOARD_OPTIONS.map((b) => (
              <OptionChip key={b} selected={data.board === b} onClick={() => onChange({ board: b })}>
                {b}
              </OptionChip>
            ))}
          </div>
          {data.board === "Other" && (
            <Input
              placeholder="Specify your board"
              value={data.board_other}
              onChange={(e) => onChange({ board_other: e.target.value })}
              maxLength={50}
              className="mt-2"
            />
          )}
        </div>
      </div>
    );
  }

  // === College student (Myself + College) ===
  if (data.user_type === "self" && data.self_subtype === "college") {
    return (
      <div className="space-y-5">
        <p className="text-muted-foreground text-sm">Tell us about your course</p>

        <div>
          <Label htmlFor="course">Course / Degree *</Label>
          <Input
            id="course"
            placeholder="e.g. B.Tech, B.Com, BA, MBA"
            value={data.course}
            onChange={(e) => onChange({ course: e.target.value })}
            maxLength={80}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="spec">Subject / Specialization</Label>
          <Input
            id="spec"
            placeholder="e.g. Computer Science, Economics"
            value={data.specialization}
            onChange={(e) => onChange({ specialization: e.target.value })}
            maxLength={80}
            className="mt-1"
          />
        </div>
      </div>
    );
  }

  // === Adult learner (Myself + Adult) — treat like skill flow ===
  const isAdultOrSkill =
    data.user_type === "skill" ||
    (data.user_type === "self" && data.self_subtype === "adult");

  if (isAdultOrSkill) {
    return (
      <div className="space-y-5">
        <p className="text-muted-foreground text-sm">Learn practical skills with expert tutors</p>

        <div>
          <Label className="mb-2 block">What do you want to learn? *</Label>
          <div className="flex flex-wrap gap-2">
            {SKILL_OPTIONS.map((s) => (
              <OptionChip key={s} selected={data.skill_type === s} onClick={() => onChange({ skill_type: s })}>
                {s}
              </OptionChip>
            ))}
          </div>
          {data.skill_type === "Other" && (
            <Input
              placeholder="Specify the skill / language"
              value={data.specialization}
              onChange={(e) => onChange({ specialization: e.target.value })}
              maxLength={80}
              className="mt-2"
            />
          )}
        </div>

        <div>
          <Label className="mb-2 block">What's your goal? *</Label>
          <div className="flex flex-wrap gap-2">
            {SKILL_GOALS.map((g) => (
              <OptionChip key={g} selected={data.skill_goal === g} onClick={() => onChange({ skill_goal: g })}>
                {g}
              </OptionChip>
            ))}
          </div>
          {data.skill_goal === "Other" && (
            <Input
              placeholder="Tell us your goal"
              value={data.goal_other}
              onChange={(e) => onChange({ goal_other: e.target.value })}
              maxLength={120}
              className="mt-2"
            />
          )}
        </div>
      </div>
    );
  }

  // === Competitive exams ===
  if (data.user_type === "exam") {
    return (
      <div className="space-y-5">
        <p className="text-muted-foreground text-sm">Select your target exam</p>

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
              <OptionChip key={lvl} selected={data.prep_level === lvl} onClick={() => onChange({ prep_level: lvl })}>
                {lvl}
              </OptionChip>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // === Hobby ===
  if (data.user_type === "hobby") {
    return (
      <div className="space-y-5">
        <p className="text-muted-foreground text-sm">Explore your passion with guided learning</p>

        <div>
          <Label className="mb-2 block">Pick your interest *</Label>
          <div className="flex flex-wrap gap-2">
            {HOBBY_OPTIONS.map((h) => (
              <OptionChip key={h} selected={data.hobby_type === h} onClick={() => onChange({ hobby_type: h })}>
                {h}
              </OptionChip>
            ))}
          </div>
          {data.hobby_type === "Other" && (
            <Input
              placeholder="Specify the hobby"
              value={data.specialization}
              onChange={(e) => onChange({ specialization: e.target.value })}
              maxLength={80}
              className="mt-2"
            />
          )}
        </div>

        <div>
          <Label className="mb-2 block">What do you want? *</Label>
          <div className="flex flex-wrap gap-2">
            {HOBBY_GOALS.map((g) => (
              <OptionChip key={g} selected={data.hobby_goal === g} onClick={() => onChange({ hobby_goal: g })}>
                {g}
              </OptionChip>
            ))}
          </div>
          {data.hobby_goal === "Other" && (
            <Input
              placeholder="Tell us your goal"
              value={data.goal_other}
              onChange={(e) => onChange({ goal_other: e.target.value })}
              maxLength={120}
              className="mt-2"
            />
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default DynamicRequirement;
