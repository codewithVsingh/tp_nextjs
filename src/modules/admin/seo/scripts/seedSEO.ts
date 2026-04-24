import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const initialConfigs = [
  { path: '/', title: 'Home | Tutors Parliament', description: 'Expert home tutors for all subjects.', is_indexed: true },
  { path: '/tutors', title: 'Find Tutors | Tutors Parliament', description: 'Browse our directory of qualified tutors.', is_indexed: true },
  { path: '/leads', title: 'Lead Management | Admin', description: 'Internal lead management system.', is_indexed: false },
  { path: '/dashboard', title: 'Admin Dashboard', description: 'System overview and metrics.', is_indexed: false },
];

async function seed() {
  console.log("Checking seo_configurations table...");
  const { data, error } = await supabase.from('seo_configurations').select('id').limit(1);
  
  if (error) {
    console.error("Error checking table:", error.message);
    if (error.message.includes('does not exist')) {
        console.log("Table does not exist. Please run migration.");
    }
    return;
  }

  if (data.length === 0) {
    console.log("Seeding initial SEO configurations...");
    const { error: insertError } = await supabase.from('seo_configurations').insert(initialConfigs);
    if (insertError) console.error("Error seeding:", insertError.message);
    else console.log("Seeding successful!");
  } else {
    console.log("Table already has data. Skipping seed.");
  }
}

seed();
