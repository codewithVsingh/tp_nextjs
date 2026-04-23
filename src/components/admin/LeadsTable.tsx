import { format, parseISO } from "date-fns";
import { MoreHorizontal, Phone, CheckCircle2, XCircle, ArrowRightCircle, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LeadsTableProps {
  leads: any[];
  onRowClick: (lead: any) => void;
  onUpdateStatus: (id: string, newStatus: string) => void;
}

export const LeadsTable = ({ leads, onRowClick, onUpdateStatus }: LeadsTableProps) => {

  const getStatusBadge = (status: string | undefined, verified: boolean) => {
    const finalStatus = status || (verified ? "Contacted" : "New Lead");
    switch (finalStatus) {
      case "New Lead":
        return <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200">🆕 New Lead</Badge>;
      case "Contacted":
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">📞 Contacted</Badge>;
      case "Trial Booked":
        return <Badge variant="outline" className="bg-violet-50 text-violet-600 border-violet-200">📅 Trial Booked</Badge>;
      case "Trial Done":
        return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">✅ Trial Done</Badge>;
      case "Converted":
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200">🎉 Converted</Badge>;
      case "Dropped":
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">❌ Dropped</Badge>;
      // Legacy fallbacks
      case "Pending":  return <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200">🆕 New Lead</Badge>;
      case "Verified": return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">📞 Contacted</Badge>;
      default:
        return <Badge variant="outline">{finalStatus}</Badge>;
    }
  };

  if (leads.length === 0) {
    return <div className="text-center py-12 text-gray-500">No leads found matching the filters.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-600">
        <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b">
          <tr>
            <th className="px-6 py-4 font-medium">Date</th>
            <th className="px-6 py-4 font-medium">Name</th>
            <th className="px-6 py-4 font-medium">Course/Class</th>
            <th className="px-6 py-4 font-medium">City</th>
            <th className="px-6 py-4 font-medium">Status</th>
            <th className="px-6 py-4 font-medium">Source</th>
            <th className="px-6 py-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {leads.map((lead) => (
            <tr 
              key={lead.id} 
              className="bg-white hover:bg-gray-50 transition-colors group cursor-pointer"
              onClick={() => onRowClick(lead)}
            >
              <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                {lead.created_at ? format(parseISO(lead.created_at), "dd MMM, yyyy") : '-'}
              </td>
              <td className="px-6 py-4">
                <div className="font-semibold text-gray-900">{lead.name || 'Unknown'}</div>
                <div className="text-xs text-gray-500">{lead.phone}</div>
              </td>
              <td className="px-6 py-4">
                <div className="font-medium text-gray-900">{lead.class_level || lead.exam || '-'}</div>
                <div className="text-xs text-gray-500 truncate max-w-[150px]">{lead.subjects?.join(', ')}</div>
              </td>
              <td className="px-6 py-4">{lead.city || '-'} {lead.area ? `(${lead.area})` : ''}</td>
              <td className="px-6 py-4">
                {getStatusBadge(lead.status, lead.otp_verified)}
              </td>
              <td className="px-6 py-4">
                <div className="text-[10px] font-bold text-indigo-600 truncate max-w-[120px]" title={lead.source_page || lead.source}>
                  {lead.source_page || lead.source || 'Direct'}
                </div>
                <div className="text-[9px] text-gray-400 truncate max-w-[120px]" title={lead.source_cta}>
                  {lead.source_cta || '-'}
                </div>
              </td>
              <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-end gap-2 items-center">
                  <a 
                    href={`https://wa.me/91${lead.phone}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors hidden group-hover:block"
                    title="WhatsApp"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                  </a>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Move to Stage</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onUpdateStatus(lead.id, "Contacted")}>
                        <ArrowRightCircle className="w-4 h-4 mr-2 text-blue-500" /> Contacted
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onUpdateStatus(lead.id, "Trial Booked")}>
                        <ArrowRightCircle className="w-4 h-4 mr-2 text-violet-500" /> Trial Booked
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onUpdateStatus(lead.id, "Trial Done")}>
                        <CheckCircle2 className="w-4 h-4 mr-2 text-amber-500" /> Trial Done
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onUpdateStatus(lead.id, "Converted")}>
                        <Target className="w-4 h-4 mr-2 text-emerald-500" /> Converted
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onUpdateStatus(lead.id, "Dropped")} className="text-red-600 focus:text-red-600">
                        <XCircle className="w-4 h-4 mr-2" /> Dropped
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
