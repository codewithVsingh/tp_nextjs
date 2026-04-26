"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, MapPin, Pin, ShieldCheck, Route, EyeOff, 
  Loader2, Star, MoreVertical, CheckCircle2, XCircle, 
  AlertCircle, ArrowUpCircle, Info, LayoutGrid, ListFilter,
  TrendingDown, Zap, ExternalLink, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type TabType = "analyze" | "explore" | "overrides";

export default function DistributionEnginePage() {
  const [activeTab, setActiveTab] = useState<TabType>("analyze");
  const [pageUrl, setPageUrl] = useState("");
  const [analyzedPage, setAnalyzedPage] = useState<{ slug: string } | null>(null);
  const [matchingResults, setMatchingResults] = useState<any[]>([]);
  const [pinnedTutors, setPinnedTutors] = useState<any[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Explorer & Master Overrides State
  const [cities, setCities] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [explorerPages, setExplorerPages] = useState<any[]>([]);
  const [loadingExplorer, setLoadingExplorer] = useState(false);
  const [explorerOffset, setExplorerOffset] = useState(0);
  const [hasMoreExplorer, setHasMoreExplorer] = useState(true);
  const EXPLORER_LIMIT = 24;
  
  const [sidePanelSlug, setSidePanelSlug] = useState<string | null>(null);

  const [allOverrides, setAllOverrides] = useState<any[]>([]);
  const [loadingOverrides, setLoadingOverrides] = useState(false);
  const [overrideSearch, setOverrideSearch] = useState("");

  // New Command Center State
  const [globalSearch, setGlobalSearch] = useState("");
  const [showInsights, setShowInsights] = useState(false);
  const [insights, setInsights] = useState<{
    totalAreas: number;
    totalCities: number;
    totalStates: number;
    stateBreakdown: { name: string; count: number }[];
  } | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  const sidePanelRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidePanelRef.current && !sidePanelRef.current.contains(event.target as Node)) {
        // Only close if we didn't click on an explorer card (which should update the panel instead)
        const isCardClick = (event.target as HTMLElement).closest('.explorer-card');
        if (!isCardClick) {
          setSidePanelSlug(null);
        }
      }
    };

    if (sidePanelSlug) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidePanelSlug]);

  const fetchInsights = async () => {
    setLoadingInsights(true);
    console.log("Fetching Marketplace Insights...");
    try {
      const [{ count: aCount }, { count: cCount }, { count: sCount }] = await Promise.all([
        supabase.from('areas').select('*', { count: 'exact', head: true }),
        supabase.from('cities').select('*', { count: 'exact', head: true }),
        supabase.from('states').select('*', { count: 'exact', head: true })
      ]);

      const { data: stateData, error } = await supabase
        .from('states')
        .select(`
          name,
          cities (
            areas ( id )
          )
        `);

      if (error) {
        console.error("Insights Error:", error);
        // Fallback to City-wise if States query fails or is empty
        const { data: cityData } = await supabase.from('cities').select('name, areas(count)');
        const cityBreakdown = (cityData || []).map(c => ({ name: c.name, count: (c.areas as any)?.[0]?.count || 0 }));
        setInsights({
          totalAreas: aCount || 0,
          totalCities: cCount || 0,
          totalStates: sCount || 0,
          stateBreakdown: cityBreakdown.slice(0, 10)
        });
        return;
      }

      const breakdown = (stateData || []).map(s => {
        const areaCount = s.cities?.reduce((acc: number, city: any) => acc + (city.areas?.length || 0), 0) || 0;
        return { name: s.name, count: areaCount };
      }).filter(s => s.count > 0).sort((a, b) => b.count - a.count);

      setInsights({
        totalAreas: aCount || 0,
        totalCities: cCount || 0,
        totalStates: sCount || 0,
        stateBreakdown: breakdown.length > 0 ? breakdown : [{ name: "No Data Found", count: 0 }]
      });
    } catch (err) {
      console.error("Critical Insights Error:", err);
    } finally {
      setLoadingInsights(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const [{ data: c }, { data: s }] = await Promise.all([
        supabase.from('cities').select('id, name').order('name'),
        supabase.from('master_subjects').select('id, name').order('name')
      ]);
      if (c) setCities(c);
      if (s) setSubjects(s);
    };
    fetchData();
    fetchInsights();
  }, []);

  const downloadStateInventory = async (stateName: string) => {
    toast.loading(`Preparing inventory for ${stateName}...`);
    try {
      // 1. Fetch areas (filtered or global)
      let query = supabase
        .from('areas')
        .select(`
          name,
          slug,
          cities!inner (
            name,
            states!inner ( name )
          )
        `);

      if (stateName !== "All India") {
        query = query.eq('cities.states.name', stateName);
      }

      const { data: areas, error } = await query;

      if (error) throw error;
      if (!areas || areas.length === 0) {
        toast.error("No areas found for this state.");
        return;
      }

      // 2. Generate URLs for every subject
      const rows = [["Page Name", "URL", "Subject", "Area", "City", "State"]];
      
      areas.forEach(a => {
        subjects.forEach(s => {
          const pageName = `${s.name} in ${a.name}`;
          const url = `https://tutorsparliament.com/${s.name.toLowerCase().replace(/\s+/g, '-')}-tutor-in-${a.slug}`;
          rows.push([
            pageName,
            url,
            s.name,
            a.name,
            (a.cities as any)?.name || "N/A",
            stateName
          ]);
        });
      });

      // 3. Create CSV and trigger download
      const csvContent = rows.map(e => e.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const dateStr = new Date().toISOString().split('T')[0];
      
      link.setAttribute("href", url);
      link.setAttribute("download", `Tutors_Parliament_${stateName.replace(/\s+/g, '_')}_Inventory_${dateStr}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.dismiss();
      toast.success(`Inventory for ${stateName} downloaded!`);
    } catch (err: any) {
      toast.dismiss();
      toast.error(`Export failed: ${err.message}`);
    }
  };

  const fetchMasterOverrides = async () => {
    setLoadingOverrides(true);
    try {
      const { data: overrides, error } = await supabase
        .from('page_overrides')
        .select('*')
        .eq('entity_type', 'tutor')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (overrides && overrides.length > 0) {
        const tutorIds = overrides.map(o => o.entity_id);
        const { data: tutors } = await supabase
          .from('tutor_registrations')
          .select('id, name, phone')
          .in('id', tutorIds);
        
        const merged = overrides.map(o => ({
          ...o,
          tutor: tutors?.find(t => t.id === o.entity_id)
        }));
        setAllOverrides(merged);
      } else {
        setAllOverrides([]);
      }
    } catch (err: any) {
      toast.error("Failed to fetch master overrides: " + err.message);
    } finally {
      setLoadingOverrides(false);
    }
  };

  useEffect(() => {
    if (activeTab === "overrides") {
      fetchMasterOverrides();
    }
  }, [activeTab]);

  const analyzePage = async (targetUrl?: string, isSidePanel = false) => {
    const urlToAnalyze = targetUrl || pageUrl;
    if (!urlToAnalyze) return;
    
    if (!isSidePanel) {
      setAnalyzing(true);
      setActiveTab("analyze");
      setPageUrl(urlToAnalyze);
    }
    
    try {
      const slug = urlToAnalyze.split('/').pop() || "";
      const cleanSlug = slug.startsWith('/') ? slug : `/${slug}`;
      
      const { data: results, error: resultsError } = await supabase.rpc('match_tutors_for_params', {
        p_subject: cleanSlug.includes('-tutor') ? cleanSlug.split('-tutor')[0].replace('/', '') : null,
        p_area_slug: cleanSlug.includes('in-') ? cleanSlug.split('in-').pop() : cleanSlug.replace('/', ''),
      });

      if (resultsError) throw resultsError;

      const { data: overrides, error: overrideError } = await supabase
        .from('page_overrides')
        .select('position, entity_id')
        .eq('page_slug', cleanSlug)
        .eq('entity_type', 'tutor');

      if (overrideError) throw overrideError;

      let pinnedData: any[] = [];
      if (overrides && overrides.length > 0) {
        const tutorIds = overrides.map(o => o.entity_id);
        const { data: tutors } = await supabase
          .from('tutor_registrations')
          .select('id, name, phone')
          .in('id', tutorIds);
        
        pinnedData = overrides.map(o => ({
          ...o,
          tutor: tutors?.find(t => t.id === o.entity_id)
        }));
      }

      setAnalyzedPage({ slug: cleanSlug });
      setMatchingResults(results || []);
      setPinnedTutors(pinnedData);
    } catch (err: any) {
      toast.error(err.message || "Failed to analyze page");
    } finally {
      setAnalyzing(false);
    }
  };

  const exploreMarketplace = async (reset = false, searchOverride?: string) => {
    if (!selectedCity && !globalSearch && !searchOverride) return;
    
    const offset = reset ? 0 : explorerOffset;
    const currentSearch = searchOverride !== undefined ? searchOverride : globalSearch;
    
    setLoadingExplorer(true);
    
    try {
      let areaQuery = supabase.from('areas').select('id, name, slug, cities(name)');
      
      if (currentSearch) {
        const cleanSearch = currentSearch.replace(/^\//, '').replace(/-tutor-in-/, ' ').trim();
        areaQuery = areaQuery.or(`name.ilike.%${cleanSearch}%,slug.ilike.%${currentSearch}%`);
      } else if (selectedCity) {
        areaQuery = areaQuery.eq('city_id', selectedCity);
      }
      
      const { data: areas } = await areaQuery.range(offset, offset + EXPLORER_LIMIT - 1);

      if (!areas || areas.length < EXPLORER_LIMIT) setHasMoreExplorer(false);
      else setHasMoreExplorer(true);

      const pages = (areas || []).map(a => {
        const subjectName = selectedSubject === "all" ? "Maths" : subjects.find(s => s.id === selectedSubject)?.name || "Maths";
        const slug = `/${subjectName.toLowerCase()}-tutor-in-${a.slug}`;
        return {
          name: `${subjectName} in ${a.name}`,
          city: (a.cities as any)?.name,
          slug,
          areaSlug: a.slug,
          subjectName
        };
      });

      const pagesWithSupply = await Promise.all(pages.map(async (p) => {
        const { data } = await supabase.rpc('match_tutors_for_params', {
          p_subject: p.subjectName,
          p_area_slug: p.areaSlug
        });
        return { ...p, supplyCount: data?.length || 0 };
      }));

      if (reset) {
        setExplorerPages(pagesWithSupply);
        setExplorerOffset(EXPLORER_LIMIT);
      } else {
        setExplorerPages(prev => [...prev, ...pagesWithSupply]);
        setExplorerOffset(prev => prev + EXPLORER_LIMIT);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingExplorer(false);
    }
  };

  useEffect(() => {
    if (activeTab === "explore" && selectedCity) {
      exploreMarketplace(true);
    }
  }, [selectedCity, selectedSubject, activeTab]);

  const updateVisibility = async (tutorId: string, status: string) => {
    setUpdatingId(tutorId);
    try {
      const { error } = await supabase
        .from('tutor_visibility')
        .upsert({ tutor_id: tutorId, visibility_status: status });
      if (error) throw error;
      setMatchingResults(prev => prev.map(r => r.tutor_id === tutorId ? { ...r, visibility_status: status } : r));
      toast.success(`Updated to ${status}`);
    } catch (err: any) { toast.error(err.message); } finally { setUpdatingId(null); }
  };

  const togglePin = async (tutorId: string, tutorName: string, customSlug?: string) => {
    const slugToUse = customSlug || analyzedPage?.slug;
    if (!slugToUse) return;
    
    setUpdatingId(tutorId);
    try {
      const isPinned = activeTab === "overrides" 
        ? true 
        : pinnedTutors.some(p => p.entity_id === tutorId);

      if (isPinned) {
        const { error } = await supabase.from('page_overrides').delete().eq('page_slug', slugToUse).eq('entity_id', tutorId);
        if (error) throw error;
      } else {
        const nextPos = pinnedTutors.length + 1;
        const { error } = await supabase.from('page_overrides').insert({ 
          page_slug: slugToUse, 
          entity_type: 'tutor', 
          entity_id: tutorId, 
          position: nextPos 
        });
        if (error) throw error;
      }
      
      if (activeTab === "overrides") {
        await fetchMasterOverrides();
      } else {
        await analyzePage(slugToUse, true);
      }
      toast.success(isPinned ? "Unpinned Successfully" : "Pinned Successfully");
    } catch (err: any) { toast.error(err.message); } finally { setUpdatingId(null); }
  };

  const filteredMasterOverrides = useMemo(() => {
    if (!overrideSearch) return allOverrides;
    const s = overrideSearch.toLowerCase();
    return allOverrides.filter(o => 
      o.tutor?.name?.toLowerCase().includes(s) || 
      o.page_slug?.toLowerCase().includes(s)
    );
  }, [allOverrides, overrideSearch]);

  const openSidePanel = async (slug: string) => {
    setSidePanelSlug(slug);
    await analyzePage(slug, true);
  };

  return (
    <div className="relative overflow-hidden">
      <div className={`space-y-4 pb-6 transition-all duration-300 ${sidePanelSlug ? 'pr-[450px]' : ''}`}>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
              <Route className="w-5 h-5 text-indigo-600" />
              Distribution Engine
            </h1>
            <p className="text-slate-500 text-[12px] font-medium mt-0.5">
              Command center for SEO inventory & marketplace supply.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant={showInsights ? "secondary" : "outline"} 
              size="sm" 
              onClick={() => setShowInsights(!showInsights)}
              className="font-bold rounded-xl"
            >
              {showInsights ? <LayoutGrid className="w-4 h-4 mr-2" /> : <TrendingDown className="w-4 h-4 mr-2" />}
              {showInsights ? "Show Inventory" : "Marketplace Insights"}
            </Button>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search 10,000+ URLs..." 
                className="pl-9 h-10 rounded-xl bg-white border-slate-200 shadow-sm focus:ring-indigo-500" 
                value={globalSearch}
                onChange={(e) => {
                  const val = e.target.value;
                  setGlobalSearch(val);
                  if (activeTab === "explore") exploreMarketplace(true, val);
                }}
                onKeyDown={(e) => e.key === 'Enter' && exploreMarketplace(true)}
              />
            </div>
          </div>
        </div>

        {/* Marketplace Insights Card */}
        <AnimatePresence>
          {showInsights && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden mb-6">
                <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 blur-[80px] -mr-24 -mt-24" />
                <div className="relative grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="space-y-0.5">
                    <div className="text-indigo-300 text-[9px] font-black uppercase tracking-widest">Total Inventory</div>
                    <div className="text-3xl font-black">{insights?.totalAreas ? (insights.totalAreas * (subjects.length || 1)).toLocaleString() : "..."}</div>
                    <div className="text-indigo-300/60 text-[10px] font-medium">Dynamic SEO Pages</div>
                  </div>
                  <div className="md:col-span-3 border-l border-white/10 pl-8">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-indigo-300 text-[10px] font-black uppercase tracking-widest">State-wise URL Coverage</div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-[10px] font-black text-white hover:bg-white/10 h-7 uppercase tracking-widest"
                        onClick={() => downloadStateInventory("All India")}
                      >
                        <ExternalLink className="w-3 h-3 mr-2" /> Download All India
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {loadingInsights ? (
                        <div className="flex items-center gap-2 text-indigo-300/50"><Loader2 className="w-4 h-4 animate-spin" /> Calculating coverage...</div>
                      ) : (
                        insights?.stateBreakdown.map((s, i) => (
                          <div 
                            key={i} 
                            onClick={() => s.count > 0 && downloadStateInventory(s.name)}
                            className={`bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center gap-3 transition-all ${
                              s.count > 0 ? 'hover:bg-white/10 hover:border-indigo-400/50 cursor-pointer group' : 'opacity-50 grayscale'
                            }`}
                          >
                            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center text-[10px] font-black group-hover:bg-indigo-500 transition-colors">
                              {s.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-xs font-bold flex items-center gap-2">
                                {s.name}
                                {s.count > 0 && <RefreshCw className="w-2.5 h-2.5 text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity" />}
                              </div>
                              <div className="text-[10px] text-indigo-300 font-medium">{s.count * (subjects.length || 1)} URLs</div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-px">
        <div className="flex gap-2 p-1 bg-white border border-slate-200 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab("analyze")}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${
              activeTab === "analyze" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <Zap className="w-4 h-4" />
            Live Analysis
          </button>
          <button
            onClick={() => setActiveTab("explore")}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${
              activeTab === "explore" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            Marketplace Explorer
          </button>
          <button
            onClick={() => setActiveTab("overrides")}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${
              activeTab === "overrides" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <Pin className="w-4 h-4" />
            Active Overrides
            {allOverrides.length > 0 && <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] ${activeTab === 'overrides' ? 'bg-white text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>{allOverrides.length}</span>}
          </button>
        </div>
      </div>

        <AnimatePresence mode="wait">
          {activeTab === "analyze" ? (
            <motion.div key="analyze" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
              <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-xl flex items-start gap-2.5">
                <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div className="text-[11px] text-indigo-700 leading-relaxed">
                  <strong className="block mb-px">Manual Override Command</strong>
                  Use this tab for advanced troubleshooting and force-pinning tutors.
                </div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input placeholder="Enter Page Slug (e.g. /maths-tutor-in-noida)" className="pl-11 h-12 border-slate-200 rounded-xl font-bold" value={pageUrl} onChange={(e) => setPageUrl(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && analyzePage()} />
                  </div>
                  <Button onClick={() => analyzePage()} disabled={analyzing} className="h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-xs rounded-xl">
                    {analyzing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ShieldCheck className="w-4 h-4 mr-2" />}
                    Run Analysis
                  </Button>
                </div>

                {analyzedPage && (
                  <div className="mt-8 space-y-8">
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Pin className="w-4 h-4" /> Pinned Overrides</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {pinnedTutors.map(p => (
                          <div key={p.entity_id} className="bg-indigo-50/50 border-2 border-indigo-200 p-4 rounded-2xl">
                            <div className="font-bold text-slate-900">{p.tutor?.name || "Unknown Tutor"}</div>
                            <div className="text-[10px] text-slate-500 mb-3">{p.tutor?.phone}</div>
                            <Button size="sm" variant="outline" className="w-full h-8 text-[10px] font-black" onClick={() => togglePin(p.entity_id, "")}>Unpin</Button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2"><Star className="w-3.5 h-3.5" /> Matches</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {matchingResults.map(r => (
                          <div key={r.tutor_id} className="bg-white border border-slate-200 p-3 rounded-xl group hover:border-indigo-200 transition-all">
                            <div className="flex justify-between items-start mb-1">
                              <div className="text-[11px] font-bold text-slate-900">{r.tutor_name}</div>
                              <Badge className="bg-emerald-50 text-emerald-600 border-none text-[9px] h-4">{r.match_score}%</Badge>
                            </div>
                            <div className="text-[9px] text-slate-400 mb-2">{r.phone}</div>
                            <div className="flex gap-1.5">
                              <Button size="sm" className="flex-1 h-6 text-[9px] font-black bg-indigo-50 text-indigo-600 hover:bg-indigo-100" onClick={() => togglePin(r.tutor_id, r.tutor_name)}>Pin</Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild><Button size="sm" variant="ghost" className="h-6 w-6 p-0"><MoreVertical className="w-3 h-3"/></Button></DropdownMenuTrigger>
                                <DropdownMenuContent><DropdownMenuItem onClick={() => updateVisibility(r.tutor_id, 'active')}>Activate</DropdownMenuItem><DropdownMenuItem onClick={() => updateVisibility(r.tutor_id, 'hidden')}>Hide</DropdownMenuItem></DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : activeTab === "explore" ? (
            <motion.div key="explore" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                  <div className="w-full md:w-64">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Select City</label>
                    <Select value={selectedCity} onValueChange={setSelectedCity}>
                      <SelectTrigger className="h-10 rounded-xl border-slate-200 font-bold">
                        <SelectValue placeholder="Choose a city..." />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full md:w-64">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Filter Subject</label>
                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                      <SelectTrigger className="h-10 rounded-xl border-slate-200 font-bold"><SelectValue placeholder="All Subjects" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Subjects</SelectItem>
                        {subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {!selectedCity ? (
                  <div className="py-24 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MapPin className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-slate-600 font-black text-lg">Marketplace Explorer</h3>
                    <p className="text-slate-400 text-sm max-w-xs mx-auto">Select a city above to start exploring potential landing pages and supply levels.</p>
                  </div>
                ) : loadingExplorer ? (
                  <div className="py-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-400 mx-auto mb-4" />
                    <p className="text-slate-400 text-sm font-medium">Analyzing market supply...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                    {explorerPages.map(p => (
                      <div 
                        key={p.slug} 
                        className={`explorer-card p-2 rounded-lg border transition-all hover:shadow-sm cursor-pointer group relative ${
                          p.supplyCount === 0 ? 'bg-rose-50/30 border-rose-100/50 hover:border-rose-200' : 'bg-white border-slate-100 hover:border-indigo-100'
                        } ${sidePanelSlug === p.slug ? 'border-indigo-600 ring-1 ring-indigo-100' : ''}`}
                        onClick={() => openSidePanel(p.slug)}
                      >
                        <div className="flex justify-between items-start mb-1.5">
                          <span className={`text-[8px] font-black px-1 py-0.5 rounded uppercase tracking-tight ${p.supplyCount === 0 ? 'bg-rose-100 text-rose-600' : 'bg-indigo-50 text-indigo-600'}`}>
                            {p.supplyCount} Tutors
                          </span>
                          <a href={p.slug} target="_blank" onClick={(e) => e.stopPropagation()} className="p-0.5 hover:bg-slate-100 rounded text-slate-300 hover:text-indigo-600 transition-all">
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <h4 className="font-bold text-slate-800 text-[11px] leading-tight group-hover:text-indigo-600 truncate">{p.name}</h4>
                        <div className="text-[8px] text-slate-400 mt-0.5 uppercase font-black tracking-widest truncate">{p.city}</div>
                      </div>
                    ))}
                  </div>
                )}

                {hasMoreExplorer && selectedCity && !loadingExplorer && (
                  <div className="mt-8 flex justify-center">
                    <Button 
                      variant="outline" 
                      onClick={() => exploreMarketplace()}
                      className="px-8 h-10 border-slate-200 text-slate-600 font-black text-xs uppercase tracking-widest hover:bg-slate-50"
                    >
                      Load More Areas
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div key="overrides" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input placeholder="Search by Tutor or Page URL..." className="pl-9 h-10 rounded-xl" value={overrideSearch} onChange={(e) => setOverrideSearch(e.target.value)} />
                  </div>
                  <Button variant="ghost" size="sm" onClick={fetchMasterOverrides} className="text-indigo-600 font-bold"><RefreshCw className="w-3.5 h-3.5 mr-2" /> Refresh List</Button>
                </div>
                {loadingOverrides ? (
                  <div className="py-20 text-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-400 mx-auto" /></div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b border-slate-100">
                          <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Tutor Name</th>
                          <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Target Page (Slug)</th>
                          <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Pos</th>
                          <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Pinned On</th>
                          <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right pr-2">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {filteredMasterOverrides.map(o => (
                          <tr key={o.id} className="group hover:bg-slate-50 transition-colors">
                            <td className="py-2 pl-2"><div className="text-[11px] font-bold text-slate-900">{o.tutor?.name || "Deleted Tutor"}</div><div className="text-[9px] text-slate-400 font-medium">{o.tutor?.phone}</div></td>
                            <td className="py-2"><a href={o.page_slug} target="_blank" className="text-[11px] font-bold text-indigo-600 hover:underline flex items-center gap-1">{o.page_slug}<ExternalLink className="w-2.5 h-2.5" /></a></td>
                            <td className="py-2"><Badge className="bg-slate-100 text-slate-600 border-none text-[9px] font-black h-4 px-1.5">P{o.position}</Badge></td>
                            <td className="py-2 text-[10px] text-slate-500 font-medium">{new Date(o.created_at).toLocaleDateString()}</td>
                            <td className="py-2 text-right pr-2"><Button size="sm" variant="ghost" className="h-6 text-rose-500 hover:text-rose-600 hover:bg-rose-50 font-black text-[9px] uppercase tracking-widest" onClick={() => togglePin(o.entity_id, o.tutor?.name, o.page_slug)}>Unpin</Button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {sidePanelSlug && (
          <motion.div 
            ref={sidePanelRef}
            initial={{ x: '100%' }} 
            animate={{ x: 0 }} 
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-[450px] bg-white shadow-2xl border-l border-slate-200 z-[60] flex flex-col"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="min-w-0">
                <h3 className="font-black text-slate-900 truncate">Manage Distribution</h3>
                <a 
                  href={sidePanelSlug} 
                  target="_blank" 
                  className="text-[10px] font-bold text-indigo-600 truncate uppercase tracking-widest hover:underline flex items-center gap-1 group"
                >
                  {sidePanelSlug}
                  <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSidePanelSlug(null)} className="h-8 w-8 p-0 rounded-full hover:bg-slate-200">
                <XCircle className="w-5 h-5 text-slate-400" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                  <Pin className="w-3.5 h-3.5" /> Pinned Overrides
                </h3>
                <div className="space-y-3">
                  {pinnedTutors.length > 0 ? pinnedTutors.map(p => (
                    <div key={p.entity_id} className="bg-indigo-50/50 border border-indigo-100 p-3 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-900">{p.tutor?.name}</div>
                        <div className="text-[9px] text-slate-500">{p.tutor?.phone}</div>
                      </div>
                      <Button size="sm" variant="ghost" className="h-7 text-[9px] font-black text-rose-500 hover:bg-rose-50" onClick={() => togglePin(p.entity_id, "")}>Unpin</Button>
                    </div>
                  )) : (
                    <p className="text-[10px] text-slate-400 italic font-medium">No overrides active.</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                  <Star className="w-3.5 h-3.5" /> Recommended Tutors
                </h3>
                <div className="space-y-3">
                  {matchingResults.filter(r => !pinnedTutors.some(p => p.entity_id === r.tutor_id)).map(r => (
                    <div key={r.tutor_id} className="bg-white border border-slate-100 p-3 rounded-xl group hover:border-indigo-200 transition-all shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 truncate">{r.tutor_name}</div>
                          <div className="text-[9px] text-slate-400">{r.phone}</div>
                        </div>
                        <Badge className="bg-emerald-50 text-emerald-600 border-none text-[9px]">{r.match_score}%</Badge>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" className="flex-1 h-7 text-[9px] font-black bg-indigo-50 text-indigo-600 hover:bg-indigo-100" onClick={() => togglePin(r.tutor_id, r.tutor_name)}>Pin Tutor</Button>
                        <Button size="sm" variant="ghost" className="h-7 text-[9px] font-black" onClick={() => updateVisibility(r.tutor_id, 'hidden')}>Hide</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
