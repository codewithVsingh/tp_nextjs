// Run: node scripts/generate-sitemap.js
// Generates public/sitemap.xml from SEO dataset

const areas = [
  "rohini","dwarka","laxmi-nagar","janakpuri","pitampura",
  "karol-bagh","rajouri-garden","vikaspuri","mayur-vihar","ashok-vihar",
  "south-delhi","north-delhi","east-delhi","west-delhi",
];

const subjects = [
  "math","science","physics","chemistry","english","accounts",
  "economics","hindi","biology","computer-science","french","german","spanish",
];

const BASE = "https://tutorsparliament.com";

const staticPages = [
  "/", "/about", "/courses", "/blog", "/faq",
  "/counselling/student", "/counselling/parent", "/counselling/personal",
];

const urls = [...staticPages];

// subject-delhi
subjects.forEach(s => urls.push(`/tutors/${s}-delhi`));

// area-delhi
areas.forEach(a => urls.push(`/tutors/${a}-delhi`));

// subject-area-delhi (top combos)
subjects.slice(0, 6).forEach(s => {
  areas.slice(0, 6).forEach(a => {
    urls.push(`/tutors/${s}-${a}-delhi`);
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
