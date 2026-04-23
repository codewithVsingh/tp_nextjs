import { createClient } from '@supabase/supabase-js';

const NEW_URL = "https://krnclnhojwblxzmituvz.supabase.co";
const NEW_KEY = "sb_publishable_j45zXUff2znI6kBLs8Nl2g_W68QUglk";
const supabase = createClient(NEW_URL, NEW_KEY);

const indianNames = ["Aarav Sharma", "Vihaan Singh", "Aditya Patel", "Rohan Gupta", "Arjun Verma", "Priya Das", "Neha Kapoor", "Aarti Mukherjee", "Sneha Rao", "Riya Bhatia"];
const indianCities = ["Delhi", "Mumbai", "Bangalore", "Chennai", "Hyderabad", "Pune"];
const phoneGen = () => "91" + Math.floor(6000000000 + Math.random() * 3999999999).toString();

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
}

const getBase = () => ({
  name: indianNames[Math.floor(Math.random() * indianNames.length)],
  phone: phoneGen(),
  created_at: randomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date())
});

async function runSeeder() {
  console.log("Preparing to mass inject testing mock data across all active pipelines...");

  // 1. DEMO BOOKINGS
  let demos = [];
  for(let i=0; i<15; i++) {
    demos.push({
      ...getBase(),
      city: indianCities[Math.floor(Math.random() * indianCities.length)],
      class_level: "Class " + (Math.floor(Math.random() * 5) + 8),
      subjects: ["Mathematics", "Science"],
      status: Math.random() > 0.5 ? "Pending" : "Contacted"
    });
  }
  await supabase.from('demo_bookings').insert(demos);
  console.log("✅ Demo Bookings seamlessly pushed!");

  // 2. COUNSELLING
  let counselling = [];
  const types = ["Student Counselling", "Parent Counselling", "Personal Counselling"];
  for(let i=0; i<15; i++) {
    counselling.push({
      ...getBase(),
      type: types[Math.floor(Math.random() * types.length)],
      concern: "Looking for guidance in scoring above 95% in upcoming board exams. Need help selecting correct streams for science.",
      status: Math.random() > 0.5 ? "Pending" : "Resolved"
    });
  }
  await supabase.from('counselling_requests').insert(counselling);
  console.log("✅ Counselling Requests flawlessly inserted!");

  // 3. REPORTED TUTORS
  let reported = [];
  for(let i=0; i<15; i++) {
    reported.push({
      tutor_name: "Tutor " + getBase().name,
      mobile: phoneGen(),
      state: "Delhi",
      city: "New Delhi",
      fraud_type: "fake_identity",
      description: "Tutor provided false identification docs initially during verification checks.",
      agency_name: "VerifyHub Check",
      contact_person: "Agent " + getBase().name,
      created_at: getBase().created_at,
      status: "Verified True"
    });
  }
  await supabase.from('reported_tutors').insert(reported);
  console.log("✅ Reported Tutors thoroughly logged!");

  // 4. CONTACT MESSAGES
  let contacts = [];
  for(let i=0; i<15; i++) {
    contacts.push({
      ...getBase(),
      email: "test" + Math.random().toString().slice(2,5) + "@gmail.com",
      subject: "Business Partnership Inquiry",
      message: "We are an institution looking to partner directly with Tutors Parliament locally.",
      inquiry_type: "Partnership"
    });
  }
  await supabase.from('contact_messages').insert(contacts);
  console.log("✅ Contact Messages wired perfectly!");

  // 5. LEADS
  let leads = [];
  for(let i=0; i<15; i++) {
    leads.push({
      ...getBase(),
      city: indianCities[Math.floor(Math.random() * indianCities.length)],
      class_level: "Class " + (Math.floor(Math.random() * 5) + 8),
      subjects: ["Science", "English"],
      status: ["Pending", "Contacted", "Verified", "Converted", "Dropped"][Math.floor(Math.random() * 5)],
      otp_verified: Math.random() > 0.5,
      step_reached: 5,
      phone: phoneGen()
    });
  }
  await supabase.from('leads').insert(leads);
  console.log("✅ Main Leads populated!");

  // 6. TUTOR REGISTRATIONS
  let tutors = [];
  for(let i=0; i<15; i++) {
    tutors.push({
      name: getBase().name,
      email: "tutor" + Math.random().toString().slice(2,5) + "@gmail.com",
      phone: phoneGen(),
      state: "Maharashtra",
      city: indianCities[Math.floor(Math.random() * indianCities.length)],
      pincode: "400001",
      subjects: ["Mathematics", "Physics"],
      classes: ["Class 10", "Class 12"],
      boards: ["CBSE", "ICSE"],
      teaching_mode: "Both",
      languages: ["English", "Hindi"],
      qualification: "B.Tech in Computer Science",
      experience: Math.floor(Math.random() * 10) + " Years",
      current_status: "Working Professional",
      available_days: ["Saturday", "Sunday"],
      time_slots: ["Evening", "Morning"],
      expected_fees: "1000/hr",
      travel_willing: "Yes, up to 5km",
      created_at: getBase().created_at
    });
  }
  await supabase.from('tutor_registrations').insert(tutors);
  console.log("✅ Tutors populated!");

  console.log("\n🚀 BOOM! Data pipeline architecture testing suites populated heavily! Enjoy the UI.");
}

runSeeder();
