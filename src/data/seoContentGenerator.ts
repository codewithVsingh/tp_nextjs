// ===== DYNAMIC CONTENT GENERATOR 2.0 =====
// Generates unique, varied content for all SEO page types including money pages,
// board-specific pages, and intent-based pages.

import { areas, subjects, classes, boards, services, type SeoPageData } from "./seoData";

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

// ===== SERVICE PAGE CONTENT =====

const serviceIntros: Record<string, (area: string) => string> = {
  academic: (area) => `Parents in ${area} looking for reliable academic support trust Tutors Parliament to connect them with experienced, verified home tutors. Whether your child needs daily homework help, exam preparation, or foundational learning support, our educators deliver personalized one-on-one sessions right at your doorstep — or online.`,
  skill: (area) => `Give your child a competitive edge with skill-based classes in ${area}. From coding and robotics to chess and public speaking, Tutors Parliament offers curated programs taught by certified instructors who make learning fun, interactive, and result-oriented.`,
  hobby: (area) => `Nurture your child's creativity and passion with hobby and activity classes in ${area}. Our verified instructors bring professional-grade teaching in dance, music, art, and more — available at home or in small group settings with flexible scheduling.`,
  early: (area) => `The early years are the most critical for your child's development. In ${area}, Tutors Parliament provides specialized early learning programs — from phonics and Montessori methods to KG-level tutoring — designed by child education experts to build strong foundations.`,
  behavioral: (area) => `Every child deserves the right support. In ${area}, our network of certified special education tutors, speech therapists, and learning disability specialists provide compassionate, individualized support tailored to your child's unique needs.`,
  discovery: (area) => `Finding the right tutor in ${area} just got easier. Tutors Parliament's verified educator network covers every subject, board, and schedule preference — giving parents complete peace of mind with background-checked, rated professionals.`,
};

const serviceValues: Record<string, (area: string) => string> = {
  academic: (area) => `Our academic tutors in ${area} don't just help with syllabus completion — they build conceptual clarity, develop problem-solving skills, and create customized study plans. With regular assessments, parent progress reports, and flexible scheduling (morning, afternoon, or evening), families get a complete learning partner.`,
  skill: (area) => `Skill-based programs at Tutors Parliament go beyond theory. In ${area}, our instructors use project-based learning, hands-on activities, and age-appropriate curriculum to ensure your child develops real-world skills. Small batch sizes ensure personalized attention.`,
  hobby: (area) => `Our hobby instructors in ${area} are professionally trained artists, musicians, and performers who bring passion to every session. Whether your child is a beginner or looking to advance, we match them with the right mentor for their skill level and interest.`,
  early: (area) => `Early learning at Tutors Parliament in ${area} follows internationally recognized methodologies. Our KG tutors and early childhood educators are trained in Montessori, Jolly Phonics, and play-based learning approaches — ensuring your child develops cognitive, motor, and social skills naturally.`,
  behavioral: (area) => `Our special education professionals in ${area} hold certifications in remedial education, speech-language pathology, and behavioral therapy. They create individualized education plans (IEPs) and work closely with parents to track measurable progress.`,
  discovery: (area) => `Every tutor on our platform serving ${area} undergoes a rigorous 4-step verification: identity check, qualification verification, criminal background screening, and a demo teaching evaluation. Parents can browse profiles, read ratings, and book a free trial session before committing.`,
};

const serviceClosings: Record<string, (area: string) => string> = {
  academic: (area) => `Don't let your child fall behind. Book a free demo class in ${area} today and see how personalized home tutoring can transform their academic performance. 4.8★ average rating, 10K+ students served.`,
  skill: (area) => `Ready to unlock your child's potential? Try a free demo session in ${area} and discover the difference expert skill-based coaching makes. No registration fee, no commitment.`,
  hobby: (area) => `Let your child explore their creative side. Book a free trial class in ${area} today — no registration fee, flexible scheduling, and experienced instructors who make learning joyful.`,
  early: (area) => `Give your little one the best start. Schedule a free demo session in ${area} with one of our certified early childhood educators. Age-appropriate, engaging, and designed to build confidence.`,
  behavioral: (area) => `Take the first step toward better support. Book a free consultation in ${area} with a qualified specialist. Compassionate, professional, and tailored to your child's needs.`,
  discovery: (area) => `Find your perfect tutor match in ${area} within 24 hours. Free demo class, no registration fee, and a satisfaction guarantee. Join 10,000+ happy families across Delhi NCR.`,
};

function getServiceIntro(svc: typeof services[number], area: string, seed: number): string {
  return (serviceIntros[svc.category] || serviceIntros.academic)(area);
}
function getServiceValue(svc: typeof services[number], area: string, seed: number): string {
  return (serviceValues[svc.category] || serviceValues.academic)(area);
}
function getServiceClosing(svc: typeof services[number], area: string, seed: number): string {
  return (serviceClosings[svc.category] || serviceClosings.academic)(area);
}

// ===== SERVICE-SPECIFIC FAQs =====
const serviceFaqPool: Record<string, (svcName: string, area: string) => { q: string; a: string }[]> = {
  academic: (name, area) => [
    { q: `How much does a ${name.toLowerCase()} cost in ${area}?`, a: `Fees typically range from ₹300–₹800/hr depending on grade and subject. First demo is free.` },
    { q: `Are tutors for ${name.toLowerCase()} verified?`, a: `Yes, all our tutors undergo ID verification, background checks, and a demo teaching evaluation.` },
    { q: `Can I get a female tutor for ${name.toLowerCase()}?`, a: `Absolutely. Specify your preference when booking and we'll match accordingly.` },
    { q: `Do you offer online ${name.toLowerCase()} sessions?`, a: `Yes, both home tuition and online classes are available with flexible scheduling.` },
    { q: `How quickly can I start ${name.toLowerCase()} in ${area}?`, a: `We typically match you with a tutor within 24–48 hours. Book a free demo to get started.` },
  ],
  skill: (name, area) => [
    { q: `What age group is ${name.toLowerCase()} suitable for?`, a: `Our programs are designed for ages 6–16, with age-appropriate curriculum for each level.` },
    { q: `Are ${name.toLowerCase()} available at home in ${area}?`, a: `Yes, we offer both home-based and online sessions in ${area}.` },
    { q: `What will my child learn in ${name.toLowerCase()}?`, a: `Curriculum includes foundational concepts, hands-on projects, and progressive skill building. Ask for a detailed syllabus during your free demo.` },
    { q: `How much do ${name.toLowerCase()} cost in ${area}?`, a: `Fees range from ₹400–₹1,000/hr depending on the program and instructor experience.` },
    { q: `Is there a free trial for ${name.toLowerCase()}?`, a: `Yes! Your first session is a free demo — no commitment required.` },
  ],
  hobby: (name, area) => [
    { q: `Do you offer ${name.toLowerCase()} at home in ${area}?`, a: `Yes, our instructors come to your home or conduct online sessions as per your preference.` },
    { q: `What ages are ${name.toLowerCase()} suitable for?`, a: `We have programs for ages 4–16, with instructors experienced in teaching different age groups.` },
    { q: `How much do ${name.toLowerCase()} cost?`, a: `Fees typically range from ₹300–₹800 per session depending on the activity and instructor.` },
    { q: `Can my child try a free class?`, a: `Yes, the first session is a free trial so you can assess the instructor and program fit.` },
    { q: `Are instructors for ${name.toLowerCase()} qualified?`, a: `All our instructors are verified professionals with relevant training and teaching experience.` },
  ],
  early: (name, area) => [
    { q: `What is the right age to start ${name.toLowerCase()}?`, a: `Our early learning programs start from age 2, with age-appropriate activities for each developmental stage.` },
    { q: `Are ${name.toLowerCase()} tutors trained in early childhood education?`, a: `Yes, our early learning educators hold certifications in Montessori, Jolly Phonics, or equivalent methodologies.` },
    { q: `How long are ${name.toLowerCase()} sessions?`, a: `Sessions are typically 45–60 minutes for young learners, keeping attention spans and engagement in mind.` },
    { q: `Do you offer ${name.toLowerCase()} at home in ${area}?`, a: `Yes, home-based and online sessions are both available across ${area}.` },
    { q: `What will my child learn?`, a: `Programs cover phonics, numeracy, motor skills, social interaction, and school readiness — all through play-based learning.` },
  ],
  behavioral: (name, area) => [
    { q: `How do I know if my child needs ${name.toLowerCase()}?`, a: `If your child struggles with communication, reading, focus, or social interactions, a professional assessment can help determine the right support.` },
    { q: `Are your ${name.toLowerCase()} specialists certified?`, a: `Yes, all our specialists hold relevant certifications and have clinical or educational experience.` },
    { q: `Is ${name.toLowerCase()} available at home in ${area}?`, a: `Yes, home-based sessions are available across ${area} for your child's comfort.` },
    { q: `How long does ${name.toLowerCase()} typically take?`, a: `Progress varies by child. Most families see improvement within 3–6 months of consistent sessions.` },
    { q: `Is there a free consultation?`, a: `Yes, we offer a free initial consultation to assess your child's needs and recommend the right approach.` },
  ],
  discovery: (name, area) => [
    { q: `How do I find ${name.toLowerCase()} in ${area}?`, a: `Simply book a free demo on Tutors Parliament. We'll match you with verified tutors in ${area} within 24 hours.` },
    { q: `Are all tutors on your platform verified?`, a: `Yes — every tutor undergoes ID verification, background checks, and demo evaluation before listing.` },
    { q: `Can I choose between home and online classes?`, a: `Absolutely. Both modes are available with flexible scheduling.` },
    { q: `What subjects and boards do you cover?`, a: `We cover all subjects for CBSE, ICSE, IGCSE, IB, and state boards.` },
    { q: `Is there a registration fee?`, a: `No registration fee. You only pay for sessions. First demo is always free.` },
  ],
};

export function getEnrichedContent(pageData: SeoPageData): { intro: string; value: string; closing: string } {
  const seed = hashStr(pageData.slug);
  const subj = pageData.subject?.name || "Home Tuition";
  const area = pageData.area?.name || "Delhi";
  const cls = pageData.classLevel?.label || "";
  const pin = pageData.area?.pincode || "";

  // Service page content
  if (pageData.service) {
    const svc = pageData.service;
    return {
      intro: getServiceIntro(svc, area, seed),
      value: getServiceValue(svc, area, seed),
      closing: getServiceClosing(svc, area, seed),
    };
  }

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
  (kw: string, area: string, cls: string) => ({ q: `What is the difference between home and online tuition?`, a: `Home tuition offers face-to-face interaction ideal for younger students. Online classes provide flexibility and access to a wider tutor pool. Both are available at similar rates.` }),
  (kw: string, area: string, cls: string) => ({ q: `Do you provide tutors for IB and IGCSE boards in ${area}?`, a: `Yes, we have specialized tutors for IB (MYP/DP) and IGCSE boards in ${area}. They are familiar with the international curriculum and assessment patterns.` }),
  (kw: string, area: string, cls: string) => ({ q: `Can I get a crash course for ${kw} before exams?`, a: `Yes, we offer intensive 30-day crash courses for ${kw} to help students revise the entire syllabus and practice previous year papers.` }),
  (kw: string, area: string, cls: string) => ({ q: `Are there any group study options in ${area}?`, a: `While we specialize in 1-on-1 tuition, we can arrange small group sessions (2-3 students) in ${area} if you have a group ready, offering a 30-40% discount per student.` }),
  (kw: string, area: string, cls: string) => ({ q: `How do you track the progress of the student?`, a: `We provide monthly progress reports, conduct regular chapter-wise tests, and maintain a feedback loop between the tutor, student, and parents.` }),
  (kw: string, area: string, cls: string) => ({ q: `Do tutors in ${area} teach on weekends?`, a: `Yes, many of our tutors in ${area} are available for weekend-only classes or extra sessions during exam months.` }),
  (kw: string, area: string, cls: string) => ({ q: `What if the tutor is on leave?`, a: `We ensure minimal disruption. If a tutor is on long leave, we provide a temporary or permanent replacement within 48 hours in ${area}.` }),
  (kw: string, area: string, cls: string) => ({ q: `Do you provide study material for ${kw}?`, a: `Our tutors provide customized notes, practice worksheets, and reference materials. We also follow school-recommended books and NCERT.` }),
  (kw: string, area: string, cls: string) => ({ q: `Is there a demo class for ${kw}?`, a: `Yes, the first demo class for ${kw} is completely free. It helps you assess the tutor's teaching style before you commit.` }),
  (kw: string, area: string, cls: string) => ({ q: `Are tutors in ${area} familiar with local school patterns?`, a: `Yes, our tutors in ${area} often teach students from the same schools and are well-versed with their internal marking schemes and test schedules.` }),
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

  // Service-specific FAQs
  if (pageData.service) {
    const cat = pageData.service.category;
    const faqFn = serviceFaqPool[cat] || serviceFaqPool.academic;
    return faqFn(pageData.service.name, area);
  }

  // Intent-specific FAQs (Money Pages)
  if (pageData.intent === "fees" || (pageData.isMoneyPage && pageData.type === "tuition-fees-area")) {
    return feesFaqs(area);
  }
  if (pageData.intent === "female-tutors") {
    return femaleFaqs(pageData.subject?.name || "Home Tuition", area);
  }

  // Board specific logic
  if (pageData.board) {
    const boardName = pageData.board.name;
    const boardFaqs = [
      { q: `How do your tutors handle the ${boardName} curriculum?`, a: `Our ${boardName} specialists focus on NCERT/standard textbooks, past 10 years' board papers, and marking scheme analysis to maximize student scores.` },
      { q: `Do you provide ${boardName}-specific mock tests?`, a: `Yes, we conduct monthly mock exams strictly following the ${boardName} pattern and time limits.` },
    ];
    // Fill the rest from pool
    const selected = [...boardFaqs];
    const used = new Set<number>();
    while (selected.length < 5) {
      const idx = (seed + selected.length * 7) % faqPool.length;
      if (!used.has(idx)) {
        used.add(idx);
        selected.push(faqPool[idx](kw, area, cls));
      }
    }
    return selected;
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
  category: "subject" | "area" | "intent" | "decision" | "exam" | "blog" | "service";
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

  // === 7. SERVICE CROSS-LINKS (3-4 related services) ===
  const areaSlug = area?.slug || "delhi";
  const currentServiceSlug = pageData.service?.slug;
  const currentCategory = pageData.service?.category;

  // Pick services from same category + different categories
  const relatedServices = services.filter(s => s.slug !== currentServiceSlug);
  const sameCat = relatedServices.filter(s => s.category === currentCategory).slice(0, 2);
  const diffCat = relatedServices.filter(s => s.category !== currentCategory)
    .sort((a, b) => hashStr(a.slug + pageData.slug) - hashStr(b.slug + pageData.slug))
    .slice(0, 2);
  for (const svc of [...sameCat, ...diffCat].slice(0, 4)) {
    add(`/${svc.slug}-${areaSlug}`, `${svc.name} in ${area?.name || "Delhi"}`, "service");
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
    title = `Home Tuition Fees in ${area} (2025 Guide) | Tutors Parliament`;
  } else if (pageData.type === "top-tutors-area") {
    title = `Top 10 Rated Home Tutors in ${area}, Delhi | Expert Recommendations`;
  }
  // Board-specific
  else if (subj && area && cls && board) {
    const variants = [
      `${subj} ${board} Tutor in ${area} for ${cls} | Expert Coaching`,
      `Best ${subj} Home Tutor in ${area} (${board} Specialists)`,
      `Top Rated ${subj} ${board} Tuition in ${area} — ${cls}`,
    ];
    title = pick(variants, seed);
  }
  // Intent pages
  else if (pageData.type === "female-subject-area") {
    title = `Best Female ${subj} Tutor in ${area} | Verified Lady Tutors`;
  } else if (pageData.type === "subject-near-me-class") {
    title = `Top ${subj} Home Tutor Near Me for ${cls} | 2025 Listings`;
  } else if (pageData.type === "home-vs-online-area") {
    title = `Home vs Online Tuition ${area} | Which is Best for ${area}?`;
  } else if (pageData.type === "subject-area-fees") {
    title = `${subj} Tutor Fees in ${area} | Affordable Home Tuition rates`;
  }
  // Standard pages
  else if (subj && area && cls) {
    const variants = [
      `Top-Rated ${subj} Home Tutor in ${area} for ${cls}`,
      `Best ${subj} Tuition in ${area} for ${cls} | Verified Experts`,
      `Verified ${subj} Home Tutor in ${area} — Class ${cls} Specialization`,
    ];
    title = pick(variants, seed);
  } else if (subj && area) {
    const variants = [
      `Best ${subj} Home Tutor in ${area}, Delhi | 2025 Top Tutors`,
      `Top Rated ${subj} Tuition in ${area} — Expert Home Educators`,
      `Verified ${subj} Home Tutor in ${area} | Start Free Demo`,
    ];
    title = pick(variants, seed);
  } else if (area) {
    const variants = [
      `Top 10 Home Tutors in ${area}, Delhi | Best Tuition Center`,
      `Home Tuition in ${area} — Verified Expert Tutors | 2025`,
      `Best Home Tutors Near ${area}, Delhi | Start Free Trial`,
    ];
    title = pick(variants, seed);
  } else if (subj) {
    title = `Best ${subj} Home Tutors in Delhi | Top 1% Verified Experts`;
  } else {
    title = pageData.title || "Best Home Tutors in Delhi | Tutors Parliament";
  }

  // Branding append if space allows (Next.js titles should stay under ~60 chars)
  if (title.length < 50) {
    title += " | Tutors Parliament";
  }

  if (title.length > 65) title = title.slice(0, 62) + "...";

  const descVariants = [
    `Looking for verified ${subj || "home"} tutors${area ? ` in ${area}` : " in Delhi"}${cls ? ` for ${cls}` : ""}${board ? ` (${board})` : ""}? 10,000+ happy students, 4.8★ rating. Free demo in 24h. Book now!`,
    `Hire top-rated ${subj || "home"} tuition${area ? ` in ${area}` : ""}${cls ? ` for ${cls}` : ""}${board ? `, ${board} specialists` : ""}. Background-checked experts, affordable fees. Free demo class!`,
    `Experienced ${subj || "home"} tutors${area ? ` in ${area}` : ""}${cls ? ` for ${cls}` : ""}. 1-on-1 personalized learning for CBSE, ICSE & IB. 2500+ verified tutors. Book demo!`,
    `The best ${subj || "home"} tuition platform${area ? ` in ${area}` : ""}${cls ? ` (${cls})` : ""}. Transparent fees, verified profiles, and proven academic results. Start free trial today!`,
  ];
  let desc = pick(descVariants, seed);
  if (desc.length > 160) desc = desc.slice(0, 157) + "...";

  return { title, description: desc };
}

export function getRelevantTutoringPages(postSlug: string): { href: string; anchor: string }[] {
  const seed = hashStr(postSlug);
  // Default recommendations
  const defaultLinks = [
    { href: "/maths-tutor-delhi", anchor: "Maths Home Tutor in Delhi" },
    { href: "/science-tutor-delhi", anchor: "Science Home Tutor in Delhi" },
    { href: "/home-tutor-in-delhi", anchor: "Find Best Home Tutors in Delhi" },
    { href: "/cbse-tuition-delhi", anchor: "CBSE Tuition in Delhi NCR" },
  ];

  // Specific matches
  if (postSlug.includes("math")) return [
    { href: "/maths-tutor-delhi", anchor: "Expert Maths Tutors in Delhi" },
    { href: "/math-tuition-in-rohini-class-10", anchor: "Class 10 Maths Tuition in Rohini" },
    { href: "/math-tuition-in-dwarka-class-12", anchor: "Class 12 Maths Tuition in Dwarka" },
  ];
  if (postSlug.includes("science")) return [
    { href: "/science-tutor-delhi", anchor: "Expert Science Tutors in Delhi" },
    { href: "/physics-tuition-in-pitampura-class-12", anchor: "Class 12 Physics Tuition in Pitampura" },
    { href: "/chemistry-tuition-in-janakpuri-class-11", anchor: "Class 11 Chemistry Tuition in Janakpuri" },
  ];
  if (postSlug.includes("board") || postSlug.includes("cbse")) return [
    { href: "/cbse-tuition-delhi", anchor: "CBSE Board Exam Coaching" },
    { href: "/home-tuition-in-rohini", anchor: "Best Home Tuition in Rohini" },
    { href: "/home-tuition-in-dwarka", anchor: "Top Home Tutors in Dwarka" },
  ];

  // Variety based on seed
  return defaultLinks.sort(() => (seed % 3) - 1).slice(0, 3);
}

