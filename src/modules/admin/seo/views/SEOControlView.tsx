"use client";

import { useState } from "react";
import { 
  Globe, Plus, Search, Settings2, Trash2, 
  AlertTriangle, Save, X, Info 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { TPDataTable } from "@/design-system/components/TPDataTable";
import { useSEO } from "../hooks/useSEO";

export default function SEOControlView() {
  const { configs, loading, updateConfig, createConfig, deleteConfig } = useSEO();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    path: "",
    title: "",
    description: "",
    canonical_url: "",
    is_indexed: true,
  });

  const handleOpenDrawer = (config: any = null) => {
    if (config) {
      setSelectedConfig(config);
      setFormData({
        path: config.path || "",
        title: config.title || "",
        description: config.description || "",
        canonical_url: config.canonical_url || "",
        is_indexed: config.is_indexed ?? true,
      });
      setIsEditing(true);
    } else {
      setSelectedConfig(null);
      setFormData({
        path: "/",
        title: "",
        description: "",
        canonical_url: "",
        is_indexed: true,
      });
      setIsEditing(false);
    }
    setIsDrawerOpen(true);
  };

  const handleSave = async () => {
    if (isEditing && selectedConfig) {
      await updateConfig(selectedConfig.id, formData);
    } else {
      await createConfig(formData);
    }
    setIsDrawerOpen(false);
  };

  const handleDelete = async () => {
    if (selectedConfig && window.confirm("Are you sure? Deleting this will revert the page to default meta data.")) {
      await deleteConfig(selectedConfig.id);
      setIsDrawerOpen(false);
    }
  };

  const filteredConfigs = configs.filter(c => 
    c.path.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { 
      key: "path", 
      header: "Page Path", 
      render: (v: string) => <code className="text-[11px] font-bold text-indigo-600 bg-indigo-50/50 px-2 py-0.5 rounded border border-indigo-100/50">{v}</code> 
    },
    { 
      key: "title", 
      header: "Meta Title", 
      render: (v: string) => <span className="text-[12px] font-semibold truncate max-w-[250px] block text-slate-700">{v || "Untitled Page"}</span> 
    },
    { 
      key: "is_indexed", 
      header: "Indexing", 
      render: (v: boolean) => (
        <Badge variant={v ? "default" : "outline"} className={v ? "bg-emerald-500 text-white border-none text-[10px]" : "text-slate-400 border-slate-200 text-[10px]"}>
          {v ? "Live / Indexed" : "No-Index"}
        </Badge>
      )
    },
    { 
      key: "actions", 
      header: "", 
      render: (_: any, row: any) => (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => handleOpenDrawer(row)}
          className="h-8 text-[11px] font-black uppercase tracking-wider text-indigo-600 hover:bg-indigo-50"
        >
          <Settings2 className="w-3.5 h-3.5 mr-1.5" /> Manage
        </Button>
      )
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-black text-slate-900 flex items-center gap-2 tracking-tight">
            <Globe className="w-6 h-6 text-indigo-500" /> SEO Command Center
          </h1>
          <p className="text-[13px] text-slate-500 mt-1 font-medium italic">Strategize, Analyze, and Control your platform's search footprint.</p>
        </div>
        <Button 
          onClick={() => handleOpenDrawer()}
          className="bg-indigo-600 hover:bg-indigo-700 h-10 px-6 font-black uppercase tracking-widest text-[11px] shadow-lg shadow-indigo-200"
        >
          <Plus className="w-4 h-4 mr-2" /> Register New Route
        </Button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-4">
           <div className="relative flex-1 max-w-sm">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
             <Input 
               placeholder="Filter routes by slug or title..." 
               className="pl-11 h-11 text-[13px] bg-white rounded-xl border-slate-200 focus:ring-indigo-500" 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
           </div>
           <div className="ml-auto flex items-center gap-2">
             <Badge variant="outline" className="bg-white py-1.5 px-3 border-slate-200 text-slate-500 text-[11px] font-bold">
               {filteredConfigs.length} Active Routes
             </Badge>
           </div>
        </div>
        <TPDataTable
          data={filteredConfigs}
          columns={columns}
          loading={loading}
          page={1}
          pageSize={filteredConfigs.length || 10}
          totalRecords={filteredConfigs.length}
          onPageChange={() => {}}
        />
      </div>

      {/* Command Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-[500px] sm:max-w-[500px] p-0 flex flex-col border-l border-slate-200">
          <SheetHeader className="p-6 bg-slate-900 text-white">
            <SheetTitle className="text-white font-black text-xl flex items-center gap-2">
              {isEditing ? <Settings2 className="w-5 h-5 text-indigo-400" /> : <Plus className="w-5 h-5 text-emerald-400" />}
              {isEditing ? "Configure Strategy" : "Register SEO Route"}
            </SheetTitle>
            <SheetDescription className="text-slate-400 text-xs font-medium">
              Fine-tune how search engines perceive your platform path.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* SEO Impact Warning */}
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-4 animate-pulse-subtle">
              <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1.5">
                <h4 className="text-amber-900 font-black text-[13px] uppercase tracking-wide">High-Impact Strategic Change</h4>
                <p className="text-amber-800 text-[12px] leading-relaxed font-medium">
                  Changing SEO metadata is a long-term strategic move. Google may take **2 to 4 weeks** to re-crawl and reflect these updates. Any error here can directly **decrease your organic traffic.**
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Page URL Slug</Label>
                <Input 
                  placeholder="/example-page" 
                  value={formData.path}
                  onChange={(e) => setFormData({...formData, path: e.target.value})}
                  className="h-11 rounded-xl font-bold bg-slate-50 border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Meta Title (Max 60 chars)</Label>
                <Input 
                  placeholder="Primary page heading for Google..." 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="h-11 rounded-xl font-bold"
                />
                <div className="flex justify-end pr-2"><span className={cn("text-[10px] font-bold", formData.title.length > 60 ? "text-rose-500" : "text-slate-400")}>{formData.title.length}/60</span></div>
              </div>

              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Meta Description (Max 160 chars)</Label>
                <Textarea 
                  placeholder="Tell the user why they should click this page..." 
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="rounded-xl font-medium"
                />
                <div className="flex justify-end pr-2"><span className={cn("text-[10px] font-bold", formData.description.length > 160 ? "text-rose-500" : "text-slate-400")}>{formData.description.length}/160</span></div>
              </div>

              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Canonical URL (Optional)</Label>
                <Input 
                  placeholder="https://tutorsparliament.com/original-page" 
                  value={formData.canonical_url}
                  onChange={(e) => setFormData({...formData, canonical_url: e.target.value})}
                  className="h-11 rounded-xl font-medium text-indigo-600 italic"
                />
              </div>

              <div className="bg-slate-50 p-4 rounded-xl flex items-center justify-between border border-slate-200">
                <div className="space-y-0.5">
                  <Label className="text-[12px] font-black text-slate-900">Allow Indexing</Label>
                  <p className="text-[11px] text-slate-500 font-medium italic">Should Google show this page in search results?</p>
                </div>
                <Switch 
                  checked={formData.is_indexed}
                  onCheckedChange={(v) => setFormData({...formData, is_indexed: v})}
                />
              </div>
            </div>
          </div>

          <SheetFooter className="p-6 bg-slate-50 border-t border-slate-200 flex flex-row gap-3 sm:justify-start">
            <Button 
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 h-11 font-black uppercase tracking-widest text-[11px]"
              onClick={handleSave}
            >
              <Save className="w-4 h-4 mr-2" /> {isEditing ? "Apply Strategic Changes" : "Create SEO Route"}
            </Button>
            {isEditing && (
              <Button 
                variant="outline" 
                className="h-11 border-rose-100 text-rose-500 hover:bg-rose-50 hover:text-rose-600 px-4"
                onClick={handleDelete}
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
