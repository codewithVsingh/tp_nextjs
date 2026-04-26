import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
  id: string;
  name: string;
}

interface PremiumSelectProps {
  options: Option[];
  value: string;
  onChange: (id: string, name: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  showSearch?: boolean;
}

const PremiumSelect = ({ options, value, onChange, placeholder = "Select...", label, className, showSearch = true }: PremiumSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openUpwards, setOpenUpwards] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (searchInputRef.current) searchInputRef.current.focus();
      
      // Smart Positioning
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const dropdownHeight = 350; // Max estimated height
        setOpenUpwards(spaceBelow < dropdownHeight && rect.top > dropdownHeight);
      }
    }
    if (!isOpen) setSearchQuery("");
  }, [isOpen]);

  const selectedOption = options.find(o => o.id === value || o.name === value);

  const filteredOptions = options.filter(o => 
    o.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      {label && (
        <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-primary/70 ml-1">
          {label}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full h-12 md:h-14 px-5 rounded-xl md:rounded-2xl border-2 flex items-center justify-between transition-all duration-300 group bg-white shadow-sm hover:shadow-md text-left",
          isOpen ? "border-primary ring-4 ring-primary/5" : "border-slate-100 hover:border-slate-200"
        )}
      >
        <span className={cn(
          "text-xs md:text-sm font-bold tracking-tight truncate mr-2",
          selectedOption ? "text-slate-900" : "text-slate-400"
        )}>
          {selectedOption ? selectedOption.name : placeholder}
        </span>
        <ChevronDown className={cn(
          "w-4 h-4 md:w-5 md:h-5 text-slate-400 shrink-0 transition-transform duration-300",
          isOpen && "rotate-180 text-primary"
        )} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: openUpwards ? -5 : 5, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: openUpwards ? -5 : 5, scale: 0.98 }}
            className={cn(
              "absolute z-[100] left-0 right-0 bg-white border border-slate-200 rounded-xl md:rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden min-h-[100px]",
              openUpwards ? "bottom-full mb-2" : "top-full mt-2"
            )}
          >
            {showSearch && (
              <div className="p-2 border-b border-slate-100 bg-slate-50/50">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Type to search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-10 pl-9 pr-4 bg-white rounded-lg md:rounded-xl text-xs md:text-sm font-bold border-2 border-slate-100 focus:border-primary/30 focus:ring-0 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            <div className="max-h-48 md:max-h-64 overflow-y-auto custom-scrollbar p-1">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      onChange(option.id, option.name);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-lg md:rounded-xl mb-0.5 flex items-center justify-between transition-all",
                      (value === option.id || value === option.name) 
                        ? "bg-primary text-white shadow-md shadow-primary/20" 
                        : "hover:bg-slate-50 text-slate-700 active:bg-slate-100"
                    )}
                  >
                    <div className="flex flex-col">
                      <span className="text-xs md:text-sm font-bold tracking-tight">
                        {option.name.replace(" (Popular)", "")}
                      </span>
                      {option.name.includes("(Popular)") && (
                        <span className={cn(
                          "text-[8px] font-black uppercase tracking-tighter",
                          (value === option.id || value === option.name) ? "text-white/80" : "text-primary"
                        )}>
                          Popular in NCR
                        </span>
                      )}
                    </div>
                    {(value === option.id || value === option.name) && (
                      <Check className="w-3.5 h-3.5 shrink-0" />
                    )}
                  </button>
                ))
              ) : (
                <div className="py-10 text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No matching results</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PremiumSelect;
