import { createClient } from '@supabase/supabase-js';

const NEW_URL = "https://krnclnhojwblxzmituvz.supabase.co";
const NEW_KEY = "sb_publishable_j45zXUff2znI6kBLs8Nl2g_W68QUglk";
const supabase = createClient(NEW_URL, NEW_KEY);

const firstNames = ["Aarav", "Vihaan", "Aditya", "Rohan", "Arjun", "Krishna", "Ishaan", "Kartik", "Siddharth", "Vivaan", "Priya", "Neha", "Aarti", "Sneha", "Riya", "Kriti", "Pooja", "Divya", "Shruti", "Kavya", "Rahul", "Amit", "Karan", "Vikas", "Ananya"];
const lastNames = ["Sharma", "Singh", "Patel", "Gupta", "Verma", "Reddy", "Iyer", "Joshi", "Desai", "Kumar", "Malhotra", "Menon", "Nair", "Rathore", "Das", "Kapoor", "Mukherjee", "Rao", "Bhatia", "Pandey"];

const cities = ["Delhi", "Mumbai", "Bangalore", "Chennai", "Hyderabad", "Pune", "Gurgaon", "Noida", "Kolkata", "Ahmedabad", "Chandigarh", "Jaipur"];
const areas = ["Sector 15", "Andheri West", "Koramangala", "Anna Nagar", "Banjara Hills", "Kalyani Nagar", "DLF Phase 3", "Salt Lake", "Vastrapur", "Whitefield"];
const statuses = ["Pending", "Pending", "Pending", "Contacted", "Contacted", "Verified", "Converted", "Dropped"]; // Slightly weighted organically
const classes = ["Class 6", "Class 8", "Class 10", "Class 10", "Class 12", "Class 12", "JEE", "NEET", "UPSC"];
const subjectOptions = [["Mathematics"], ["Physics", "Chemistry"], ["Biology"], ["English", "Hindi"], ["Social Science", "History"], ["All Subjects"]];

function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
}

async function seedDatabase() {
    console.log("Generating Indian Sample Records for your CRM...");
    
    let sampleLeads = [];
    
    // Generate ~40 high quality leads to massively populate your charts
    for (let i = 0; i < 40; i++) {
        const name = `${getRandom(firstNames)} ${getRandom(lastNames)}`;
        const phone = "91" + Math.floor(6000000000 + Math.random() * 3999999999).toString();
        const city = getRandom(cities);
        const area = getRandom(areas);
        const status = getRandom(statuses);
        const class_level = getRandom(classes);
        const subjects = getRandom(subjectOptions);
        
        // Spread dates primarily over the last 15 days so your dynamic charts look alive!
        const created_at = randomDate(new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), new Date()); 

        sampleLeads.push({
            name,
            phone,
            city,
            area,
            status,
            class_level,
            subjects,
            created_at,
            otp_verified: Math.random() > 0.5
        });
    }

    console.log("Pushing 40 leads to database...");
    
    const { data, error } = await supabase.from('leads').insert(sampleLeads);

    if (error) {
        console.error("\n❌ ERROR: ", error.message);
        if (error.message.includes("Could not find the table")) {
            console.error("⚠️ WAIT! YOU HAVEN'T CREATED THE TABLES YET!");
            console.error("Please go to your Supabase Dashboard -> SQL Editor and Run 'supabase-master-init.sql' first!");
        }
    } else {
        console.log("✅ Successfully injected 40 sample leads! Your CRM dashboard is now fully populated.");
    }
}

seedDatabase();
