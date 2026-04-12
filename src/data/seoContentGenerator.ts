// ===== DYNAMIC CONTENT GENERATOR =====
// Generates unique, varied content for SEO pages using deterministic seed-based selection.
// Ensures 30%+ variation across pages with zero runtime cost.

import { areas, subjects, classes, type SeoPageData } from "./seoData";

// ===== HASH FUNCTION (deterministic variation) =====
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
    `What sets our ${subj} tutors apart in ${area} is the rigorous vetting process — every educator is background-verified, qualification-checked, and demo-evaluated before joining our platform. ${cls ? `For ${cls}, ` : ""}We focus on building conceptual understanding through worksheets, mock tests, and chapter-wise analysis, ensuring students don't just pass exams but genuinely master the subject.`,
  (subj: string, area: string, cls: string) =>
    `Our ${area}-based ${subj} tutors bring an average of 5+ years of teaching experience${cls ? ` with specific expertise in ${cls} curriculum` : ""}. Fees start from ₹300–₹800 per hour depending on grade and subject complexity, making quality education accessible. Every session is structured around weak-area identification, concept reinforcement, and timed practice.`,
  (subj: string, area: string, cls: string) =>
    `Choosing Tutors Parliament for ${subj} tuition in ${area} means access to flexible scheduling (morning, afternoon, or evening slots), both online and offline modes, and a satisfaction guarantee — if you're not happy with your tutor, we'll match you with another at no extra cost${cls ? `, ensuring ${cls} students never lose momentum` : ""}.`,
  (subj: string, area: string, cls: string) =>
    `Families in ${area} choose us because our ${subj} tutors don't just teach — they mentor${cls ? ` ${cls} students` : ""}. From helping with school assignments and project work to preparing for unit tests and board exams, our educators become a reliable academic partner. Fees are transparent, with no hidden registration charges.`,
  (subj: string, area: string, cls: string) =>
    `With 10,000+ students already learning through Tutors Parliament, our ${subj} tutors in ${area} have a proven track record of grade improvements${cls ? ` for ${cls}` : ""}. Parents appreciate our regular progress reports, parent-teacher communication, and the flexibility to adjust session frequency as exams approach.`,
];

const closingParagraphs = [
  (subj: string, area: string, cls: string) =>
    `Don't let another exam season go by without the right ${subj} support${cls ? ` for your ${cls} child` : ""}. Book a free demo class in ${area} today and see the Tutors Parliament difference — experienced tutors, proven methods, and results that speak for themselves. Join 10,000+ happy families across Delhi NCR.`,
  (subj: string, area: string, cls: string) =>
    `Your child's academic journey in ${subj} deserves personalised attention${cls ? ` — especially at the ${cls} level where foundations are critical` : ""}. Start with a complimentary demo session in ${area}, meet your tutor, and experience quality tuition before committing. No registration fee, no obligation.`,
  (subj: string, area: string, cls: string) =>
    `Ready to transform your child's ${subj} performance${cls ? ` in ${cls}` : ""}? Connect with a verified tutor in ${area} within 24 hours. With 4.8★ average ratings, flexible scheduling, and coverage of CBSE, ICSE, IB, and state boards, Tutors Parliament is Delhi's most trusted home tuition platform.`,
  (subj: string, area: string, cls: string) =>
    `From foundation building to board exam excellence, our ${subj} tutors in ${area} deliver measurable results${cls ? ` for ${cls} students` : ""}. Take the first step — schedule your free demo class now and join thousands of families who chose smarter, personalised learning with Tutors Parliament.`,
  (subj: string, area: string, cls: string) =>
    `Whether preparing for boards, olympiads, or entrance exams, the right ${subj} tutor makes all the difference${cls ? ` at the ${cls} stage` : ""}. In ${area}, Tutors Parliament is the go-to choice for verified, experienced, and passionate educators. Book your free demo and experience it first-hand.`,
];

export function getEnrichedContent(pageData: SeoPageData): { intro: string; value: string; closing: string } {
  const seed = hashStr(pageData.slug);
  const subj = pageData.subject?.name || "Home Tuition";
  const area = pageData.area?.name || "Delhi";
  const cls = pageData.classLevel?.label || "";
  const pin = pageData.area?.pincode || "";

  return {
    intro: pick(introParagraphs, seed)(subj, area, cls, pin),
    value: pick(valueParagraphs, seed + 1)(subj, area, cls),
    closing: pick(closingParagraphs, seed + 2)(subj, area, cls),
  };
}

// ===== ENRICHED FAQ GENERATOR (5 per page, highly varied) =====

const faqPool = [
  (kw: string, area: string, cls: string) => ({ q: `What is the fee for ${kw}?`, a: `Fees for ${kw} typically range from ₹300 to ₹800 per hour, depending on the subject, class level${cls ? ` (${cls})` : ""}, and tutor experience. Contact us for a personalised quote — the first demo class is always free.` }),
  (kw: string, area: string, cls: string) => ({ q: `Are female tutors available${area ? ` in ${area}` : ""}?`, a: `Yes, we have a large pool of qualified female tutors available${area ? ` in ${area}` : ""} for home tuition. You can specify your preference when booking, and we'll match accordingly.` }),
  (kw: string, area: string, cls: string) => ({ q: `Which subjects are covered${cls ? ` for ${cls}` : ""}?`, a: `Our tutors cover all major subjects including Maths, Science, English, Hindi, Social Studies, Accounts, Economics, and more${cls ? ` for ${cls}` : ""}. We support CBSE, ICSE, IGCSE, IB, and state board curricula.` }),
  (kw: string, area: string, cls: string) => ({ q: `Is home tuition better than coaching classes?`, a: `Home tuition offers personalised attention, flexible scheduling, and curriculum-specific teaching that group coaching cannot match. Students typically show 20–30% faster improvement with one-on-one tuition, especially${cls ? ` in ${cls}` : ""} for board exam preparation.` }),
  (kw: string, area: string, cls: string) => ({ q: `How quickly can I get a tutor${area ? ` in ${area}` : ""}?`, a: `We typically match you with a suitable tutor within 24–48 hours${area ? ` in ${area}` : ""}. After booking a free demo, our team reviews your requirements and assigns the best-fit educator promptly.` }),
  (kw: string, area: string, cls: string) => ({ q: `Do you provide online classes as well?`, a: `Absolutely! We offer both home tuition and online classes. Students can learn from anywhere with our flexible scheduling — morning, afternoon, or evening slots available${cls ? ` for ${cls}` : ""}.` }),
  (kw: string, area: string, cls: string) => ({ q: `How are your tutors verified?`, a: `Every tutor goes through a multi-step verification process including identity checks, qualification verification, background screening, and a demo teaching evaluation before being listed on our platform.` }),
  (kw: string, area: string, cls: string) => ({ q: `Can I change my tutor if I'm not satisfied?`, a: `Yes, tutor replacement is free. If you or your child aren't satisfied after the initial sessions, we'll assign a new tutor at no additional cost until you find the perfect match.` }),
  (kw: string, area: string, cls: string) => ({ q: `Do tutors help with homework and assignments?`, a: `Yes, our tutors assist with daily homework, school projects, and assignments as part of regular sessions${cls ? ` for ${cls} students` : ""}. They also provide additional practice worksheets and mock tests for exam preparation.` }),
  (kw: string, area: string, cls: string) => ({ q: `What boards do your tutors cover${area ? ` in ${area}` : ""}?`, a: `Our tutors are experienced in CBSE, ICSE, IGCSE, IB, and all state boards. Whether your school follows NCERT or a custom syllabus, we have tutors who specialise in your specific board.` }),
  (kw: string, area: string, cls: string) => ({ q: `Is there a registration fee to join?`, a: `No, there is zero registration fee. You only pay for the tuition sessions you take. The first demo class is completely free with no obligation to continue.` }),
  (kw: string, area: string, cls: string) => ({ q: `Do you offer group tuition${area ? ` in ${area}` : ""}?`, a: `We primarily focus on one-on-one home tuition for maximum attention, but small group sessions (2–3 students) can be arranged on request${area ? ` in ${area}` : ""}. Group tuition is available at discounted rates.` }),
];

export function getEnrichedFaqs(pageData: SeoPageData): { q: string; a: string }[] {
  const seed = hashStr(pageData.slug);
  const kw = pageData.keyword;
  const area = pageData.area?.name || "";
  const cls = pageData.classLevel?.label || "";
  
  // Pick 5 unique FAQs based on seed
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

// ===== INTERNAL LINKING ENGINE =====

interface InternalLink {
  href: string;
  anchor: string;
}

export function getRelatedLinks(pageData: SeoPageData): InternalLink[] {
  const links: InternalLink[] = [];
  const currentSlug = pageData.slug;
  const seen = new Set<string>();
  seen.add(currentSlug);

  const addLink = (href: string, anchor: string) => {
    const slug = href.replace(/^\//, "");
    if (!seen.has(slug) && links.length < 10) {
      seen.add(slug);
      links.push({ href, anchor });
    }
  };

  // 1. Same area, different subjects
  if (pageData.area) {
    const shuffledSubjects = [...subjects].sort((a, b) => hashStr(a.slug + currentSlug) - hashStr(b.slug + currentSlug));
    for (const s of shuffledSubjects) {
      if (s.slug === pageData.subject?.slug) continue;
      addLink(`/tutors/${s.slug}-${pageData.area.slug}-delhi`, `${s.name} Home Tutor in ${pageData.area.name}`);
      if (links.length >= 3) break;
    }
  }

  // 2. Same subject, nearby areas
  if (pageData.subject) {
    const shuffledAreas = [...areas].sort((a, b) => hashStr(a.slug + currentSlug) - hashStr(b.slug + currentSlug));
    for (const a of shuffledAreas) {
      if (a.slug === pageData.area?.slug) continue;
      addLink(`/tutors/${pageData.subject.slug}-${a.slug}-delhi`, `${pageData.subject.name} Tutor in ${a.name}`);
      if (links.length >= 6) break;
    }
  }

  // 3. Same subject + area, different class
  if (pageData.subject && pageData.area) {
    for (const c of classes.filter(c => ["9", "10", "11", "12"].includes(c.slug) && c.slug !== pageData.classLevel?.slug)) {
      addLink(`/${pageData.subject.slug}-tuition-in-${pageData.area.slug}-class-${c.slug}`, `${pageData.subject.name} Tuition for ${c.label} in ${pageData.area.name}`);
      if (links.length >= 8) break;
    }
  }

  // 4. Area tuition & best tutors links
  if (pageData.area) {
    addLink(`/home-tuition-in-${pageData.area.slug}`, `Home Tuition in ${pageData.area.name}`);
    addLink(`/best-home-tutors-in-${pageData.area.slug}`, `Best Home Tutors in ${pageData.area.name}`);
  }

  // 5. Nearby pincodes
  if (pageData.area) {
    const nearby = areas.filter(a => a.slug !== pageData.area?.slug).slice(0, 2);
    for (const a of nearby) {
      addLink(`/home-tuition-in-${a.slug}-${a.pincode}`, `Home Tuition in ${a.name} (${a.pincode})`);
    }
  }

  return links.slice(0, 10);
}

// ===== OPTIMIZED META GENERATOR =====

export function getOptimizedMeta(pageData: SeoPageData): { title: string; description: string } {
  const subj = pageData.subject?.name;
  const area = pageData.area?.name;
  const cls = pageData.classLevel?.label;
  const seed = hashStr(pageData.slug);

  // Title: max 60 chars, keyword + area + intent
  let title = "";
  if (subj && area && cls) {
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
  // Truncate to 60 chars
  if (title.length > 65) title = title.slice(0, 62) + "...";

  // Description: 140-160 chars with benefit + trust + CTA
  let desc = "";
  const descVariants = [
    `Find verified ${subj || "home"} tutors${area ? ` in ${area}` : " in Delhi"}${cls ? ` for ${cls}` : ""}. Affordable fees, CBSE/ICSE experts, free demo class. Book now!`,
    `Top-rated ${subj || "home"} tuition${area ? ` in ${area}` : ""}${cls ? ` for ${cls}` : ""}. 4.8★ rated, background-verified tutors. Free demo available — start today!`,
    `Experienced ${subj || "home"} tutors${area ? ` in ${area}` : " in Delhi"}${cls ? ` for ${cls}` : ""}. Personalized learning, all boards covered. Book a free demo!`,
    `Looking for ${subj || "home"} tuition${area ? ` in ${area}` : ""}${cls ? ` (${cls})` : ""}? Verified tutors, flexible timings, 10K+ happy students. Free demo!`,
  ];
  desc = pick(descVariants, seed);
  if (desc.length > 160) desc = desc.slice(0, 157) + "...";

  return { title, description: desc };
}
