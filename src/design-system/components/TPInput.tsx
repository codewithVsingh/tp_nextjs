"use client";

import * as React from "react";
import { Input as ShadcnInput } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * TPInput: The authoritative input component.
 * Standardizes typography and focus behavior across all modules.
 */
export interface TPInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const TPInput = React.forwardRef<HTMLInputElement, TPInputProps>(
  ({ className, error, label, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
            {label}
          </label>
        ) }
        <ShadcnInput
          ref={ref}
          className={cn(
            "h-10 text-[13px] border-slate-200 focus-visible:ring-indigo-500 bg-white transition-all",
            error && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-[10px] font-bold text-red-500 ml-1">{error}</p>
        )}
      </div>
    );
  }
);

TPInput.displayName = "TPInput";
