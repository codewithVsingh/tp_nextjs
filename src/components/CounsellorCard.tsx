import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CounsellorCardProps {
  name: string;
  expertise: string;
  experience: string;
  bio: string;
  rating: number;
  initials: string;
}

const CounsellorCard = ({ name, expertise, experience, bio, rating, initials }: CounsellorCardProps) => (
  <div className="bg-background rounded-2xl p-6 card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shrink-0">
        <span className="text-primary-foreground font-bold text-xl">{initials}</span>
      </div>
      <div>
        <h3 className="font-heading font-semibold text-lg text-foreground">{name}</h3>
        <p className="text-primary text-sm font-medium">{expertise}</p>
        <p className="text-muted-foreground text-xs">{experience}</p>
      </div>
    </div>
    <p className="text-muted-foreground text-sm leading-relaxed mb-4">{bio}</p>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? "fill-secondary text-secondary" : "text-muted-foreground/30"}`} />
        ))}
        <span className="text-sm text-muted-foreground ml-1">{rating}</span>
      </div>
      <Button variant="cta" size="sm">Book a Slot</Button>
    </div>
  </div>
);

export default CounsellorCard;

