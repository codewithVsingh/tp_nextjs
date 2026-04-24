import { USER_TYPES, type LeadData } from "../types";

export type ReviewEditTarget =
  | "phone" | "user_type" | "self_subtype" | "location" | "details" | "subjects_goals" | "schedule" | "tutor_gender";

interface ReviewSubmitProps {
  data: LeadData;
  onEditStep: (target: ReviewEditTarget) => void;
}

const Row = ({ label, value, target, onEdit }: { label: string; value: string; target: ReviewEditTarget; onEdit: (s: ReviewEditTarget) => void }) => {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
      <button
        type="button"
        onClick={() => onEdit(target)}
        className="text-xs text-primary hover:underline"
      >
        Edit
      </button>
    </div>
  );
};

const ReviewSubmit = ({ data, onEditStep }: ReviewSubmitProps) => {
  const userTypeLabel = USER_TYPES.find((t) => t.value === data.user_type)?.label || data.user_type;
  const modeLabel = data.mode === "home" ? "Home Tutor" : data.mode === "online" ? "Online" : data.mode === "both" ? "Both" : "";
  const boardDisplay = data.board === "Other" ? (data.board_other || "Other") : data.board;

  return (
    <div className="space-y-5">
      <p className="text-muted-foreground text-sm">Make sure everything looks correct before submitting</p>

      <div className="bg-muted/30 rounded-xl p-4 border border-border">
        <Row label="Phone" value={`+91 ${data.phone}`} target="phone" onEdit={onEditStep} />
        {data.name && <Row label="Name" value={data.name} target="phone" onEdit={onEditStep} />}
        <Row label="Looking for" value={userTypeLabel} target="user_type" onEdit={onEditStep} />
        {data.user_type === "self" && data.self_subtype && (
          <Row label="Type" value={data.self_subtype} target="self_subtype" onEdit={onEditStep} />
        )}
        <Row label="Location" value={[data.city, data.area].filter(Boolean).join(", ")} target="location" onEdit={onEditStep} />
        <Row label="Mode" value={modeLabel} target="location" onEdit={onEditStep} />

        <Row label="Class" value={data.class_level} target="details" onEdit={onEditStep} />
        <Row label="Board" value={boardDisplay} target="details" onEdit={onEditStep} />
        <Row label="Course" value={data.course} target="details" onEdit={onEditStep} />
        <Row label="Specialization" value={data.specialization} target="details" onEdit={onEditStep} />
        <Row label="Exam" value={data.exam} target="details" onEdit={onEditStep} />
        <Row label="Prep Level" value={data.prep_level} target="details" onEdit={onEditStep} />
        <Row label="Skill" value={data.skill_type} target="details" onEdit={onEditStep} />
        <Row label="Skill Goal" value={data.skill_goal} target="details" onEdit={onEditStep} />
        <Row label="Hobby" value={data.hobby_type} target="details" onEdit={onEditStep} />
        <Row label="Hobby Goal" value={data.hobby_goal} target="details" onEdit={onEditStep} />

        {data.subjects.length > 0 && (
          <Row label="Subjects" value={data.subjects.join(", ")} target="subjects_goals" onEdit={onEditStep} />
        )}
        {data.goals.length > 0 && (
          <Row label="Goals" value={data.goals.join(", ")} target="subjects_goals" onEdit={onEditStep} />
        )}
        {data.goal_other && <Row label="Other Goal" value={data.goal_other} target="subjects_goals" onEdit={onEditStep} />}
        <Row label="Time" value={data.preferred_time} target="schedule" onEdit={onEditStep} />
        <Row label="Frequency" value={data.frequency} target="schedule" onEdit={onEditStep} />
        <Row label="Start" value={data.start_time} target="schedule" onEdit={onEditStep} />
        <Row label="Preferred Tutor Gender" value={data.preferred_tutor_gender} target="tutor_gender" onEdit={onEditStep} />
      </div>
    </div>
  );
};

export default ReviewSubmit;

