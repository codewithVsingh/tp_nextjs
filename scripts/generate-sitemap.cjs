// Run: node scripts/generate-sitemap.cjs
// Generates public/sitemap.xml — mirrors getAllSlugs() from seoData.ts

const areas = [
  { slug: "rohini", pincode: "110085" },
  { slug: "dwarka", pincode: "110075" },
  { slug: "laxmi-nagar", pincode: "110092" },
  { slug: "janakpuri", pincode: "110058" },
  { slug: "pitampura", pincode: "110034" },
  { slug: "karol-bagh", pincode: "110005" },
  { slug: "rajouri-garden", pincode: "110027" },
  { slug: "vikaspuri", pincode: "110018" },
  { slug: "mayur-vihar", pincode: "110091" },
  { slug: "ashok-vihar", pincode: "110052" },
  { slug: "south-delhi", pincode: "110049" },
  { slug: "north-delhi", pincode: "110009" },
  { slug: "east-delhi", pincode: "110096" },
  { slug: "west-delhi", pincode: "110063" },
  { slug: "saket", pincode: "110017" },
  { slug: "malviya-nagar", pincode: "110017" },
  { slug: "hauz-khas", pincode: "110016" },
  { slug: "preet-vihar", pincode: "110092" },
  { slug: "model-town", pincode: "110009" },
  { slug: "kamla-nagar", pincode: "110007" },
  { slug: "vasant-kunj", pincode: "110070" },
  { slug: "greater-kailash", pincode: "110048" },
  { slug: "defence-colony", pincode: "110024" },
  { slug: "paschim-vihar", pincode: "110063" },
  { slug: "tilak-nagar", pincode: "110018" },
  { slug: "uttam-nagar", pincode: "110059" },
  { slug: "nehru-place", pincode: "110019" },
  { slug: "connaught-place", pincode: "110001" },
  { slug: "lajpat-nagar", pincode: "110024" },
  { slug: "kalkaji", pincode: "110019" },
  { slug: "noida", pincode: "201301" },
  { slug: "greater-noida", pincode: "201310" },
  { slug: "gurgaon", pincode: "122001" },
  { slug: "ghaziabad", pincode: "201001" },
  { slug: "faridabad", pincode: "121001" },
  { slug: "indirapuram", pincode: "201014" },
  { slug: "vaishali", pincode: "201010" },
  { slug: "sector-62-noida", pincode: "201309" },
  { slug: "dlf-phase-3", pincode: "122002" },
  { slug: "sohna-road", pincode: "122018" },
];

const subjects = [
  "math","science","physics","chemistry","english","accounts",
  "economics","hindi","biology","computer-science","french","german","spanish",
];

const topSubjects = subjects.slice(0, 6);
const topAreas = areas.slice(0, 10);
const highRoiClasses = ["8","9","10","11","12"];
const boardClasses = ["10","11","12"];
const boardSubjects = topSubjects.slice(0, 4);
const boards = ["cbse","icse","ib"];
const examTypes = ["jee","neet","cuet","ntse","olympiad","navodaya","sainik-school"];
const ncrCities = ["noida","gurgaon","ghaziabad","faridabad"];

const servicesSlugs = [
  "home-tutor-for-kids", "1-on-1-home-tutor", "affordable-tuition-classes",
  "after-school-homework-help", "exam-crash-course",
  "coding-classes-for-kids", "robotics-classes", "vedic-maths-classes",
  "public-speaking-for-kids", "chess-classes-for-kids", "abacus-classes-for-kids",
  "summer-camp-for-kids", "dance-classes-for-kids", "music-classes-for-kids",
  "art-and-craft-classes",
  "kg-home-tutor", "phonics-classes-for-kg", "montessori-classes", "early-learning-program",
  "special-education-tutor",
];

const BASE = "https://tutorsparliament.com";

const staticPages = [
  "/", "/about", "/courses", "/blog", "/faq", "/contact",
  "/counselling/student", "/counselling/parent", "/counselling/personal",
  "/demo-booking", "/become-a-tutor", "/tutor-registry",
  "/ai-in-education-for-kids-guide",
  "/home-tuition-vs-coaching-delhi", "/home-tuition-vs-online-classes-delhi",
  "/is-home-tuition-worth-it-delhi", "/best-home-tuition-or-coaching-for-class-10-delhi",
];

// Phase 1 keyword aliases
const aliasPages = [
  "/home-tutor-in-delhi",
  "/tuition-in-delhi",
  "/maths-tutor-delhi",
  "/science-tutor-delhi",
  "/cbse-tuition-delhi",
];

// Blog index, paginated index, city archives, year/month archive
const blogCities = [
  "delhi", "mumbai", "bangalore", "hyderabad", "pune",
  "chennai", "kolkata", "ahmedabad", "noida", "gurgaon",
];
const blogYears = ["2025", "2026"];
const blogMonths = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];

const blogStaticPages = [
  ...Array.from({ length: 6 }, (_, i) => `/blog?page=${i + 1}`),
  ...blogCities.map(c => `/blog/city/${c}`),
  ...blogYears.map(y => `/blog/archive/${y}`),
  ...blogYears.flatMap(y => blogMonths.map(m => `/blog/archive/${y}/${m}`)),
];

const urls = [...staticPages, ...aliasPages, ...blogStaticPages];

// Legacy: subject-delhi
subjects.forEach(s => urls.push(`/tutors/${s}-delhi`));
// Legacy: area-delhi
areas.forEach(a => urls.push(`/tutors/${a.slug}-delhi`));
// Legacy: subject-area-delhi (top combos)
topSubjects.forEach(s => {
  areas.slice(0, 6).forEach(a => urls.push(`/tutors/${s}-${a.slug}-delhi`));
});

// v1.0: home-tuition-in-{area}
areas.forEach(a => urls.push(`/home-tuition-in-${a.slug}`));
// v1.0: home-tuition-in-{area}-{pincode} (top 15)
areas.slice(0, 15).forEach(a => urls.push(`/home-tuition-in-${a.slug}-${a.pincode}`));
// v1.0: best-home-tutors-in-{area} (top 15)
areas.slice(0, 15).forEach(a => urls.push(`/best-home-tutors-in-${a.slug}`));
// v1.0: {subject}-tuition-in-{area}-class-{class}
topSubjects.forEach(s => {
  topAreas.forEach(a => {
    highRoiClasses.forEach(c => urls.push(`/${s}-tuition-in-${a.slug}-class-${c}`));
  });
});

// v2.0: Money pages — fees & top-10 for all areas
areas.forEach(a => {
  urls.push(`/home-tuition-fees-in-${a.slug}`);
  urls.push(`/top-10-home-tutors-${a.slug}`);
});

// v2.0: Board-specific pages
boardSubjects.forEach(s => {
  topAreas.forEach(a => {
    boardClasses.forEach(c => {
      boards.forEach(b => urls.push(`/${s}-home-tutor-${a.slug}-class-${c}-${b}`));
    });
  });
});

// v2.0: Female tutor pages
topSubjects.forEach(s => {
  areas.slice(0, 15).forEach(a => urls.push(`/female-${s}-home-tutor-${a.slug}`));
});

// v2.0: Near-me pages
topSubjects.forEach(s => {
  highRoiClasses.forEach(c => urls.push(`/${s}-home-tutor-near-me-class-${c}`));
});

// v2.0: Home vs online
areas.slice(0, 15).forEach(a => urls.push(`/home-vs-online-tuition-${a.slug}`));

// v2.0: Subject fees
topSubjects.forEach(s => {
  topAreas.forEach(a => urls.push(`/${s}-home-tutor-${a.slug}-fees`));
});

// v2.0: Exam coaching
examTypes.forEach(e => {
  urls.push(`/${e}-coaching-near-me`);
  areas.slice(0, 15).forEach(a => urls.push(`/${e}-coaching-${a.slug}`));
});

// v3.0: Service pages
const priorityServices = servicesSlugs.slice(0, 20);
const serviceAreas = areas.slice(0, 10);
priorityServices.forEach(svc => {
  urls.push(`/${svc}-delhi`);
  ncrCities.forEach(city => urls.push(`/${svc}-${city}`));
  serviceAreas.forEach(a => urls.push(`/${svc}-${a.slug}`));
});

const today = new Date().toISOString().split("T")[0];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${BASE}${u}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u === "/" ? "daily" : "weekly"}</changefreq>
    <priority>${u === "/" ? "1.0" : "0.8"}</priority>
  </url>`).join("\n")}
</urlset>`;

const fs = require("fs");
const path = require("path");
fs.writeFileSync(path.join(__dirname, "..", "public", "sitemap.xml"), xml);
console.log(`✅ Generated sitemap.xml with ${urls.length} URLs`);
