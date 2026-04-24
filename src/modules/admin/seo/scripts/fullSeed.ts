
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://krnclnhojwblxzmituvz.supabase.co";
const supabaseAnonKey = "sb_publishable_j45zXUff2znI6kBLs8Nl2g_W68QUglk";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkAndSeed() {
  console.log("Checking tables...");

  // 1. Check SEO
  const { data: seoData } = await supabase.from('seo_configurations').select('id').limit(1);
  if (seoData && seoData.length === 0) {
    console.log("Seeding SEO...");
    await supabase.from('seo_configurations').insert([
        { path: '/', title: 'Home | Tutors Parliament', description: 'Expert home tutors for all subjects.', is_indexed: true },
        { path: '/tutors', title: 'Find Tutors | Tutors Parliament', description: 'Browse our directory of qualified tutors.', is_indexed: true },
        { path: '/leads', title: 'Lead Management | Admin', description: 'Internal lead management system.', is_indexed: false },
        { path: '/dashboard', title: 'Admin Dashboard', description: 'System overview and metrics.', is_indexed: false },
    ]);
  }

  // 2. Check Entity Clusters
  const { data: clusterData } = await supabase.from('entity_clusters').select('id').limit(1);
  if (clusterData && clusterData.length === 0) {
    console.log("Seeding Clusters...");
    const { data: clusters } = await supabase.from('entity_clusters').insert([
        { primary_name: 'Suspicious Aggregator A', risk_score: 85, cluster_type: 'agency', last_activity: new Date() },
        { primary_name: 'High Frequency Lead Bot', risk_score: 92, cluster_type: 'bot', last_activity: new Date() },
        { primary_name: 'Verified Agency Partner', risk_score: 5, cluster_type: 'agency', last_activity: new Date() },
    ]).select();

    // 3. Seed Alerts
    if (clusters) {
        await supabase.from('intelligence_alerts').insert([
            { severity: 'critical', description: 'Multi-agency fraud pattern detected in New Delhi cluster.', cluster_id: clusters[0].id },
            { severity: 'high', description: 'Automated lead scraping activity identified from known bot IP.', cluster_id: clusters[1].id },
        ]);
    }
  }

  console.log("Seed check complete.");
}

checkAndSeed();
