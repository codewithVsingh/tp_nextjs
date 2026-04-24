import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

/**
 * Tutors Parliament: Architecture Guard
 * This script ensures the integrity of the DDA and Authority Layer.
 * It scans for "Leakage" that ESLint might miss.
 */

const VIOLATIONS = [];

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath);

  // 1. Check for raw button usage in modules
  if (filePath.includes('src/modules') && content.includes('<button') && !content.includes('// @ts-ignore-guard')) {
    VIOLATIONS.push(`❌ DESIGN SYSTEM LEAKAGE: Raw <button> found in ${filePath}. Use <TPButton> instead.`);
  }

  // 2. Check for raw input usage in modules
  if (filePath.includes('src/modules') && content.includes('<input') && !content.includes('// @ts-ignore-guard')) {
    VIOLATIONS.push(`❌ DESIGN SYSTEM LEAKAGE: Raw <input> found in ${filePath}. Use <TPInput> instead.`);
  }

  // 3. Check for direct Supabase imports in Views
  if (fileName.endsWith('View.tsx') && content.includes('@/integrations/supabase/client')) {
    VIOLATIONS.push(`❌ ARCHITECTURE LEAKAGE: Direct Supabase import found in View: ${filePath}. Move to Service layer.`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.next') walkDir(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      checkFile(fullPath);
    }
  }
}

console.log('🛡️ Starting Architecture Guard Scan...');
walkDir('./src/modules');
walkDir('./src/domains');

if (VIOLATIONS.length > 0) {
  console.error('\n🛑 ARCHITECTURE CONTRACT VIOLATED!');
  VIOLATIONS.forEach(v => console.error(v));
  console.log('\n💡 Tip: Use the "DDA Pattern" mentioned in ARCHITECTURE.md to fix these.');
  process.exit(1);
} else {
  console.log('✅ Architecture is stable and clean.');
  process.exit(0);
}
