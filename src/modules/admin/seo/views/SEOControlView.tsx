"use client";

import { Globe, Plus, Save, Search, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TPDataTable } from "@/design-system/components/TPDataTable";
import { useSEO } from "../hooks/useSEO";

export default function SEOControlView() {
  const { configs, loading, updateConfig } = useSEO();

  const columns = [
    { key: "path", header: "Page Path", render: (v: string) => <code className="text-[11px] bg-slate-100 px-1.5 py-0.5 rounded">{v}</code> },
    { key: "title", header: "Meta Title", render: (v: string) => <span className="text-[12px] font-medium truncate max-w-[200px] block">{v}</span> },
    { key: "is_indexed", header: "Index", render: (v: boolean) => <Badge variant={v ? "default" : "outline"} className="text-[10px]">{v ? "Indexed" : "NoIndex"}</Badge> },
    { key: "actions", header: "", render: (_: any, row: any) => (
      <Button variant="ghost" size="sm" className="h-8 text-[11px] text-indigo-600">
        <Settings2 className="w-3.5 h-3.5 mr-1.5" /> Edit
      </Button>
    )},
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-black text-slate-900 flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-500" /> SEO Command Center
          </h1>
          <p className="text-[12px] text-slate-500 mt-1">Manage meta tags, canonicals, and indexing platform-wide.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 h-9">
          <Plus className="w-4 h-4 mr-2" /> New Route
        </Button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center gap-4">
           <div className="relative flex-1 max-w-sm">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
             <Input placeholder="Search routes..." className="pl-9 h-9 text-[12px] bg-white" />
           </div>
        </div>
        <TPDataTable
          data={configs}
          columns={columns}
          loading={loading}
          page={1}
          pageSize={configs.length}
          totalRecords={configs.length}
          onPageChange={() => {}}
        />
      </div>
    </div>
  );
}
