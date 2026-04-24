"use client";

import { GraduationCap, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { TPKPICard } from "@/design-system/components/TPKPICard";

export default function TutorHomeView() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Tutor Academy</h1>
          <p className="text-slate-500">Manage your profile, classes, and earnings.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <TPKPICard icon={Clock} label="Active Classes" value="3" color="bg-indigo-50 text-indigo-700" />
        <TPKPICard icon={GraduationCap} label="Assigned Leads" value="12" color="bg-blue-50 text-blue-700" />
        <TPKPICard icon={CheckCircle} label="Completed" value="45" color="bg-emerald-50 text-emerald-700" />
        <TPKPICard icon={AlertCircle} label="Pending Logs" value="2" color="bg-amber-50 text-amber-700" />
      </div>

      <div className="h-[400px] border-2 border-dashed border-slate-200 rounded-3xl flex items-center justify-center text-slate-400">
        Feature Migration in Progress...
      </div>
    </div>
  );
}
