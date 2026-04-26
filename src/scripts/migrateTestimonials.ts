import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Using service role to bypass RLS for migration
);

const testimonials = [
  { name: "Sneha P.", result: "Class 10 — 96.4% (CBSE)", text: "Tutors Parliament completely changed how I approached my board exams. My maths tutor in Delhi made every concept crystal clear. I went from 75% to 96% in just 6 months!", initials: "SP", type: "student", verified: true },
  { name: "Arjun M.", result: "Class 12 — 94% (Science)", text: "The personalized study plan and weekly mock tests helped me score consistently in Physics and Chemistry. Best tuition in Delhi for serious students.", initials: "AM", type: "student", verified: true },
  { name: "Kavita R.", result: "Class 10 — 98.5% (ICSE)", text: "My tutor understood my learning pace perfectly. I went from struggling in maths to scoring 99 in boards! The ICSE coaching was exceptional.", initials: "KR", type: "student", verified: true },
  { name: "Rahul N.", result: "Class 9 — Topped Section", text: "The daily routine my tutor helped me create was a game-changer. In Delhi's competitive schools, having a structured approach made all the difference.", initials: "RN", type: "student", verified: true },
  { name: "Divya I.", result: "NEET — AIR 320", text: "The biology sessions were incredibly detailed. My tutor's exam strategies helped me score way beyond my expectations. Best NEET coaching support in Delhi.", initials: "DI", type: "student", verified: true },
  { name: "Aisha K.", result: "Class 8 — School Topper", text: "I used to hate Science but my tutor made it so interesting with real-life examples. Now it's my favourite subject! Thank you Tutors Parliament!", initials: "AK", type: "student", verified: true },
  { name: "Rohan S.", result: "JEE Mains — 99.2%ile", text: "Started JEE preparation in Class 11 with Tutors Parliament. The Physics and Maths coaching was at par with top coaching institutes in Delhi.", initials: "RS", type: "student", verified: true },
  { name: "Priya D.", result: "Class 12 — 97% (Commerce)", text: "Accountancy felt impossible until I found my tutor here. She explained every concept with patience. Best commerce tuition in Delhi NCR!", initials: "PD", type: "student", verified: true },
  { name: "Vikash T.", result: "Class 6 — Improved 40%", text: "My son was very weak in English and Hindi. The home tutor from Tutors Parliament helped him improve dramatically. Highly recommend for Delhi parents.", initials: "VT", type: "parent", verified: true },
  { name: "Meena G.", result: "Parent — Class 4 Student", text: "Finding a good tutor for young kids in Delhi is so hard. Tutors Parliament matched us with the perfect teacher. My daughter actually looks forward to study time now.", initials: "MG", type: "parent", verified: true },
  { name: "Sanjay K.", result: "Parent — Class 11 Student", text: "The parent counselling session helped me understand how to support my son during his JEE preparation without adding pressure. Truly grateful.", initials: "SK", type: "parent", verified: true },
  { name: "Anjali B.", result: "Class 10 — 91% (State Board)", text: "I switched from another coaching centre to Tutors Parliament and the difference was night and day. Personalised attention really matters.", initials: "AB", type: "student", verified: true },
];

async function migrate() {
  console.log("🚀 Starting Testimonial Migration...");
  
  const { data, error } = await supabase
    .from('testimonials')
    .insert(testimonials);

  if (error) {
    console.error("❌ Migration Failed:", error);
  } else {
    console.log("✅ Successfully migrated 12 testimonials!");
  }
}

migrate();
