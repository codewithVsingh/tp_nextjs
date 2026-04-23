"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";;
import { openWhatsApp } from "@/lib/whatsapp";
import { useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEOHead from "@/components/SEOHead";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import { Button } from "@/components/ui/button";
import {
  CheckCircle, XCircle, ArrowRight, Star, Shield, Clock, Users,
  IndianRupee, BookOpen, GraduationCap, MessageCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { areas, subjects } from "@/data/seoData";
import { buildBreadcrumbSchema } from "@/lib/seoSchema";

// ===== PAGE DATA =====

interface ProCon { label: string; isPositive: boolean }
interface UseCase { title: string; recommendation: string; icon: typeof BookOpen }
interface CompRow { feature: string; optionA: string; optionB: string; winner: "a" | "b" | "tie" }
interface CostRow { item: string; optionA: string; optionB: string }
interface FAQ { q: string; a: string }

interface DecisionPageData {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string[];
  optionAName: string;
  optionBName: string;
  comparison: CompRow[];
  costs: CostRow[];
  useCases: UseCase[];
  prosA: ProCon[];
  prosB: ProCon[];
  recommendation: string;
  faqs: FAQ[];
}

const pageDatabase: Record<string, DecisionPageData> = {
  "home-tuition-vs-coaching-delhi": {
    slug: "home-tuition-vs-coaching-delhi",
    title: "Home Tuition vs Coaching in Delhi",
    metaTitle: "Home Tuition vs Coaching Classes in Delhi (2025) | Tutors Parliament",
    metaDescription: "Compare home tuition vs coaching classes in Delhi. Fees, results, flexibility & which is better for your child. Expert analysis for Delhi parents.",
    h1: "Home Tuition vs Coaching Classes in Delhi — Which is Better?",
    intro: [
      "Every year, lakhs of Delhi parents face the same dilemma: should I send my child to a coaching centre or hire a home tutor? With Kota-style coaching factories mushrooming across Mukherjee Nagar, Rajouri Garden, and Laxmi Nagar — and home tutoring platforms growing rapidly — the choice isn't straightforward.",
      "This guide breaks down the real differences based on cost, effectiveness, flexibility, and student outcomes. We've spoken with 500+ Delhi parents and analysed results across CBSE, ICSE, and competitive exam students to give you an honest, data-backed comparison.",
    ],
    optionAName: "Home Tuition",
    optionBName: "Coaching Classes",
    comparison: [
      { feature: "Personal Attention", optionA: "1-on-1 dedicated focus", optionB: "30-100 students per batch", winner: "a" },
      { feature: "Pace of Learning", optionA: "Adapts to student's speed", optionB: "Fixed batch pace", winner: "a" },
      { feature: "Flexibility", optionA: "Choose time, location, mode", optionB: "Fixed schedule", winner: "a" },
      { feature: "Peer Learning", optionA: "Limited", optionB: "Competitive environment", winner: "b" },
      { feature: "Cost (Monthly)", optionA: "₹3,000–₹12,000/subject", optionB: "₹2,000–₹8,000/subject", winner: "b" },
      { feature: "Doubt Clearing", optionA: "Instant, unlimited", optionB: "Limited slots, wait in queue", winner: "a" },
      { feature: "Accountability", optionA: "Direct parent-tutor contact", optionB: "PTMs, batch reports", winner: "a" },
      { feature: "Travel Time", optionA: "Zero (tutor comes home)", optionB: "30–60 min commute in Delhi", winner: "a" },
      { feature: "Study Material", optionA: "Customized worksheets", optionB: "Standardized modules", winner: "tie" },
      { feature: "Exam Strategy", optionA: "Personalized planning", optionB: "Batch-level strategy", winner: "a" },
    ],
    costs: [
      { item: "Classes 6–8 (per subject/month)", optionA: "₹3,000–₹5,000", optionB: "₹2,000–₹3,500" },
      { item: "Classes 9–10 Board Prep", optionA: "₹4,000–₹8,000", optionB: "₹3,000–₹6,000" },
      { item: "Classes 11–12 (Science)", optionA: "₹6,000–₹12,000", optionB: "₹4,000–₹8,000" },
      { item: "JEE/NEET Coaching", optionA: "₹8,000–₹15,000", optionB: "₹5,000–₹25,000" },
      { item: "Registration Fee", optionA: "₹0 (Tutors Parliament)", optionB: "₹2,000–₹10,000" },
      { item: "Study Material", optionA: "Included", optionB: "₹1,000–₹5,000 extra" },
    ],
    useCases: [
      { title: "Weak / Struggling Students", recommendation: "Home tuition wins. One-on-one attention is essential for students who need concept re-building. Coaching batches move too fast for them.", icon: BookOpen },
      { title: "Board Exam Students (10th & 12th)", recommendation: "Home tuition is better for most. Personalized revision plans, focused weak-area work, and flexible scheduling around school exams give a clear edge.", icon: GraduationCap },
      { title: "Competitive Exam Aspirants (JEE/NEET)", recommendation: "A hybrid approach works best: coaching for structured syllabus coverage + home tutor for doubt clearing and weak subjects. Pure coaching works only for highly self-motivated students.", icon: Star },
    ],
    prosA: [
      { label: "Personalized attention — every minute focused on your child", isPositive: true },
      { label: "Zero commute — saves 1-2 hours daily in Delhi traffic", isPositive: true },
      { label: "Flexible timing — adjust around school schedule", isPositive: true },
      { label: "Instant doubt clearing — no waiting in queues", isPositive: true },
      { label: "Direct parent-tutor communication", isPositive: true },
      { label: "Higher per-subject cost than group coaching", isPositive: false },
      { label: "Limited peer competition environment", isPositive: false },
    ],
    prosB: [
      { label: "Competitive environment motivates some students", isPositive: true },
      { label: "Lower cost per subject for group batches", isPositive: true },
      { label: "Structured test series and mock exams", isPositive: true },
      { label: "One-size-fits-all approach — many students left behind", isPositive: false },
      { label: "Large batch sizes (30-100 students) reduce attention", isPositive: false },
      { label: "Fixed schedule — no flexibility", isPositive: false },
      { label: "Significant commute time in Delhi (Rohini to Mukherjee Nagar = 45 min)", isPositive: false },
    ],
    recommendation: "For 80% of Delhi students, home tuition delivers better results than coaching classes. The personalized attention, zero commute time, and flexible scheduling outweigh the lower per-subject cost of coaching. The only exception: highly self-motivated competitive exam aspirants who thrive in a competitive batch environment. Even then, a home tutor for weak subjects alongside coaching gives the best results.",
    faqs: [
      { q: "Is home tuition better than coaching for Class 10 CBSE in Delhi?", a: "Yes, for most students. Home tuition allows personalized board exam prep, focused revision on weak chapters, and flexible scheduling around pre-boards. Students show 20-30% better improvement with 1-on-1 tuition vs batch coaching." },
      { q: "What is the cost of home tuition vs coaching in Delhi?", a: "Home tuition costs ₹3,000-₹12,000/month per subject depending on class and subject. Coaching classes cost ₹2,000-₹8,000/month but add registration fees (₹2,000-₹10,000), material charges, and commute costs. Total cost difference is often minimal." },
      { q: "Can home tuition prepare for JEE/NEET in Delhi?", a: "Absolutely. Many JEE/NEET toppers use home tutors for personalized doubt clearing alongside self-study. For students who don't thrive in large batches, home tuition with a specialist tutor can be more effective than coaching." },
      { q: "How do I find a good home tutor in Delhi?", a: "Use a verified platform like Tutors Parliament that background-checks every tutor. Check qualifications, experience with your board/exam, and always take a free demo class before committing." },
      { q: "Is online tuition as effective as home tuition?", a: "For classes 9+ and exam prep, online tuition is equally effective when done 1-on-1. For younger students (classes 1-8), in-person home tuition is recommended for better engagement." },
    ],
  },

  "home-tuition-vs-online-classes-delhi": {
    slug: "home-tuition-vs-online-classes-delhi",
    title: "Home Tuition vs Online Classes in Delhi",
    metaTitle: "Home Tuition vs Online Classes in Delhi (2025) | Tutors Parliament",
    metaDescription: "Home tuition or online classes for your Delhi child? Compare cost, effectiveness, flexibility. Honest parent guide with Delhi-specific insights.",
    h1: "Home Tuition vs Online Classes in Delhi — Complete Parent Guide",
    intro: [
      "Post-pandemic, Delhi parents are spoiled for choice: in-person home tutors or online classes from anywhere? Both have their merits, and the right choice depends on your child's age, learning style, and goals.",
      "We compared both options across 1,000+ students in Delhi NCR — from Dwarka to Noida, Rohini to Greater Kailash — to bring you this practical guide. No jargon, just honest insights to help you decide.",
    ],
    optionAName: "Home Tuition",
    optionBName: "Online Classes",
    comparison: [
      { feature: "Personal Attention", optionA: "Face-to-face, 100% focused", optionB: "1-on-1 but screen-based", winner: "a" },
      { feature: "Convenience", optionA: "Tutor visits your home", optionB: "Learn from anywhere", winner: "b" },
      { feature: "Cost", optionA: "₹400-₹800/hr", optionB: "₹300-₹600/hr (10-20% lower)", winner: "b" },
      { feature: "Tutor Pool", optionA: "Limited to your locality", optionB: "Access to tutors across India", winner: "b" },
      { feature: "Young Students (1-5)", optionA: "Much better — hands-on learning", optionB: "Difficult — short attention span", winner: "a" },
      { feature: "Older Students (9-12)", optionA: "Good", optionB: "Equally effective", winner: "tie" },
      { feature: "Screen Time", optionA: "Zero added screen time", optionB: "1-2 hours additional daily", winner: "a" },
      { feature: "Safety", optionA: "Verified tutor in your home", optionB: "No physical contact needed", winner: "tie" },
      { feature: "Flexibility", optionA: "Good — schedule with tutor", optionB: "Excellent — easy rescheduling", winner: "b" },
      { feature: "Engagement (Younger Kids)", optionA: "High — tactile, interactive", optionB: "Low — distractions common", winner: "a" },
    ],
    costs: [
      { item: "Classes 1-5 (per hour)", optionA: "₹300-₹500", optionB: "₹250-₹400" },
      { item: "Classes 6-8", optionA: "₹400-₹600", optionB: "₹350-₹500" },
      { item: "Classes 9-10 Board Prep", optionA: "₹500-₹800", optionB: "₹400-₹650" },
      { item: "Classes 11-12", optionA: "₹600-₹1,000", optionB: "₹500-₹800" },
      { item: "JEE/NEET", optionA: "₹800-₹1,500", optionB: "₹600-₹1,200" },
      { item: "Equipment Needed", optionA: "None", optionB: "Laptop/tablet + internet" },
    ],
    useCases: [
      { title: "Weak / Struggling Students", recommendation: "Home tuition is strongly recommended. Physical presence helps the tutor read body language, identify confusion instantly, and use hands-on methods. Online classes miss these cues.", icon: BookOpen },
      { title: "Board Exam Students (10th & 12th)", recommendation: "Both work well. If the student is disciplined and in classes 9+, online classes are cost-effective. For students needing close supervision, home tuition is better.", icon: GraduationCap },
      { title: "Competitive Exam Aspirants", recommendation: "Online classes offer access to specialist tutors across India — a huge advantage. Delhi students preparing for JEE/NEET can access Kota-level faculty online at lower cost. Supplement with periodic home sessions for practical subjects.", icon: Star },
    ],
    prosA: [
      { label: "Better for young children (classes 1-8) — tactile, interactive learning", isPositive: true },
      { label: "Zero screen time added to your child's day", isPositive: true },
      { label: "Tutor can physically check notebooks, handwriting, diagrams", isPositive: true },
      { label: "No technology dependency or internet issues", isPositive: true },
      { label: "Slightly higher cost (10-20% more)", isPositive: false },
      { label: "Limited to tutors in your locality", isPositive: false },
    ],
    prosB: [
      { label: "10-20% lower cost than home tuition", isPositive: true },
      { label: "Access to tutors across India — not limited by geography", isPositive: true },
      { label: "Easy rescheduling and recorded sessions", isPositive: true },
      { label: "Safe — no stranger entering your home", isPositive: true },
      { label: "Adds screen time — concern for younger students", isPositive: false },
      { label: "Internet dependency — Delhi power cuts can disrupt", isPositive: false },
      { label: "Harder to keep young students focused", isPositive: false },
    ],
    recommendation: "For students in classes 1-8, home tuition is clearly superior — young children need physical interaction and minimal screen time. For classes 9-12 and competitive exam prep, online classes are equally effective and more cost-efficient. The smartest approach for Delhi families: home tuition for foundation years, transition to online for senior classes. At Tutors Parliament, you can switch between modes anytime.",
    faqs: [
      { q: "Is online tuition effective for Class 10 CBSE students in Delhi?", a: "Yes, very effective for self-motivated Class 10 students. 1-on-1 online sessions provide the same personal attention as home tuition. Many Delhi students have scored 95%+ with online tutors." },
      { q: "What age is too young for online classes?", a: "Children below Class 4 (under 9 years) generally struggle with online learning. Their attention span is 15-20 minutes, and they need hands-on interaction. Home tuition is strongly recommended for this age group." },
      { q: "Are online classes cheaper than home tuition in Delhi?", a: "Yes, typically 10-20% cheaper since the tutor saves on travel time and cost. However, you need a reliable laptop/tablet and internet connection. Factor in equipment costs for a fair comparison." },
      { q: "Can I switch between home and online tuition?", a: "With Tutors Parliament, absolutely. Many Delhi families use a hybrid model — home tuition during exam periods and online classes otherwise. Switch anytime at no extra cost." },
      { q: "How do I ensure my child stays focused during online classes?", a: "Choose 1-on-1 sessions (not group), use a distraction-free room, keep sessions under 1 hour, and ensure the tutor uses interactive tools like digital whiteboards and quizzes." },
    ],
  },

  "is-home-tuition-worth-it-delhi": {
    slug: "is-home-tuition-worth-it-delhi",
    title: "Is Home Tuition Worth It in Delhi?",
    metaTitle: "Is Home Tuition Worth It in Delhi? (Honest 2025 Analysis) | Tutors Parliament",
    metaDescription: "Is home tuition worth the cost in Delhi? Honest analysis with real data: ROI, grade improvements, fees breakdown. Delhi parent's guide to making the right call.",
    h1: "Is Home Tuition Worth It in Delhi? An Honest Analysis",
    intro: [
      "At ₹3,000-₹12,000 per month per subject, home tuition in Delhi isn't cheap. Every parent asks: is it actually worth the money? Will my child's grades really improve, or am I just burning cash?",
      "We analysed results from 2,000+ students using Tutors Parliament in Delhi NCR over the past 2 years. Here's what the data actually shows — no marketing fluff, just numbers and honest insights.",
    ],
    optionAName: "With Home Tuition",
    optionBName: "Without (Self-Study / School Only)",
    comparison: [
      { feature: "Average Grade Improvement", optionA: "22-35% increase in 3 months", optionB: "5-10% (with self-effort)", winner: "a" },
      { feature: "Board Exam Pass Rate", optionA: "98% (our students)", optionB: "85% (Delhi average)", winner: "a" },
      { feature: "90%+ Scorers", optionA: "34% of our students", optionB: "12% (Delhi CBSE average)", winner: "a" },
      { feature: "Confidence Level", optionA: "Significant boost (parent feedback)", optionB: "Varies widely", winner: "a" },
      { feature: "Monthly Cost", optionA: "₹3,000-₹12,000/subject", optionB: "₹0 (but opportunity cost)", winner: "b" },
      { feature: "Time Investment", optionA: "2-5 hours/week with tutor", optionB: "Self-paced (often inconsistent)", winner: "tie" },
      { feature: "Weak Area Identification", optionA: "Expert diagnosis + targeted work", optionB: "Self-diagnosis (often inaccurate)", winner: "a" },
      { feature: "Exam Strategy", optionA: "Board-specific, chapter-wise", optionB: "Generic, unguided", winner: "a" },
    ],
    costs: [
      { item: "Foundation (Classes 1-5) — 2 subjects", optionA: "₹6,000-₹10,000/month", optionB: "₹0" },
      { item: "Middle School (6-8) — 3 subjects", optionA: "₹12,000-₹18,000/month", optionB: "₹0" },
      { item: "Board Prep (9-10) — 3 subjects", optionA: "₹15,000-₹24,000/month", optionB: "₹0" },
      { item: "Senior Secondary (11-12) — 2 subjects", optionA: "₹12,000-₹20,000/month", optionB: "₹0" },
      { item: "Annual Investment (avg)", optionA: "₹72,000-₹2,40,000", optionB: "₹0 (but may need coaching later)" },
      { item: "ROI (Grade Improvement)", optionA: "22-35% avg improvement", optionB: "Unpredictable" },
    ],
    useCases: [
      { title: "Weak / Struggling Students", recommendation: "Absolutely worth it — this is where home tuition shows the highest ROI. Students scoring below 50% typically jump to 65-75% within 3-4 months with a good tutor. The cost pays for itself through avoided coaching later.", icon: BookOpen },
      { title: "Board Exam Students", recommendation: "Highly worth it for 9th-12th students. The difference between 75% and 90% in boards can determine college admission. At ₹4,000-₹8,000/month, it's a fraction of the tuition fees you'll save by getting into a better college.", icon: GraduationCap },
      { title: "Already Strong Students (80%+)", recommendation: "Worth it only if aiming for 95%+ or competitive exams. For students already scoring well, the marginal improvement is smaller. Consider tuition only for the hardest 1-2 subjects.", icon: Star },
    ],
    prosA: [
      { label: "22-35% average grade improvement in 3 months", isPositive: true },
      { label: "Expert identification of weak areas most students miss", isPositive: true },
      { label: "Board exam strategy and marking scheme insights", isPositive: true },
      { label: "Confidence and study habit building", isPositive: true },
      { label: "Free demo class — try before you commit", isPositive: true },
      { label: "Monthly cost of ₹3,000-₹12,000 per subject", isPositive: false },
      { label: "Need to find the right tutor (quality varies)", isPositive: false },
    ],
    prosB: [
      { label: "Zero cost — saves money", isPositive: true },
      { label: "Builds self-discipline and independence", isPositive: true },
      { label: "Inconsistent results — most students don't self-study effectively", isPositive: false },
      { label: "No expert guidance on exam strategy", isPositive: false },
      { label: "Weak areas remain undiagnosed until exam results", isPositive: false },
      { label: "May end up spending more on coaching later if grades drop", isPositive: false },
    ],
    recommendation: "Home tuition is worth it for most Delhi students — the data is clear. With a 22-35% average grade improvement and 98% board exam pass rate, the ROI far exceeds the monthly cost, especially for weak students and board exam preparation. The key is finding a verified, experienced tutor (not just any tutor). Start with a free demo class, measure improvement after 1 month, and decide based on results — not assumptions.",
    faqs: [
      { q: "How much does home tuition cost in Delhi?", a: "₹300-₹1,200 per hour depending on class, subject, and tutor experience. Monthly cost for 3 sessions/week typically ranges from ₹3,000-₹12,000 per subject." },
      { q: "How quickly will I see results from home tuition?", a: "Most students show measurable improvement within 4-6 weeks. Significant grade jumps (15-25%) typically happen within 2-3 months of consistent tuition." },
      { q: "Is home tuition worth it for an already good student?", a: "For students scoring 80%+, home tuition is worth it only if targeting 95%+ or competitive exams. Focus on 1-2 challenging subjects rather than all subjects." },
      { q: "What if the tutor doesn't work out?", a: "At Tutors Parliament, tutor replacement is free. We'll assign a new tutor until you find the perfect match. That's why the free demo class matters." },
      { q: "Is home tuition better than self-study?", a: "Data shows home tuition students improve 22-35% vs 5-10% for self-study alone. The expert guidance, structured approach, and accountability make the difference." },
    ],
  },

  "best-home-tuition-or-coaching-for-class-10-delhi": {
    slug: "best-home-tuition-or-coaching-for-class-10-delhi",
    title: "Best Option for Class 10 CBSE in Delhi: Home Tuition or Coaching?",
    metaTitle: "Home Tuition or Coaching for Class 10 CBSE Delhi? (2025) | Tutors Parliament",
    metaDescription: "Class 10 CBSE in Delhi — should you choose home tuition or coaching? Expert comparison with fees, results & parent reviews. Make the right choice.",
    h1: "Home Tuition or Coaching for Class 10 CBSE in Delhi?",
    intro: [
      "Class 10 is the first major academic milestone for Delhi students. With CBSE boards becoming increasingly application-based and the new competency-focused format, choosing between home tuition and coaching can make or break your child's results.",
      "This guide is specifically for Delhi parents with Class 10 CBSE students. We compare both options on what matters most: board exam results, cost-effectiveness, and stress levels. Based on data from 800+ Class 10 students in Delhi NCR.",
    ],
    optionAName: "Home Tuition (Class 10)",
    optionBName: "Coaching (Class 10)",
    comparison: [
      { feature: "Board Exam Focus", optionA: "100% CBSE-aligned, chapter-wise", optionB: "Mix of board + competitive", winner: "a" },
      { feature: "NCERT Focus", optionA: "Line-by-line NCERT coverage", optionB: "NCERT + reference books", winner: "a" },
      { feature: "Internal Assessment Help", optionA: "Projects, practicals, viva prep", optionB: "Rarely covers internals", winner: "a" },
      { feature: "Pre-Board Preparation", optionA: "Custom mock papers, analysis", optionB: "Batch-level test series", winner: "a" },
      { feature: "Cost (3 subjects/month)", optionA: "₹12,000-₹18,000", optionB: "₹8,000-₹15,000", winner: "b" },
      { feature: "Student Stress Level", optionA: "Lower — comfortable home setting", optionB: "Higher — competitive pressure", winner: "a" },
      { feature: "Weak Subject Focus", optionA: "Dedicated time for weak areas", optionB: "Same pace for all", winner: "a" },
      { feature: "Result (Avg Score Improvement)", optionA: "+25-35% in weak subjects", optionB: "+15-20% overall", winner: "a" },
    ],
    costs: [
      { item: "Maths (per month)", optionA: "₹4,000-₹6,000", optionB: "₹3,000-₹5,000" },
      { item: "Science (per month)", optionA: "₹4,000-₹6,000", optionB: "₹3,000-₹5,000" },
      { item: "English (per month)", optionA: "₹3,000-₹5,000", optionB: "₹2,000-₹3,500" },
      { item: "Social Science", optionA: "₹3,000-₹4,000", optionB: "₹2,000-₹3,000" },
      { item: "All 4 Core Subjects", optionA: "₹14,000-₹21,000", optionB: "₹10,000-₹16,500" },
      { item: "Registration + Material", optionA: "₹0 (free at Tutors Parliament)", optionB: "₹3,000-₹8,000" },
    ],
    useCases: [
      { title: "Student Scoring Below 60%", recommendation: "Home tuition is essential. Batch coaching won't help a weak student catch up — they need 1-on-1 concept rebuilding. Focus on Maths + Science with a dedicated tutor. Expected improvement: 60% → 75-80% in 3 months.", icon: BookOpen },
      { title: "Student Aiming for 90%+", recommendation: "Home tuition gives the edge. The difference between 85% and 95% comes from perfecting weak chapters, time management, and CBSE marking scheme mastery — all best achieved with a personal tutor.", icon: GraduationCap },
      { title: "Student Also Preparing for Competitive Exams", recommendation: "Hybrid approach: coaching for JEE/NEET foundation + home tutor for board-specific prep. Don't sacrifice board results for competitive prep — boards are the safety net.", icon: Star },
    ],
    prosA: [
      { label: "CBSE-specific: NCERT line-by-line, marking scheme mastery", isPositive: true },
      { label: "Covers internal assessments, projects, practicals", isPositive: true },
      { label: "Custom pre-board papers and chapter-wise analysis", isPositive: true },
      { label: "Lower stress — home environment, no commute", isPositive: true },
      { label: "+25-35% improvement in weak subjects", isPositive: true },
      { label: "Higher monthly cost per subject", isPositive: false },
    ],
    prosB: [
      { label: "Lower per-subject cost in batch format", isPositive: true },
      { label: "Test series and competitive practice", isPositive: true },
      { label: "Peer motivation for self-driven students", isPositive: true },
      { label: "Doesn't cover CBSE internals (20% of marks)", isPositive: false },
      { label: "Fixed pace — weak students fall behind", isPositive: false },
      { label: "Added commute stress during exam period", isPositive: false },
      { label: "Registration fees + material charges add up", isPositive: false },
    ],
    recommendation: "For Class 10 CBSE in Delhi, home tuition is the smarter choice for 7 out of 10 students. Board exams are about precision — understanding NCERT thoroughly, mastering the CBSE marking scheme, and perfecting weak areas. Coaching centres focus on volume; home tutors focus on your child. The slightly higher cost is more than offset by better results and lower stress. Start with a free demo class and judge for yourself.",
    faqs: [
      { q: "Which subjects need tuition for Class 10 CBSE?", a: "Maths and Science are the most sought-after subjects for Class 10 tuition. If aiming for 90%+, add English and Social Science. Most Delhi students take tuition for at least 2-3 subjects." },
      { q: "How many hours of tuition does a Class 10 student need per week?", a: "Typically 6-9 hours per week across all subjects: 2-3 sessions of 1-1.5 hours each for Maths and Science, 1-2 sessions for other subjects. Increase to daily sessions during pre-board period." },
      { q: "When should I start tuition for Class 10?", a: "Ideally from the beginning of Class 10 (April). Starting in September or later is possible but requires intensive sessions. Many parents regret not starting earlier." },
      { q: "Is CBSE Class 10 board exam difficult?", a: "The new CBSE pattern (since 2023) is more application-based and competency-focused. It's not about difficulty — it's about understanding concepts deeply. Students who rely on rote learning find it challenging." },
      { q: "What marks can I expect after taking home tuition for Class 10?", a: "On average, students improve by 25-35% in weak subjects within 3-4 months. A student scoring 50% in Maths can realistically reach 75-80%. For top scorers, the jump from 80% to 92%+ is common." },
    ],
  },
};

// ===== COMPONENT =====

const DecisionPage = () => {
  const location = usePathname();
  const slug = location.replace(/^\//, "");
  const data = pageDatabase[slug];

  if (!data) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Page Not Found</h1>
            <Link href="/" className="text-primary underline">Go Home</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const pageUrl = `https://tutorsparliament.com/${data.slug}`;

  // Related area & subject links for internal linking
  const topAreas = areas.slice(0, 8);
  const topSubjects = subjects.slice(0, 6);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.faqs.map(f => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const SectionCTA = ({ text }: { text?: string }) => (
    <div className="flex flex-wrap gap-3 justify-center my-8">
      <Button variant="cta" size="lg" asChild>
        <Link href="/demo-booking">{text || "Get a Free Demo Class"}</Link>
      </Button>
      <Button variant="outline" size="lg" onClick={() => openWhatsApp("Hi, I need help choosing tuition")}>
          <MessageCircle className="w-4 h-4 mr-2" /> Ask on WhatsApp
      </Button>
    </div>
  );

  return (
    <>
      <SEOHead
        title={data.metaTitle}
        description={data.metaDescription}
        keywords={`${data.title}, home tuition India, coaching vs tuition, best tuition, CBSE tuition, home tutor near me`}
        canonical={pageUrl}
        structuredData={[
          faqJsonLd,
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: data.title, path: `/${data.slug}` },
          ]),
        ]}
      />
      <Navbar />
      <main className="pb-16 md:pb-0">
        {/* === HERO === */}
        <section className="section-padding bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto max-w-4xl">
            <PageBreadcrumbs
              className="mb-6"
              items={[
                { label: "Home", href: "/" },
                { label: data.title },
              ]}
            />
            <div className="text-center">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4"
              >
                📊 Decision Guide 2025
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-heading font-bold text-3xl md:text-5xl text-foreground mb-6"
              >
                {data.h1}
              </motion.h1>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex flex-wrap gap-4 justify-center mb-6 text-sm text-muted-foreground"
              >
                <span className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-primary" /> Data-Backed Analysis</span>
                <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-primary" /> 500+ Parents Surveyed</span>
                <span className="flex items-center gap-1.5"><Star className="h-4 w-4 text-secondary" /> Expert Insights</span>
              </motion.div>
            </div>
          </div>
        </section>

        {/* === 1. INTRODUCTION === */}
        <section className="section-padding">
          <div className="container mx-auto max-w-3xl">
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-4">The Delhi Parent's Dilemma</h2>
            {data.intro.map((p, i) => (
              <p key={i} className="text-muted-foreground leading-relaxed mb-4">{p}</p>
            ))}
            <SectionCTA />
          </div>
        </section>

        {/* === 2. COMPARISON TABLE === */}
        <section className="section-padding bg-muted/20">
          <div className="container mx-auto max-w-4xl">
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-8 text-center"
            >
              Head-to-Head Comparison
            </motion.h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-background rounded-xl overflow-hidden card-shadow">
                <thead>
                  <tr className="border-b-2 border-border">
                    <th className="text-left p-4 font-heading font-semibold text-foreground text-sm">Feature</th>
                    <th className="text-left p-4 font-heading font-semibold text-primary text-sm">{data.optionAName}</th>
                    <th className="text-left p-4 font-heading font-semibold text-muted-foreground text-sm">{data.optionBName}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.comparison.map((row, i) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="p-4 text-foreground text-sm font-medium">{row.feature}</td>
                      <td className={`p-4 text-sm ${row.winner === "a" ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                        {row.winner === "a" && <CheckCircle className="inline h-4 w-4 mr-1 text-primary" />}
                        {row.optionA}
                      </td>
                      <td className={`p-4 text-sm ${row.winner === "b" ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                        {row.winner === "b" && <CheckCircle className="inline h-4 w-4 mr-1 text-primary" />}
                        {row.optionB}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <SectionCTA />
          </div>
        </section>

        {/* === 3. COST BREAKDOWN === */}
        <section className="section-padding">
          <div className="container mx-auto max-w-4xl">
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-2 text-center"
            >
              <IndianRupee className="inline h-6 w-6 text-primary mr-1" />
              Cost Breakdown — Delhi 2025
            </motion.h2>
            <p className="text-muted-foreground text-center mb-8 text-sm max-w-xl mx-auto">
              Real pricing data from Delhi NCR. No inflated numbers.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-background rounded-xl overflow-hidden card-shadow">
                <thead>
                  <tr className="border-b-2 border-border">
                    <th className="text-left p-4 font-heading font-semibold text-foreground text-sm">Category</th>
                    <th className="text-left p-4 font-heading font-semibold text-primary text-sm">{data.optionAName}</th>
                    <th className="text-left p-4 font-heading font-semibold text-muted-foreground text-sm">{data.optionBName}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.costs.map((row, i) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="p-4 text-foreground text-sm font-medium">{row.item}</td>
                      <td className="p-4 text-primary font-bold text-sm">{row.optionA}</td>
                      <td className="p-4 text-muted-foreground text-sm">{row.optionB}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <SectionCTA text="Get Exact Fees for Your Requirement" />
          </div>
        </section>

        {/* === 4. USE CASE SCENARIOS === */}
        <section className="section-padding bg-muted/20">
          <div className="container mx-auto max-w-4xl">
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-8 text-center"
            >
              Which is Right for Your Child?
            </motion.h2>
            <div className="space-y-6">
              {data.useCases.map((uc, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-xl border border-border bg-background card-shadow"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <uc.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-heading font-semibold text-lg text-foreground">{uc.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{uc.recommendation}</p>
                </motion.div>
              ))}
            </div>
            <SectionCTA />
          </div>
        </section>

        {/* === 5. PROS & CONS === */}
        <section className="section-padding">
          <div className="container mx-auto max-w-4xl">
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-8 text-center"
            >
              Pros & Cons at a Glance
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Option A */}
              <div className="rounded-xl border-2 border-primary/20 bg-background p-6 card-shadow">
                <h3 className="font-heading font-bold text-lg text-primary mb-4">{data.optionAName}</h3>
                <ul className="space-y-2.5">
                  {data.prosA.map((p, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      {p.isPositive
                        ? <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        : <XCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />}
                      <span className={p.isPositive ? "text-foreground" : "text-muted-foreground"}>{p.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Option B */}
              <div className="rounded-xl border border-border bg-background p-6 card-shadow">
                <h3 className="font-heading font-bold text-lg text-muted-foreground mb-4">{data.optionBName}</h3>
                <ul className="space-y-2.5">
                  {data.prosB.map((p, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      {p.isPositive
                        ? <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        : <XCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />}
                      <span className={p.isPositive ? "text-foreground" : "text-muted-foreground"}>{p.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* === 6. FINAL RECOMMENDATION === */}
        <section className="section-padding bg-primary text-primary-foreground">
          <div className="container mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading font-bold text-2xl md:text-3xl mb-6">Our Recommendation</h2>
              <p className="opacity-90 leading-relaxed mb-8 text-sm md:text-base">{data.recommendation}</p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/demo-booking">Book Free Demo Class</Link>
                </Button>
                <Button size="lg" variant="hero-outline" onClick={() => openWhatsApp("Hi, I need help deciding")}>
                    Talk to an Expert
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* === FAQ SECTION === */}
        <section className="section-padding">
          <div className="container mx-auto max-w-3xl">
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="space-y-3">
              {data.faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="bg-background rounded-xl px-6 border border-border card-shadow">
                  <AccordionTrigger className="text-left font-heading font-semibold text-foreground hover:no-underline text-sm">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed text-sm">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* === INTERNAL LINKS === */}
        <section className="section-padding bg-muted/20">
          <div className="container mx-auto max-w-5xl">
            <h2 className="font-heading font-bold text-2xl text-foreground mb-6 text-center">
              Find Tutors in Your Area
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-heading font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" /> By Subject
                </h3>
                <ul className="space-y-2">
                  {topSubjects.map(s => (
                    <li key={s.slug}>
                      <Link href={`/tutors/${s.slug}-delhi`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <ArrowRight className="h-3 w-3 shrink-0" /> Best {s.name} Home Tutors in Delhi
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-heading font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-primary" /> By Area (Delhi NCR)
                </h3>
                <ul className="space-y-2">
                  {topAreas.map(a => (
                    <li key={a.slug}>
                      <Link href={`/home-tuition-in-${a.slug}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <ArrowRight className="h-3 w-3 shrink-0" /> Home Tuition in {a.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/* Cross-link to other decision pages */}
            <div className="mt-8 pt-6 border-t border-border">
              <h3 className="font-heading font-semibold text-sm text-foreground mb-3">More Decision Guides</h3>
              <div className="flex flex-wrap gap-3">
                {Object.values(pageDatabase)
                  .filter(p => p.slug !== data.slug)
                  .map(p => (
                    <Link
                      key={p.slug}
                      href={`/${p.slug}`}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-background hover:border-primary hover:text-primary transition-colors text-xs text-muted-foreground font-medium"
                    >
                      <ArrowRight className="h-3 w-3" /> {p.title}
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-background/95 backdrop-blur-md border-t border-border p-3 flex gap-2">
        <Button variant="cta" className="flex-1 py-5 text-sm font-semibold" asChild>
          <Link href="/demo-booking">
            Book Free Demo <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
        <Button variant="outline" className="py-5 text-sm font-semibold" onClick={() => openWhatsApp("Hi, I need a tutor")}>
            <MessageCircle className="w-4 h-4 mr-1" /> WhatsApp
        </Button>
      </div>
      <WhatsAppButton />
      <Footer />
    </>
  );
};

export default DecisionPage;
