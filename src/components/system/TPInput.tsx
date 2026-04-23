import React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface TPInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  role?: "admin" | "institute" | "tutor" | "global";
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const TPInput = React.forwardRef<HTMLInputElement, TPInputProps>(
  ({ className, role = "global", label, error, icon, ...props }, ref) => {
    const focusClasses = {
      admin: "focus-visible:ring-tp-admin/30 focus-visible:border-tp-admin",
      institute: "focus-visible:ring-tp-institute/30 focus-visible:border-tp-institute",
      tutor: "focus-visible:ring-tp-tutor/30 focus-visible:border-tp-tutor",
      global: "focus-visible:ring-primary/30 focus-visible:border-primary",
    };

    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
            {label}
          </label>
        )}
        <div className="relative group">
          {icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600 transition-colors">
              {icon}
            </div>
          )}
          <Input
            ref={ref}
            className={cn(
              "h-12 bg-slate-50 border-slate-200 rounded-xl transition-all",
              icon && "pl-11",
              role !== "global" && focusClasses[role],
              error && "border-destructive focus-visible:ring-destructive/20",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-destructive font-medium ml-1">{error}</p>}
      </div>
    );
  }
);

TPInput.displayName = "TPInput";

export { TPInput };
