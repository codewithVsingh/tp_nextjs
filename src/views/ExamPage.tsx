"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";;
import { openWhatsApp } from "@/modules/shared/logic/whatsapp";
import { Helmet } from "react-helmet-async";
import WhatsAppButton from "@/components/WhatsAppButton";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Target, Brain, Users, CheckCircle, MapPin, GraduationCap, Clock, Star, TrendingUp, AlertTriangle } from "lucide-react";
import { useState } from "react";
import LeadCaptureModal from "@/components/LeadCaptureModal";

interface ExamSection {
  title: string;
  icon: React.ReactNode;
  content: string[];
  bullets?: string[];
}

interface ExamData {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  heroHeadline: string;
  heroSub: string;
  ctaText: string;
  overview: ExamSection;
  syllabus: ExamSection;
  strategy: ExamSection;
  whyHomeTuition: ExamSection;
  delhiChallenges: ExamSection;
  subjectLinks: { label: string; href: string }[];
  blogLinks: { label: string; href: string }[];
  faqs: { q: string; a: string }[];
}

const examDatabase: Record<string, ExamData> = {
  "cbse-board-exam-delhi": {
    slug: "cbse-board-exam-delhi",
    title: "CBSE Board Exam Preparation in Delhi",
    metaTitle: "CBSE Board Exam Preparation with Home Tutor in Delhi | Tutors Parliament",
    metaDescription: "Expert CBSE board exam preparation with verified home tutors in Delhi NCR. Personalized coaching for Class 10 & 12 boards. Book free demo today.",
    heroHeadline: "CBSE Board Exam Preparation with Expert Home Tutors in Delhi",
    heroSub: "Personalized 1-on-1 coaching for Class 10 & 12 CBSE boards. 95%+ results from our students across Delhi NCR.",
    ctaText: "Get Home Tutor for CBSE Boards",
    overview: {
      title: "CBSE Board Exam Overview",
      icon: <BookOpen className="w-6 h-6" />,
      content: [
        "The Central Board of Secondary Education (CBSE) conducts board examinations for Class 10 and Class 12 every year, typically between February and April. With over 28,000 affiliated schools across India, CBSE remains the most popular board choice for Delhi NCR families.",
        "In Delhi alone, over 5 lakh students appear for CBSE board exams annually. The competition is intense — top college admissions in Delhi University, IITs, and medical colleges depend heavily on board exam performance."
      ],
      bullets: [
        "Class 10: 5 main subjects + 1 additional (internal assessment counts 20%)",
        "Class 12: 5 subjects including core + electives",
        "New competency-based question format since 2023",
        "Internal assessment: 20 marks (projects, practicals, periodic tests)",
        "Term-based examination pattern with MCQs and subjective questions"
      ]
    },
    syllabus: {
      title: "CBSE Syllabus Breakdown 2026–27",
      icon: <Target className="w-6 h-6" />,
      content: [
        "CBSE has streamlined its syllabus post-2020, focusing on core competencies and application-based learning. Here's what students need to master:"
      ],
      bullets: [
        "Mathematics: Algebra, Geometry, Trigonometry, Statistics, Probability — focus on HOTS questions",
        "Science: Physics, Chemistry, Biology with practical components (30 marks)",
        "English: Reading comprehension, Writing skills, Literature (prose & poetry)",
        "Social Science: History, Geography, Political Science, Economics — map work is crucial",
        "Hindi/Sanskrit: Grammar, comprehension, and literature sections",
        "Class 12 additions: Calculus, Organic Chemistry, Genetics, Electromagnetic Theory"
      ]
    },
    strategy: {
      title: "6-Month CBSE Board Preparation Strategy",
      icon: <Brain className="w-6 h-6" />,
      content: [
        "A structured preparation plan is essential for CBSE success. Our expert tutors follow a proven 6-month roadmap tailored for Delhi students:"
      ],
      bullets: [
        "Month 1–2: Complete syllabus revision with concept clarity sessions",
        "Month 3: NCERT thoroughly — every example, exercise, and in-text question",
        "Month 4: Previous 10 years' papers — pattern analysis and time management",
        "Month 5: Sample papers and mock tests — 2 full tests per week",
        "Month 6: Weak area focus + rapid revision notes + exam strategy sessions",
        "Daily: 2-hour focused study with 25-min Pomodoro blocks"
      ]
    },
    whyHomeTuition: {
      title: "Why Home Tuition Beats Coaching for CBSE Boards",
      icon: <Users className="w-6 h-6" />,
      content: [
        "While coaching centers in Delhi process students in batches of 30–50, home tuition offers a fundamentally different approach that consistently produces better results for board exams.",
        "Our data from 2,000+ Delhi students shows that home-tutored students score 15–20% higher than their coaching-center peers in CBSE boards."
      ],
      bullets: [
        "Personalized attention: Every minute focused on YOUR weak areas, not generic teaching",
        "Flexible scheduling: Study during peak concentration hours, not when the batch is scheduled",
        "NCERT-first approach: Tutors ensure 100% NCERT completion — the CBSE gold standard",
        "Exam psychology: 1-on-1 sessions help build confidence and reduce exam anxiety",
        "Parent updates: Weekly progress reports so you're never in the dark",
        "No travel time: Save 1–2 hours daily that Delhi commute would consume"
      ]
    },
    delhiChallenges: {
      title: "Delhi/NCR-Specific Challenges for CBSE Students",
      icon: <AlertTriangle className="w-6 h-6" />,
      content: [
        "Delhi's academic environment creates unique pressures that students in other cities don't face. Understanding these challenges is key to designing an effective preparation strategy."
      ],
      bullets: [
        "Extreme competition: Delhi has the highest density of CBSE schools — your rank is relative to lakhs of peers",
        "School pressure: Top Delhi schools assign heavy homework loads, leaving little time for self-study",
        "Coaching culture trap: Peer pressure to join Kota-style factories even when personal attention is needed",
        "Commute fatigue: Average Delhi student spends 1.5 hours daily commuting to coaching — wasted study time",
        "Pollution impact: Winter smog during exam prep months (Nov–Feb) affects health and concentration",
        "Board + competitive dual pressure: Many Class 12 students simultaneously prepare for JEE/NEET"
      ]
    },
    subjectLinks: [
      { label: "Math Tuition in Delhi", href: "/math-tuition-in-rohini-class-10" },
      { label: "Science Tuition in Delhi", href: "/science-tuition-in-laxmi-nagar-class-10" },
      { label: "English Tuition in Delhi", href: "/english-tuition-in-dwarka-class-10" },
      { label: "Hindi Tuition in Delhi", href: "/hindi-tuition-in-janakpuri-class-9" },
      { label: "Physics Tuition in Delhi", href: "/physics-tuition-in-rohini-class-12" },
      { label: "Chemistry Tuition in Delhi", href: "/chemistry-tuition-in-dwarka-class-12" },
    ],
    blogLinks: [
      { label: "How to Prepare for CBSE Board Exams at Home", href: "/blog/cbse-board-exam-preparation-at-home" },
      { label: "Best Tuition Classes in Delhi Guide", href: "/blog/tuition-classes-delhi-guide" },
    ],
    faqs: [
      { q: "When should I start CBSE board exam preparation with a home tutor?", a: "Ideally 6–8 months before the exam. For Class 10, start by July–August. For Class 12, begin by June. However, even 3 months of focused home tuition can significantly improve scores." },
      { q: "How much does a CBSE board exam home tutor cost in Delhi?", a: "Fees range from ₹800–₹1,500/hour depending on the subject and tutor experience. Monthly packages for 2–3 subjects typically cost ₹8,000–₹20,000." },
      { q: "Can home tuition help score 95%+ in CBSE boards?", a: "Absolutely. 68% of our Delhi students scored above 90% in 2026 CBSE boards. Personalized attention ensures no concept gaps remain." },
      { q: "Do you provide CBSE board exam tutors across Delhi NCR?", a: "Yes, we have verified tutors in all Delhi areas — Rohini, Dwarka, Laxmi Nagar, Janakpuri, Pitampura, and across Noida, Gurgaon, Ghaziabad, and Faridabad." },
      { q: "Is NCERT enough for CBSE boards or do I need extra books?", a: "NCERT is the foundation and covers 85–90% of the paper. Our tutors supplement with RS Aggarwal (Math), HC Verma (Physics), and previous year papers for the remaining edge." },
    ]
  },
  "icse-board-exam-delhi": {
    slug: "icse-board-exam-delhi",
    title: "ICSE Board Exam Preparation in Delhi",
    metaTitle: "ICSE Board Exam Preparation with Home Tutor in Delhi | Tutors Parliament",
    metaDescription: "Expert ICSE board exam preparation with verified home tutors in Delhi NCR. In-depth coaching for Class 10 ICSE. Book free demo class today.",
    heroHeadline: "ICSE Board Exam Preparation with Specialist Home Tutors in Delhi",
    heroSub: "ICSE demands deeper understanding — our tutors provide the analytical edge Delhi students need for top scores.",
    ctaText: "Get Home Tutor for ICSE Boards",
    overview: {
      title: "ICSE Board Exam Overview",
      icon: <BookOpen className="w-6 h-6" />,
      content: [
        "The Indian Certificate of Secondary Education (ICSE) is conducted by CISCE and is known for its comprehensive and application-heavy curriculum. Delhi has over 200 ICSE-affiliated schools, and the board's rigorous standards demand a different preparation approach than CBSE.",
        "ICSE students study more subjects (typically 6–7 vs CBSE's 5) and face longer, more detailed question papers. This makes personalized preparation essential."
      ],
      bullets: [
        "Class 10: Minimum 6 subjects — English, Hindi, History/Civics, Geography, Math, Science",
        "Internal assessment: 20% for most subjects (project work + practicals)",
        "Longer question papers with higher word limits than CBSE",
        "Application-based questions requiring analytical thinking",
        "English Literature is a separate, detailed paper"
      ]
    },
    syllabus: {
      title: "ICSE Syllabus Breakdown 2026–27",
      icon: <Target className="w-6 h-6" />,
      content: [
        "ICSE covers a broader syllabus than CBSE in most subjects. Here's what makes it unique:"
      ],
      bullets: [
        "English Language + Literature: Two separate papers — grammar, composition, and in-depth literature analysis",
        "Mathematics: More emphasis on commercial math, shares & dividends, GST calculations",
        "Physics: Detailed coverage of electronics and modern physics concepts",
        "Chemistry: Organic chemistry introduced earlier than CBSE, analytical chemistry included",
        "Biology: Genetics and evolution covered in greater depth",
        "History & Civics: Indian freedom movement + world history, detailed constitution study",
        "Geography: Extensive map work — both Indian and world geography"
      ]
    },
    strategy: {
      title: "ICSE Board Preparation Strategy",
      icon: <Brain className="w-6 h-6" />,
      content: [
        "ICSE preparation requires a subject-specialist approach. Our tutors design customized plans:"
      ],
      bullets: [
        "Phase 1 (6 months before): Subject-wise concept completion with Selina/Concise textbooks",
        "Phase 2 (4 months before): Chapter-wise testing and gap analysis",
        "Phase 3 (2 months before): Previous 10 years' solved papers — ICSE repeats patterns",
        "Phase 4 (1 month before): Mock exams under real conditions + answer-writing practice",
        "English Literature: Character analysis, theme essays, and context questions practice",
        "Map work: Weekly map practice sessions for Geography (high-scoring section)"
      ]
    },
    whyHomeTuition: {
      title: "Why ICSE Students Need Home Tuition More",
      icon: <Users className="w-6 h-6" />,
      content: [
        "ICSE's broader curriculum means more subjects to manage simultaneously. Home tuition provides the structured, prioritized approach ICSE students need.",
        "Finding ICSE-specialist tutors in coaching centers is hard — most Delhi centers focus on CBSE. Home tutors who specialize in ICSE are available through our platform."
      ],
      bullets: [
        "Subject specialists: Each ICSE subject needs an expert — generalists struggle with ICSE depth",
        "Time management: Juggling 7 subjects requires a personalized study timetable",
        "Answer-writing: ICSE rewards elaborate, well-structured answers — this needs 1-on-1 coaching",
        "Literature coaching: Prose, poetry, and drama need guided discussion, not batch teaching",
        "Practical preparation: Science practicals carry significant marks — lab prep at home saves time"
      ]
    },
    delhiChallenges: {
      title: "Delhi/NCR Challenges for ICSE Students",
      icon: <AlertTriangle className="w-6 h-6" />,
      content: [
        "ICSE students in Delhi face a unique set of challenges compared to their CBSE peers:"
      ],
      bullets: [
        "Fewer ICSE coaching options: Most Delhi coaching centers are CBSE-focused, leaving ICSE students underserved",
        "Peer group pressure: ICSE students in mixed-board neighborhoods often feel isolated in their preparation",
        "College conversion: DU and other Delhi colleges use best-of-4 formula — ICSE students need board-to-percentage conversion guidance",
        "Higher school workload: ICSE schools in Delhi typically assign more homework than CBSE schools",
        "Limited study material: ICSE-specific question banks and guides are less available in Delhi markets"
      ]
    },
    subjectLinks: [
      { label: "Math Tuition for ICSE", href: "/math-tuition-in-dwarka-class-10" },
      { label: "English Tuition for ICSE", href: "/english-tuition-in-rohini-class-10" },
      { label: "Science Tuition in Delhi", href: "/science-tuition-in-pitampura-class-10" },
      { label: "Physics Tuition for ICSE", href: "/physics-tuition-in-janakpuri-class-10" },
      { label: "Chemistry Tuition for ICSE", href: "/chemistry-tuition-in-laxmi-nagar-class-10" },
    ],
    blogLinks: [
      { label: "How to Prepare for Board Exams at Home", href: "/blog/cbse-board-exam-preparation-at-home" },
      { label: "Tuition Classes in Delhi Guide", href: "/blog/tuition-classes-delhi-guide" },
    ],
    faqs: [
      { q: "Is ICSE harder than CBSE for board exams?", a: "ICSE has a broader syllabus and more detailed papers, but scoring is also generous. With the right preparation and a subject-specialist tutor, students can score 90%+ consistently." },
      { q: "Do you have ICSE-specialist tutors in Delhi?", a: "Yes, we have 200+ verified ICSE-specialist tutors across Delhi NCR, many of whom are former ICSE school teachers." },
      { q: "How much does ICSE home tuition cost in Delhi?", a: "ICSE tutors typically charge ₹900–₹1,800/hour due to the specialized nature of the curriculum. Monthly packages start at ₹10,000 per subject." },
      { q: "Can I switch from coaching center to home tuition mid-year?", a: "Absolutely. Many of our best results come from students who switched mid-year. Our tutors quickly assess gaps and create a catch-up plan." },
    ]
  },
  "jee-coaching-vs-home-tuition-delhi": {
    slug: "jee-coaching-vs-home-tuition-delhi",
    title: "JEE Coaching vs Home Tuition in Delhi",
    metaTitle: "JEE Coaching vs Home Tuition in Delhi – Which is Better? | Tutors Parliament",
    metaDescription: "JEE preparation: coaching center or home tutor in Delhi? Compare costs, results, and strategies. Expert IIT-JEE home tutors available across Delhi NCR.",
    heroHeadline: "JEE Preparation: Coaching Center vs Home Tutor in Delhi",
    heroSub: "₹2–5 lakh coaching fees vs ₹15,000/month home tuition — discover which path gives better ROI for IIT-JEE aspirants in Delhi.",
    ctaText: "Get Home Tutor for JEE",
    overview: {
      title: "JEE Exam: The IIT Gateway",
      icon: <BookOpen className="w-6 h-6" />,
      content: [
        "The Joint Entrance Examination (JEE) is India's most competitive engineering entrance exam. JEE Main qualifies students for NITs, IIITs, and GFTIs, while JEE Advanced is the gateway to the prestigious IITs.",
        "Delhi produces thousands of JEE aspirants every year, with areas like Kalu Sarai, Mukherjee Nagar, and Rajendra Nagar becoming coaching hubs. But is the traditional coaching model really the best path?"
      ],
      bullets: [
        "JEE Main: 3 attempts per year, NTA score-based ranking, 90 questions in 3 hours",
        "JEE Advanced: Only top 2.5 lakh JEE Main qualifiers can appear",
        "Subjects: Physics, Chemistry, Mathematics — equal weightage",
        "Question types: MCQ, numerical, and integer-type questions",
        "2026 cut-off trend: General category ~90 percentile for top NITs"
      ]
    },
    syllabus: {
      title: "JEE Syllabus: What to Master",
      icon: <Target className="w-6 h-6" />,
      content: [
        "JEE covers Class 11 and 12 NCERT syllabus plus advanced problem-solving. Here's the breakdown:"
      ],
      bullets: [
        "Physics: Mechanics (highest weightage), Electrodynamics, Optics, Modern Physics, Thermodynamics",
        "Chemistry: Physical Chemistry (Mole concept, Equilibrium), Organic Chemistry (GOC, Reactions), Inorganic Chemistry",
        "Mathematics: Calculus (35% weightage), Algebra, Coordinate Geometry, Trigonometry, Vectors/3D",
        "JEE Advanced extras: Electrochemistry, Nuclear Physics, advanced Calculus, Matrix Algebra",
        "Overlapping chapters with CBSE boards: ~70% syllabus overlap — smart planning covers both"
      ]
    },
    strategy: {
      title: "JEE Preparation Strategy: Home Tuition Advantage",
      icon: <Brain className="w-6 h-6" />,
      content: [
        "The factory coaching model treats every student identically. Here's how home tuition creates a winning strategy:"
      ],
      bullets: [
        "Diagnostic assessment: First 2 sessions identify your exact JEE readiness level across PCM",
        "Targeted practice: If you're strong in Mechanics but weak in Organic Chemistry, 70% time goes to Chemistry",
        "Board + JEE integration: Smart tutors align CBSE board prep with JEE simultaneously — no duplicated effort",
        "Mock test analysis: Every mock test result is analyzed question-by-question, not just scored",
        "Doubt resolution: Instant — no waiting for batch doubt sessions or queuing after class",
        "Mental health: 1-on-1 reduces the toxic competition pressure of coaching batches"
      ]
    },
    whyHomeTuition: {
      title: "Home Tuition vs Coaching: The Real Comparison",
      icon: <Users className="w-6 h-6" />,
      content: [
        "Let's compare Delhi's coaching centers (Allen, FIITJEE, Aakash) with home tuition objectively:",
        "Cost comparison: Top coaching = ₹2–5 lakh/year + ₹50,000 for test series + ₹30,000 books. Home tuition = ₹12,000–25,000/month for all 3 subjects with personalized attention."
      ],
      bullets: [
        "Batch size: Coaching 40–80 students vs Home tuition 1 student — 40x more attention",
        "Flexibility: Coaching fixed schedule vs Home tuition adapts to your peak hours",
        "Travel: Average Delhi coaching commute = 1.5 hours/day = 45 hours/month WASTED",
        "Results reality: Top coaching results come from their entrance-screened toppers, not average students",
        "Dropout rate: 30%+ students drop out of coaching mid-year — home tuition retention is 95%+",
        "Hybrid option: Many successful JEE crackers use coaching for tests + home tutor for weak areas"
      ]
    },
    delhiChallenges: {
      title: "Delhi's JEE Preparation Ecosystem: Reality Check",
      icon: <AlertTriangle className="w-6 h-6" />,
      content: [
        "Delhi's JEE preparation landscape has unique characteristics every parent should understand:"
      ],
      bullets: [
        "Kota culture in Delhi: Satellite centers of Kota institutes have opened across Delhi but lack the original faculty quality",
        "Coaching fatigue: Students attend 6–8 hours of coaching + school, leading to burnout by November",
        "Peer pressure: 'Everyone goes to coaching' mentality ignores individual learning styles",
        "Financial burden: Many Delhi families spend 20–30% of annual income on coaching fees — often without results",
        "Ignored board exams: Coaching centers prioritize JEE over boards, hurting DU/state college backup options",
        "Mental health crisis: Delhi NCR sees rising cases of student anxiety and depression linked to coaching pressure"
      ]
    },
    subjectLinks: [
      { label: "Physics Tuition in Delhi", href: "/physics-tuition-in-rohini-class-12" },
      { label: "Chemistry Tuition in Delhi", href: "/chemistry-tuition-in-dwarka-class-12" },
      { label: "Math Tuition in Delhi", href: "/math-tuition-in-laxmi-nagar-class-12" },
      { label: "Physics Tuition in Noida", href: "/physics-tuition-in-noida-class-12" },
      { label: "Math Tuition in Gurgaon", href: "/math-tuition-in-gurgaon-class-12" },
    ],
    blogLinks: [
      { label: "JEE Preparation Strategy with Home Tutor", href: "/blog/jee-preparation-strategy-home-tutor" },
      { label: "Home Tuition vs Coaching in Delhi", href: "/blog/tuition-classes-delhi-guide" },
    ],
    faqs: [
      { q: "Can a home tutor really prepare a student for JEE?", a: "Yes. Many IIT Delhi and IIT Bombay students were home-tutored. What matters is the tutor's quality and the student's dedication, not the batch size." },
      { q: "How much does a JEE home tutor cost in Delhi?", a: "IIT-graduate JEE tutors charge ₹1,200–₹2,500/hour in Delhi. For 3 subjects, expect ₹15,000–₹25,000/month with 3–4 sessions per week." },
      { q: "Should I combine coaching with home tuition for JEE?", a: "The hybrid model works well — use coaching for test series and competitive environment, and home tutor for concept clarity and weak areas. Many top rankers use this approach." },
      { q: "When should I start JEE preparation with a home tutor?", a: "Ideally from Class 11 start (April–May). If you're in Class 12, a focused 8-month plan can still deliver strong results." },
      { q: "Do you have IIT-graduate tutors available in Delhi?", a: "Yes, we have 100+ IIT/NIT alumni tutors across Delhi NCR. All are verified and have proven JEE teaching track records." },
    ]
  },
  "neet-preparation-home-tutor-delhi": {
    slug: "neet-preparation-home-tutor-delhi",
    title: "NEET Preparation with Home Tutor in Delhi",
    metaTitle: "NEET Preparation with Home Tutor in Delhi – Best Strategy | Tutors Parliament",
    metaDescription: "NEET preparation with expert home tutors in Delhi NCR. Biology, Physics, Chemistry coaching. Personalized study plan. Book free demo class today.",
    heroHeadline: "NEET Preparation with Expert Home Tutors in Delhi NCR",
    heroSub: "NEET is 50% Biology — our specialist tutors give you the targeted approach Delhi coaching centers can't.",
    ctaText: "Get Home Tutor for NEET",
    overview: {
      title: "NEET Exam: Your Medical Career Gateway",
      icon: <BookOpen className="w-6 h-6" />,
      content: [
        "The National Eligibility cum Entrance Test (NEET-UG) is the sole entrance exam for MBBS, BDS, AYUSH, and veterinary courses across India. With 20+ lakh applicants competing for ~1 lakh seats, NEET is among the most competitive exams in the world.",
        "Delhi NCR has a massive NEET aspirant base, with students from areas like Rohini, Dwarka, Janakpuri, Noida, and Gurgaon. The unique challenge? Balancing NEET preparation with CBSE Class 12 boards."
      ],
      bullets: [
        "Total questions: 200 (attempt 180) — Physics 45, Chemistry 45, Biology 90",
        "Marking: +4 correct, -1 wrong — negative marking strategy is crucial",
        "Duration: 3 hours 20 minutes",
        "Language options: English, Hindi, and 11 regional languages",
        "2026 cut-off trend: General category ~620/720 for government MBBS seats"
      ]
    },
    syllabus: {
      title: "NEET Syllabus: Subject-wise Breakdown",
      icon: <Target className="w-6 h-6" />,
      content: [
        "NEET syllabus is based on Class 11 and 12 NCERT. Biology dominates with 50% weightage:"
      ],
      bullets: [
        "Biology (360 marks): Botany + Zoology — Cell Biology, Genetics, Ecology, Human Physiology, Plant Physiology",
        "Physics (180 marks): Mechanics, Optics, Electrostatics, Modern Physics — NCERT-centric",
        "Chemistry (180 marks): Physical Chemistry (Mole concept), Organic Chemistry (Reactions, GOC), Inorganic Chemistry",
        "High-yield Biology chapters: Genetics (30+ marks), Ecology (25+ marks), Cell Biology (20+ marks)",
        "Physics focus areas: Ray Optics, Current Electricity, Mechanics — together 60%+ of Physics marks",
        "Chemistry focus: Organic reactions + Periodic Table trends — predictable pattern every year"
      ]
    },
    strategy: {
      title: "NEET Preparation Strategy with Home Tutor",
      icon: <Brain className="w-6 h-6" />,
      content: [
        "NEET demands a different approach than JEE. Biology is the differentiator, and our tutors design strategies around this:"
      ],
      bullets: [
        "NCERT Bible approach: 95% of NEET questions come directly from NCERT — tutors ensure line-by-line mastery",
        "Biology dominance: 2 hours Biology daily + dedicated diagram practice sessions",
        "Physics simplification: NEET Physics is easier than JEE — focus on formula application, not derivations",
        "Chemistry shortcut: Pattern-based learning for Inorganic + reaction mechanism mastery for Organic",
        "Mock test rhythm: Weekly full-length mocks + daily 45-minute topic tests",
        "Negative marking strategy: When to skip vs when to attempt — trained through 50+ mock tests"
      ]
    },
    whyHomeTuition: {
      title: "Why Home Tuition Works Better for NEET",
      icon: <Users className="w-6 h-6" />,
      content: [
        "NEET preparation is fundamentally different from JEE, yet most coaching centers use the same approach for both. Home tuition addresses NEET's unique demands:",
        "Biology needs discussion, not lectures. Understanding cell mechanisms, genetic patterns, and ecosystem dynamics requires interactive teaching — impossible in a batch of 50."
      ],
      bullets: [
        "Biology focus: Coaching batches spend equal time on PCB — NEET needs 50% time on Biology",
        "NCERT deep dive: Tutors read NCERT with students line-by-line — coaching centers skip this",
        "Diagram training: Biology diagrams (cell structure, human anatomy) need guided practice",
        "Assertion-Reasoning mastery: New NEET pattern needs 1-on-1 logical thinking training",
        "Board exam alignment: Smart tutors integrate CBSE + NEET prep — save 2–3 months",
        "Dropper support: For NEET repeaters, home tuition provides focused full-day preparation"
      ]
    },
    delhiChallenges: {
      title: "Delhi/NCR NEET Preparation Challenges",
      icon: <AlertTriangle className="w-6 h-6" />,
      content: [
        "Delhi's NEET ecosystem has specific challenges that affect preparation:"
      ],
      bullets: [
        "Seat competition: Delhi state quota is limited — most Delhi NEET aspirants compete for All India quota seats",
        "Coaching center quality: Many Delhi NEET coaching centers use JEE-style teaching for Biology — ineffective",
        "School conflict: Top CBSE schools in Delhi don't accommodate NEET preparation schedules",
        "Practical gap: Delhi schools often rush through Biology practicals — coaching centers don't cover them",
        "Mental pressure: Medical entrance pressure in Delhi families is intense — home tutors provide emotional support too",
        "Dropper stigma: Delhi's competitive parent community adds social pressure on NEET repeaters"
      ]
    },
    subjectLinks: [
      { label: "Biology Tuition in Delhi", href: "/biology-tuition-in-rohini-class-12" },
      { label: "Physics Tuition in Delhi", href: "/physics-tuition-in-dwarka-class-12" },
      { label: "Chemistry Tuition in Delhi", href: "/chemistry-tuition-in-laxmi-nagar-class-12" },
      { label: "Biology Tuition in Noida", href: "/biology-tuition-in-noida-class-12" },
      { label: "Biology Tuition in Gurgaon", href: "/biology-tuition-in-gurgaon-class-12" },
    ],
    blogLinks: [
      { label: "NEET Study Plan for Class 11–12 Students", href: "/blog/neet-study-plan-class-11-12" },
      { label: "How to Prepare for Board Exams at Home", href: "/blog/cbse-board-exam-preparation-at-home" },
    ],
    faqs: [
      { q: "Can I crack NEET with only home tuition?", a: "Yes. NEET is NCERT-based, and a good home tutor who ensures line-by-line NCERT mastery + sufficient mock tests can absolutely prepare you for 600+ scores. Many AIIMS toppers were home-tutored." },
      { q: "How much does a NEET home tutor cost in Delhi?", a: "NEET specialist tutors charge ₹1,000–₹2,000/hour. For all 3 subjects (PCB), monthly packages range from ₹15,000–₹30,000 with 4–5 sessions per week." },
      { q: "Is home tuition enough for NEET or do I also need coaching?", a: "For most students, dedicated home tuition + a good test series subscription is sufficient. Add coaching only if you need the competitive environment for motivation." },
      { q: "Do you have MBBS-graduate tutors for NEET?", a: "Yes, we have 50+ MBBS/BDS graduates and NEET top-scorers as tutors across Delhi NCR. All are verified with proven teaching results." },
      { q: "Should I take a drop year for NEET or prepare alongside Class 12?", a: "If your target is 550+, prepare alongside Class 12 with a home tutor. For 650+ (top government colleges), a focused drop year with home tuition gives the best results." },
    ]
  }
};

const ExamPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useRouter();
  const [showModal, setShowModal] = useState(false);

  const data = slug ? examDatabase[slug] : null;

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Exam page not found</h1>
          <Button onClick={() => router.push("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.faqs.map(f => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a }
    }))
  };

  const eduSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Tutors Parliament",
    description: data.metaDescription,
    areaServed: { "@type": "City", name: "Delhi" },
    url: `https://tutorsparliament.com/exams/${data.slug}`
  };

  const SectionCTA = ({ text }: { text?: string }) => (
    <div className="mt-6 flex flex-col sm:flex-row gap-3">
      <Button onClick={() => setShowModal(true)} className="font-semibold" style={{ background: "var(--cta-gradient)" }}>
        {text || data.ctaText} <ArrowRight className="w-4 h-4 ml-1" />
      </Button>
      <Button variant="outline" onClick={() => openWhatsApp("Hi, I need a tutor for exam prep")}>
          Chat on WhatsApp
      </Button>
    </div>
  );

  const ContentSection = ({ section, altBg = false }: { section: ExamSection; altBg?: boolean }) => (
    <section className={`py-12 md:py-16 ${altBg ? "bg-muted/50" : ""}`}>
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">{section.icon}</div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">{section.title}</h2>
        </div>
        {section.content.map((p, i) => (
          <p key={i} className="text-muted-foreground leading-relaxed mb-4">{p}</p>
        ))}
        {section.bullets && (
          <ul className="space-y-3 mt-4">
            {section.bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span className="text-foreground/90">{b}</span>
              </li>
            ))}
          </ul>
        )}
        <SectionCTA />
      </div>
    </section>
  );

  return (
    <>
      <Helmet>
        <title>{data.metaTitle}</title>
        <meta name="description" content={data.metaDescription} />
        <link rel="canonical" href={`https://tutorsparliament.com/exams/${data.slug}`} />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(eduSchema)}</script>
      </Helmet>

      

      {/* Hero */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-20" style={{ background: "var(--hero-gradient)" }}>
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 text-primary-foreground text-sm font-medium backdrop-blur-sm">
              <Star className="w-4 h-4" /> 4.8★ Rated Tutors
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 text-primary-foreground text-sm font-medium backdrop-blur-sm">
              <GraduationCap className="w-4 h-4" /> Verified & Background Checked
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4 leading-tight">
            {data.heroHeadline}
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            {data.heroSub}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" variant="hero" onClick={() => setShowModal(true)}>
              {data.ctaText} <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
            <Button size="lg" variant="hero-outline" onClick={() => openWhatsApp("Hi, I need a tutor for exam prep")}>
                Talk to Expert Now
            </Button>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-muted/50 border-b border-border">
        <div className="container mx-auto px-4 py-3 max-w-4xl">
          <nav className="text-sm text-muted-foreground flex items-center gap-1 flex-wrap">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <span className="text-foreground font-medium">{data.title}</span>
          </nav>
        </div>
      </div>

      {/* Content Sections */}
      <ContentSection section={data.overview} />
      <ContentSection section={data.syllabus} altBg />
      <ContentSection section={data.strategy} />
      <ContentSection section={data.whyHomeTuition} altBg />
      <ContentSection section={data.delhiChallenges} />

      {/* Internal Links */}
      <section className="py-12 md:py-16 bg-muted/50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Related Resources</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Subject Tuition Pages</h3>
              </div>
              <ul className="space-y-2">
                {data.subjectLinks.map((l, i) => (
                  <li key={i}>
                    <Link href={l.href} className="text-primary hover:underline text-sm flex items-center gap-1">
                      <ArrowRight className="w-3 h-3" /> {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Helpful Articles</h3>
              </div>
              <ul className="space-y-2">
                {data.blogLinks.map((l, i) => (
                  <li key={i}>
                    <Link href={l.href} className="text-primary hover:underline text-sm flex items-center gap-1">
                      <ArrowRight className="w-3 h-3" /> {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-4 border-t border-border">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Decision Guides</h4>
                <ul className="space-y-2">
                  <li><Link href="/home-tuition-vs-coaching-delhi" className="text-primary hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" /> Home Tuition vs Coaching in Delhi</Link></li>
                  <li><Link href="/is-home-tuition-worth-it-delhi" className="text-primary hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" /> Is Home Tuition Worth It?</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {data.faqs.map((f, i) => (
              <details key={i} className="group bg-card border border-border rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-muted/50 transition-colors">
                  <span className="font-medium text-foreground pr-4">{f.q}</span>
                  <span className="text-primary shrink-0 transition-transform group-open:rotate-45 text-xl">+</span>
                </summary>
                <div className="px-5 pb-5 text-muted-foreground leading-relaxed">{f.a}</div>
              </details>
            ))}
          </div>
          <SectionCTA text="Get Free Demo Class in Delhi" />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-20" style={{ background: "var(--hero-gradient)" }}>
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Start Your {data.title.split(" ")[0]} Preparation?
          </h2>
          <p className="text-primary-foreground/80 mb-8 text-lg">
            Join 5,000+ Delhi students who chose personalized home tuition over crowded coaching centers.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" variant="hero" onClick={() => setShowModal(true)}>
              Book Free Demo Class <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
            <Button size="lg" variant="hero-outline" asChild>
              <a href="tel:+919873101564">Call Now: +91 98731 01564</a>
            </Button>
          </div>
        </div>
      </section>

      

      <StickyMobileCTA onCtaClick={() => setShowModal(true)} />
      <LeadCaptureModal open={showModal} onOpenChange={setShowModal} />
    </>
  );
};

export default ExamPage;

