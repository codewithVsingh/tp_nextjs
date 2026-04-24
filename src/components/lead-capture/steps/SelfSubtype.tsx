import OptionChip from "../OptionChip";
import { SELF_SUBTYPES, type StepProps } from "../types";

const SelfSubtype = ({ data, onChange }: StepProps) => (
  <div className="space-y-5">
    <div>
      <p className="text-muted-foreground text-sm">Pick what best describes you so we can personalize the next steps</p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {SELF_SUBTYPES.map((s) => (
        <OptionChip
          key={s.value}
          variant="card"
          selected={data.self_subtype === s.value}
          onClick={() => {
            const updates: Partial<typeof data> = { self_subtype: s.value };
            // Reset downstream fields when switching subtype
            if (s.value !== "school") { updates.class_level = ""; updates.board = ""; }
            if (s.value !== "college") { updates.course = ""; updates.specialization = ""; }
            onChange(updates);
          }}
          className="py-5"
        >
          <div className="text-3xl mb-2">{s.emoji}</div>
          <div className="font-semibold text-sm">{s.label}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{s.subtitle}</div>
        </OptionChip>
      ))}
    </div>

    {data.self_subtype === "adult" && (
      <p className="text-xs text-primary bg-primary/10 rounded-lg p-3">
        Great — we'll redirect you to skill-based learning options on the next step.
      </p>
    )}
  </div>
);

export default SelfSubtype;

