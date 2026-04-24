"use client";

import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Popover, PopoverContent, PopoverTrigger 
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface FilterOption {
  label: string;
  value: string;
}

interface TPSmartFiltersProps {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (val: string) => void;
  activeFiltersCount: number;
  onClearFilters: () => void;
  children: React.ReactNode; // For the filter dropdowns/controls
}

export const TPSmartFilters = ({
  searchPlaceholder = "Search records...",
  searchValue,
  onSearchChange,
  activeFiltersCount,
  onClearFilters,
  children
}: TPSmartFiltersProps) => {
  return (
    <div className="flex flex-wrap items-center gap-3 bg-white/50 backdrop-blur-sm p-1.5 rounded-xl border border-slate-200/60 shadow-sm">
      <div className="relative w-full max-w-xs shrink-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input 
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-9 bg-white border-slate-200 focus-visible:ring-indigo-500 text-[13px]"
        />
      </div>

      <div className="flex-1 flex items-center gap-3 overflow-hidden">
        {children}
      </div>

      <div className="flex items-center gap-2 border-l border-slate-200 pl-3 ml-1 shrink-0">
        {activeFiltersCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearFilters}
            className="h-9 px-3 text-slate-500 hover:text-indigo-600 text-[11px] font-bold uppercase tracking-tight"
          >
            Clear All <X className="w-3 h-3 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
};
