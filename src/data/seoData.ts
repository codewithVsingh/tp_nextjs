// ===== PROGRAMMATIC SEO DATASET =====
// Extend these arrays to auto-generate new pages

export const areas = [
  { slug: "rohini", name: "Rohini" },
  { slug: "dwarka", name: "Dwarka" },
  { slug: "laxmi-nagar", name: "Laxmi Nagar" },
  { slug: "janakpuri", name: "Janakpuri" },
  { slug: "pitampura", name: "Pitampura" },
  { slug: "karol-bagh", name: "Karol Bagh" },
  { slug: "rajouri-garden", name: "Rajouri Garden" },
  { slug: "vikaspuri", name: "Vikaspuri" },
  { slug: "mayur-vihar", name: "Mayur Vihar" },
  { slug: "ashok-vihar", name: "Ashok Vihar" },
  { slug: "south-delhi", name: "South Delhi" },
  { slug: "north-delhi", name: "North Delhi" },
  { slug: "east-delhi", name: "East Delhi" },
  { slug: "west-delhi", name: "West Delhi" },
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

export type PageType = "subject" | "area" | "subject-area";

export interface SeoPageData {
  type: PageType;
  slug: string;
  subject?: { slug: string; name: string };
  area?: { slug: string; name: string };
  keyword: string;
  title: string;
  metaDescription: string;
  h1: string;
}

// Intro paragraph templates — rotated by index to reduce duplication
const introTemplates = [
  (kw: string, city: string) =>
    `Looking for the ${kw} in ${city}? Tutors Parliament connects students with experienced, verified home tutors who deliver personalized learning. Whether your child needs help with board exams, competitive prep, or building a strong foundation — our tutors are ready to help.`,
  (kw: string, city: string) =>
    `Tutors Parliament is your trusted source for ${kw} in ${city}. Our handpicked educators specialize in CBSE, ICSE, and state board curricula, providing one-on-one attention that classroom teaching simply cannot match. Book a free demo class today.`,
  (kw: string, city: string) =>
    `Finding the right ${kw} in ${city} can be overwhelming. At Tutors Parliament, we make it simple — browse verified tutor profiles, check ratings, and schedule a free demo. Join 8500+ students already learning with us across Delhi NCR.`,
];

// FAQ templates — each returns 4 Q&A pairs
const faqTemplates = [
  (kw: string, area?: string) => [
    { q: `How do I find the best ${kw}?`, a: `Tutors Parliament provides verified, experienced tutors${area ? ` in ${area}` : ""}. Browse profiles, check ratings, and book a free demo to find the perfect match.` },
    { q: `What subjects are covered by ${kw}?`, a: `Our tutors cover all major subjects including Maths, Science, English, Hindi, Accounts, Economics, and more for CBSE, ICSE & state boards.` },
    { q: `Are demo classes available?`, a: `Yes! We offer a completely free demo class so you can evaluate the tutor's teaching style before committing.` },
    { q: `What is the fee for ${kw}?`, a: `Fees vary based on subject, class, and experience level. Contact us for a personalized quote — we have options for every budget.` },
  ],
  (kw: string, area?: string) => [
    { q: `Why choose Tutors Parliament for ${kw}?`, a: `With 8500+ students, 4.8★ ratings, and verified tutors, Tutors Parliament is Delhi's most trusted home tuition platform${area ? ` serving ${area}` : ""}.` },
    { q: `Do you provide online classes?`, a: `Yes, we offer both home tuition and online classes. Students can learn from anywhere with our flexible scheduling options.` },
    { q: `How are tutors verified?`, a: `Every tutor goes through a rigorous screening process including background checks, qualification verification, and demo class evaluation.` },
    { q: `Can I change my tutor?`, a: `Absolutely. If you're not satisfied, we'll assign a new tutor at no extra cost until you find the right fit.` },
  ],
];

export function getIntro(keyword: string, city: string, index: number): string {
  return introTemplates[index % introTemplates.length](keyword, city);
}

export function getFaqs(keyword: string, area: string | undefined, index: number) {
  return faqTemplates[index % faqTemplates.length](keyword, area);
}

// Parse slug into page data
export function parseSlug(slug: string): SeoPageData | null {
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

// Generate all possible slugs (for sitemap + internal linking)
export function getAllSlugs(): string[] {
  const slugs: string[] = [];
  
  // Subject-delhi
  for (const subj of subjects) {
    slugs.push(`${subj.slug}-delhi`);
  }
  
  // Area-delhi
  for (const area of areas) {
    slugs.push(`${area.slug}-delhi`);
  }
  
  // Subject-area-delhi (top combinations only for initial launch)
  const topSubjects = subjects.slice(0, 6);
  const topAreas = areas.slice(0, 6);
  for (const subj of topSubjects) {
    for (const area of topAreas) {
      slugs.push(`${subj.slug}-${area.slug}-delhi`);
    }
  }
  
  return slugs;
}
