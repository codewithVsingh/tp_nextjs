import Link from "next/link";;
import { openWhatsApp } from "@/modules/shared/logic/whatsapp";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  CheckCircle, Star, Shield, Users, Clock, MapPin, ArrowRight,
  IndianRupee, GraduationCap, BookOpen, MessageCircle, FileText,
  Scale, Newspaper, Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { areas, subjects, examTypes, type SeoPageData } from "@/data/seoData";
import { getSmartInternalLinks } from "@/data/seoContentGenerator";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// ===== TRUST LAYER =====
export const TrustLayer = ({ pageData }: { pageData: SeoPageData }) => {
  const area = pageData.area?.name || "Delhi";
  const testimonials = [
    { name: "Priya M.", area: "Rohini", text: "My son's Maths scores jumped from 62% to 89% in just 3 months. The tutor was incredibly patient and thorough." },
    { name: "Rahul K.", area: "Dwarka", text: "We were skeptical about home tuition, but the free demo class convinced us. Best decision for our daughter's board prep." },
    { name: "Sunita V.", area: "Noida", text: "Finding a verified female tutor was our priority. Tutors Parliament matched us within 24 hours. Highly recommend!" },
    { name: "Amit S.", area: "Gurgaon", text: "The tutor not only teaches the subject but also mentors my child. Grades improved significantly." },
  ];
  const seed = pageData.slug.length;
  const testimonial = testimonials[seed % testimonials.length];

  return (
    <section className="py-12 bg-slate-50 border-y border-slate-100">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Shield, label: "Verified Tutors", sub: "ID & qualification checked" },
            { icon: CheckCircle, label: "Background Checked", sub: "Criminal & reference verified" },
            { icon: Star, label: "4.5+ Rated", sub: "Avg tutor rating" },
            { icon: Clock, label: "Match in 24 Hours", sub: "No commitment required" },
          ].map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center p-4 rounded-xl bg-background border border-border card-shadow"
            >
              <b.icon className="h-6 w-6 text-primary mb-2" />
              <span className="font-heading font-semibold text-sm text-foreground">{b.label}</span>
              <span className="text-xs text-muted-foreground mt-0.5">{b.sub}</span>
            </motion.div>
          ))}
        </div>
        {/* Testimonial */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-background rounded-xl p-6 border border-border card-shadow max-w-2xl mx-auto"
        >
          <div className="flex gap-1 mb-2">
            {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />)}
          </div>
          <p className="text-foreground text-sm leading-relaxed italic mb-3">"{testimonial.text}"</p>
          <p className="text-muted-foreground text-xs font-medium">Ã¢â‚¬â€ {testimonial.name}, {testimonial.area}</p>
        </motion.div>
      </div>
    </section>
  );
};


// ===== FEES SECTION =====
export const FeesSection = ({ pageData }: { pageData: SeoPageData }) => {
  const area = pageData.area?.name || "Delhi";
  const fees = [
    { range: "Classes 1-5", fee: "₹300 - ₹600/hr", note: "Foundation & Homework Help" },
    { range: "Classes 6-8", fee: "₹400 - ₹700/hr", note: "Subject Strengthening" },
    { range: "Classes 9-10", fee: "₹500 - ₹1,000/hr", note: "Board exam prep" },
    { range: "Classes 11-12", fee: "₹600 - ₹1,200/hr", note: "Advanced + entrance prep" },
    { range: "JEE / NEET / CUET", fee: "₹800 - ₹1,500/hr", note: "Mock tests, strategy" },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="text-center mb-10">
          <h2 className="font-heading font-black text-2xl md:text-3xl text-slate-900 mb-3 flex items-center justify-center gap-2">
            <IndianRupee className="h-6 w-6 text-primary" /> Tuition Fees in {area}
          </h2>
          <p className="text-slate-500 text-sm">Transparent pricing. No hidden charges. First demo class is always free.</p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-4 font-heading font-bold text-slate-700 text-xs tracking-wider uppercase">Class Range</th>
                <th className="p-4 font-heading font-bold text-slate-700 text-xs tracking-wider uppercase">Fee / Hour</th>
                <th className="p-4 font-heading font-bold text-slate-700 text-xs tracking-wider uppercase hidden sm:table-cell">Includes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {fees.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                  <td className="p-4 text-slate-800 font-medium text-sm">{row.range}</td>
                  <td className="p-4 text-primary font-bold text-sm">{row.fee}</td>
                  <td className="p-4 text-slate-500 text-sm hidden sm:table-cell">{row.note}</td>
                </tr>
              ))}
              <tr className="bg-orange-50/30">
                <td className="p-4 text-orange-700 font-bold text-sm underline decoration-orange-200 decoration-2 underline-offset-4">Bulk Discount (10+ hrs)</td>
                <td className="p-4 text-orange-600 font-bold text-sm">10% OFF</td>
                <td className="p-4 text-orange-500/70 text-xs hidden sm:table-cell italic">Monthly pre-paid plans</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-center text-slate-400 text-xs italic">
          *Actual fees depend on tutor experience and frequency.
        </p>
      </div>
    </section>
  );
};

// ===== TOP TUTORS NEAR YOU =====
export const TopTutorsNearYou = ({ pageData }: { pageData: SeoPageData }) => {
  const [tutors, setTutors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const area = pageData.area?.name || "Delhi";

  useEffect(() => {
    const fetchTutors = async () => {
      setLoading(true);
      try {
        const rawSlug = pageData.slug.toLowerCase().replace(/^\//, "");
        const { data: overrideRecords } = await supabase
          .from("page_overrides")
          .select("entity_id, position")
          .eq("entity_type", "tutor")
          .or("page_slug.ilike." + rawSlug + ",page_slug.ilike./" + rawSlug)
          .order("position");
        let pinnedTutors = [];
        if (overrideRecords && overrideRecords.length > 0) {
          const tutorIds = overrideRecords.map(r => r.entity_id);
          const { data: tutorsData } = await supabase
            .from("tutor_registrations")
            .select("*")
            .in("id", tutorIds);
          if (tutorsData) {
            pinnedTutors = overrideRecords
              .map(r => {
                const t = tutorsData.find(td => td.id === r.entity_id);
                return t ? { ...t, isPinned: true, position: r.position } : null;
              })
              .filter(t => t !== null);
          }
        }
        const { data: matches } = await supabase.rpc("match_tutors_for_params", {
          p_subject: pageData.subject?.name || null,
          p_area_slug: pageData.area?.slug || null,
          p_class_label: pageData.classLevel?.label || null,
        });
        const matchingList = (matches || [])
          .filter(m => m.visibility_status === "active")
          .map(m => ({
            ...m,
            isPinned: false,
            match_score: m.match_score || 80,
            match_reasons: m.match_reasons || ["Matched by Subject & Area"]
          }));
        const pinnedIds = new Set(pinnedTutors.map(p => p.id));
        const combined = [
          ...pinnedTutors,
          ...matchingList.filter(m => !pinnedIds.has(m.id))
        ];
        setTutors(combined.slice(0, 6));
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTutors();
  }, [pageData]);

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  if (tutors.length === 0) return null;

  return (
    <section className="py-16 bg-slate-50/50 border-y border-slate-100">
      <div className="container mx-auto max-w-5xl px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-heading font-black text-2xl md:text-3xl text-slate-900 mb-2 text-center">
            <Users className="inline h-6 w-6 text-orange-500 mr-2" />
            Top Tutors Near {area}
          </h2>
          <p className="text-muted-foreground text-center mb-8 text-sm">
            Verified, experienced educators ready to help
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutors.map((t, i) => (
            <motion.div
              key={t.id || i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`group relative p-6 rounded-[2rem] border-2 transition-all duration-500 overflow-hidden ${
                t.isPinned 
                  ? 'bg-gradient-to-br from-indigo-50/50 to-white border-indigo-100 shadow-xl shadow-indigo-100/50 hover:border-indigo-300' 
                  : 'bg-white border-slate-100 shadow-sm hover:border-slate-200 hover:shadow-md'
              }`}
            >
              {/* Premium Glow for Pinned */}
              {t.isPinned && (
                <div className="absolute -right-12 -top-12 w-32 h-32 bg-indigo-500/5 blur-[50px] group-hover:bg-indigo-500/10 transition-colors" />
              )}
              
              <div className="relative flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg shadow-inner ${
                    t.isPinned ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {t.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'TP'}
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">{t.name}</h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, star) => (
                          <Star key={star} className={`w-2.5 h-2.5 fill-current ${star < 4 ? 'text-amber-400' : 'text-slate-200'}`} />
                        ))}
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">4.9 Rating</span>
                    </div>
                  </div>
                </div>
                {t.isPinned && (
                  <Badge className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 text-white border border-amber-400/40 text-[9px] font-black px-3 py-1.5 uppercase tracking-tighter rounded-full shadow-lg shadow-indigo-200/50 flex items-center gap-1.5">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> 
                    <span className="bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent">Elite Partner</span>
                  </Badge>
                )}
              </div>

              <div className="relative space-y-4 mb-8">
                <div className="flex flex-wrap gap-1.5">
                  {(t.match_reasons || ['Verified Profile', 'Subject Expert']).map((reason: string, j: number) => (
                    <span key={j} className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1 ${
                      t.isPinned ? 'bg-indigo-50 text-indigo-600 border-indigo-100/50' : 'bg-slate-50 text-slate-500 border-slate-100'
                    }`}>
                      <CheckCircle className="w-2.5 h-2.5" /> {reason}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-2 border-t border-slate-50">
                  <div className="flex items-center gap-1"><MapPin className="w-3 h-3 text-rose-500" /> {area}</div>
                  <div className="flex items-center gap-1"><Shield className="w-3 h-3 text-emerald-500" /> ID Verified</div>
                </div>
              </div>

              <div className="relative flex items-center justify-between pt-4 gap-4">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Availability</span>
                  <span className="text-xs font-black text-emerald-600 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Highly Active
                  </span>
                </div>
                  <Button variant="cta" className={`flex-1 h-12 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg transition-transform active:scale-95 ${
                    t.isPinned 
                      ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-200' 
                      : 'bg-slate-900 hover:bg-black shadow-slate-200'
                  }`} asChild>
                    <Link href={`/demo-booking?tutor=${t.id}&from=${pageData.slug}`}>
                      Check Availability <ArrowRight className="w-3.5 h-3.5 ml-2" />
                    </Link>
                  </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ===== AUTOMATED INTERNAL LINKING BLOCK =====
export const InternalLinkingBlock = ({ pageData }: { pageData: SeoPageData }) => {
  const allLinks = getSmartInternalLinks(pageData);

  const subjectLinks = allLinks.filter(l => l.category === "subject");
  const areaLinks = allLinks.filter(l => l.category === "area");
  const intentLinks = allLinks.filter(l => l.category === "intent");
  const decisionLinks = allLinks.filter(l => l.category === "decision");
  const examLinks = allLinks.filter(l => l.category === "exam");
  const blogLinks = allLinks.filter(l => l.category === "blog");
  const serviceLinks = allLinks.filter(l => l.category === "service");

  const categoryIcon = {
    subject: BookOpen,
    area: MapPin,
    intent: FileText,
    decision: Scale,
    exam: GraduationCap,
    blog: Newspaper,
    service: Sparkles,
  };

  const sections = [
    { title: "Related Subjects", links: subjectLinks, icon: categoryIcon.subject },
    { title: "Nearby Tutors", links: areaLinks, icon: categoryIcon.area },
    { title: "Find What You Need", links: intentLinks, icon: categoryIcon.intent },
    { title: "Compare & Decide", links: decisionLinks, icon: categoryIcon.decision },
    { title: "Exam Preparation", links: examLinks, icon: categoryIcon.exam },
    { title: "Helpful Guides", links: blogLinks, icon: categoryIcon.blog },
    { title: "Explore More Classes", links: serviceLinks, icon: categoryIcon.service },
  ].filter(s => s.links.length > 0);

  if (sections.length === 0) return null;

  return (
    <section className="py-12">
      <div className="container mx-auto max-w-5xl px-4">
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-heading font-bold text-2xl text-foreground mb-8 text-center"
        >
          Explore Related Pages
        </motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section, si) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={si}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: si * 0.06 }}
                className="p-5 rounded-xl border border-border bg-background card-shadow"
              >
                <h3 className="font-heading font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
                  <Icon className="h-4 w-4 text-primary shrink-0" /> {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((l, li) => (
                    <li key={li}>
                      <Link
                        href={l.href}
                        className="flex items-start gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                      >
                        <ArrowRight className="h-3 w-3 shrink-0 mt-1 group-hover:translate-x-0.5 transition-transform" />
                        <span>{l.anchor}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ===== EXAM CONNECTION BLOCK =====
export const ExamConnectionBlock = ({ pageData }: { pageData: SeoPageData }) => {
  const classNum = pageData.classLevel?.slug ? parseInt(pageData.classLevel.slug) : 0;
  if (classNum < 9) return null;

  const area = pageData.area;
  const subj = pageData.subject;
  const scienceSubjects = ["physics", "chemistry", "biology", "science", "math"];
  const isScience = subj ? scienceSubjects.includes(subj.slug) : false;

  const examLinks = [
    { exam: "CBSE Board Exam Prep", href: area ? `/home-tuition-in-${area.slug}` : "/courses", always: true },
    { exam: "JEE Coaching", href: area ? `/jee-coaching-${area.slug}` : "/jee-coaching-near-me", always: isScience },
    { exam: "NEET Coaching", href: area ? `/neet-coaching-${area.slug}` : "/neet-coaching-near-me", always: isScience && subj?.slug !== "math" },
    { exam: "CUET Preparation", href: area ? `/cuet-coaching-${area.slug}` : "/cuet-coaching-near-me", always: classNum >= 11 },
  ].filter(e => e.always);

  if (examLinks.length === 0) return null;

  return (
    <section className="py-10 bg-primary/5">
      <div className="container mx-auto max-w-4xl px-4">
        <h2 className="font-heading font-bold text-xl text-foreground mb-4 text-center">
          <GraduationCap className="inline h-5 w-5 text-primary mr-2" />
          Exam Preparation {area ? `in ${area.name}` : ""}
        </h2>
        <div className="flex flex-wrap gap-3 justify-center">
          {examLinks.map((e, i) => (
            <Link
              key={i}
              href={e.href}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-background hover:border-primary hover:text-primary transition-colors text-sm text-foreground font-medium card-shadow"
            >
              <ArrowRight className="h-3.5 w-3.5" />
              {e.exam}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

// ===== STICKY BOTTOM CTA =====
export const StickyBottomCTA = ({ pageData }: { pageData: SeoPageData }) => (
  <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-background/95 backdrop-blur-md border-t border-border p-3 flex gap-2">
    <Button id="cta-sticky-mobile-demo" variant="cta" className="flex-1 py-5 text-sm font-semibold" asChild>
      <Link href={`/demo-booking?from=${pageData.slug}&cta=sticky_mobile`}>
        Book Free Demo <ArrowRight className="w-4 h-4 ml-1" />
      </Link>
    </Button>
    <Button id="cta-sticky-mobile-whatsapp" variant="outline" className="py-5 text-sm font-semibold" onClick={() => openWhatsApp(`Hi, I need a tutor for ${pageData.keyword} in ${pageData.area?.name || "Delhi"}`)}>
      <MessageCircle className="w-4 h-4 mr-1" /> Talk Now
    </Button>
  </div>
);

