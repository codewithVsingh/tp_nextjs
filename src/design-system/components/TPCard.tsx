import React from "react";
import { cn } from "@/lib/utils";

export interface TPCardProps extends React.HTMLAttributes<HTMLDivElement> {
  role?: "admin" | "institute" | "tutor" | "global";
  glass?: boolean;
}

const TPCard = React.forwardRef<HTMLDivElement, TPCardProps>(
  ({ className, role = "global", glass = false, children, ...props }, ref) => {
    const roleBorderClasses = {
      admin: "hover:border-tp-admin/30",
      institute: "hover:border-tp-institute/30",
      tutor: "hover:border-tp-tutor/30",
      global: "hover:border-primary/30",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl border border-slate-100 bg-white p-6 transition-all duration-300",
          glass && "bg-white/80 backdrop-blur-md border-white/20",
          "card-shadow hover:card-shadow-hover",
          role !== "global" && roleBorderClasses[role],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TPCard.displayName = "TPCard";

export { TPCard };

