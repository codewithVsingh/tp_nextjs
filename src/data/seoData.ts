// ===== PROGRAMMATIC SEO 2.0 DATASET =====
// Generates 2,000+ high-intent pages dynamically via dimension combinations.

export const areas = [
  { slug: "rohini", name: "Rohini", pincode: "110085" },
  { slug: "dwarka", name: "Dwarka", pincode: "110075" },
  { slug: "laxmi-nagar", name: "Laxmi Nagar", pincode: "110092" },
  { slug: "janakpuri", name: "Janakpuri", pincode: "110058" },
  { slug: "pitampura", name: "Pitampura", pincode: "110034" },
  { slug: "karol-bagh", name: "Karol Bagh", pincode: "110005" },
  { slug: "rajouri-garden", name: "Rajouri Garden", pincode: "110027" },
  { slug: "vikaspuri", name: "Vikaspuri", pincode: "110018" },
  { slug: "mayur-vihar", name: "Mayur Vihar", pincode: "110091" },
  { slug: "ashok-vihar", name: "Ashok Vihar", pincode: "110052" },
  { slug: "south-delhi", name: "South Delhi", pincode: "110049" },
  { slug: "north-delhi", name: "North Delhi", pincode: "110009" },
  { slug: "east-delhi", name: "East Delhi", pincode: "110096" },
  { slug: "west-delhi", name: "West Delhi", pincode: "110063" },
  { slug: "saket", name: "Saket", pincode: "110017" },
  { slug: "malviya-nagar", name: "Malviya Nagar", pincode: "110017" },
  { slug: "hauz-khas", name: "Hauz Khas", pincode: "110016" },
  { slug: "preet-vihar", name: "Preet Vihar", pincode: "110092" },
  { slug: "model-town", name: "Model Town", pincode: "110009" },
  { slug: "kamla-nagar", name: "Kamla Nagar", pincode: "110007" },
  { slug: "vasant-kunj", name: "Vasant Kunj", pincode: "110070" },
  { slug: "greater-kailash", name: "Greater Kailash", pincode: "110048" },
  { slug: "defence-colony", name: "Defence Colony", pincode: "110024" },
  { slug: "paschim-vihar", name: "Paschim Vihar", pincode: "110063" },
  { slug: "tilak-nagar", name: "Tilak Nagar", pincode: "110018" },
  { slug: "uttam-nagar", name: "Uttam Nagar", pincode: "110059" },
  { slug: "nehru-place", name: "Nehru Place", pincode: "110019" },
  { slug: "connaught-place", name: "Connaught Place", pincode: "110001" },
  { slug: "lajpat-nagar", name: "Lajpat Nagar", pincode: "110024" },
  { slug: "kalkaji", name: "Kalkaji", pincode: "110019" },
  // NCR Areas
  { slug: "noida", name: "Noida", pincode: "201301" },
  { slug: "greater-noida", name: "Greater Noida", pincode: "201310" },
  { slug: "gurgaon", name: "Gurgaon", pincode: "122001" },
  { slug: "ghaziabad", name: "Ghaziabad", pincode: "201001" },
  { slug: "faridabad", name: "Faridabad", pincode: "121001" },
  { slug: "indirapuram", name: "Indirapuram", pincode: "201014" },
  { slug: "vaishali", name: "Vaishali", pincode: "201010" },
  { slug: "sector-62-noida", name: "Sector 62 Noida", pincode: "201309" },
  { slug: "dlf-phase-3", name: "DLF Phase 3", pincode: "122002" },
  { slug: "sohna-road", name: "Sohna Road", pincode: "122018" },
];

export const subjects = [
  { slug: "math", name: "Maths" },
  { slug: "science", name: "Science" },
  { slug: "physics", name: "Physics" },
  { slug: "chemistry", name: "Chemistry" },
  { slug: "english", name: "English" },
  { slug: "accounts", name: "Accounts" },
  { slug: "economics", name: "Economics" },
  { slug: "hindi", name: "Hindi" },
  { slug: "biology", name: "Biology" },
  { slug: "computer-science", name: "Computer Science" },
  { slug: "french", name: "French" },
  { slug: "german", name: "German" },
  { slug: "spanish", name: "Spanish" },
];

export const classes = [
  { slug: "kg", name: "KG", label: "Kindergarten" },
  { slug: "1", name: "1", label: "Class 1" },
  { slug: "2", name: "2", label: "Class 2" },
  { slug: "3", name: "3", label: "Class 3" },
  { slug: "4", name: "4", label: "Class 4" },
  { slug: "5", name: "5", label: "Class 5" },
  { slug: "6", name: "6", label: "Class 6" },
  { slug: "7", name: "7", label: "Class 7" },
  { slug: "8", name: "8", label: "Class 8" },
  { slug: "9", name: "9", label: "Class 9" },
  { slug: "10", name: "10", label: "Class 10" },
  { slug: "11", name: "11", label: "Class 11" },
  { slug: "12", name: "12", label: "Class 12" },
];

// ===== NEW DIMENSIONS =====
export const boards = [
  { slug: "cbse", name: "CBSE" },
  { slug: "icse", name: "ICSE" },
  { slug: "ib", name: "IB" },
];

export const intentModifiers = [
  { slug: "fees", name: "Fees", label: "Tuition Fees" },
  { slug: "female-tutors", name: "Female Tutors", label: "Female Tutors" },
  { slug: "near-me", name: "Near Me", label: "Near Me" },
  { slug: "home-vs-online", name: "Home vs Online", label: "Home vs Online Tuition" },
] as const;

// ===== SERVICE CATEGORIES (Non-academic + Niche Academic) =====
export const services = [
  // Core Academic Help
  { slug: "home-tutor-for-kids", name: "Home Tutor for Kids", category: "academic", h1Tpl: "Best Home Tutors for Kids in {area}", descTpl: "Find trusted, verified home tutors for kids in {area}. Age-appropriate teaching, all subjects. Book a free demo!" },
  { slug: "1-on-1-home-tutor", name: "1-on-1 Home Tutor", category: "academic", h1Tpl: "1-on-1 Home Tutors in {area}", descTpl: "Get personalized 1-on-1 home tuition in {area}. Focused learning, flexible schedule. Free demo class!" },
  { slug: "affordable-tuition-classes", name: "Affordable Tuition Classes", category: "academic", h1Tpl: "Affordable Tuition Classes in {area}", descTpl: "Budget-friendly tuition classes in {area} starting ₹300/hr. All subjects, verified tutors. Book free demo!" },
  { slug: "after-school-homework-help", name: "After School Homework Help", category: "academic", h1Tpl: "After School Homework Help in {area}", descTpl: "Struggling with homework? Get after-school homework help in {area}. Experienced tutors, all subjects. Free demo!" },
  { slug: "exam-crash-course", name: "Exam Crash Course", category: "academic", h1Tpl: "Exam Crash Course in {area}", descTpl: "Intensive exam crash courses in {area}. Board & competitive exam prep. Expert tutors. Book free demo!" },

  // Skill Development
  { slug: "coding-classes-for-kids", name: "Coding Classes for Kids", category: "skill", h1Tpl: "Coding Classes for Kids in {area}", descTpl: "Fun, interactive coding classes for kids in {area}. Python, Scratch, web dev. Expert instructors. Free demo!" },
  { slug: "robotics-classes", name: "Robotics Classes", category: "skill", h1Tpl: "Robotics Classes for Kids in {area}", descTpl: "Hands-on robotics classes in {area}. Build, code & innovate. Ages 6-16. Book a free demo session!" },
  { slug: "vedic-maths-classes", name: "Vedic Maths Classes", category: "skill", h1Tpl: "Vedic Maths Classes in {area}", descTpl: "Speed up mental math with Vedic Maths classes in {area}. Fun techniques for kids. Free demo!" },
  { slug: "public-speaking-for-kids", name: "Public Speaking for Kids", category: "skill", h1Tpl: "Public Speaking Classes for Kids in {area}", descTpl: "Build confidence with public speaking classes in {area}. Debate, elocution & presentation skills. Free demo!" },
  { slug: "chess-classes-for-kids", name: "Chess Classes for Kids", category: "skill", h1Tpl: "Chess Classes for Kids in {area}", descTpl: "Sharpen your child's mind with chess classes in {area}. Beginner to advanced. Book a free demo!" },
  { slug: "abacus-classes-for-kids", name: "Abacus Classes for Kids", category: "skill", h1Tpl: "Abacus Classes for Kids in {area}", descTpl: "Boost mental arithmetic with abacus classes in {area}. Ages 4-14. Certified trainers. Free demo!" },

  // Hobby + Activity
  { slug: "summer-camp-for-kids", name: "Summer Camp for Kids", category: "hobby", h1Tpl: "Summer Camp for Kids in {area}", descTpl: "Fun summer camp activities in {area}. Art, sports, coding & more. Ages 4-16. Register now!" },
  { slug: "dance-classes-for-kids", name: "Dance Classes for Kids", category: "hobby", h1Tpl: "Dance Classes for Kids in {area}", descTpl: "Creative dance classes in {area}. Classical, western, hip-hop. All ages. Book a free trial!" },
  { slug: "music-classes-for-kids", name: "Music Classes for Kids", category: "hobby", h1Tpl: "Music Classes for Kids in {area}", descTpl: "Learn music at home in {area}. Guitar, piano, vocals & more. Expert teachers. Free trial class!" },
  { slug: "art-and-craft-classes", name: "Art and Craft Classes", category: "hobby", h1Tpl: "Art & Craft Classes for Kids in {area}", descTpl: "Creative art & craft classes in {area}. Drawing, painting, pottery. Ages 4-16. Free trial!" },

  // KG / Early Learning
  { slug: "kg-home-tutor", name: "KG Home Tutor", category: "early", h1Tpl: "Best KG Home Tutors in {area}", descTpl: "Find caring KG home tutors in {area}. Phonics, numbers, early reading. Verified & experienced. Free demo!" },
  { slug: "phonics-classes-for-kg", name: "Phonics Classes for KG", category: "early", h1Tpl: "Phonics Classes for KG in {area}", descTpl: "Expert phonics classes for KG students in {area}. Build reading foundations. Certified teachers. Free demo!" },
  { slug: "montessori-classes", name: "Montessori Classes", category: "early", h1Tpl: "Montessori Classes in {area}", descTpl: "Montessori-method early learning in {area}. Hands-on, child-led education. Ages 2-6. Free demo!" },
  { slug: "early-learning-program", name: "Early Learning Program", category: "early", h1Tpl: "Early Learning Programs in {area}", descTpl: "Structured early learning programs in {area}. Cognitive, motor & social skills for ages 2-6. Free demo!" },

  // Behavioral + Developmental Support
  { slug: "special-education-tutor", name: "Special Education Tutor", category: "behavioral", h1Tpl: "Special Education Tutors in {area}", descTpl: "Qualified special education tutors in {area}. Individualized support for learning differences. Free consultation!" },
  { slug: "speech-therapy-kids", name: "Speech Therapy for Kids", category: "behavioral", h1Tpl: "Speech Therapy for Kids in {area}", descTpl: "Professional speech therapy in {area}. Help your child communicate better. Certified therapists. Free consultation!" },
  { slug: "learning-disability-support", name: "Learning Disability Support", category: "behavioral", h1Tpl: "Learning Disability Support in {area}", descTpl: "Expert learning disability support in {area}. Dyslexia, ADHD, autism-friendly tutoring. Free consultation!" },

  // Local Discovery
  { slug: "verified-tutors", name: "Verified Tutors", category: "discovery", h1Tpl: "Verified Home Tutors in {area}", descTpl: "Find background-checked, verified home tutors in {area}. All subjects, all boards. Book a free demo!" },
  { slug: "weekend-classes-for-kids", name: "Weekend Classes for Kids", category: "discovery", h1Tpl: "Weekend Classes for Kids in {area}", descTpl: "Weekend tuition & activity classes in {area}. Flexible Saturday-Sunday batches. All ages. Free demo!" },
];

export type ServiceCategory = typeof services[number];

function findService(s: string) { return services.find(svc => svc.slug === s); }

export const examTypes = [
  { slug: "jee", name: "JEE" },
  { slug: "neet", name: "NEET" },
  { slug: "cuet", name: "CUET" },
  { slug: "ntse", name: "NTSE" },
  { slug: "olympiad", name: "Olympiad" },
  { slug: "navodaya", name: "Navodaya (JNVST)" },
  { slug: "sainik-school", name: "Sainik School" },
];
function findExam(s: string) { return examTypes.find(e => e.slug === s); }

export type IntentModifier = typeof intentModifiers[number];

export type PageType =
  | "subject" | "area" | "subject-area"
  | "area-tuition" | "area-pincode"
  | "subject-class-area" | "best-tutors-area"
  // 2.0 types
  | "subject-class-area-board"
  | "subject-area-fees"
  | "female-subject-area"
  | "subject-near-me-class"
  | "home-vs-online-area"
  | "tuition-fees-area"   // money page
  | "top-tutors-area"     // money page
  // 3.0 service pages
  | "service-area"
  | "service-city";

export interface SeoPageData {
  type: PageType;
  slug: string;
  subject?: { slug: string; name: string };
  area?: { slug: string; name: string; pincode: string };
  classLevel?: { slug: string; name: string; label: string };
  board?: { slug: string; name: string };
  service?: ServiceCategory;
  intent?: string;
  keyword: string;
  title: string;
  metaDescription: string;
  h1: string;
  isPillar?: boolean;
  isMoneyPage?: boolean;
}

// ===== HELPERS =====
function findArea(s: string) { return areas.find(a => a.slug === s); }
function findSubject(s: string) { return subjects.find(x => x.slug === s); }
function findClass(s: string) { return classes.find(c => c.slug === s); }
function findBoard(s: string) { return boards.find(b => b.slug === s); }

// ===== INTRO / FAQ TEMPLATES (legacy compat) =====
const introTemplates = [
  (kw: string, city: string, pincode?: string) =>
    `Looking for the ${kw} in ${city}${pincode ? ` (${pincode})` : ""}? Tutors Parliament connects students with experienced, verified home tutors who deliver personalized learning.`,
  (kw: string, city: string, pincode?: string) =>
    `Tutors Parliament is your trusted source for ${kw} in ${city}${pincode ? ` (${pincode})` : ""}. Our handpicked educators specialize in CBSE, ICSE, and state board curricula.`,
  (kw: string, city: string, pincode?: string) =>
    `Finding the right ${kw} in ${city}${pincode ? `, pincode ${pincode}` : ""} can be overwhelming. At Tutors Parliament, we make it simple — browse verified tutor profiles and schedule a free demo.`,
  (kw: string, city: string, pincode?: string) =>
    `Need a reliable ${kw} near ${city}${pincode ? ` (${pincode})` : ""}? Our platform matches you with qualified, background-verified tutors in your locality.`,
  (kw: string, city: string, pincode?: string) =>
    `Discover top-rated ${kw} in ${city}${pincode ? ` — ${pincode}` : ""}. Tutors Parliament offers expert home tuition for all boards and competitive exams.`,
];

const faqTemplates = [
  (kw: string, area?: string, cls?: string) => [
    { q: `How do I find the best ${kw}?`, a: `Tutors Parliament provides verified, experienced tutors${area ? ` in ${area}` : ""}${cls ? ` for ${cls}` : ""}. Browse profiles, check ratings, and book a free demo.` },
    { q: `What subjects are covered by ${kw}?`, a: `Our tutors cover all major subjects including Maths, Science, English, Hindi, Accounts, Economics, and more for CBSE, ICSE & state boards.` },
    { q: `Are demo classes available?`, a: `Yes! We offer a completely free demo class so you can evaluate the tutor's teaching style before committing.` },
    { q: `What is the fee for ${kw}?`, a: `Fees vary based on subject, class, and experience level. Contact us for a personalized quote.` },
  ],
  (kw: string, area?: string, cls?: string) => [
    { q: `Why choose Tutors Parliament for ${kw}?`, a: `With 10,000+ students, 4.8★ ratings, and verified tutors, Tutors Parliament is Delhi's most trusted home tuition platform${area ? ` serving ${area}` : ""}.` },
    { q: `Do you provide online classes${cls ? ` for ${cls}` : ""}?`, a: `Yes, we offer both home tuition and online classes with flexible scheduling options.` },
    { q: `How are tutors verified?`, a: `Every tutor goes through rigorous screening including background checks, qualification verification, and demo class evaluation.` },
    { q: `Can I change my tutor?`, a: `Absolutely. If you're not satisfied, we'll assign a new tutor at no extra cost.` },
  ],
  (kw: string, area?: string, cls?: string) => [
    { q: `How quickly can I get a ${kw}?`, a: `We typically match you with a suitable tutor within 24–48 hours${area ? ` in ${area}` : ""}.` },
    { q: `What boards do your tutors cover${area ? ` in ${area}` : ""}?`, a: `Our tutors are experienced in CBSE, ICSE, IGCSE, IB, and all state boards${cls ? ` for ${cls}` : ""}.` },
    { q: `Is there a registration fee?`, a: `No registration fee. You only pay for tuition sessions. Plus, the first demo class is completely free.` },
    { q: `Do you offer group tuition${area ? ` in ${area}` : ""}?`, a: `We primarily focus on one-on-one home tuition, but small group sessions (2-3 students) can be arranged on request.` },
  ],
];

export function getIntro(keyword: string, city: string, index: number, pincode?: string): string {
  return introTemplates[index % introTemplates.length](keyword, city, pincode);
}

export function getFaqs(keyword: string, area: string | undefined, index: number, cls?: string) {
  return faqTemplates[index % faqTemplates.length](keyword, area, cls);
}

// ===== SLUG PARSERS =====

// ---- SEO 2.0 NEW PATTERNS ----
export function parseSlug2(slug: string): SeoPageData | null {
  // top-10-home-tutors-{area}
  let m = slug.match(/^top-10-home-tutors-(.+)$/);
  if (m) {
    const area = findArea(m[1]);
    if (area) {
      const kw = `Top 10 Home Tutors in ${area.name}`;
      return { type: "top-tutors-area", slug, area, keyword: kw, isMoneyPage: true,
        title: `Top 10 Home Tutors in ${area.name}, Delhi | Tutors Parliament`,
        metaDescription: `Discover the top 10 home tutors in ${area.name}. Verified profiles, ratings & reviews. Book a free demo today!`,
        h1: kw };
    }
  }

  // home-tuition-fees-in-{area}
  m = slug.match(/^home-tuition-fees-in-(.+)$/);
  if (m) {
    const area = findArea(m[1]);
    if (area) {
      const kw = `Home Tuition Fees in ${area.name}`;
      return { type: "tuition-fees-area", slug, area, keyword: kw, intent: "fees", isMoneyPage: true,
        title: `Home Tuition Fees in ${area.name} (2025) | Tutors Parliament`,
        metaDescription: `Check home tuition fees in ${area.name}, Delhi. ₹300–₹800/hr. Affordable, transparent pricing. Book a free demo!`,
        h1: `Home Tuition Fees in ${area.name}, Delhi` };
    }
  }

  // female-{subject}-home-tutor-{area}
  m = slug.match(/^female-(.+)-home-tutor-(.+)$/);
  if (m) {
    const subj = findSubject(m[1]);
    const area = findArea(m[2]);
    if (subj && area) {
      const kw = `Female ${subj.name} Home Tutor in ${area.name}`;
      return { type: "female-subject-area", slug, subject: subj, area, keyword: kw, intent: "female-tutors",
        title: `Female ${subj.name} Tutor in ${area.name} | Tutors Parliament`,
        metaDescription: `Find verified female ${subj.name} home tutors in ${area.name}. Safe, experienced & CBSE/ICSE experts. Free demo!`,
        h1: kw };
    }
  }

  // {subject}-home-tutor-near-me-class-{class}
  m = slug.match(/^(.+)-home-tutor-near-me-class-(.+)$/);
  if (m) {
    const subj = findSubject(m[1]);
    const cls = findClass(m[2]);
    if (subj && cls) {
      const kw = `${subj.name} Home Tutor Near Me for ${cls.label}`;
      return { type: "subject-near-me-class", slug, subject: subj, classLevel: cls, keyword: kw, intent: "near-me",
        title: `${subj.name} Home Tutor Near Me — ${cls.label} | Tutors Parliament`,
        metaDescription: `Find ${subj.name} home tutors near you for ${cls.label}. Verified, experienced, CBSE/ICSE. Book free demo!`,
        h1: kw };
    }
  }

  // home-vs-online-tuition-{area}
  m = slug.match(/^home-vs-online-tuition-(.+)$/);
  if (m) {
    const area = findArea(m[1]);
    if (area) {
      const kw = `Home vs Online Tuition in ${area.name}`;
      return { type: "home-vs-online-area", slug, area, keyword: kw, intent: "home-vs-online",
        title: `Home vs Online Tuition in ${area.name} | Tutors Parliament`,
        metaDescription: `Compare home tuition vs online classes in ${area.name}. Pros, cons & what works best. Expert advice inside!`,
        h1: kw };
    }
  }

  // {subject}-home-tutor-{area}-class-{class}-{board}
  m = slug.match(/^(.+)-home-tutor-(.+)-class-(.+)-(cbse|icse|ib)$/);
  if (m) {
    const subj = findSubject(m[1]);
    const area = findArea(m[2]);
    const cls = findClass(m[3]);
    const board = findBoard(m[4]);
    if (subj && area && cls && board) {
      const kw = `${subj.name} Home Tutor in ${area.name} for ${cls.label} ${board.name}`;
      return { type: "subject-class-area-board", slug, subject: subj, area, classLevel: cls, board, keyword: kw,
        title: `${subj.name} Tutor ${area.name} ${cls.label} ${board.name} | Tutors Parliament`,
        metaDescription: `Expert ${subj.name} home tutor in ${area.name} for ${cls.label} ${board.name}. Verified, experienced. Free demo!`,
        h1: kw };
    }
  }

  // {subject}-home-tutor-{area}-fees
  m = slug.match(/^(.+)-home-tutor-(.+)-fees$/);
  if (m) {
    const subj = findSubject(m[1]);
    const area = findArea(m[2]);
    if (subj && area) {
      const kw = `${subj.name} Home Tutor Fees in ${area.name}`;
      return { type: "subject-area-fees", slug, subject: subj, area, keyword: kw, intent: "fees",
        title: `${subj.name} Tutor Fees in ${area.name} | Tutors Parliament`,
        metaDescription: `${subj.name} home tuition fees in ${area.name}: ₹300–₹800/hr. Transparent pricing, free demo. Book now!`,
        h1: kw };
    }
  }

  // {exam}-coaching-{area}
  m = slug.match(/^(.+)-coaching-(.+)$/);
  if (m) {
    const exam = findExam(m[1]);
    const area = findArea(m[2]);
    if (exam && area) {
      const kw = `${exam.name} Coaching in ${area.name}`;
      return { type: "subject-area" as PageType, slug, area, keyword: kw,
        title: `${exam.name} Coaching in ${area.name}, Delhi | Tutors Parliament`,
        metaDescription: `Top ${exam.name} coaching in ${area.name}. Expert tutors, mock tests, personalized study plans. Book free demo!`,
        h1: `Best ${exam.name} Coaching in ${area.name}, Delhi` };
    }
  }

  // {exam}-coaching-near-me
  m = slug.match(/^(.+)-coaching-near-me$/);
  if (m) {
    const exam = findExam(m[1]);
    if (exam) {
      const kw = `${exam.name} Coaching Near Me`;
      return { type: "subject-near-me-class" as PageType, slug, keyword: kw, intent: "near-me",
        title: `${exam.name} Coaching Near Me — Delhi | Tutors Parliament`,
        metaDescription: `Find the best ${exam.name} coaching near you in Delhi. Verified tutors, free demo class. Start preparing today!`,
        h1: kw };
    }
  }

  // === SERVICE PAGES ===
  // {service-slug}-{area} e.g. coding-classes-for-kids-rohini
  for (const svc of services) {
    for (const area of areas) {
      if (slug === `${svc.slug}-${area.slug}`) {
        const h1 = svc.h1Tpl.replace("{area}", area.name);
        const desc = svc.descTpl.replace("{area}", area.name);
        return {
          type: "service-area", slug, service: svc, area, keyword: h1,
          title: `${h1} | Tutors Parliament`,
          metaDescription: desc, h1,
        };
      }
    }
    // {service-slug}-delhi e.g. coding-classes-for-kids-delhi
    if (slug === `${svc.slug}-delhi`) {
      const h1 = svc.h1Tpl.replace("{area}", "Delhi");
      const desc = svc.descTpl.replace("{area}", "Delhi");
      return {
        type: "service-city", slug, service: svc,
        area: { slug: "delhi", name: "Delhi", pincode: "110001" },
        keyword: h1,
        title: `${h1} | Tutors Parliament`,
        metaDescription: desc, h1,
      };
    }
    // {service-slug}-noida, gurgaon, ghaziabad
    for (const city of ["noida", "gurgaon", "ghaziabad", "faridabad"]) {
      if (slug === `${svc.slug}-${city}`) {
        const area = findArea(city);
        if (area) {
          const h1 = svc.h1Tpl.replace("{area}", area.name);
          const desc = svc.descTpl.replace("{area}", area.name);
          return {
            type: "service-city", slug, service: svc, area, keyword: h1,
            title: `${h1} | Tutors Parliament`,
            metaDescription: desc, h1,
          };
        }
      }
    }
  }

  return null;
}

// ---- Phase 1 keyword aliases (Delhi-wide high-intent) ----
// Maps short, high-CTR Delhi slugs to existing structured pageData so we don't
// duplicate templates. New slug → reuse existing subject/area/board paths.
const ALIAS_MAP: Record<string, () => SeoPageData | null> = {
  "home-tutor-in-delhi": () => ({
    type: "area", slug: "home-tutor-in-delhi",
    area: { slug: "delhi", name: "Delhi", pincode: "110001" },
    keyword: "Home Tutor in Delhi", isPillar: true,
    title: "Home Tutor in Delhi — Verified 1-on-1 Tutors | Tutors Parliament",
    metaDescription: "Hire a verified home tutor in Delhi for CBSE, ICSE & state boards. All subjects, all classes. Free demo class — book in 24 hours.",
    h1: "Home Tutors in Delhi",
  }),
  "tuition-in-delhi": () => ({
    type: "area-tuition", slug: "tuition-in-delhi",
    area: { slug: "delhi", name: "Delhi", pincode: "110001" },
    keyword: "Tuition in Delhi", isPillar: true,
    title: "Tuition Classes in Delhi — Home & Online | Tutors Parliament",
    metaDescription: "Personalised tuition in Delhi for Class 1–12. CBSE, ICSE, IB. Verified tutors, transparent fees, free demo class.",
    h1: "Tuition Classes in Delhi",
  }),
  "maths-tutor-delhi": () => {
    const subj = findSubject("math");
    if (!subj) return null;
    return {
      type: "subject", slug: "maths-tutor-delhi", subject: subj,
      keyword: "Maths Tutor in Delhi", isPillar: true,
      title: "Maths Tutor in Delhi — Class 6 to 12 Home Tuition | Tutors Parliament",
      metaDescription: "Top-rated Maths home tutors in Delhi for Class 6–12. CBSE/ICSE specialists, board & competitive prep. Free demo!",
      h1: "Best Maths Tutors in Delhi",
    };
  },
  "science-tutor-delhi": () => {
    const subj = findSubject("science");
    if (!subj) return null;
    return {
      type: "subject", slug: "science-tutor-delhi", subject: subj,
      keyword: "Science Tutor in Delhi", isPillar: true,
      title: "Science Tutor in Delhi — Physics, Chemistry, Biology | Tutors Parliament",
      metaDescription: "Expert Science home tutors in Delhi covering Physics, Chemistry & Biology. Class 6–12, CBSE/ICSE. Book a free demo class.",
      h1: "Best Science Tutors in Delhi",
    };
  },
  "cbse-tuition-delhi": () => {
    const board = boards.find(b => b.slug === "cbse");
    if (!board) return null;
    return {
      type: "subject", slug: "cbse-tuition-delhi", board,
      keyword: "CBSE Tuition in Delhi", isPillar: true,
      title: "CBSE Tuition in Delhi — Class 1 to 12 Home Tutors | Tutors Parliament",
      metaDescription: "CBSE-specialist home tutors in Delhi for Class 1–12. NCERT-aligned, board exam prep, sample papers. Free demo class.",
      h1: "CBSE Home Tuition in Delhi",
    };
  },
};

// ---- Existing 1.0 patterns ----
export function parseNewSlug(slug: string): SeoPageData | null {
  // Phase 1 short aliases
  if (ALIAS_MAP[slug]) {
    const r = ALIAS_MAP[slug]();
    if (r) return r;
  }

  // best-home-tutors-in-{area}
  let m = slug.match(/^best-home-tutors-in-(.+)$/);
  if (m) {
    const area = findArea(m[1]);
    if (area) {
      const kw = `Best Home Tutors in ${area.name}`;
      return { type: "best-tutors-area", slug, area, keyword: kw, isPillar: true,
        title: `${kw}, Delhi | Tutors Parliament`,
        metaDescription: `Find the best home tutors in ${area.name}, Delhi (${area.pincode}). Verified tutors for all subjects. Book a free demo!`,
        h1: kw };
    }
  }

  // {subject}-tuition-in-{area}-class-{class}
  m = slug.match(/^(.+)-tuition-in-(.+)-class-(.+)$/);
  if (m) {
    const subj = findSubject(m[1]);
    const area = findArea(m[2]);
    const cls = findClass(m[3]);
    if (subj && area && cls) {
      const kw = `${subj.name} Tuition in ${area.name} for ${cls.label}`;
      return { type: "subject-class-area", slug, subject: subj, area, classLevel: cls, keyword: kw,
        title: `${subj.name} Home Tuition in ${area.name} for ${cls.label} | Tutors Parliament`,
        metaDescription: `Expert ${subj.name} home tuition in ${area.name} (${area.pincode}) for ${cls.label} students. CBSE/ICSE. Book a free demo!`,
        h1: `${subj.name} Home Tuition in ${area.name} for ${cls.label}` };
    }
  }

  // home-tuition-in-{area}-{pincode}
  m = slug.match(/^home-tuition-in-(.+)-(\d{6})$/);
  if (m) {
    const area = findArea(m[1]);
    if (area) {
      return { type: "area-pincode", slug, area: { ...area, pincode: m[2] }, keyword: `Home Tuition in ${area.name} ${m[2]}`,
        title: `Home Tuition in ${area.name} (${m[2]}) | Tutors Parliament`,
        metaDescription: `Looking for home tuition in ${area.name}, ${m[2]}? Verified tutors for all subjects. Book a free demo!`,
        h1: `Home Tuition in ${area.name} — ${m[2]}` };
    }
  }

  // home-tuition-in-{area}
  m = slug.match(/^home-tuition-in-(.+)$/);
  if (m) {
    const area = findArea(m[1]);
    if (area) {
      return { type: "area-tuition", slug, area, keyword: `Home Tuition in ${area.name}`, isPillar: true,
        title: `Home Tuition in ${area.name}, Delhi | Tutors Parliament`,
        metaDescription: `Find expert home tuition in ${area.name}, Delhi (${area.pincode}). All subjects, all boards. Book a free demo!`,
        h1: `Home Tuition in ${area.name}, Delhi` };
    }
  }

  return null;
}

// Master parser — tries 2.0 first, then 1.0, then legacy
export function parseSlug(slug: string): SeoPageData | null {
  // SEO 2.0
  const v2 = parseSlug2(slug);
  if (v2) return v2;

  // 1.0 patterns
  const v1 = parseNewSlug(slug);
  if (v1) return v1;

  // Legacy: subject-area-delhi
  for (const subj of subjects) {
    for (const area of areas) {
      if (slug === `${subj.slug}-${area.slug}-delhi`) {
        const kw = `${subj.name} Home Tutor in ${area.name}, Delhi`;
        return { type: "subject-area", slug, subject: subj, area, keyword: kw, isPillar: true,
          title: `Best ${subj.name} Home Tutor in ${area.name}, Delhi | Tutors Parliament`,
          metaDescription: `Find the best ${subj.name} home tutor in ${area.name}, Delhi. Verified tutors, personalized classes. Book a free demo!`,
          h1: `Best ${subj.name} Home Tutor in ${area.name}, Delhi` };
      }
    }
  }

  // Legacy: area-delhi
  for (const area of areas) {
    if (slug === `${area.slug}-delhi`) {
      return { type: "area", slug, area, keyword: `Home Tutor in ${area.name}, Delhi`,
        title: `Best Home Tutors in ${area.name}, Delhi | Tutors Parliament`,
        metaDescription: `Looking for home tutors in ${area.name}, Delhi? Verified tutors for all subjects. Book a free demo!`,
        h1: `Best Home Tutors in ${area.name}, Delhi` };
    }
  }

  // Legacy: subject-delhi
  for (const subj of subjects) {
    if (slug === `${subj.slug}-delhi`) {
      return { type: "subject", slug, subject: subj, keyword: `${subj.name} Home Tutor in Delhi`,
        title: `Best ${subj.name} Home Tutors in Delhi | Tutors Parliament`,
        metaDescription: `Find experienced ${subj.name} home tutors in Delhi. One-on-one tuition for CBSE, ICSE & state boards. Book a free demo!`,
        h1: `Best ${subj.name} Home Tutors in Delhi` };
    }
  }

  return null;
}

// ===== CLUSTER LINKING =====
// Returns pillar page + sibling pages for topical authority

export interface ClusterLink {
  href: string;
  anchor: string;
  isPillar: boolean;
}

export function getClusterLinks(pageData: SeoPageData): ClusterLink[] {
  const links: ClusterLink[] = [];
  const seen = new Set([pageData.slug]);

  const add = (href: string, anchor: string, isPillar = false) => {
    const s = href.replace(/^\//, "");
    if (!seen.has(s)) { seen.add(s); links.push({ href, anchor, isPillar }); }
  };

  const subj = pageData.subject;
  const area = pageData.area;

  // Pillar: subject-area-delhi (if we're a child page)
  if (subj && area) {
    add(`/tutors/${subj.slug}-${area.slug}-delhi`, `${subj.name} Tutor in ${area.name}`, true);
  }
  // Pillar: home-tuition-in-area
  if (area) {
    add(`/home-tuition-in-${area.slug}`, `Home Tuition in ${area.name}`, true);
    add(`/best-home-tutors-in-${area.slug}`, `Best Tutors in ${area.name}`, true);
  }

  // Siblings: board variants
  if (subj && area && pageData.classLevel) {
    for (const b of boards) {
      if (b.slug !== pageData.board?.slug) {
        add(`/${subj.slug}-home-tutor-${area.slug}-class-${pageData.classLevel.slug}-${b.slug}`,
          `${subj.name} ${b.name} Tutor — ${pageData.classLevel.label}`);
      }
    }
  }

  // Siblings: fees variant
  if (subj && area && pageData.intent !== "fees") {
    add(`/${subj.slug}-home-tutor-${area.slug}-fees`, `${subj.name} Tutor Fees in ${area.name}`);
  }

  // Siblings: female variant
  if (subj && area && pageData.intent !== "female-tutors") {
    add(`/female-${subj.slug}-home-tutor-${area.slug}`, `Female ${subj.name} Tutor in ${area.name}`);
  }

  // Money pages
  if (area) {
    add(`/home-tuition-fees-in-${area.slug}`, `Tuition Fees in ${area.name}`);
    add(`/top-10-home-tutors-${area.slug}`, `Top 10 Tutors in ${area.name}`);
  }

  // Class variants
  if (subj && area) {
    for (const c of classes.filter(c => ["9", "10", "11", "12"].includes(c.slug) && c.slug !== pageData.classLevel?.slug)) {
      add(`/${subj.slug}-tuition-in-${area.slug}-class-${c.slug}`, `${subj.name} — ${c.label} in ${area.name}`);
      if (links.length >= 10) break;
    }
  }

  return links.slice(0, 10);
}

// ===== GENERATE ALL SLUGS (for sitemap) =====
export function getAllSlugs(): string[] {
  const slugs: string[] = [];
  const topSubjects = subjects.slice(0, 6);
  const topAreas = areas.slice(0, 10);
  const highClasses = classes.filter(c => ["8", "9", "10", "11", "12"].includes(c.slug));

  // === LEGACY (v1.0) ===
  for (const subj of subjects) slugs.push(`${subj.slug}-delhi`);
  for (const area of areas) slugs.push(`${area.slug}-delhi`);
  for (const subj of topSubjects) {
    for (const area of topAreas.slice(0, 6)) slugs.push(`${subj.slug}-${area.slug}-delhi`);
  }
  for (const area of areas) slugs.push(`home-tuition-in-${area.slug}`);
  for (const area of areas.slice(0, 15)) {
    slugs.push(`home-tuition-in-${area.slug}-${area.pincode}`);
    slugs.push(`best-home-tutors-in-${area.slug}`);
  }
  for (const subj of topSubjects) {
    for (const area of topAreas) {
      for (const cls of highClasses) slugs.push(`${subj.slug}-tuition-in-${area.slug}-class-${cls.slug}`);
    }
  }

  // === SEO 2.0 ===
  // Money pages: fees & top-10 for all areas (92 pages)
  for (const area of areas) {
    slugs.push(`home-tuition-fees-in-${area.slug}`);
    slugs.push(`top-10-home-tutors-${area.slug}`);
  }

  // Board pages: top 6 subjects × top 25 areas × classes 10-12 × 3 boards (~1350 pages)
  const boardSubjects = topSubjects.slice(0, 6);
  const boardClasses = classes.filter(c => ["10", "11", "12"].includes(c.slug));
  for (const subj of boardSubjects) {
    for (const area of areas.slice(0, 25)) {
      for (const cls of boardClasses) {
        for (const board of boards) {
          slugs.push(`${subj.slug}-home-tutor-${area.slug}-class-${cls.slug}-${board.slug}`);
        }
      }
    }
  }

  // Female tutor pages: top 8 subjects × all 46 areas (~360 pages)
  for (const subj of subjects.slice(0, 8)) {
    for (const area of areas) {
      slugs.push(`female-${subj.slug}-home-tutor-${area.slug}`);
    }
  }

  // Near-me pages: top 6 subjects × high classes (30 pages)
  for (const subj of topSubjects) {
    for (const cls of highClasses) {
      slugs.push(`${subj.slug}-home-tutor-near-me-class-${cls.slug}`);
    }
  }

  // Home vs online: all 46 areas (46 pages)
  for (const area of areas) {
    slugs.push(`home-vs-online-tuition-${area.slug}`);
  }

  // Fees pages: top 10 subjects × all 46 areas (~460 pages)
  for (const subj of subjects.slice(0, 10)) {
    for (const area of areas) {
      slugs.push(`${subj.slug}-home-tutor-${area.slug}-fees`);
    }
  }

  // Exam coaching pages: 7 exams × all 46 areas + near-me (~330 pages)
  for (const exam of examTypes) {
    slugs.push(`${exam.slug}-coaching-near-me`);
    for (const area of areas) {
      slugs.push(`${exam.slug}-coaching-${area.slug}`);
    }
  }

  // === SEO 3.0: SERVICE PAGES ===
  // High-priority services × Delhi + top 25 areas + NCR cities (~600 pages)
  const priorityServices = services.slice(0, 25);
  const serviceAreas = areas.slice(0, 25);
  const ncrCities = ["noida", "gurgaon", "ghaziabad", "faridabad"];
  for (const svc of priorityServices) {
    slugs.push(`${svc.slug}-delhi`);
    for (const city of ncrCities) {
      slugs.push(`${svc.slug}-${city}`);
    }
    for (const area of serviceAreas) {
      slugs.push(`${svc.slug}-${area.slug}`);
    }
  }

  return slugs;
}

