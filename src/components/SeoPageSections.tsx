import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  CheckCircle, Star, Shield, Users, Clock, MapPin, ArrowRight,
  IndianRupee, GraduationCap, BookOpen, MessageCircle, FileText,
  Scale, Newspaper, Sparkles,
} from "lucide-react";
import { areas, subjects, examTypes, type SeoPageData } from "@/data/seoData";
import { getSmartInternalLinks } from "@/data/seoContentGenerator";

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
    <section className="py-10 bg-muted/30">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Shield, label: "Verified Tutors", sub: "ID & qualification checked" },
            { icon: CheckCircle, label: "Background Checked", sub: "Criminal & reference verified" },
            { icon: Star, label: "4.5+ Rated", sub: "Avg tutor rating" },
            { icon: Clock, label: "Free Demo in 24h", sub: "No commitment required" },
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
          <p className="text-muted-foreground text-xs font-medium">— {testimonial.name}, {testimonial.area}</p>
        </motion.div>
      </div>
    </section>
  );
};

// ===== FEES SECTION =====
export const FeesSection = ({ pageData }: { pageData: SeoPageData }) => {
  const area = pageData.area?.name || "Delhi NCR";
  const classSlug = pageData.classLevel?.slug;
  const classNum = classSlug ? parseInt(classSlug) : 0;

  const getFeeRange = () => {
    if (classNum >= 11) return { low: "₹600", high: "₹1,500", label: "Classes 11-12 / Competitive" };
    if (classNum >= 9) return { low: "₹500", high: "₹1,000", label: "Classes 9-10 (Board Prep)" };
    if (classNum >= 6) return { low: "₹400", high: "₹700", label: "Classes 6-8" };
    return { low: "₹300", high: "₹600", label: "Classes 1-5 (Foundation)" };
  };
  const fee = getFeeRange();

  return (
    <section className="py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-2 text-center">
            <IndianRupee className="inline h-6 w-6 text-primary mr-1" />
            Tuition Fees in {area}
          </h2>
          <p className="text-muted-foreground text-center mb-8 max-w-xl mx-auto text-sm">
            Transparent pricing. No hidden charges. First demo class is always free.
          </p>
        </motion.div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-border">
                <th className="text-left p-3 font-heading font-semibold text-foreground text-sm">Class Range</th>
                <th className="text-left p-3 font-heading font-semibold text-foreground text-sm">Fee / Hour</th>
                <th className="text-left p-3 font-heading font-semibold text-foreground text-sm hidden sm:table-cell">Includes</th>
              </tr>
            </thead>
            <tbody>
              {[
                { range: "Classes 1–5", fee: "₹300–₹600/hr", note: "Foundation, homework help", highlight: classNum >= 1 && classNum <= 5 },
                { range: "Classes 6–8", fee: "₹400–₹700/hr", note: "Subject strengthening", highlight: classNum >= 6 && classNum <= 8 },
                { range: "Classes 9–10", fee: "₹500–₹1,000/hr", note: "Board exam prep", highlight: classNum >= 9 && classNum <= 10 },
                { range: "Classes 11–12", fee: "₹600–₹1,200/hr", note: "Advanced + entrance prep", highlight: classNum >= 11 },
                { range: "JEE / NEET / CUET", fee: "₹800–₹1,500/hr", note: "Mock tests, strategy", highlight: false },
              ].map((row, i) => (
                <tr key={i} className={`border-b border-border/50 transition-colors ${row.highlight ? "bg-primary/5" : "hover:bg-muted/30"}`}>
                  <td className="p-3 text-foreground text-sm font-medium">{row.range}</td>
                  <td className="p-3 text-primary font-bold text-sm">{row.fee}</td>
                  <td className="p-3 text-muted-foreground text-xs hidden sm:table-cell">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-center mt-6">
          <Button variant="cta" size="lg" asChild>
            <Link to="/demo-booking">Get Exact Fees for Your Requirement</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

// ===== TOP TUTORS NEAR YOU =====
export const TopTutorsNearYou = ({ pageData }: { pageData: SeoPageData }) => {
  const area = pageData.area?.name || "Delhi";
  const subj = pageData.subject?.name || "All Subjects";
  const tutors = [
    { name: "Priya Sharma", initials: "PS", exp: "8 yrs", subjects: "Maths & Science", rating: 4.9, classes: "6-12", board: "CBSE/ICSE" },
    { name: "Rajesh Kumar", initials: "RK", exp: "12 yrs", subjects: "Physics & Chemistry", rating: 4.8, classes: "9-12", board: "CBSE/IB" },
    { name: "Anita Verma", initials: "AV", exp: "6 yrs", subjects: "English & Hindi", rating: 4.9, classes: "1-10", board: "All Boards" },
    { name: "Dr. Suresh Gupta", initials: "SG", exp: "15 yrs", subjects: "Biology & Chemistry", rating: 4.7, classes: "11-12", board: "CBSE" },
    { name: "Meena Devi", initials: "MD", exp: "7 yrs", subjects: "Accounts & Economics", rating: 4.8, classes: "11-12", board: "CBSE/ISC" },
  ];

  return (
    <section className="py-12 bg-muted/20">
      <div className="container mx-auto max-w-5xl px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-2 text-center">
            <Users className="inline h-6 w-6 text-primary mr-2" />
            Top Tutors Near {area}
          </h2>
          <p className="text-muted-foreground text-center mb-8 text-sm">
            Verified, experienced educators ready to help
          </p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tutors.slice(0, 5).map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="p-5 rounded-xl border border-border bg-background card-shadow hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                  {t.initials}
                </div>
                <div className="min-w-0">
                  <div className="font-heading font-semibold text-foreground text-sm truncate">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.exp} experience</div>
                </div>
              </div>
              <div className="space-y-1 text-xs text-muted-foreground mb-3">
                <div className="flex justify-between"><span>Subjects:</span><span className="text-foreground font-medium">{t.subjects}</span></div>
                <div className="flex justify-between"><span>Classes:</span><span className="text-foreground font-medium">{t.classes}</span></div>
                <div className="flex justify-between"><span>Board:</span><span className="text-foreground font-medium">{t.board}</span></div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className={`h-3 w-3 ${j < Math.floor(t.rating) ? "fill-secondary text-secondary" : "text-muted-foreground/30"}`} />
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">{t.rating}</span>
                </div>
                <Button variant="cta" size="sm" className="text-xs h-7 px-3" asChild>
                  <Link to="/demo-booking">Book Demo</Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-6">
          <Button variant="outline" asChild>
            <Link to="/demo-booking" className="flex items-center gap-2">
              View All Tutor Profiles <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
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
    { title: "Nearby Areas (Delhi NCR)", links: areaLinks, icon: categoryIcon.area },
    { title: "Find What You Need", links: intentLinks, icon: categoryIcon.intent },
    { title: "Compare & Decide", links: decisionLinks, icon: categoryIcon.decision },
    { title: "Exam Preparation", links: examLinks, icon: categoryIcon.exam },
    { title: "Helpful Reads", links: blogLinks, icon: categoryIcon.blog },
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
                        to={l.href}
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
              to={e.href}
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
    <Button variant="cta" className="flex-1 py-5 text-sm font-semibold" asChild>
      <Link to="/demo-booking">
        Book Free Demo <ArrowRight className="w-4 h-4 ml-1" />
      </Link>
    </Button>
    <Button variant="outline" className="py-5 text-sm font-semibold" onClick={() => openWhatsApp("Hi, I need a tutor")}>
      <MessageCircle className="w-4 h-4 mr-1" /> Talk Now
    </Button>
  </div>
);
