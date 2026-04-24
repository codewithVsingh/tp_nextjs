import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Manually parse .env
const envContent = fs.readFileSync('.env', 'utf8');
const env = {};
envContent.split(/\r?\n/).forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    let value = valueParts.join('=').trim();
    // Remove quotes if present
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    env[key.trim()] = value;
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function discover() {
  const tables = ['leads', 'payments', 'automation_logs', 'intelligence_alerts', 'entity_clusters', 'trust_users', 'agency_activity_logs'];
  
  for (const table of tables) {
    console.log(`\n--- Inspecting: ${table} ---`);
    const { data, count, error } = await supabase.from(table).select('*', { count: 'exact' }).limit(1);
    
    if (error) {
      console.error(`Error:`, error.message);
      continue;
    }
    
    console.log(`Row count: ${count}`);
    if (data && data.length > 0) {
      console.log('Columns:', Object.keys(data[0]).join(', '));
    }
  }
}

discover();
