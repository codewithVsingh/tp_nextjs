// ===== DYNAMIC CONTENT GENERATOR 2.0 =====
// Generates unique, varied content for all SEO page types including money pages,
// board-specific pages, and intent-based pages.

import { areas, subjects, classes, boards, type SeoPageData } from "./seoData";

// ===== HASH FUNCTION =====
function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

// ===== ENRICHED CONTENT PARAGRAPHS =====

const introParagraphs = [
  (subj: string, area: string, cls: string, pin: string) =>
    `Parents and students in ${area}${pin ? ` (${pin})` : ""} consistently seek dependable ${subj} home tutors who can simplify complex topics${cls ? ` for ${cls} students` : ""}. At Tutors Parliament, we bridge this gap by connecting families with educators who bring years of board-exam expertise — covering CBSE, ICSE, and IGCSE curricula — right to your doorstep.`,
  (subj: string, area: string, cls: string, pin: string) =>
    `Academic success in ${subj} demands more than classroom learning, especially in competitive areas like ${area}${pin ? `, pincode ${pin}` : ""}. Our handpicked tutors provide focused, one-on-one sessions${cls ? ` tailored for ${cls}` : ""} that address individual weak points while building exam confidence across CBSE, ICSE, and state board syllabi.`,
  (subj: string, area: string, cls: string, pin: string) =>
    `${area} is home to thousands of students preparing for board exams and competitive entrance tests${cls ? ` at the ${cls} level` : ""}. Finding a skilled ${subj} tutor nearby${pin ? ` (${pin})` : ""} shouldn't be a struggle — Tutors Parliament makes it effortless with verified profiles, transparent ratings, and a free demo class.`,
  (subj: string, area: string, cls: string, pin: string) =>
    `Whether your child is struggling with fundamentals or aiming for top percentile scores in ${subj}, our tutors in ${area}${pin ? ` — ${pin}` : ""} are equipped to deliver results${cls ? ` for ${cls} students` : ""}. With personalized lesson plans aligned to CBSE, ICSE, IB, and state boards, every session counts.`,
  (subj: string, area: string, cls: string, pin: string) =>
    `The demand for quality ${subj} tuition in ${area}${pin ? ` (${pin})` : ""} has never been higher${cls ? `, particularly for ${cls}` : ""}. Tutors Parliament answers this need with a curated network of 500+ verified educators who combine subject mastery with proven teaching methodologies.`,
  (subj: string, area: string, cls: string, pin: string) =>
    `Students across ${area}${pin ? `, ${pin}` : ""} trust Tutors Parliament for ${subj} home tuition that goes beyond rote learning${cls ? ` — especially for ${cls} preparation` : ""}. Our tutors focus on concept clarity, regular assessments, and exam strategy for CBSE, ICSE, and competitive exams.`,
  (subj: string, area: string, cls: string, pin: string) =>
    `In a vibrant locality like ${area}${pin ? ` (pincode ${pin})` : ""}, students need ${subj} tutors who understand local school patterns and exam trends${cls ? ` for ${cls}` : ""}. Tutors Parliament's educators bring neighbourhood familiarity along with deep subject expertise across all major boards.`,
];

const valueParagraphs = [
  (subj: string, area: string, cls: string) =>
    `What sets our ${subj} tutors apart in ${area} is the rigorous vetting process — every educator is background-verified, qualification-checked, and demo-evaluated. ${cls ? `For ${cls}, ` : ""}We focus on building conceptual understanding through worksheets, mock tests, and chapter-wise analysis.`,
  (subj: string, area: string, cls: string) =>
    `Our ${area}-based ${subj} tutors bring an average of 5+ years of teaching experience${cls ? ` with specific expertise in ${cls} curriculum` : ""}. Fees start from ₹300–₹800 per hour depending on grade and subject complexity.`,
  (subj: string, area: string, cls: string) =>
    `Choosing Tutors Parliament for ${subj} tuition in ${area} means access to flexible scheduling, both online and offline modes, and a satisfaction guarantee${cls ? `, ensuring ${cls} students never lose momentum` : ""}.`,
  (subj: string, area: string, cls: string) =>
    `Families in ${area} choose us because our ${subj} tutors don't just teach — they mentor${cls ? ` ${cls} students` : ""}. From school assignments to board exams, our educators become a reliable academic partner.`,
  (subj: string, area: string, cls: string) =>
    `With 10,000+ students already learning through Tutors Parliament, our ${subj} tutors in ${area} have a proven track record of grade improvements${cls ? ` for ${cls}` : ""}. Parents appreciate our regular progress reports and flexibility.`,
];

const closingParagraphs = [
  (subj: string, area: string, cls: string) =>
    `Don't let another exam season go by without the right ${subj} support${cls ? ` for your ${cls} child` : ""}. Book a free demo class in ${area} today and see the Tutors Parliament difference.`,
  (subj: string, area: string, cls: string) =>
    `Your child's academic journey in ${subj} deserves personalised attention${cls ? ` — especially at the ${cls} level` : ""}. Start with a complimentary demo session in ${area}, meet your tutor, and experience quality tuition.`,
  (subj: string, area: string, cls: string) =>
    `Ready to transform your child's ${subj} performance${cls ? ` in ${cls}` : ""}? Connect with a verified tutor in ${area} within 24 hours. 4.8★ average ratings, flexible scheduling, all boards covered.`,
  (subj: string, area: string, cls: string) =>
    `From foundation building to board exam excellence, our ${subj} tutors in ${area} deliver measurable results${cls ? ` for ${cls} students` : ""}. Schedule your free demo class now.`,
  (subj: string, area: string, cls: string) =>
    `Whether preparing for boards, olympiads, or entrance exams, the right ${subj} tutor makes all the difference${cls ? ` at the ${cls} stage` : ""}. In ${area}, Tutors Parliament is the go-to choice.`,
];

// ===== INTENT-SPECIFIC CONTENT =====

const feesContent = [
  (subj: string, area: string) =>
    `Home tuition fees in ${area} vary based on subject, class level, and tutor experience. For ${subj}, expect ₹300–₹500/hr for classes 1–8, ₹400–₹600/hr for classes 9–10, and ₹500–₹800/hr for classes 11–12. Competitive exam coaching (JEE, NEET) may range ₹600–₹1,200/hr. At Tutors Parliament, there's no registration fee — you only pay for sessions taken.`,
  (subj: string, area: string) =>
    `Parents in ${area} often ask about ${subj} tuition costs. Our fee structure is transparent: ₹300–₹800 per hour depending on grade and complexity. Group tuition (2–3 students) is available at 30–40% lower rates. All fees are discussed upfront with no hidden charges. The first demo class is always free.`,
];

const femaleContent = [
  (subj: string, area: string) =>
    `Many families in ${area} prefer female ${subj} tutors for their children, especially for younger students. Tutors Parliament has a strong network of qualified female educators with 3–10+ years of experience in CBSE, ICSE, and IB curricula. All our female tutors are background-verified and ID-checked for your peace of mind.`,
  (subj: string, area: string) =>
    `Our pool of female ${subj} tutors in ${area} includes postgraduates, B.Ed holders, and working professionals with proven teaching track records. Whether for a young learner or a senior student, our female tutors bring patience, expertise, and a safe learning environment.`,
];

const homeVsOnlineContent = [
  (area: string) =>
    `Choosing between home tuition and online classes in ${area}? Home tuition offers distraction-free, face-to-face learning ideal for younger students (classes 1–8). Online classes provide flexibility and access to a wider tutor pool — perfect for classes 9–12 and exam prep. At Tutors Parliament, you can switch between modes anytime. Many students in ${area} use a hybrid approach: home tuition for core subjects and online sessions for supplementary learning.`,
  (area: string) =>
    `The home vs online debate in ${area} has a simple answer: it depends on the student. Younger children benefit from in-person attention, while older students often thrive with the convenience of online sessions. Our tutors in ${area} are trained in both modes. Fees are similar for both formats, and you can try each with a free demo before deciding.`,
];

const moneyPageContent = {
  fees: (area: string) => ({
    intro: `Understanding home tuition fees in ${area} helps you plan your child's education budget effectively. Here's a comprehensive breakdown of current tuition rates across subjects, classes, and boards.`,
    breakdown: [
      { range: "Classes 1–5", fee: "₹300–₹450/hr", note: "Foundation building, homework help" },
      { range: "Classes 6–8", fee: "₹350–₹500/hr", note: "Subject strengthening, exam prep" },
      { range: "Classes 9–10", fee: "₹400–₹600/hr", note: "Board exam preparation" },
      { range: "Classes 11–12", fee: "₹500–₹800/hr", note: "Advanced subjects, entrance prep" },
      { range: "Competitive Exams", fee: "₹600–₹1,200/hr", note: "JEE, NEET, CLAT coaching" },
    ],
    factors: [
      "Subject complexity (Science/Maths cost more than languages)",
      "Tutor experience (5+ years commands premium fees)",
      "Session frequency (bulk bookings get 10–15% discount)",
      "Teaching mode (online is typically 10–20% lower)",
    ],
  }),
  topTutors: (area: string) => ({
    intro: `Looking for the top 10 home tutors in ${area}? Our curated list features Delhi's most experienced, highest-rated educators serving ${area} and surrounding areas.`,
    criteria: [
      "5+ years verified teaching experience",
      "4.5★+ average student rating",
      "Board exam result track record",
      "Background verified & ID checked",
      "Specialization in CBSE, ICSE, or IB",
    ],
  }),
};

export { moneyPageContent };

export function getEnrichedContent(pageData: SeoPageData): { intro: string; value: string; closing: string } {
  const seed = hashStr(pageData.slug);
  const subj = pageData.subject?.name || "Home Tuition";
  const area = pageData.area?.name || "Delhi";
  const cls = pageData.classLevel?.label || "";
  const pin = pageData.area?.pincode || "";

  // Intent-specific overrides
  if (pageData.intent === "fees") {
    return {
      intro: pick(feesContent, seed)(subj, area),
      value: pick(valueParagraphs, seed + 1)(subj, area, cls),
      closing: pick(closingParagraphs, seed + 2)(subj, area, cls),
    };
  }
  if (pageData.intent === "female-tutors") {
    return {
      intro: pick(femaleContent, seed)(subj, area),
      value: pick(valueParagraphs, seed + 1)(subj, area, cls),
      closing: pick(closingParagraphs, seed + 2)(subj, area, cls),
    };
  }
  if (pageData.intent === "home-vs-online") {
    return {
      intro: pick(homeVsOnlineContent, seed)(area),
      value: pick(valueParagraphs, seed + 1)("Home Tuition", area, cls),
      closing: pick(closingParagraphs, seed + 2)("Home Tuition", area, cls),
    };
  }

  // Board-specific enrichment
  if (pageData.board) {
    const boardIntro = `${subj} tuition for ${pageData.board.name} students in ${area}${cls ? ` (${cls})` : ""} requires tutors who deeply understand the ${pageData.board.name} syllabus structure, exam pattern, and marking scheme. At Tutors Parliament, our ${pageData.board.name}-specialist tutors bring chapter-wise mastery and years of board exam coaching experience.`;
    return {
      intro: boardIntro,
      value: pick(valueParagraphs, seed + 1)(subj, area, cls),
      closing: pick(closingParagraphs, seed + 2)(subj, area, cls),
    };
  }

  return {
    intro: pick(introParagraphs, seed)(subj, area, cls, pin),
    value: pick(valueParagraphs, seed + 1)(subj, area, cls),
    closing: pick(closingParagraphs, seed + 2)(subj, area, cls),
  };
}

// ===== FAQ GENERATOR =====

const faqPool = [
  (kw: string, area: string, cls: string) => ({ q: `What is the fee for ${kw}?`, a: `Fees for ${kw} typically range from ₹300 to ₹800 per hour, depending on the subject, class level${cls ? ` (${cls})` : ""}, and tutor experience. Contact us for a personalised quote — the first demo class is always free.` }),
  (kw: string, area: string, cls: string) => ({ q: `Are female tutors available${area ? ` in ${area}` : ""}?`, a: `Yes, we have a large pool of qualified female tutors available${area ? ` in ${area}` : ""} for home tuition. Specify your preference when booking.` }),
  (kw: string, area: string, cls: string) => ({ q: `Which subjects are covered${cls ? ` for ${cls}` : ""}?`, a: `Our tutors cover Maths, Science, English, Hindi, Social Studies, Accounts, Economics, and more${cls ? ` for ${cls}` : ""}. CBSE, ICSE, IGCSE, IB, and state board curricula supported.` }),
  (kw: string, area: string, cls: string) => ({ q: `Is home tuition better than coaching classes?`, a: `Home tuition offers personalised attention and flexible scheduling that group coaching cannot match. Students typically show 20–30% faster improvement with one-on-one tuition.` }),
  (kw: string, area: string, cls: string) => ({ q: `How quickly can I get a tutor${area ? ` in ${area}` : ""}?`, a: `We typically match you with a suitable tutor within 24–48 hours${area ? ` in ${area}` : ""}. Book a free demo to get started.` }),
  (kw: string, area: string, cls: string) => ({ q: `Do you provide online classes as well?`, a: `Yes! Both home tuition and online classes available. Flexible morning, afternoon, or evening slots${cls ? ` for ${cls}` : ""}.` }),
  (kw: string, area: string, cls: string) => ({ q: `How are your tutors verified?`, a: `Multi-step verification: identity checks, qualification verification, background screening, and demo teaching evaluation before listing.` }),
  (kw: string, area: string, cls: string) => ({ q: `Can I change my tutor if I'm not satisfied?`, a: `Yes, tutor replacement is free. We'll assign a new tutor at no additional cost until you find the perfect match.` }),
  (kw: string, area: string, cls: string) => ({ q: `Do tutors help with homework and assignments?`, a: `Yes, our tutors assist with homework, projects, and assignments${cls ? ` for ${cls}` : ""}. They also provide practice worksheets and mock tests.` }),
  (kw: string, area: string, cls: string) => ({ q: `What boards do your tutors cover?`, a: `CBSE, ICSE, IGCSE, IB, and all state boards. Whether NCERT or custom syllabus, we have specialist tutors.` }),
  (kw: string, area: string, cls: string) => ({ q: `Is there a registration fee?`, a: `No registration fee. You only pay for sessions. First demo class is completely free.` }),
  (kw: string, area: string, cls: string) => ({ q: `What is the difference between home and online tuition?`, a: `Home tuition offers face-to-face interaction ideal for younger students. Online classes provide flexibility and access to a wider tutor pool. Both are available at similar rates.` }),
];

// Intent-specific FAQs
const feesFaqs = (area: string) => [
  { q: `What are the average tuition fees in ${area}?`, a: `Home tuition fees in ${area} range from ₹300–₹800/hr depending on class, subject, and tutor experience. Competitive exam coaching may cost ₹600–₹1,200/hr.` },
  { q: `Are there any hidden charges?`, a: `No hidden charges. You only pay for sessions taken. No registration fee, no material fee. The first demo class is always free.` },
  { q: `Do you offer discounts for multiple subjects?`, a: `Yes! Students taking tuition in 2+ subjects get a 10–15% discount on the total fee. Group tuition (2–3 students) is available at 30–40% lower rates.` },
  { q: `Can I pay monthly?`, a: `Yes, most families opt for monthly payments. We also offer flexible per-session billing. All payment terms are discussed upfront.` },
  { q: `Are online classes cheaper than home tuition?`, a: `Online classes are typically 10–20% lower in fees since there's no travel involved for the tutor. Quality and session duration remain the same.` },
];

const femaleFaqs = (subj: string, area: string) => [
  { q: `How many female ${subj} tutors are available in ${area}?`, a: `We have 50+ verified female ${subj} tutors in and around ${area}. New tutors join our platform regularly.` },
  { q: `Can I request a female tutor specifically?`, a: `Absolutely. When booking, simply select "Female Tutor Preferred" and we'll match you with the best-fit female educator.` },
  { q: `Are female tutors available for home visits?`, a: `Yes, our female tutors provide both home tuition and online classes. All tutors are background-verified for safety.` },
  { q: `Do female tutors cover all boards?`, a: `Yes, our female tutors specialize in CBSE, ICSE, IB, and state boards with equal expertise.` },
  { q: `What qualifications do female tutors have?`, a: `Our female tutors include B.Ed holders, postgraduates, PhD scholars, and working professionals with 3–10+ years of teaching experience.` },
];

export function getEnrichedFaqs(pageData: SeoPageData): { q: string; a: string }[] {
  const seed = hashStr(pageData.slug);
  const kw = pageData.keyword;
  const area = pageData.area?.name || "";
  const cls = pageData.classLevel?.label || "";

  // Intent-specific FAQs
  if (pageData.intent === "fees" || pageData.isMoneyPage && pageData.type === "tuition-fees-area") {
    return feesFaqs(area);
  }
  if (pageData.intent === "female-tutors") {
    return femaleFaqs(pageData.subject?.name || "Home Tuition", area);
  }

  // Default: pick 5 unique from pool
  const selected: { q: string; a: string }[] = [];
  const used = new Set<number>();
  for (let i = 0; i < 5; i++) {
    let idx = (seed + i * 3) % faqPool.length;
    while (used.has(idx)) idx = (idx + 1) % faqPool.length;
    used.add(idx);
    selected.push(faqPool[idx](kw, area, cls));
  }
  return selected;
}

// ===== PROXIMITY-BASED AREA GRAPH =====
// Maps each area to its geographically nearest neighbours for smarter linking

const areaProximity: Record<string, string[]> = {
  "rohini": ["pitampura", "model-town", "ashok-vihar", "paschim-vihar", "north-delhi"],
  "dwarka": ["janakpuri", "vikaspuri", "uttam-nagar", "west-delhi", "gurgaon"],
  "laxmi-nagar": ["preet-vihar", "mayur-vihar", "east-delhi", "vaishali", "indirapuram"],
  "janakpuri": ["dwarka", "vikaspuri", "tilak-nagar", "rajouri-garden", "uttam-nagar"],
  "pitampura": ["rohini", "model-town", "ashok-vihar", "north-delhi", "paschim-vihar"],
  "karol-bagh": ["rajouri-garden", "connaught-place", "kamla-nagar", "north-delhi", "west-delhi"],
  "rajouri-garden": ["karol-bagh", "janakpuri", "tilak-nagar", "vikaspuri", "west-delhi"],
  "vikaspuri": ["janakpuri", "dwarka", "uttam-nagar", "tilak-nagar", "paschim-vihar"],
  "mayur-vihar": ["laxmi-nagar", "preet-vihar", "east-delhi", "noida", "indirapuram"],
  "ashok-vihar": ["pitampura", "rohini", "model-town", "kamla-nagar", "north-delhi"],
  "south-delhi": ["saket", "malviya-nagar", "hauz-khas", "greater-kailash", "defence-colony"],
  "north-delhi": ["model-town", "kamla-nagar", "pitampura", "rohini", "ashok-vihar"],
  "east-delhi": ["laxmi-nagar", "preet-vihar", "mayur-vihar", "ghaziabad", "vaishali"],
  "west-delhi": ["rajouri-garden", "janakpuri", "vikaspuri", "paschim-vihar", "tilak-nagar"],
  "saket": ["malviya-nagar", "hauz-khas", "greater-kailash", "south-delhi", "nehru-place"],
  "malviya-nagar": ["saket", "hauz-khas", "south-delhi", "greater-kailash", "kalkaji"],
  "hauz-khas": ["malviya-nagar", "saket", "south-delhi", "vasant-kunj", "greater-kailash"],
  "preet-vihar": ["laxmi-nagar", "mayur-vihar", "east-delhi", "vaishali", "indirapuram"],
  "model-town": ["pitampura", "ashok-vihar", "north-delhi", "kamla-nagar", "rohini"],
  "kamla-nagar": ["model-town", "north-delhi", "karol-bagh", "connaught-place", "ashok-vihar"],
  "vasant-kunj": ["hauz-khas", "saket", "south-delhi", "malviya-nagar", "dlf-phase-3"],
  "greater-kailash": ["defence-colony", "south-delhi", "saket", "kalkaji", "nehru-place"],
  "defence-colony": ["greater-kailash", "lajpat-nagar", "south-delhi", "nehru-place", "kalkaji"],
  "paschim-vihar": ["rohini", "pitampura", "vikaspuri", "west-delhi", "janakpuri"],
  "tilak-nagar": ["rajouri-garden", "janakpuri", "vikaspuri", "west-delhi", "dwarka"],
  "uttam-nagar": ["dwarka", "janakpuri", "vikaspuri", "tilak-nagar", "west-delhi"],
  "nehru-place": ["kalkaji", "greater-kailash", "defence-colony", "south-delhi", "lajpat-nagar"],
  "connaught-place": ["karol-bagh", "kamla-nagar", "north-delhi", "lajpat-nagar", "nehru-place"],
  "lajpat-nagar": ["defence-colony", "nehru-place", "greater-kailash", "south-delhi", "kalkaji"],
  "kalkaji": ["nehru-place", "greater-kailash", "lajpat-nagar", "south-delhi", "faridabad"],
  // NCR
  "noida": ["mayur-vihar", "sector-62-noida", "greater-noida", "indirapuram", "east-delhi"],
  "greater-noida": ["noida", "sector-62-noida", "faridabad", "ghaziabad", "indirapuram"],
  "gurgaon": ["dwarka", "dlf-phase-3", "sohna-road", "vasant-kunj", "south-delhi"],
  "ghaziabad": ["east-delhi", "vaishali", "indirapuram", "laxmi-nagar", "noida"],
  "faridabad": ["kalkaji", "greater-kailash", "south-delhi", "noida", "greater-noida"],
  "indirapuram": ["ghaziabad", "vaishali", "mayur-vihar", "noida", "east-delhi"],
  "vaishali": ["indirapuram", "ghaziabad", "east-delhi", "laxmi-nagar", "preet-vihar"],
  "sector-62-noida": ["noida", "greater-noida", "indirapuram", "mayur-vihar", "ghaziabad"],
  "dlf-phase-3": ["gurgaon", "sohna-road", "dwarka", "vasant-kunj", "south-delhi"],
  "sohna-road": ["gurgaon", "dlf-phase-3", "faridabad", "south-delhi", "dwarka"],
};

export function getNearbyAreas(areaSlug: string): typeof areas {
  const neighbours = areaProximity[areaSlug] || [];
  return neighbours
    .map(slug => areas.find(a => a.slug === slug))
    .filter(Boolean) as typeof areas;
}

// ===== BLOG MATCHING ENGINE =====

interface BlogLink { href: string; title: string; }

const blogIndex: { slug: string; title: string; keywords: string[] }[] = [
  { slug: "tuition-classes-delhi-guide", title: "Best Tuition Classes in Delhi (Complete Guide)", keywords: ["tuition", "delhi", "class", "coaching"] },
  { slug: "home-tutor-delhi-guide", title: "How to Find the Best Home Tutor in Delhi", keywords: ["home tutor", "delhi", "find", "tutor"] },
  { slug: "cbse-study-tips-delhi", title: "CBSE Study Tips for Delhi Students", keywords: ["cbse", "study", "tips", "board"] },
  { slug: "study-techniques-for-students", title: "Effective Study Techniques for Students", keywords: ["study", "techniques", "effective", "students"] },
  { slug: "study-plan-board-exams-delhi", title: "Study Plan for Board Exams in Delhi", keywords: ["board exam", "study plan", "cbse", "icse"] },
  { slug: "personalized-tutoring-delhi", title: "Benefits of Personalized Tutoring in Delhi", keywords: ["personalized", "tutoring", "one-on-one", "benefits"] },
  { slug: "online-vs-home-tuition-delhi", title: "Online vs Home Tuition in Delhi", keywords: ["online", "home tuition", "comparison", "delhi"] },
  { slug: "daily-routine-students-delhi", title: "Daily Routine Tips for Delhi Students", keywords: ["routine", "daily", "students", "time"] },
  { slug: "exam-mistakes-students", title: "Common Exam Mistakes Students Make", keywords: ["exam", "mistakes", "tips", "board"] },
  { slug: "fun-learning-kids", title: "Fun Learning Activities for Kids", keywords: ["fun", "kids", "learning", "activities"] },
];

export function getRelevantBlogs(pageData: SeoPageData): BlogLink[] {
  const seed = hashStr(pageData.slug);
  const subj = pageData.subject?.slug || "";
  const cls = pageData.classLevel?.slug ? parseInt(pageData.classLevel.slug) : 0;
  const intent = pageData.intent || "";

  // Score each blog by relevance
  const scored = blogIndex.map(blog => {
    let score = 0;
    if (intent === "home-vs-online" && blog.slug.includes("online")) score += 5;
    if (intent === "fees" && blog.keywords.includes("tuition")) score += 3;
    if (cls >= 9 && blog.keywords.some(k => k.includes("board") || k.includes("exam"))) score += 3;
    if (cls <= 5 && blog.keywords.some(k => k.includes("kids") || k.includes("fun"))) score += 4;
    if (blog.keywords.includes("tutor") || blog.keywords.includes("tuition")) score += 1;
    if (blog.keywords.includes("study")) score += 1;
    // Add seed-based tiebreaker for variety
    score += (hashStr(blog.slug + pageData.slug) % 3);
    return { ...blog, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 2).map(b => ({ href: `/blog/${b.slug}`, title: b.title }));
}

// ===== ENHANCED INTERNAL LINKING ENGINE =====

interface InternalLink {
  href: string;
  anchor: string;
  category: "subject" | "area" | "intent" | "decision" | "exam" | "blog";
}

export function getSmartInternalLinks(pageData: SeoPageData): InternalLink[] {
  const links: InternalLink[] = [];
  const seen = new Set<string>();
  seen.add(pageData.slug);

  const add = (href: string, anchor: string, category: InternalLink["category"]) => {
    const slug = href.replace(/^\//, "");
    if (!seen.has(slug)) {
      seen.add(slug);
      links.push({ href, anchor, category });
    }
  };

  const seed = hashStr(pageData.slug);
  const area = pageData.area;
  const subj = pageData.subject;
  const cls = pageData.classLevel;
  const classNum = cls?.slug ? parseInt(cls.slug) : 0;

  // === 1. SUBJECT LINKS (3 related subjects, same class & area) ===
  if (area) {
    const shuffled = [...subjects].sort((a, b) => hashStr(a.slug + pageData.slug) - hashStr(b.slug + pageData.slug));
    let count = 0;
    for (const s of shuffled) {
      if (s.slug === subj?.slug) continue;
      const anchor = cls
        ? `${s.name} Tuition for ${cls.label} in ${area.name}`
        : `Best ${s.name} Home Tutor in ${area.name}`;
      const href = cls
        ? `/${s.slug}-tuition-in-${area.slug}-class-${cls.slug}`
        : `/tutors/${s.slug}-${area.slug}-delhi`;
      add(href, anchor, "subject");
      if (++count >= 3) break;
    }
  }

  // === 2. AREA LINKS (5 nearby via proximity graph) ===
  if (area) {
    const nearby = getNearbyAreas(area.slug);
    for (const a of nearby.slice(0, 5)) {
      const anchor = subj
        ? `${subj.name} Home Tutor in ${a.name}`
        : `Home Tuition in ${a.name}`;
      const href = subj
        ? `/tutors/${subj.slug}-${a.slug}-delhi`
        : `/home-tuition-in-${a.slug}`;
      add(href, anchor, "area");
    }
  }

  // === 3. INTENT LINKS (fees, female, near-me) ===
  if (area && pageData.intent !== "fees") {
    add(`/home-tuition-fees-in-${area.slug}`, `Home Tuition Fees in ${area.name}`, "intent");
  }
  if (subj && area && pageData.intent !== "female-tutors") {
    add(`/female-${subj.slug}-home-tutor-${area.slug}`, `Female ${subj.name} Tutor in ${area.name}`, "intent");
  }
  if (subj && pageData.intent !== "near-me") {
    const nearMeClass = cls?.slug || "10";
    add(`/${subj.slug}-home-tutor-near-me-class-${nearMeClass}`, `${subj.name} Tutor Near Me`, "intent");
  }
  if (subj && area && pageData.intent !== "fees") {
    add(`/${subj.slug}-home-tutor-${area.slug}-fees`, `${subj.name} Tuition Fees in ${area.name}`, "intent");
  }

  // === 4. DECISION LINKS ===
  if (area && pageData.intent !== "home-vs-online") {
    add(`/home-vs-online-tuition-${area.slug}`, `Home vs Online Tuition in ${area.name}`, "decision");
  }
  add("/blog/online-vs-home-tuition-delhi", "Online vs Home Tuition — Complete Comparison", "decision");

  // === 5. EXAM LINKS (class 9+) ===
  if (classNum >= 9) {
    if (area) {
      add(`/home-tuition-in-${area.slug}`, `CBSE Board Exam Prep in ${area.name}`, "exam");
    }
    const scienceSlugs = ["math", "physics", "chemistry", "biology", "science"];
    const isScience = subj ? scienceSlugs.includes(subj.slug) : false;
    if (isScience) {
      add(area ? `/jee-coaching-${area.slug}` : "/jee-coaching-near-me", `JEE Coaching${area ? ` in ${area.name}` : " Near Me"}`, "exam");
    }
    if (isScience && subj?.slug !== "math") {
      add(area ? `/neet-coaching-${area.slug}` : "/neet-coaching-near-me", `NEET Coaching${area ? ` in ${area.name}` : " Near Me"}`, "exam");
    }
    if (classNum >= 11) {
      add(area ? `/cuet-coaching-${area.slug}` : "/cuet-coaching-near-me", `CUET Preparation${area ? ` in ${area.name}` : ""}`, "exam");
    }
  }

  // === 6. BLOG LINKS (1-2 relevant) ===
  const blogs = getRelevantBlogs(pageData);
  for (const b of blogs) {
    add(b.href, b.title, "blog");
  }

  return links;
}

// Keep legacy function for backward compat
export function getRelatedLinks(pageData: SeoPageData): { href: string; anchor: string }[] {
  return getSmartInternalLinks(pageData).map(l => ({ href: l.href, anchor: l.anchor }));
}

// ===== OPTIMIZED META GENERATOR =====

export function getOptimizedMeta(pageData: SeoPageData): { title: string; description: string } {
  const subj = pageData.subject?.name;
  const area = pageData.area?.name;
  const cls = pageData.classLevel?.label;
  const board = pageData.board?.name;
  const seed = hashStr(pageData.slug);

  let title = "";

  // Money pages
  if (pageData.type === "tuition-fees-area") {
    title = `Home Tuition Fees in ${area} (2025) | Tutors Parliament`;
  } else if (pageData.type === "top-tutors-area") {
    title = `Top 10 Home Tutors in ${area}, Delhi | Tutors Parliament`;
  }
  // Board-specific
  else if (subj && area && cls && board) {
    title = `${subj} ${board} Tutor ${area} ${cls} | Tutors Parliament`;
  }
  // Intent pages
  else if (pageData.type === "female-subject-area") {
    title = `Female ${subj} Tutor in ${area} | Tutors Parliament`;
  } else if (pageData.type === "subject-near-me-class") {
    title = `${subj} Home Tutor Near Me — ${cls} | Tutors Parliament`;
  } else if (pageData.type === "home-vs-online-area") {
    title = `Home vs Online Tuition ${area} | Tutors Parliament`;
  } else if (pageData.type === "subject-area-fees") {
    title = `${subj} Tutor Fees in ${area} | Tutors Parliament`;
  }
  // Standard pages
  else if (subj && area && cls) {
    title = `${subj} Home Tutor in ${area} for ${cls} | Tutors Parliament`;
  } else if (subj && area) {
    title = `Best ${subj} Home Tutor in ${area}, Delhi | Tutors Parliament`;
  } else if (area) {
    const variants = [
      `Best Home Tutors in ${area}, Delhi | Tutors Parliament`,
      `Home Tuition in ${area} — Verified Tutors | Tutors Parliament`,
      `Top Home Tutors in ${area}, Delhi | Tutors Parliament`,
    ];
    title = pick(variants, seed);
  } else if (subj) {
    title = `Best ${subj} Home Tutors in Delhi | Tutors Parliament`;
  } else {
    title = pageData.title;
  }

  if (title.length > 65) title = title.slice(0, 62) + "...";

  const descVariants = [
    `Find verified ${subj || "home"} tutors${area ? ` in ${area}` : " in Delhi"}${cls ? ` for ${cls}` : ""}${board ? ` (${board})` : ""}. Affordable fees, free demo. Book now!`,
    `Top-rated ${subj || "home"} tuition${area ? ` in ${area}` : ""}${cls ? ` for ${cls}` : ""}${board ? `, ${board}` : ""}. 4.8★ rated, verified tutors. Free demo!`,
    `Experienced ${subj || "home"} tutors${area ? ` in ${area}` : ""}${cls ? ` for ${cls}` : ""}. Personalized learning, all boards. Book a free demo!`,
    `Looking for ${subj || "home"} tuition${area ? ` in ${area}` : ""}${cls ? ` (${cls})` : ""}? Verified tutors, 10K+ students. Free demo!`,
  ];
  let desc = pick(descVariants, seed);
  if (desc.length > 160) desc = desc.slice(0, 157) + "...";

  return { title, description: desc };
}
