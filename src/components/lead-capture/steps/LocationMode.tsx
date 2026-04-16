import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, CheckCircle } from "lucide-react";
import OptionChip from "../OptionChip";
import type { StepProps } from "../types";

const MODES = [
  { value: "online", label: "Online", emoji: "💻" },
  { value: "home", label: "Home Tutor", emoji: "🏠" },
  { value: "both", label: "Both", emoji: "🔄" },
];

const LocationMode = ({ data, onChange }: StepProps) => {
  const [availability, setAvailability] = useState<string | null>(null);

  useEffect(() => {
    if (data.city.trim().length >= 3) {
      setAvailability(`✅ Tutors available in ${data.city}!`);
    } else {
      setAvailability(null);
    }
  }, [data.city]);

  const requireArea = data.mode === "home" || data.mode === "both";

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-1">
          Location & Preferences
        </h2>
        <p className="text-muted-foreground text-sm">Help us find tutors near you</p>
      </div>

      <div>
        <Label htmlFor="lead-city">City / Pincode *</Label>
        <div className="relative mt-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="lead-city"
            placeholder="e.g. Bangalore, 560001"
            value={data.city}
            onChange={(e) => onChange({ city: e.target.value })}
            maxLength={100}
            className="pl-10"
          />
        </div>
        {availability && (
          <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> {availability}
          </p>
        )}
      </div>

      {requireArea && (
        <div>
          <Label htmlFor="lead-area">Area / Locality {requireArea ? "*" : "(optional)"}</Label>
          <Input
            id="lead-area"
            placeholder="e.g. Koramangala, Sector 62"
            value={data.area}
            onChange={(e) => onChange({ area: e.target.value })}
            maxLength={100}
            className="mt-1"
          />
        </div>
      )}

      <div>
        <Label className="mb-2 block">Mode of Learning *</Label>
        <div className="grid grid-cols-3 gap-3">
          {MODES.map((m) => (
            <OptionChip
              key={m.value}
              variant="card"
              selected={data.mode === m.value}
              onClick={() => onChange({ mode: m.value })}
              className="py-5"
            >
              <div className="text-2xl mb-1">{m.emoji}</div>
              <div className="text-xs font-semibold">{m.label}</div>
            </OptionChip>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LocationMode;
