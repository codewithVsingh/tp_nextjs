import React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface TPButtonProps extends ButtonProps {
  role?: "admin" | "institute" | "tutor" | "global";
}

const TPButton = React.forwardRef<HTMLButtonElement, TPButtonProps>(
  ({ className, role = "global", variant = "default", ...props }, ref) => {
    const roleClasses = {
      admin: "bg-tp-admin hover:bg-tp-admin/90 text-white shadow-lg shadow-tp-admin/20",
      institute: "bg-tp-institute hover:bg-tp-institute/90 text-white shadow-lg shadow-tp-institute/20",
      tutor: "bg-tp-tutor hover:bg-tp-tutor/90 text-white shadow-lg shadow-tp-tutor/20",
      global: "",
    };

    return (
      <Button
        ref={ref}
        className={cn(
          "rounded-xl font-bold transition-all active:scale-[0.98]",
          role !== "global" && variant === "default" && roleClasses[role],
          className
        )}
        variant={variant}
        {...props}
      />
    );
  }
);

TPButton.displayName = "TPButton";

export { TPButton };
