"use client";

import { useState } from "react";
import { 
  Star, Quote, Plus, Search, Settings2, Trash2, 
  Save, X, User, Users, ShieldCheck, Eye, EyeOff,
  Upload, HelpCircle, Loader2
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TPDataTable } from "@/design-system/components/TPDataTable";
import { useTestimonials } from "../hooks/useTestimonials";
import { cn } from "@/lib/utils";

export default function TestimonialsControlView() {
  const { testimonials, loading, updateTestimonial, createTestimonial, deleteTestimonial } = useTestimonials();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [isUploading, setIsUploading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    result: "",
    text: "",
    initials: "",
    avatar_url: "",
    type: "student",
    verified: true,
    rating: 5,
    is_active: true,
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('testimonials')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('testimonials')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, avatar_url: publicUrl }));
      toast.success("Image uploaded successfully!");
    } catch (error: any) {
      toast.error("Upload failed: " + error.message);
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleOpenDrawer = (item: any = null) => {
    if (item) {
      setSelectedItem(item);
      setFormData({
        name: item.name || "",
        result: item.result || "",
        text: item.text || "",
        initials: item.initials || "",
        avatar_url: item.avatar_url || "",
        type: item.type || "student",
        verified: item.verified ?? true,
        rating: item.rating || 5,
        is_active: item.is_active ?? true,
      });
      setIsEditing(true);
    } else {
      setSelectedItem(null);
      setFormData({
        name: "",
        result: "",
        text: "",
        initials: "",
        avatar_url: "",
        type: "student",
        verified: true,
        rating: 5,
        is_active: true,
      });
      setIsEditing(false);
    }
    setIsDrawerOpen(true);
  };

  const handleSave = async () => {
    const finalData = {
      ...formData,
      initials: formData.initials || getInitials(formData.name)
    };

    if (isEditing && selectedItem) {
      await updateTestimonial(selectedItem.id, finalData);
    } else {
      await createTestimonial(finalData);
    }
    setIsDrawerOpen(false);
  };

  const handleDelete = async () => {
    if (selectedItem && window.confirm("Are you sure? This will permanently remove this success story.")) {
      await deleteTestimonial(selectedItem.id);
      setIsDrawerOpen(false);
    }
  };

  const filteredData = testimonials.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { 
      key: "name", 
      header: "Author", 
      render: (_: string, row: any) => (
        <div className="flex items-center gap-2.5">
          <div className={cn(
            "w-7 h-7 rounded-full overflow-hidden flex items-center justify-center text-[9px] font-black text-white shrink-0 border border-slate-100 shadow-sm", 
            row.type === 'parent' ? 'bg-indigo-500' : 
            row.type === 'tutor' ? 'bg-emerald-500' :
            row.type === 'learner' ? 'bg-slate-700' : 'bg-orange-500'
          )}>
            {row.avatar_url ? (
              <img src={row.avatar_url} alt={row.name} className="w-full h-full object-cover" />
            ) : (
              row.initials || getInitials(row.name)
            )}
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-black text-slate-900 truncate leading-tight">{row.name}</div>
            <div className="text-[9px] text-slate-500 font-bold truncate opacity-70 italic">{row.result}</div>
          </div>
        </div>
      )
    },
    { 
      key: "text", 
      header: "Review Snippet", 
      render: (v: string, row: any) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-[10px] text-slate-500 font-medium italic line-clamp-1 max-w-[250px] cursor-help">
                "{v}"
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-slate-900 text-white border-slate-800 text-[11px] font-medium max-w-[350px] leading-relaxed p-3 shadow-xl">
              {row.text}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
    { 
      key: "type", 
      header: "Category", 
      render: (v: string) => (
        <Badge variant="outline" className={cn(
          "text-[8px] uppercase tracking-[0.1em] font-black h-4 px-1.5", 
          v === 'parent' ? 'text-indigo-600 bg-indigo-50 border-indigo-100' : 
          v === 'tutor' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' :
          v === 'learner' ? 'text-slate-600 bg-slate-100 border-slate-200' : 'text-orange-600 bg-orange-50 border-orange-100'
        )}>
          {v}
        </Badge>
      )
    },
    { 
      key: "is_active", 
      header: "Status", 
      render: (v: boolean) => (
        <Badge variant={v ? "default" : "outline"} className={v ? "bg-emerald-500 text-white border-none text-[8px] h-4" : "text-slate-300 border-slate-100 text-[8px] h-4"}>
          {v ? <><Eye className="w-2.5 h-2.5 mr-1"/> LIVE</> : <><EyeOff className="w-2.5 h-2.5 mr-1"/> HIDDEN</>}
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
          className="h-7 text-[10px] font-black uppercase tracking-wider text-indigo-600 hover:bg-indigo-50 px-2"
        >
          Manage
        </Button>
      )
    },
  ];

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-black text-slate-900 flex items-center gap-2 tracking-tight">
            <Star className="w-5 h-5 text-orange-500 fill-orange-500" /> Testimonials
          </h1>
          <p className="text-[11px] text-slate-500 mt-0.5 font-bold italic opacity-70 uppercase tracking-widest">Social Proof Engine</p>
        </div>
        <Button 
          onClick={() => handleOpenDrawer()}
          className="bg-indigo-600 hover:bg-indigo-700 h-8 px-4 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-200"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" /> New Story
        </Button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center gap-4">
           <div className="relative flex-1 max-w-sm">
             <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
             <Input 
               placeholder="Filter reviews..." 
               className="pl-9 h-9 text-[12px] bg-white rounded-lg border-slate-200" 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
           </div>
           <div className="ml-auto">
             <Badge variant="outline" className="bg-white py-1 px-2.5 border-slate-200 text-slate-500 text-[9px] font-black uppercase tracking-tighter">
               {filteredData.length} Success Stories
             </Badge>
           </div>
        </div>
        <TPDataTable
          data={filteredData}
          columns={columns}
          loading={loading}
          onRowClick={handleOpenDrawer}
          page={1}
          pageSize={filteredData.length || 10}
          totalRecords={filteredData.length}
          onPageChange={() => {}}
        />
      </div>

      {/* Control Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-[400px] sm:max-w-[400px] p-0 flex flex-col border-l border-slate-200 shadow-2xl">
          <SheetHeader className="p-4 bg-slate-900 text-white">
            <SheetTitle className="text-white font-black text-lg flex items-center gap-2">
              <Quote className="w-4 h-4 text-indigo-400" />
              {isEditing ? "Edit Story" : "New Story"}
            </SheetTitle>
            <SheetDescription className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
              Success Story Manager
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-full overflow-hidden flex items-center justify-center text-xs font-bold text-white shrink-0 border-2 border-slate-100 shadow-md",
                  formData.type === 'parent' ? 'bg-indigo-500' : 'bg-orange-500'
                )}>
                  {formData.avatar_url ? (
                    <img src={formData.avatar_url} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    getInitials(formData.name || "User")
                  )}
                </div>
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center justify-between ml-1">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Avatar Image URL / Upload</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-3 h-3 text-slate-300 cursor-help hover:text-indigo-500 transition-colors" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-slate-900 text-white border-slate-800 text-[10px] font-bold">
                          Recommended: Square (200x200px)
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="https://link-to-photo.jpg" 
                      value={formData.avatar_url}
                      onChange={(e) => setFormData({...formData, avatar_url: e.target.value})}
                      className="h-8 text-[11px] rounded-lg border-slate-200 italic flex-1"
                    />
                    <div className="relative">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleUpload}
                        className="hidden" 
                        id="avatar-upload" 
                        disabled={isUploading}
                      />
                      <Button 
                        asChild 
                        variant="outline" 
                        size="sm" 
                        className={cn("h-8 px-2 border-dashed border-indigo-200 text-indigo-600 hover:bg-indigo-50", isUploading && "opacity-50")}
                      >
                        <label htmlFor="avatar-upload" className="cursor-pointer">
                          {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                        </label>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</Label>
                  <Input 
                    placeholder="Sneha P." 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="h-9 text-[12px] rounded-lg font-bold border-slate-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Role</Label>
                  <Select value={formData.type} onValueChange={(v) => setFormData({...formData, type: v})}>
                    <SelectTrigger className="h-9 text-[12px] rounded-lg font-bold border-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="tutor">Tutor</SelectItem>
                      <SelectItem value="learner">Individual / Pro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Achievement</Label>
                <Input 
                  placeholder="Class 12 — 98% (Physics)" 
                  value={formData.result}
                  onChange={(e) => setFormData({...formData, result: e.target.value})}
                  className="h-9 text-[12px] rounded-lg font-semibold border-slate-200"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">The Review</Label>
                <Textarea 
                  placeholder="Share their feedback..." 
                  rows={5}
                  value={formData.text}
                  onChange={(e) => setFormData({...formData, text: e.target.value})}
                  className="text-[12px] rounded-lg font-medium border-slate-200 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-2 px-3 rounded-lg flex items-center justify-between border border-slate-100">
                  <Label className="text-[11px] font-bold text-slate-700">Verified</Label>
                  <Switch 
                    className="scale-75 origin-right"
                    checked={formData.verified}
                    onCheckedChange={(v) => setFormData({...formData, verified: v})}
                  />
                </div>
                <div className="bg-slate-50 p-2 px-3 rounded-lg flex items-center justify-between border border-slate-100">
                  <Label className="text-[11px] font-bold text-slate-700">Live</Label>
                  <Switch 
                    className="scale-75 origin-right"
                    checked={formData.is_active}
                    onCheckedChange={(v) => setFormData({...formData, is_active: v})}
                  />
                </div>
              </div>
            </div>
          </div>

          <SheetFooter className="p-4 bg-slate-50 border-t border-slate-100 flex flex-row gap-2 sm:justify-start">
            <Button 
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 h-9 font-black uppercase tracking-widest text-[10px]"
              onClick={handleSave}
            >
              <Save className="w-3.5 h-3.5 mr-1.5" /> Save Changes
            </Button>
            {isEditing && (
              <Button 
                variant="outline" 
                className="h-9 border-rose-100 text-rose-500 hover:bg-rose-50 hover:text-rose-600 px-3"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
