"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Tag, Download, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TPBulkActionToolbarProps {
  selectedCount: number;
  onClear: () => void;
  actions: {
    label: string;
    icon: any;
    onClick: () => void;
    variant?: "default" | "destructive" | "outline";
  }[];
}

export const TPBulkActionToolbar = ({
  selectedCount,
  onClear,
  actions
}: TPBulkActionToolbarProps) => {
  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-2xl px-4"
        >
          <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-2xl flex items-center justify-between border border-white/10 backdrop-blur-xl">
            <div className="flex items-center gap-4 pl-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-[11px] font-black">
                {selectedCount}
              </div>
              <span className="text-[13px] font-bold">Selected</span>
              <div className="h-4 w-[1px] bg-white/20 mx-1" />
              <button 
                onClick={onClear}
                className="text-[11px] text-white/50 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>

            <div className="flex items-center gap-2">
              {actions.map((action, i) => (
                <Button
                  key={i}
                  size="sm"
                  variant="ghost"
                  onClick={action.onClick}
                  className={cn(
                    "h-9 px-4 text-[11px] font-bold border border-white/10 hover:bg-white/10 text-white transition-all",
                    action.variant === "destructive" && "hover:bg-rose-500/20 hover:text-rose-400 border-rose-500/20 text-rose-500"
                  )}
                >
                  <action.icon className="w-3.5 h-3.5 mr-2" />
                  {action.label}
                </Button>
              ))}
              <div className="h-4 w-[1px] bg-white/20 mx-1" />
              <Button
                size="icon"
                variant="ghost"
                onClick={onClear}
                className="h-9 w-9 text-white/50 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
