import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Monitor, MapPin, BookOpen, GraduationCap, Trophy, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEOHead from "@/components/SEOHead";
import FAQSection from "@/components/FAQSection";

const classCategories = [
  { label: "KG – Class 5", desc: "Build strong foundations with interactive learning and fun activities tailored for young learners.", icon: Sparkles },
  { label: "Class 6 – 8", desc: "Strengthen concepts across all subjects with structured coaching and regular assessments.", icon: BookOpen },
  { label: "Class 9 – 10", desc: "Board exam preparation with focused study plans, mock tests, and expert guidance for CBSE & ICSE.", icon: GraduationCap },
  { label: "Class 11 – 12", desc: "Advanced subject coaching for Science, Commerce, and Arts streams with competitive exam integration.", icon: Trophy },
];

const boards = [
  { name: "CBSE", desc: "Structured learning aligned with NCERT curriculum. Our tutors cover every chapter with clarity and exam-focused practice." },
  { name: "ICSE", desc: "Concept clarity with detailed subject depth. In-depth coverage of ISC/ICSE syllabus with application-based learning." },
  { name: "State Boards", desc: "Region-specific syllabus expertise. Expert tutors familiar with Delhi, UP, Haryana, and other state board patterns." },
];

const exams = [
  { name: "JEE Preparation", desc: "Physics, Chemistry & Maths coaching with mock tests, problem-solving sessions, and IIT-level strategies." },
  { name: "NEET Preparation", desc: "Biology-focused preparation with comprehensive coverage of Physics and Chemistry for medical aspirants." },
  { name: "Olympiads", desc: "Specialized training for Science, Maths, and English Olympiads to build competitive edge from an early age." },
];

const specials = [
  { name: "Spoken English", desc: "Build fluency and confidence with conversational English classes designed for students and young professionals." },
  { name: "Coding for Kids", desc: "Introduction to programming with Scratch, Python, and web development — making coding fun and accessible." },
  { name: "Skill Development", desc: "Personality development, public speaking, and critical thinking workshops for holistic student growth." },
];

const courseCards = [
  { name: "CBSE Maths (Class 10)", board: "CBSE", mode: "Online & Offline", desc: "Master algebra, geometry, and trigonometry with expert Delhi-based tutors." },
  { name: "ICSE Science (Class 9)", board: "ICSE", mode: "Online & Offline", desc: "In-depth Physics, Chemistry, and Biology with lab-oriented teaching." },
  { name: "JEE Foundation (Class 11)", board: "JEE", mode: "Online", desc: "Start JEE preparation early with concept building and problem practice." },
  { name: "English Speaking", board: "Skill", mode: "Online", desc: "Build fluency and communication skills with interactive speaking sessions." },
  { name: "NEET Biology (Class 12)", board: "NEET", mode: "Online & Offline", desc: "Detailed NCERT biology + MCQ practice for NEET aspirants in Delhi." },
  { name: "Coding with Python", board: "Skill", mode: "Online", desc: "Learn Python programming from scratch — perfect for Class 6-12 students." },
];

const faqs = [
  { question: "What classes and subjects do you offer tuition for?", answer: "We offer tuition for KG to Class 12 across all subjects — Mathematics, Science, English, Social Studies, Hindi, and more. We cover CBSE, ICSE, and State Board curricula." },
  { question: "Do you offer online tuition classes in Delhi?", answer: "Yes! We offer both online and offline tuition classes. Students across Delhi NCR can choose the mode that works best for them." },
  { question: "How are your tutors selected?", answer: "All our tutors go through a rigorous selection process including background verification, subject expertise tests, and demo teaching sessions. Only the top 5% make it through." },
  { question: "Can I get a free demo class before enrolling?", answer: "Absolutely! We offer a free demo class so you can experience our teaching quality before committing. Book one today through our website or WhatsApp." },
  { question: "Do you provide JEE and NEET coaching?", answer: "Yes, we provide comprehensive JEE and NEET preparation with experienced faculty, regular mock tests, and personalized study plans for students in Delhi NCR." },
];

const Courses = () => (
  <>
    <SEOHead
      title="Tuition Classes in Delhi | CBSE, ICSE & All Subjects"
      description="Find expert tutors for CBSE, ICSE & all classes. Online & offline tuition available across Delhi."
      keywords="tuition classes Delhi, CBSE tuition, ICSE tuition, home tutor Delhi, online classes Delhi"
    />
    <Navbar />
    <main>
      {/* Hero */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden" style={{ background: "var(--hero-gradient)" }}>
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-primary-foreground mb-6 leading-tight">
              Find the Right Course for Your <span className="text-secondary">Learning Goals</span>
            </h1>
            <p className="text-primary-foreground/80 text-lg mb-4 max-w-2xl mx-auto">
              Online & Offline Classes Available Across Delhi NCR
            </p>
            <div className="flex items-center justify-center gap-6 mb-8">
              <span className="flex items-center gap-2 text-primary-foreground/90 text-sm font-medium">
                <Monitor className="w-4 h-4" /> 🟢 Online Classes
              </span>
              <span className="flex items-center gap-2 text-primary-foreground/90 text-sm font-medium">
                <MapPin className="w-4 h-4" /> 🟢 Offline Classes
              </span>
            </div>
            <Button variant="hero" size="lg" className="text-base px-8 py-6">
              Explore Courses <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Classes by Grade */}
      <section className="section-padding">
        <div className="container mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">By Class</span>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mt-2">Classes for <span className="text-primary">Every Grade</span></h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {classCategories.map((c, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-background rounded-2xl p-6 card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4">
                  <c.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-foreground mb-2">{c.label}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Boards */}
      <section className="section-padding section-alt">
        <div className="container mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">By Board</span>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mt-2">All Major <span className="text-primary">School Boards</span></h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {boards.map((b, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-background rounded-2xl p-8 card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1 text-center">
                <h3 className="font-heading font-bold text-2xl text-primary mb-3">{b.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{b.desc}</p>
                <Link to="/#contact">
                  <Button variant="outline">Explore Courses</Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Exams */}
      <section className="section-padding">
        <div className="container mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">Competitive Exams</span>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mt-2">Exam <span className="text-primary">Preparation</span></h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {exams.map((e, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-background rounded-2xl p-8 card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1">
                <h3 className="font-heading font-semibold text-lg text-foreground mb-2">{e.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{e.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Classes */}
      <section className="section-padding section-alt">
        <div className="container mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">Beyond Academics</span>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mt-2">Special <span className="text-primary">Classes</span></h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {specials.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-background rounded-2xl p-8 card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1">
                <h3 className="font-heading font-semibold text-lg text-foreground mb-2">{s.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Cards */}
      <section className="section-padding">
        <div className="container mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground">Popular <span className="text-primary">Courses</span></h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courseCards.map((c, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="bg-background rounded-2xl overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1">
                <div className="h-2 bg-gradient-to-r from-primary to-secondary" />
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-medium bg-accent text-accent-foreground px-2 py-1 rounded-full">{c.board}</span>
                    <span className="text-xs font-medium bg-muted text-muted-foreground px-2 py-1 rounded-full">{c.mode}</span>
                  </div>
                  <h3 className="font-heading font-semibold text-lg text-foreground mb-2">{c.name}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">{c.desc}</p>
                  <Button variant="cta" className="w-full">Enroll Now</Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <FAQSection faqs={faqs} subtitle="Have Questions?" />
    </main>
    <Footer />
    <WhatsAppButton />
  </>
);

export default Courses;
