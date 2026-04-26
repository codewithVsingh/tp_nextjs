import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import OptionChip from "../OptionChip";
import { CITY_OPTIONS, isValidCityOrPincode, type StepProps } from "../types";
import { supabase } from "@/integrations/supabase/client";
import PremiumSelect from "../PremiumSelect";

const MODES = [
  { value: "online", label: "Online", emoji: "💻" },
  { value: "home", label: "Home Tutor", emoji: "🏠" },
  { value: "any", label: "Any", emoji: "🔄" },
];

type LocationKind = "none" | "city" | "pincode" | "invalid";

const classifyLocation = (city: string): LocationKind => {
  const trimmed = city.trim();
  if (!trimmed) return "none";
  // Pure digits → must be exactly 6
  if (/^\d+$/.test(trimmed)) return /^\d{6}$/.test(trimmed) ? "pincode" : "invalid";
  // Otherwise: accept any plausible city/locality name (≥ 3 letters).
  return isValidCityOrPincode(trimmed) ? "city" : "invalid";
};

const PRIORITIZED_CITIES = [
  "Delhi", "New Delhi", "Noida", "Gurgaon", "Ghaziabad", "Faridabad",
  "Mumbai", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad"
];

const LocationMode = ({ data, onChange }: StepProps) => {
  const [cities, setCities] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // 1. Load All Cities on Mount
  useEffect(() => {
    const init = async () => {
      const { data: c } = await supabase.from('cities').select('*, states(name)').order('name');
      if (c) {
        // Sort: Prioritized first, then alphabetical
        const sorted = [...c].sort((a, b) => {
          const aPri = PRIORITIZED_CITIES.indexOf(a.name);
          const bPri = PRIORITIZED_CITIES.indexOf(b.name);
          
          if (aPri !== -1 && bPri !== -1) return aPri - bPri;
          if (aPri !== -1) return -1;
          if (bPri !== -1) return 1;
          return a.name.localeCompare(b.name);
        });
        
        setCities(sorted);
        
        if (data.city) {
          const cityObj = sorted.find(item => item.name === data.city);
          if (cityObj) setSelectedCity(cityObj);
        }
      }
    };
    init();
  }, []);

  // 2. Load Areas when City changes
  useEffect(() => {
    const fetchAreas = async () => {
      if (!selectedCity) return;
      setLoading(true);
      const { data: a } = await supabase.from('areas').select('*').eq('city_id', selectedCity.id).order('name');
      if (a) setAreas(a);
      setLoading(false);
    };
    fetchAreas();
  }, [selectedCity]);

  const requireArea = data.mode?.toLowerCase() === "home" || data.mode?.toLowerCase() === "any" || data.mode?.toLowerCase() === "both";

  const getAreaPlaceholder = () => {
    const c = (selectedCity?.name || data.city || "").toLowerCase();
    if (c.includes('delhi')) return "e.g. Rohini, Pitampura, Janakpuri";
    if (c.includes('bangalore')) return "e.g. Koramangala, Indiranagar, HSR Layout";
    if (c.includes('mumbai')) return "e.g. Andheri, Borivali, Powai";
    return "Search your area...";
  };

  return (
    <div className="space-y-5">
      <div className="space-y-4">
        {/* Unified City Selection */}
        <div className="relative">
          <PremiumSelect
            label="City *"
            options={cities.map(c => ({ 
              id: c.id, 
              name: PRIORITIZED_CITIES.includes(c.name) ? `${c.name} (Popular)` : c.name 
            }))}
            value={data.city}
            onChange={(id, name) => {
              const cleanName = name.replace(" (Popular)", "");
              const cityObj = cities.find(c => c.id === id);
              setSelectedCity(cityObj);
              onChange({ 
                city: cleanName, 
                state: cityObj?.states?.name || "",
                area: "" 
              });
            }}
            placeholder="Search or select city..."
          />
        </div>

        <div>
          <Label className="mb-3 block text-xs font-black uppercase tracking-widest text-primary/70 ml-1">Learning Mode *</Label>
          <div className="grid grid-cols-3 gap-2">
            {MODES.map((m) => (
              <OptionChip
                key={m.value}
                variant="card"
                selected={data.mode === m.value}
                onClick={() => onChange({ mode: m.value })}
                className="py-3 h-16 md:h-18"
              >
                <div className="text-lg md:text-lg mb-0.5 md:mb-1">{m.emoji}</div>
                <div className="text-[9px] md:text-[10px] font-bold uppercase tracking-tight leading-none">{m.label}</div>
              </OptionChip>
            ))}
          </div>
        </div>
      </div>

      {/* Area Selection (PremiumSelect) - Only for Home/Any */}
      <AnimatePresence>
        {requireArea && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }}
            className="overflow-visible pb-40"
          >
            <div className="pt-2">
              <PremiumSelect
                label="Area / Locality *"
                options={areas.map(a => ({ id: a.name, name: a.name }))}
                value={data.area}
                onChange={(id) => {
                  onChange({ area: id });
                }}
                placeholder={selectedCity ? getAreaPlaceholder() : "Select city first"}
              />
              {loading && <p className="text-[9px] font-black text-primary animate-pulse mt-2 uppercase tracking-widest ml-1">Finding local experts in {selectedCity?.name}...</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LocationMode;

