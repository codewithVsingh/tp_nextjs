import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, MessageCircle } from "lucide-react";
import { openWhatsApp } from "@/modules/shared/logic/whatsapp";
import { USER_TYPES, type LeadData } from "../types";

interface SuccessRedirectProps {
  data: LeadData;
  onClose?: () => void;
}

const buildWhatsAppMessage = (data: LeadData): string => {
  const userTypeLabel = USER_TYPES.find((t) => t.value === data.user_type)?.label || data.user_type;
  const modeLabel = data.mode === "home" ? "Home Tutor" : data.mode === "online" ? "Online" : "Any";

  const lines = [
    "Hi, I need a tutor.",
    data.name ? `Name: ${data.name}` : "",
    `Phone: ${data.phone}`,
    `For: ${userTypeLabel}`,
    data.state ? `State: ${data.state}` : "",
    data.city ? `City: ${data.city}` : "",
    data.area ? `Area: ${data.area}` : "",
    `Mode: ${modeLabel}`,
    data.class_level ? `Class: ${data.class_level}` : "",
    data.board ? `Board: ${data.board}` : "",
    data.exam ? `Exam: ${data.exam}` : "",
    data.skill_type ? `Skill: ${data.skill_type}` : "",
    data.hobby_type ? `Hobby: ${data.hobby_type}` : "",
    data.subjects.length > 0 ? `Subjects: ${data.subjects.join(", ")}` : "",
    data.goals.length > 0 ? `Goals: ${data.goals.join(", ")}` : "",
    data.preferred_time ? `Time: ${data.preferred_time}` : "",
    data.frequency ? `Frequency: ${data.frequency}` : "",
    data.preferred_tutor_gender ? `Preferred Tutor Gender: ${data.preferred_tutor_gender}` : "",
  ].filter(Boolean).join("\n");

  return lines;
};

const SuccessRedirect = ({ data, onClose }: SuccessRedirectProps) => {
  const whatsappMsg = buildWhatsAppMessage(data);

  useEffect(() => {
    // Auto-open WhatsApp after a short delay
    const timer = setTimeout(() => {
      openWhatsApp(whatsappMsg);
    }, 1500);
    return () => clearTimeout(timer);
  }, [whatsappMsg]);

  return (
    <div className="text-center space-y-6 py-4 px-2">
      <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
      
      <div>
        <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-3 leading-tight">
          Great choice! Your journey starts here. 🚀
        </h2>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
          Your request is now with our expert matching team. We're hand-picking the perfect tutor for your specific goals. Stay close to your phone—the best match is coming your way!
        </p>
      </div>

      <div className="space-y-3">
        <Button
          onClick={() => openWhatsApp(whatsappMsg)}
          className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white h-12"
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          Chat on WhatsApp
        </Button>

        {onClose && (
          <Button variant="outline" onClick={onClose} className="w-full">
            Done
          </Button>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        🔒 Your information is secure and never shared with third parties
      </p>
    </div>
  );
};

export default SuccessRedirect;

