// ===== PROGRAMMATIC SEO DATASET =====
// Extend arrays to auto-generate 500+ pages with ZERO per-page AI tokens

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
  // High ROI sub-areas
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

export type PageType = "subject" | "area" | "subject-area" | "area-tuition" | "area-pincode" | "subject-class-area" | "best-tutors-area";

export interface SeoPageData {
  type: PageType;
  slug: string;
  subject?: { slug: string; name: string };
  area?: { slug: string; name: string; pincode: string };
  classLevel?: { slug: string; name: string; label: string };
  keyword: string;
  title: string;
  metaDescription: string;
  h1: string;
}

// Intro paragraph templates — rotated by index to reduce duplication
const introTemplates = [
  (kw: string, city: string, pincode?: string) =>
    `Looking for the ${kw} in ${city}${pincode ? ` (${pincode})` : ""}? Tutors Parliament connects students with experienced, verified home tutors who deliver personalized learning. Whether your child needs help with board exams, competitive prep, or building a strong foundation — our tutors are ready to help.`,
  (kw: string, city: string, pincode?: string) =>
    `Tutors Parliament is your trusted source for ${kw} in ${city}${pincode ? ` (${pincode})` : ""}. Our handpicked educators specialize in CBSE, ICSE, and state board curricula, providing one-on-one attention that classroom teaching simply cannot match. Book a free demo class today.`,
  (kw: string, city: string, pincode?: string) =>
    `Finding the right ${kw} in ${city}${pincode ? `, pincode ${pincode}` : ""} can be overwhelming. At Tutors Parliament, we make it simple — browse verified tutor profiles, check ratings, and schedule a free demo. Join 10,000+ students already learning with us across Delhi NCR.`,
  (kw: string, city: string, pincode?: string) =>
    `Need a reliable ${kw} near ${city}${pincode ? ` (${pincode})` : ""}? Our platform matches you with qualified, background-verified tutors in your locality. Flexible timings, affordable fees, and a free demo class — start your child's learning journey today.`,
  (kw: string, city: string, pincode?: string) =>
    `Discover top-rated ${kw} in ${city}${pincode ? ` — ${pincode}` : ""}. Tutors Parliament offers expert home tuition for all boards and competitive exams. Personalized attention, proven results, and a 4.8★ average rating from thousands of happy families.`,
];

// FAQ templates — each returns 4 Q&A pairs
const faqTemplates = [
  (kw: string, area?: string, cls?: string) => [
    { q: `How do I find the best ${kw}?`, a: `Tutors Parliament provides verified, experienced tutors${area ? ` in ${area}` : ""}${cls ? ` for ${cls}` : ""}. Browse profiles, check ratings, and book a free demo to find the perfect match.` },
    { q: `What subjects are covered by ${kw}?`, a: `Our tutors cover all major subjects including Maths, Science, English, Hindi, Accounts, Economics, and more for CBSE, ICSE & state boards.` },
    { q: `Are demo classes available?`, a: `Yes! We offer a completely free demo class so you can evaluate the tutor's teaching style before committing.` },
    { q: `What is the fee for ${kw}?`, a: `Fees vary based on subject, class, and experience level. Contact us for a personalized quote — we have options for every budget.` },
  ],
  (kw: string, area?: string, cls?: string) => [
    { q: `Why choose Tutors Parliament for ${kw}?`, a: `With 10,000+ students, 4.8★ ratings, and verified tutors, Tutors Parliament is Delhi's most trusted home tuition platform${area ? ` serving ${area}` : ""}.` },
    { q: `Do you provide online classes${cls ? ` for ${cls}` : ""}?`, a: `Yes, we offer both home tuition and online classes. Students can learn from anywhere with our flexible scheduling options.` },
    { q: `How are tutors verified?`, a: `Every tutor goes through a rigorous screening process including background checks, qualification verification, and demo class evaluation.` },
    { q: `Can I change my tutor?`, a: `Absolutely. If you're not satisfied, we'll assign a new tutor at no extra cost until you find the right fit.` },
  ],
  (kw: string, area?: string, cls?: string) => [
    { q: `How quickly can I get a ${kw}?`, a: `We typically match you with a suitable tutor within 24–48 hours${area ? ` in ${area}` : ""}. Book a free demo to get started immediately.` },
    { q: `What boards do your tutors cover${area ? ` in ${area}` : ""}?`, a: `Our tutors are experienced in CBSE, ICSE, IGCSE, IB, and all state boards${cls ? ` for ${cls}` : ""}.` },
    { q: `Is there a registration fee?`, a: `No, there is no registration fee. You only pay for the tuition sessions. Plus, the first demo class is completely free.` },
    { q: `Do you offer group tuition${area ? ` in ${area}` : ""}?`, a: `We primarily focus on one-on-one home tuition for maximum attention, but small group sessions (2-3 students) can be arranged on request.` },
  ],
];

export function getIntro(keyword: string, city: string, index: number, pincode?: string): string {
  return introTemplates[index % introTemplates.length](keyword, city, pincode);
}

export function getFaqs(keyword: string, area: string | undefined, index: number, cls?: string) {
  return faqTemplates[index % faqTemplates.length](keyword, area, cls);
}

// ===== SLUG PARSERS =====

// New URL patterns:
// home-tuition-in-{area}
// home-tuition-in-{area}-{pincode}
// {subject}-tuition-in-{area}-class-{class}
// best-home-tutors-in-{area}

function findArea(areaSlug: string) {
  return areas.find(a => a.slug === areaSlug);
}
function findSubject(subjSlug: string) {
  return subjects.find(s => s.slug === subjSlug);
}
function findClass(clsSlug: string) {
  return classes.find(c => c.slug === clsSlug);
}

export function parseNewSlug(slug: string): SeoPageData | null {
  // Pattern: best-home-tutors-in-{area}
  const bestMatch = slug.match(/^best-home-tutors-in-(.+)$/);
  if (bestMatch) {
    const area = findArea(bestMatch[1]);
    if (area) {
      const keyword = `Best Home Tutors in ${area.name}`;
      return {
        type: "best-tutors-area",
        slug,
        area,
        keyword,
        title: `${keyword}, Delhi | Tutors Parliament`,
        metaDescription: `Find the best home tutors in ${area.name}, Delhi (${area.pincode}). Verified tutors for all subjects and boards. Book a free demo today!`,
        h1: keyword,
      };
    }
  }

  // Pattern: {subject}-tuition-in-{area}-class-{class}
  const subClassMatch = slug.match(/^(.+)-tuition-in-(.+)-class-(.+)$/);
  if (subClassMatch) {
    const subj = findSubject(subClassMatch[1]);
    const area = findArea(subClassMatch[2]);
    const cls = findClass(subClassMatch[3]);
    if (subj && area && cls) {
      const keyword = `${subj.name} Tuition in ${area.name} for ${cls.label}`;
      return {
        type: "subject-class-area",
        slug,
        subject: subj,
        area,
        classLevel: cls,
        keyword,
        title: `${subj.name} Home Tuition in ${area.name} for ${cls.label} | Tutors Parliament`,
        metaDescription: `Expert ${subj.name} home tuition in ${area.name} (${area.pincode}) for ${cls.label} students. CBSE/ICSE. Book a free demo today!`,
        h1: `${subj.name} Home Tuition in ${area.name} for ${cls.label}`,
      };
    }
  }

  // Pattern: home-tuition-in-{area}-{pincode}
  const pinMatch = slug.match(/^home-tuition-in-(.+)-(\d{6})$/);
  if (pinMatch) {
    const area = findArea(pinMatch[1]);
    if (area) {
      const pincode = pinMatch[2];
      const keyword = `Home Tuition in ${area.name} ${pincode}`;
      return {
        type: "area-pincode",
        slug,
        area: { ...area, pincode },
        keyword,
        title: `Home Tuition in ${area.name} (${pincode}) | Tutors Parliament`,
        metaDescription: `Looking for home tuition in ${area.name}, ${pincode}? Verified tutors for all subjects. CBSE, ICSE & state boards. Book a free demo!`,
        h1: `Home Tuition in ${area.name} — ${pincode}`,
      };
    }
  }

  // Pattern: home-tuition-in-{area}
  const tuitionMatch = slug.match(/^home-tuition-in-(.+)$/);
  if (tuitionMatch) {
    const area = findArea(tuitionMatch[1]);
    if (area) {
      const keyword = `Home Tuition in ${area.name}`;
      return {
        type: "area-tuition",
        slug,
        area,
        keyword,
        title: `Home Tuition in ${area.name}, Delhi | Tutors Parliament`,
        metaDescription: `Find expert home tuition in ${area.name}, Delhi (${area.pincode}). All subjects, all boards. Book a free demo class today!`,
        h1: `Home Tuition in ${area.name}, Delhi`,
      };
    }
  }

  return null;
}

// Legacy slug parser (existing patterns)
export function parseSlug(slug: string): SeoPageData | null {
  // Try new patterns first
  const newResult = parseNewSlug(slug);
  if (newResult) return newResult;

  // Try subject-area-delhi pattern
  for (const subj of subjects) {
    for (const area of areas) {
      if (slug === `${subj.slug}-${area.slug}-delhi`) {
        const keyword = `${subj.name} Home Tutor in ${area.name}, Delhi`;
        return {
          type: "subject-area",
          slug,
          subject: subj,
          area,
          keyword,
          title: `Best ${subj.name} Home Tutor in ${area.name}, Delhi | Tutors Parliament`,
          metaDescription: `Find the best ${subj.name} home tutor in ${area.name}, Delhi. Verified tutors, personalized classes for CBSE/ICSE. Book a free demo today!`,
          h1: `Best ${subj.name} Home Tutor in ${area.name}, Delhi`,
        };
      }
    }
  }

  // Try area-delhi pattern
  for (const area of areas) {
    if (slug === `${area.slug}-delhi`) {
      const keyword = `Home Tutor in ${area.name}, Delhi`;
      return {
        type: "area",
        slug,
        area,
        keyword,
        title: `Best Home Tutors in ${area.name}, Delhi | Tutors Parliament`,
        metaDescription: `Looking for home tutors in ${area.name}, Delhi? Verified tutors for all subjects, CBSE & ICSE. Book a free demo class today!`,
        h1: `Best Home Tutors in ${area.name}, Delhi`,
      };
    }
  }

  // Try subject-delhi pattern
  for (const subj of subjects) {
    if (slug === `${subj.slug}-delhi`) {
      const keyword = `${subj.name} Home Tutor in Delhi`;
      return {
        type: "subject",
        slug,
        subject: subj,
        keyword,
        title: `Best ${subj.name} Home Tutors in Delhi | Tutors Parliament`,
        metaDescription: `Find experienced ${subj.name} home tutors in Delhi. One-on-one tuition for CBSE, ICSE & state boards. Book a free demo today!`,
        h1: `Best ${subj.name} Home Tutors in Delhi`,
      };
    }
  }

  return null;
}

// Generate all possible slugs (for sitemap — HIGH ROI only)
export function getAllSlugs(): string[] {
  const slugs: string[] = [];

  // === LEGACY PATTERNS ===
  // Subject-delhi (13 pages)
  for (const subj of subjects) {
    slugs.push(`${subj.slug}-delhi`);
  }
  // Area-delhi (30 pages)
  for (const area of areas) {
    slugs.push(`${area.slug}-delhi`);
  }
  // Subject-area-delhi — top 6x6 combos (36 pages)
  const topSubjects = subjects.slice(0, 6);
  const topAreas = areas.slice(0, 10);
  for (const subj of topSubjects) {
    for (const area of topAreas.slice(0, 6)) {
      slugs.push(`${subj.slug}-${area.slug}-delhi`);
    }
  }

  // === NEW PATTERNS ===
  // home-tuition-in-{area} (30 pages)
  for (const area of areas) {
    slugs.push(`home-tuition-in-${area.slug}`);
  }
  // home-tuition-in-{area}-{pincode} — top 15 areas (15 pages)
  for (const area of areas.slice(0, 15)) {
    slugs.push(`home-tuition-in-${area.slug}-${area.pincode}`);
  }
  // best-home-tutors-in-{area} — top 15 (15 pages)
  for (const area of areas.slice(0, 15)) {
    slugs.push(`best-home-tutors-in-${area.slug}`);
  }
  // {subject}-tuition-in-{area}-class-{class} — top 6 subjects x 10 areas x key classes (180 pages)
  const highRoiClasses = classes.filter(c => ["8", "9", "10", "11", "12"].includes(c.slug));
  for (const subj of topSubjects) {
    for (const area of topAreas) {
      for (const cls of highRoiClasses) {
        slugs.push(`${subj.slug}-tuition-in-${area.slug}-class-${cls.slug}`);
      }
    }
  }

  return slugs;
}
