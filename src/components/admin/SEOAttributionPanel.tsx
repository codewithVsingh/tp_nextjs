"use client";

import { useMemo } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell, PieChart, Pie 
} from "recharts";
import { 
  Globe, MousePointer2, Target, BarChart3, 
  MapPin, Award, Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#f97316", "#eab308", "#10b981", "#06b6d4"];

interface SEOAttributionPanelProps {
  leads: any[];
}

export function SEOAttributionPanel({ leads }: SEOAttributionPanelProps) {
  const stats = useMemo(() => {
    const seoLeads = leads.filter(l => l.source_page);
    const totalSEO = seoLeads.length;

    // 1. CTA Performance
    const ctaMap: Record<string, number> = {};
    seoLeads.forEach(l => {
      const cta = l.source_cta || "Unknown";
      ctaMap[cta] = (ctaMap[cta] || 0) + 1;
    });
    const ctaData = Object.entries(ctaMap).map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // 2. Cluster Performance (Derived from slug patterns)
    const clusterMap: Record<string, { total: number; conv: number }> = {
      "Female Tutor": { total: 0, conv: 0 },
      "Board Specific": { total: 0, conv: 0 },
      "Exam Prep": { total: 0, conv: 0 },
      "Class Specific": { total: 0, conv: 0 },
      "Other SEO": { total: 0, conv: 0 },
    };

    seoLeads.forEach(l => {
      const slug = (l.source_page || "").toLowerCase();
      let cluster = "Other SEO";
      if (slug.includes("female-")) cluster = "Female Tutor";
      else if (slug.includes("-cbse-") || slug.includes("-icse-") || slug.includes("-ib-")) cluster = "Board Specific";
      else if (slug.includes("jee-") || slug.includes("neet-") || slug.includes("cuet-") || slug.includes("-coaching-")) cluster = "Exam Prep";
      else if (slug.match(/class-\d+/)) cluster = "Class Specific";

      clusterMap[cluster].total++;
      if (l.status === "Converted") clusterMap[cluster].conv++;
    });

    const clusterData = Object.entries(clusterMap)
      .map(([name, v]) => ({ 
        name, 
        leads: v.total, 
        rate: v.total > 0 ? Math.round((v.conv / v.total) * 100) : 0 
      }))
      .filter(c => c.leads > 0)
      .sort((a, b) => b.leads - a.leads);

    // 3. Top Localities (Area)
    const areaMap: Record<string, number> = {};
    seoLeads.forEach(l => {
      if (l.area) areaMap[l.area] = (areaMap[l.area] || 0) + 1;
    });
    const areaData = Object.entries(areaMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);

    // 4. Top Performing Slugs
    const slugMap: Record<string, number> = {};
    seoLeads.forEach(l => {
      slugMap[l.source_page] = (slugMap[l.source_page] || 0) + 1;
    });
    const slugData = Object.entries(slugMap)
      .map(([slug, leads]) => ({ slug, leads }))
      .sort((a, b) => b.leads - a.leads)
      .slice(0, 10);

    return {
      totalSEO,
      ctaData,
      clusterData,
      areaData,
      slugData
    };
  }, [leads]);

  if (stats.totalSEO === 0) {
    return (
      <div className="bg-white border rounded-2xl p-12 text-center space-y-4">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
          <Info className="w-8 h-8 text-gray-300" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">No SEO Attribution Data Yet</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto mt-1">
            Attribution tracking is active. As soon as leads start coming from your programmatic pages, analysis will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-indigo-600 rounded-2xl p-5 text-white shadow-lg shadow-indigo-100">
          <div className="flex items-center gap-3 mb-2 opacity-80">
            <Globe className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">SEO Contribution</span>
          </div>
          <p className="text-3xl font-black">{stats.totalSEO}</p>
          <p className="text-[11px] font-medium mt-1 opacity-70">Total leads from programmatic pages</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-gray-400">
            <Target className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Highest ROI Cluster</span>
          </div>
          <p className="text-2xl font-black text-gray-900">{stats.clusterData[0]?.name || "—"}</p>
          <p className="text-[11px] font-bold text-emerald-600 mt-1">
            {stats.clusterData[0]?.rate || 0}% Conversion Rate
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-gray-400">
            <MousePointer2 className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Top Performing Area</span>
          </div>
          <p className="text-2xl font-black text-gray-900">{stats.areaData[0]?.name || "—"}</p>
          <p className="text-[11px] font-bold text-indigo-600 mt-1">
            {stats.areaData[0]?.value || 0} Leads Captured
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-500" />
              <h3 className="text-[14px] font-black text-gray-900">Cluster ROI Analysis</h3>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.clusterData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} 
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="leads" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={40}>
                  {stats.clusterData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {stats.clusterData.map((c, i) => (
              <div key={c.name} className="p-2 rounded-lg bg-gray-50 border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{c.name}</p>
                <p className="text-[13px] font-black text-gray-900">{c.rate}% <span className="text-[10px] font-medium text-gray-400">CR</span></p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <h3 className="text-[14px] font-black text-gray-900">Winning SEO Slugs</h3>
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Leads Captured</span>
          </div>
          <div className="space-y-1">
            {stats.slugData.map((s, i) => (
              <div key={s.slug} className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-bold text-gray-800 truncate">/{s.slug}</p>
                  <p className="text-[10px] text-gray-400">Programmatic Landing Page</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-1.5 w-16 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 rounded-full" 
                      style={{ width: `${(s.leads / stats.slugData[0].leads) * 100}%` }} 
                    />
                  </div>
                  <span className="text-[13px] font-black text-gray-900 w-6 text-right">{s.leads}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <MousePointer2 className="w-4 h-4 text-teal-500" />
            <h3 className="text-[14px] font-black text-gray-900">CTA Performance</h3>
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
             <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.ctaData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {stats.ctaData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
             </div>
             <div className="space-y-3">
                {stats.ctaData.map((cta, i) => (
                  <div key={cta.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-[12px] font-bold text-gray-600">{cta.name}</span>
                    </div>
                    <span className="text-[12px] font-black text-gray-900">{cta.value}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-red-500" />
            <h3 className="text-[14px] font-black text-gray-900">High Demand Delhi Areas</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
             {stats.areaData.map((a, i) => (
               <div key={a.name} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-300 w-4">0{i+1}</span>
                    <span className="text-[12px] font-bold text-gray-700">{a.name}</span>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-black border-indigo-100 text-indigo-600">
                    {a.value} Leads
                  </Badge>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}

