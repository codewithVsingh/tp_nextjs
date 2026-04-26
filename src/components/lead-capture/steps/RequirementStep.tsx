import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Search, Plus } from "lucide-react";
import OptionChip from "../OptionChip";
import type { StepProps } from "../types";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import PremiumSelect from "../PremiumSelect";

const RequirementStep = ({ data, onChange }: StepProps) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);
  const [selectedSubId, setSelectedSubId] = useState<string | null>(null);
  const [subjectInput, setSubjectInput] = useState("");

  // 1. Fetch Categories
  useEffect(() => {
    const fetchCats = async () => {
      const { data: cats } = await supabase.from('learning_categories').select('*').order('sort_order');
      if (cats) setCategories(cats);
    };
    fetchCats();
  }, []);

  // 2. Fetch Subcategories when Category changes
  useEffect(() => {
    const fetchSubs = async () => {
      if (!selectedCatId) return;
      const { data: subs } = await supabase.from('learning_subcategories').select('*').eq('category_id', selectedCatId).order('sort_order');
      if (subs) setSubcategories(subs);
    };
    fetchSubs();
  }, [selectedCatId]);

  // 3. Fetch Topics when Subcategory changes
  useEffect(() => {
    const fetchTopics = async () => {
      if (!selectedSubId) return;
      const { data: tops } = await supabase.from('learning_topics').select('*').eq('subcategory_id', selectedSubId).order('name');
      if (tops) setTopics(tops);
    };
    fetchTopics();
  }, [selectedSubId]);
  
  const handleAddSubject = (val: string) => {
    const trimmed = val.trim().replace(/,$/, "");
    if (!trimmed) return;
    if (data.subjects.includes(trimmed)) {
      setSubjectInput("");
      return;
    }
    onChange({ subjects: [...data.subjects, trimmed] });
    setSubjectInput("");
  };

  const removeSubject = (s: string) => {
    onChange({ subjects: data.subjects.filter(item => item !== s) });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "," || e.key === "Enter") {
      handleAddSubject(subjectInput);
    }
  };

  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const getSubjectLabel = () => {
    switch (data.user_type) {
      case "competitive-exams": return "Which exams? *";
      case "skill-language": return "Which skills / languages? *";
      case "hobby-extra": return "Which hobbies? *";
      case "counselling": return "What type of guidance? (Optional)";
      case "myself": return "What do you want to learn? *";
      default: return "Which subjects? *";
    }
  };

  const getSubjectPlaceholder = () => {
    const sub = subcategories.find(s => s.id === selectedSubId);
    const subSlug = sub?.slug || "";

    if (data.user_type === "counselling") {
      switch (subSlug) {
        case "career-counselling": return "Search for Stream Selection, Career Roadmap...";
        case "student-counselling": return "Search for Exam Stress, Study Habits...";
        case "parent-counselling": return "Search for Parenting, Child Behavior...";
        default: return "Search for specific guidance...";
      }
    }

    if (subSlug.includes("school-tuition")) {
      return "Search for Mathematics, English, All Subjects...";
    }

    if (data.user_type === "skill-language") {
      switch (subSlug) {
        case "programming": return "Search for Python, Java, React, DSA...";
        case "languages": return "Search for French, German, Spoken English...";
        case "design-creative": return "Search for UI/UX, Graphic Design, Figma...";
        default: return "Search for skills or languages...";
      }
    }

    if (data.user_type === "hobby-extra") {
      switch (subSlug) {
        case "music": return "Search for Guitar, Piano, Vocal...";
        case "dance": return "Search for Kathak, Hip Hop, Bollywood...";
        case "fitness": return "Search for Yoga, Zumba, Gym...";
        case "niche-skills": return "Search for Handwriting, Abacus, Vedic Maths...";
        default: return "Search for hobbies or extra-curriculars...";
      }
    }

    switch (data.user_type) {
      case "competitive-exams": return "Search for JEE, NEET, UPSC...";
      default: return "Search or type subject...";
    }
  };

  const getFilteredClasses = () => {
    const fullList = [
      "Nursery", "KG", "UKG", 
      "Class 1", "Class 2", "Class 3", "Class 4", "Class 5",
      "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"
    ];
    if (data.user_type === "myself") {
      return fullList.slice(8); // Start from Class 6, ends at 12
    }
    return fullList;
  };

  const isSchoolTuition = () => {
    const sub = subcategories.find(s => s.id === selectedSubId);
    return sub?.slug.includes("school-tuition");
  };

  const getPopularSubjectsForGrade = (grade: string) => {
    const common = ["All Subjects", "Mathematics", "English", "Hindi"];
    
    if (!grade) return [];
    
    if (["Nursery", "KG", "UKG", "Class 1", "Class 2"].includes(grade)) {
      return [...common, "Handwriting Improvement", "Phonics", "EVS"];
    }
    if (["Class 3", "Class 4", "Class 5"].includes(grade)) {
      return [...common, "Science", "Social Studies (SST)", "EVS", "Handwriting Improvement"];
    }
    if (["Class 6", "Class 7", "Class 8"].includes(grade)) {
      return [...common, "Science", "Social Studies (SST)", "Sanskrit", "Computer Science"];
    }
    if (["Class 9", "Class 10"].includes(grade)) {
      return [...common, "Physics", "Chemistry", "Biology", "Social Studies (SST)", "Computer Science", "Sanskrit"];
    }
    if (["Class 11", "Class 12"].includes(grade)) {
      return [
        "Physics", "Chemistry", "Mathematics", "Biology", 
        "Accountancy", "Business Studies", "Economics",
        "History", "Geography", "Computer Science", "Applied Maths"
      ];
    }
    return [];
  };

  return (
    <div className="space-y-4 pb-4">
      <div>
        <Label className="mb-2 block text-xs font-black uppercase tracking-widest text-primary/70">Who is the tutor for? *</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {categories.map((t) => (
            <OptionChip
              key={t.id}
              variant="card"
              selected={selectedCatId === t.id}
              onClick={() => {
                setSelectedCatId(t.id);
                setSelectedSubId(null);
                // Reset ALL dependent data when changing main category
                onChange({ 
                  user_type: t.slug, 
                  subjects: [], 
                  learning_subcategory: "",
                  class_level: "" 
                });
              }}
              className="py-2 px-1 h-[72px] md:h-20"
            >
              <span className="text-lg md:text-xl">{t.icon}</span>
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-tight leading-none text-center">{t.name}</span>
            </OptionChip>
          ))}
        </div>
      </div>

      {subcategories.length > 0 && (
        <div className="animate-in fade-in slide-in-from-top-2">
          <Label className="mb-2 block text-xs font-black uppercase tracking-widest text-primary/70">
             {data.user_type === 'counselling' ? 'Guidance Type *' : 'Category *'}
          </Label>
          
          {/* Mobile Dropdown for ALL Categories / Desktop Chips */}
          <div className="md:hidden block">
            <PremiumSelect 
              options={subcategories.filter(s => !(data.user_type === 'myself' && s.name.includes('Post Graduation')))}
              value={selectedSubId || ""}
              showSearch={false}
              onChange={(id, name) => {
                setSelectedSubId(id);
                // Reset subjects/class when subcategory changes
                onChange({ 
                  learning_subcategory: name,
                  subjects: [],
                  class_level: ""
                });
              }}
              placeholder="Select Category..."
            />
          </div>

          <div className="hidden md:flex flex-wrap gap-2">
            {subcategories
              .filter(s => !(data.user_type === 'myself' && s.name.includes('Post Graduation')))
              .map(s => (
              <OptionChip
                key={s.id}
                selected={selectedSubId === s.id}
                onClick={() => {
                  setSelectedSubId(s.id);
                  onChange({ 
                    learning_subcategory: s.name,
                    subjects: [],
                    class_level: ""
                  });
                }}
                className="px-3 py-1.5 text-[11px] font-bold"
              >
                {s.name}
              </OptionChip>
            ))}
          </div>
        </div>
      )}

      {selectedSubId && (
        <div className="animate-in fade-in slide-in-from-top-2 space-y-4">
          {isSchoolTuition() && (
            <div className="animate-in zoom-in-95 duration-300">
              <PremiumSelect 
                label="Select Class / Grade *"
                options={getFilteredClasses().map(c => ({ id: c, name: c }))}
                value={data.class_level}
                showSearch={false}
                onChange={(id) => {
                  // Reset subjects when class changes to trigger the new filtered chips
                  onChange({ 
                    class_level: id,
                    subjects: [] 
                  });
                }}
                placeholder="Choose Class..."
              />
            </div>
          )}

          {(!isSchoolTuition() || data.class_level) && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-500">
              <Label className="mb-2 block text-xs font-black uppercase tracking-widest text-primary/70">
                {getSubjectLabel().replace(" *", "")}
                {!(data.learning_subcategory === "Early Learning" || data.learning_subcategory === "Special Education") && " *"}
                {(data.learning_subcategory === "Early Learning" || data.learning_subcategory === "Special Education") && " (Optional)"}
              </Label>
              
              <div className="flex flex-wrap gap-2 mb-3 empty:hidden">
                {data.subjects.map(s => (
                  <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-[11px] font-bold">
                    {s}
                    <button type="button" onClick={() => removeSubject(s)} className="hover:text-destructive transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="relative" ref={searchRef}>
                <div className="flex items-center relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    placeholder={getSubjectPlaceholder()} 
                    value={subjectInput}
                    onChange={e => {
                      setSubjectInput(e.target.value);
                      setShowSearchDropdown(true);
                    }}
                    onFocus={() => setShowSearchDropdown(true)}
                    onKeyDown={onKeyDown}
                    className="pl-11 h-11 md:h-12 rounded-xl text-xs md:text-sm border-2 font-bold bg-white border-slate-100 focus-visible:ring-primary/20 focus-visible:border-primary transition-all shadow-sm"
                  />
                </div>
                
                <AnimatePresence>
                  {showSearchDropdown && subjectInput.length >= 2 && (
                    <motion.ul
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-30 left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl max-h-60 overflow-y-auto py-2 custom-scrollbar"
                    >
                      {topics
                        .filter(t => t.name.toLowerCase().includes(subjectInput.toLowerCase()))
                        .map(t => (
                        <li key={t.id}>
                          <button
                            type="button"
                            onClick={() => {
                              handleAddSubject(t.name);
                              setShowSearchDropdown(false);
                            }}
                            className="w-full text-left px-5 py-3.5 text-sm hover:bg-slate-50 transition-colors font-bold text-slate-700 flex items-center justify-between border-b border-slate-50 last:border-0"
                          >
                            {t.name}
                            <Plus className="w-4 h-4 text-primary/40" />
                          </button>
                        </li>
                      ))}
                      
                      <li>
                        <button
                          type="button"
                          onClick={() => {
                            handleAddSubject(subjectInput);
                            setShowSearchDropdown(false);
                          }}
                          className="w-full text-left px-5 py-4 text-xs text-primary bg-primary/5 hover:bg-primary/10 transition-colors font-black flex items-center gap-2 uppercase tracking-widest"
                        >
                          <Plus className="w-4 h-4" /> Add custom: "{subjectInput}"
                        </button>
                      </li>
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>

              {((isSchoolTuition() && data.class_level) || topics.length > 0) && !showSearchDropdown && (
                <div className="mt-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                    {isSchoolTuition() && data.class_level ? `Popular for ${data.class_level}` : "Popular in this category"}
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {(isSchoolTuition() && data.class_level 
                      ? getPopularSubjectsForGrade(data.class_level).filter(s => !data.subjects.includes(s))
                      : topics.filter(t => !data.subjects.includes(t.name)).sort((a, b) => (a.slug === "all-subjects" ? -1 : b.slug === "all-subjects" ? 1 : 0)).map(t => t.name)
                    )
                    .slice(0, 10)
                    .map(subjectName => (
                      <button 
                        key={subjectName}
                        onClick={() => handleAddSubject(subjectName)}
                        className={cn(
                          "px-3.5 py-2 text-[11px] font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm active:scale-95",
                          subjectName === "All Subjects" 
                            ? "bg-primary text-white border-primary" 
                            : "bg-white hover:bg-slate-50 border border-slate-200"
                        )}
                      >
                        <Plus className={cn("w-3.5 h-3.5", subjectName === "All Subjects" ? "text-white" : "text-primary")} /> {subjectName}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RequirementStep;
