import { USER_TYPES, type LeadData } from "../types";

interface ReviewSubmitProps {
  data: LeadData;
  onEditStep: (step: number) => void;
}

const Row = ({ label, value, step, onEdit }: { label: string; value: string; step: number; onEdit: (s: number) => void }) => {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
      <button
        type="button"
        onClick={() => onEdit(step)}
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

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-1">
          Review Your Details
        </h2>
        <p className="text-muted-foreground text-sm">Make sure everything looks correct</p>
      </div>

      <div className="bg-muted/30 rounded-xl p-4 border border-border">
        <Row label="Phone" value={`+91 ${data.phone}`} step={0} onEdit={onEditStep} />
        {data.name && <Row label="Name" value={data.name} step={0} onEdit={onEditStep} />}
        <Row label="Looking for" value={userTypeLabel} step={2} onEdit={onEditStep} />
        <Row label="Location" value={[data.city, data.area].filter(Boolean).join(", ")} step={3} onEdit={onEditStep} />
        <Row label="Mode" value={modeLabel} step={3} onEdit={onEditStep} />

        {(data.user_type === "child" || data.user_type === "self") && (
          <>
            <Row label="Class" value={data.class_level} step={4} onEdit={onEditStep} />
            <Row label="Board" value={data.board} step={4} onEdit={onEditStep} />
          </>
        )}

        {data.user_type === "exam" && (
          <>
            <Row label="Exam" value={data.exam} step={4} onEdit={onEditStep} />
            <Row label="Prep Level" value={data.prep_level} step={4} onEdit={onEditStep} />
          </>
        )}

        {data.user_type === "skill" && (
          <Row label="Skill" value={data.skill_type} step={4} onEdit={onEditStep} />
        )}

        {data.user_type === "hobby" && (
          <Row label="Hobby" value={data.hobby_type} step={4} onEdit={onEditStep} />
        )}

        {data.subjects.length > 0 && (
          <Row label="Subjects" value={data.subjects.join(", ")} step={5} onEdit={onEditStep} />
        )}
        {data.goals.length > 0 && (
          <Row label="Goals" value={data.goals.join(", ")} step={5} onEdit={onEditStep} />
        )}
        <Row label="Time" value={data.preferred_time} step={6} onEdit={onEditStep} />
        <Row label="Frequency" value={data.frequency} step={6} onEdit={onEditStep} />
        <Row label="Start" value={data.start_time} step={6} onEdit={onEditStep} />
      </div>
    </div>
  );
};

export default ReviewSubmit;
