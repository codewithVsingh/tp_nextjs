"use client";

import * as React from "react";
import { Button as ShadcnButton, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * TPButton: The authoritative button component for Tutors Parliament.
 * Enforces role-based visual contracts and interaction feedback.
 */
export interface TPButtonProps extends ButtonProps {
  roleVariant?: "admin" | "institute" | "tutor" | "shared";
  isLoading?: boolean;
}

export const TPButton = React.forwardRef<HTMLButtonElement, TPButtonProps>(
  ({ className, roleVariant = "shared", isLoading, children, disabled, ...props }, ref) => {
    const roleClasses = {
      admin: "bg-tp-admin hover:bg-blue-700 shadow-blue-200/50",
      institute: "bg-tp-institute hover:bg-teal-700 shadow-teal-200/50",
      tutor: "bg-tp-tutor hover:bg-indigo-700 shadow-indigo-200/50",
      shared: "",
    };

    return (
      <ShadcnButton
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "btn-press font-bold transition-all active:scale-95 shadow-sm",
          roleVariant !== "shared" && roleClasses[roleVariant],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Loading...
          </span>
        ) : children}
      </ShadcnButton>
    );
  }
);

TPButton.displayName = "TPButton";
