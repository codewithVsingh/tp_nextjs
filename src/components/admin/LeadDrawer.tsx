import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { MapPin, Phone, Mail, BookOpen, GraduationCap, Target, Clock, CalendarDays, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LeadDrawerProps {
  lead: any | null;
  isOpen: boolean;
  onClose: () => void;
}

const getStatusColor = (status: string | undefined, verified: boolean) => {
  const finalStatus = status || (verified ? "Verified" : "Pending");
  switch (finalStatus) {
    case "Converted": return "bg-blue-100 text-blue-800 border-blue-200";
    case "Dropped": return "bg-red-100 text-red-800 border-red-200";
    case "Contacted": return "bg-purple-100 text-purple-800 border-purple-200";
    case "Verified": return "bg-green-100 text-green-800 border-green-200";
    default: return "bg-orange-100 text-orange-800 border-orange-200";
  }
};

export const LeadDrawer = ({ lead, isOpen, onClose }: LeadDrawerProps) => {
  if (!lead) return null;

  const currentStatus = lead.status || (lead.otp_verified ? "Verified" : "Pending");

  return (
    <Sheet open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-6 border-b">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className={getStatusColor(lead.status, lead.otp_verified)}>
              {currentStatus}
            </Badge>
            <span className="text-xs text-gray-400 font-medium tracking-wide">
              {format(parseISO(lead.created_at), "PPp")}
            </span>
          </div>
          <SheetTitle className="text-2xl pt-2">{lead.name || "Unknown Lead"}</SheetTitle>
          <SheetDescription className="flex items-center gap-1.5 text-gray-500">
            <MapPin className="w-4 h-4" /> {lead.city || "No city"} {lead.area ? `(${lead.area})` : ""}
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-8">
          {/* Quick Actions */}
          <div className="flex gap-3">
            <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => window.open(`https://wa.me/91${lead.phone}`, '_blank')}>
              WhatsApp
            </Button>
            <Button className="flex-1" variant="outline" onClick={() => window.open(`tel:${lead.phone}`, '_self')}>
              <Phone className="w-4 h-4 mr-2" /> Call
            </Button>
          </div>

          {/* Details Grid */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" /> Lead Requirements
            </h3>
            
            <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 mb-1 flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5"/> Class / Exam</p>
                <p className="font-medium">{lead.class_level || lead.exam || "-"}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1 flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5"/> Subjects</p>
                <p className="font-medium">{lead.subjects?.join(", ") || "-"}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1 flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5"/> Mode</p>
                <p className="font-medium capitalize">{lead.mode || "-"}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/> Pref. Time</p>
                <p className="font-medium">{lead.preferred_time || "-"}</p>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-500" /> Contact Info
            </h3>
            <div className="bg-gray-50 rounded-xl p-4 space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Phone</span>
                <span className="font-medium">{lead.phone}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">User Type</span>
                <span className="font-medium capitalize">{lead.user_type || "-"}</span>
              </div>
            </div>
          </div>

        </div>
      </SheetContent>
    </Sheet>
  );
};
