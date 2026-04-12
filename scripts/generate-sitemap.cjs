// Run: node scripts/generate-sitemap.cjs
// Generates public/sitemap.xml from SEO dataset

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
];

const subjects = [
  "math","science","physics","chemistry","english","accounts",
  "economics","hindi","biology","computer-science","french","german","spanish",
];

const highRoiClasses = ["8","9","10","11","12"];
const topSubjects = subjects.slice(0, 6);
const topAreas = areas.slice(0, 10);

const BASE = "https://tutorsparliament.com";

const staticPages = [
  "/", "/about", "/courses", "/blog", "/faq",
  "/counselling/student", "/counselling/parent", "/counselling/personal",
];

const urls = [...staticPages];

// Legacy: subject-delhi
subjects.forEach(s => urls.push(`/tutors/${s}-delhi`));
// Legacy: area-delhi
areas.forEach(a => urls.push(`/tutors/${a.slug}-delhi`));
// Legacy: subject-area-delhi (top combos)
topSubjects.forEach(s => {
  areas.slice(0, 6).forEach(a => {
    urls.push(`/tutors/${s}-${a.slug}-delhi`);
  });
});

// New: home-tuition-in-{area}
areas.forEach(a => urls.push(`/home-tuition-in-${a.slug}`));
// New: home-tuition-in-{area}-{pincode} (top 15)
areas.slice(0, 15).forEach(a => urls.push(`/home-tuition-in-${a.slug}-${a.pincode}`));
// New: best-home-tutors-in-{area} (top 15)
areas.slice(0, 15).forEach(a => urls.push(`/best-home-tutors-in-${a.slug}`));
// New: {subject}-tuition-in-{area}-class-{class}
topSubjects.forEach(s => {
  topAreas.forEach(a => {
    highRoiClasses.forEach(c => {
      urls.push(`/${s}-tuition-in-${a.slug}-class-${c}`);
    });
  });
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
