import { Label } from "@/components/ui/label";
import OptionChip from "../OptionChip";
import type { StepProps } from "../types";

const TIME_OPTIONS = ["Morning", "Afternoon", "Evening", "Flexible"];
const FREQUENCY_OPTIONS = ["Daily", "3–4 days/week", "Weekend"];
const START_OPTIONS = ["Immediately", "Within a week", "Just exploring"];

const SchedulePrefs = ({ data, onChange }: StepProps) => (
  <div className="space-y-5">
    <div>
      <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-1">
        Schedule Preferences
      </h2>
      <p className="text-muted-foreground text-sm">Almost done! Set your preferred schedule</p>
    </div>

    <div>
      <Label className="mb-2 block">Preferred Time *</Label>
      <div className="flex flex-wrap gap-2">
        {TIME_OPTIONS.map((t) => (
          <OptionChip key={t} selected={data.preferred_time === t} onClick={() => onChange({ preferred_time: t })}>
            {t}
          </OptionChip>
        ))}
      </div>
    </div>

    <div>
      <Label className="mb-2 block">Frequency *</Label>
      <div className="flex flex-wrap gap-2">
        {FREQUENCY_OPTIONS.map((f) => (
          <OptionChip key={f} selected={data.frequency === f} onClick={() => onChange({ frequency: f })}>
            {f}
          </OptionChip>
        ))}
      </div>
    </div>

    <div>
      <Label className="mb-2 block">When do you want to start? *</Label>
      <div className="flex flex-wrap gap-2">
        {START_OPTIONS.map((s) => (
          <OptionChip key={s} selected={data.start_time === s} onClick={() => onChange({ start_time: s })}>
            {s}
          </OptionChip>
        ))}
      </div>
    </div>
  </div>
);

export default SchedulePrefs;
