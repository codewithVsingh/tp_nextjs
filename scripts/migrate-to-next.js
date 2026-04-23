import fs from 'fs';
import path from 'path';

const SRC_DIR = path.resolve('src');
const APP_DIR = path.resolve('src/app');
const PAGES_DIR = path.resolve('src/pages');
const COMPONENTS_DIR = path.resolve('src/components');

// Route mapping
const routes = {
  'about': 'AboutUs',
  'courses': 'Courses',
  'counselling': 'Counselling',
  'counselling/student': 'StudentCounselling',
  'counselling/parent': 'ParentCounselling',
  'counselling/personal': 'PersonalCounselling',
  'blog': 'Blog',
  'blog/[slug]': 'BlogPost',
  'faq': 'FAQ',
  'demo-booking': 'DemoBooking',
  'become-a-tutor': 'BecomeATutor',
  'tutor-registry': 'TutorRegistry',
  'report-tutor': 'ReportTutor',
  'contact': 'Contact',
  'terms-and-conditions': 'TermsAndConditions',
  'ai-in-education-for-kids-guide': 'AIEducationGuide',
  'admin/login': 'admin/AdminLogin',
  'admin/dashboard': 'admin/AdminDashboard',
  'admin/leads': 'admin/AdminLeads',
  'admin/followups': 'admin/AdminFollowUps',
  'admin/tutors': 'admin/AdminTutors',
  'admin/assignments': 'admin/AdminAssignments',
  'admin/revenue': 'admin/AdminRevenue',
  'admin/funnel': 'admin/AdminFunnel',
  'admin/marketing': 'admin/AdminMarketing',
  'admin/cities': 'admin/AdminCities',
};

// 1. Generate Next.js App Router structure
console.log('Generating Next.js App Router structure...');
for (const [routePath, componentName] of Object.entries(routes)) {
  const fullPath = path.join(APP_DIR, routePath);
  fs.mkdirSync(fullPath, { recursive: true });
  
  // Calculate relative path to the component
  const depth = routePath.split('/').length;
  const relativePrefix = '../'.repeat(depth + 1); // +1 because we are in src/app/..
  
  const content = `export { default } from "${relativePrefix}pages/${componentName}";\n`;
  fs.writeFileSync(path.join(fullPath, 'page.tsx'), content);
}

// 2. Refactor react-router-dom usage and add use client
console.log('Refactoring react-router-dom usage...');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Add use client to pages if not present
  if (filePath.includes(path.join('src', 'pages')) && !content.includes('"use client"')) {
    content = '"use client";\n\n' + content;
    changed = true;
  }

  // Replace imports
  if (content.includes('react-router-dom')) {
    content = content.replace(/import\s+{([^}]+)}\s+from\s+["']react-router-dom["']/g, (match, imports) => {
      let newImports = [];
      const parts = imports.split(',').map(s => s.trim());
      
      let nextNav = [];
      let nextLink = false;

      parts.forEach(p => {
        if (p === 'Link') nextLink = true;
        if (p === 'useNavigate') nextNav.push('useRouter');
        if (p === 'useLocation') nextNav.push('usePathname');
        if (p === 'useParams') nextNav.push('useParams');
        if (p === 'useSearchParams') nextNav.push('useSearchParams', 'useRouter', 'usePathname');
        if (p === 'Navigate') nextNav.push('redirect'); // Though Next.js redirect is different, we handle it
      });

      let replacement = '';
      if (nextLink) replacement += `import Link from "next/link";\n`;
      if (nextNav.length > 0) replacement += `import { ${nextNav.join(', ')} } from "next/navigation";\n`;
      
      return replacement.trim();
    });
    changed = true;
  }

  // Replace hooks
  if (content.includes('useNavigate()')) {
    content = content.replace(/const\s+(\w+)\s*=\s*useNavigate\(\)/g, 'const $1 = useRouter()');
    changed = true;
  }
  
  if (content.includes('useLocation()')) {
    content = content.replace(/const\s+(\w+)\s*=\s*useLocation\(\)/g, 'const $1 = usePathname()');
    changed = true;
  }

  // Handle useSearchParams specifically
  if (content.includes('useSearchParams()')) {
    content = content.replace(/const\s+\[(.*?),.*?\]\s*=\s*useSearchParams\(\)/g, 'const $1 = useSearchParams()');
    content = content.replace(/setParams\(next.*?\)|\bsetParams\(next\)/g, 'router.push(`${pathname}?${next.toString()}`, { scroll: false })');
    if (!content.includes('const router = useRouter()')) {
       content = content.replace(/const\s+(.*?)\s*=\s*useSearchParams\(\);/g, 'const $1 = useSearchParams();\n  const router = useRouter();\n  const pathname = usePathname();');
    }
    changed = true;
  }

  // Replace navigation calls
  if (changed) {
    // router.navigate -> router.push (assuming navigate was the var name)
    content = content.replace(/navigate\(/g, 'router.push(');
  }

  // Replace Link to= with Link href=
  if (content.includes('<Link')) {
    content = content.replace(/<Link([^>]*)\sto=/g, '<Link$1 href=');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

walkDir(PAGES_DIR);
walkDir(COMPONENTS_DIR);

console.log('Migration completed!');
