import { cn } from "@/lib/utils";

interface OptionChipProps {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  variant?: "card" | "chip";
}

const OptionChip = ({ selected, onClick, children, className, variant = "chip" }: OptionChipProps) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "transition-all duration-200 font-medium text-sm",
      variant === "chip"
        ? cn(
            "px-4 py-2.5 rounded-full border",
            selected
              ? "border-primary bg-primary text-primary-foreground shadow-sm"
              : "border-border bg-background text-foreground hover:border-primary/50 hover:bg-accent/40"
          )
        : cn(
            "p-4 rounded-xl border-2 text-center",
            selected
              ? "border-primary bg-accent text-accent-foreground shadow-md"
              : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-accent/30"
          ),
      className
    )}
  >
    {children}
  </button>
);

export default OptionChip;
