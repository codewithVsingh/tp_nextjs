import { useState, useMemo, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, CheckCircle, AlertCircle } from "lucide-react";
import OptionChip from "../OptionChip";
import { CITY_OPTIONS, type StepProps } from "../types";

const MODES = [
  { value: "online", label: "Online", emoji: "💻" },
  { value: "home", label: "Home Tutor", emoji: "🏠" },
  { value: "both", label: "Both", emoji: "🔄" },
];

type LocationKind = "none" | "city" | "pincode" | "invalid";

const classifyLocation = (city: string): LocationKind => {
  const trimmed = city.trim();
  if (!trimmed) return "none";
  // Pure digits → must be exactly 6
  if (/^\d+$/.test(trimmed)) return /^\d{6}$/.test(trimmed) ? "pincode" : "invalid";
  // Otherwise must match one of the known cities exactly (case-insensitive)
  const matched = CITY_OPTIONS.find((c) => c.toLowerCase() === trimmed.toLowerCase());
  return matched ? "city" : "invalid";
};

const LocationMode = ({ data, onChange }: StepProps) => {
  const [query, setQuery] = useState(data.city);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || /^\d/.test(q)) return [];
    return CITY_OPTIONS.filter((c) => c.toLowerCase().includes(q)).slice(0, 6);
  }, [query]);

  const kind = classifyLocation(data.city);
  const requireArea = data.mode === "home" || data.mode === "both";

  const handleSelectCity = (city: string) => {
    setQuery(city);
    onChange({ city });
    setShowSuggestions(false);
  };

  const handleInputChange = (val: string) => {
    setQuery(val);
    // For pincodes: persist only when user types digits — final validity checked on canNext
    onChange({ city: val });
    setShowSuggestions(true);
  };

  return (
    <div className="space-y-5">
      <div>
        <Label className="mb-1 block">City or Pincode *</Label>
        <p className="text-xs text-muted-foreground mb-2">Type your city name and pick from the list, or enter a 6-digit pincode</p>
        <div ref={wrapperRef} className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
          <Input
            id="lead-city"
            placeholder="e.g. Bangalore or 560001"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            maxLength={100}
            className="pl-10"
            autoComplete="off"
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-20 left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-md max-h-56 overflow-auto">
              {suggestions.map((c) => (
                <li key={c}>
                  <button
                    type="button"
                    onClick={() => handleSelectCity(c)}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-accent transition-colors"
                  >
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {kind === "city" && (
          <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Tutors available in {data.city.trim()}
          </p>
        )}
        {kind === "pincode" && (
          <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Pincode {data.city.trim()} accepted
          </p>
        )}
        {kind === "invalid" && (
          <p className="text-xs text-destructive mt-1.5 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Pick a city from the list or enter a valid 6-digit pincode
          </p>
        )}
      </div>

      {requireArea && (
        <div>
          <Label htmlFor="lead-area">Area / Locality *</Label>
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
