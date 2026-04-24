
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://krnclnhojwblxzmituvz.supabase.co";
const supabaseAnonKey = "sb_publishable_j45zXUff2znI6kBLs8Nl2g_W68QUglk";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seedLeads() {
  console.log("Checking leads...");
  const { data: existingLeads } = await supabase.from('leads').select('id').limit(1);

  if (!existingLeads || existingLeads.length === 0) {
    console.log("No leads found. Creating dummy leads...");
    
    const pages = [
      'female-home-tutors-south-delhi',
      'class-12-physics-cbse-tutor',
      'neet-coaching-janakpuri',
      'ib-maths-tutor-gurgaon',
      'female-tutor-west-delhi',
      'class-10-maths-icse'
    ];
    const ctas = ['Book Free Trial', 'Check Fees', 'Contact Now', 'Get Callback'];
    const areas = ['Vasant Kunj', 'Saket', 'Janakpuri', 'Gurgaon Sector 45', 'Dwarka Sector 10', 'Rohini'];
    const names = ['Amit Sharma', 'Priya Gupta', 'Rahul Verma', 'Sneha Reddy', 'Vikram Singh', 'Anjali Das'];

    const newLeads = names.map(name => ({
      name,
      phone: '99999' + Math.floor(Math.random() * 100000),
      city: 'Delhi',
      status: Math.random() > 0.7 ? 'Converted' : 'New Lead',
      source_page: pages[Math.floor(Math.random() * pages.length)],
      source_cta: ctas[Math.floor(Math.random() * ctas.length)],
      area: areas[Math.floor(Math.random() * areas.length)],
      lead_temperature: 'Hot',
      created_at: new Date().toISOString()
    }));

    const { error } = await supabase.from('leads').insert(newLeads);
    if (error) console.error("Error inserting leads:", error.message);
    else console.log("Dummy leads created successfully.");
  } else {
    console.log("Leads already exist.");
  }
}

seedLeads();
