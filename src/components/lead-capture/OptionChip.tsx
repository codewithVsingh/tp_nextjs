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
      "transition-all duration-200 font-medium text-sm border-2",
      variant === "chip"
        ? cn(
            "px-4 py-2 rounded-full",
            selected
              ? "border-primary bg-primary/5 text-primary shadow-sm"
              : "border-border bg-background text-foreground hover:border-primary/50 hover:bg-accent/40"
          )
        : cn(
            "p-3 md:p-4 rounded-xl text-center flex flex-col items-center justify-center gap-1",
            selected
              ? "border-primary bg-primary/5 text-primary shadow-md"
              : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-accent/30"
          ),
      className
    )}
  >
    {children}
  </button>
);

export default OptionChip;

