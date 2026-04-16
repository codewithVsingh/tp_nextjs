import OptionChip from "../OptionChip";
import { USER_TYPES, type StepProps } from "../types";

const UserTypeSelect = ({ data, onChange }: StepProps) => (
  <div className="space-y-5">
    <div>
      <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-1">
        Who do you need a tutor for?
      </h2>
      <p className="text-muted-foreground text-sm">Select one to personalize your experience</p>
    </div>

    <div className="grid grid-cols-2 gap-3">
      {USER_TYPES.map((type) => (
        <OptionChip
          key={type.value}
          variant="card"
          selected={data.user_type === type.value}
          onClick={() => onChange({ user_type: type.value })}
          className="py-6"
        >
          <div className="text-3xl mb-2">{type.emoji}</div>
          <div className="font-semibold text-sm">{type.label}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{type.subtitle}</div>
        </OptionChip>
      ))}
    </div>
  </div>
);

export default UserTypeSelect;
