import { createClient } from '@supabase/supabase-js';

// Old Supabase Environment Data
const OLD_URL = "https://jplwbiujzhqrjdsfwegu.supabase.co";
const OLD_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwbHdiaXVqemhxcmpkc2Z3ZWd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzMjU3ODcsImV4cCI6MjA5MTkwMTc4N30.a-cHihv90bEI6t8rKD9SVg8egN1zUDa2uoR_er9sHFE";

// New Supabase Environment Data
const NEW_URL = "https://krnclnhojwblxzmituvz.supabase.co";
const NEW_KEY = "sb_publishable_j45zXUff2znI6kBLs8Nl2g_W68QUglk";

const oldDb = createClient(OLD_URL, OLD_KEY);
const newDb = createClient(NEW_URL, NEW_KEY);

const tables = ["leads", "contact_messages", "tutor_registrations"];

async function runMigration() {
    console.log("Starting DB Migration...");
    let movedTotal = 0;

    for (const table of tables) {
        try {
            console.log(`Connecting to old DB checking table: ${table}...`);
            const { data, error } = await oldDb.from(table).select('*');
            
            if (error || !data) {
                console.log(`- Warning: Could not fetch from ${table} (maybe it never existed): ${error?.message || "Unknown"}`);
                continue;
            }
            
            console.log(`- Found ${data.length} records in ${table}. Attempting to port...`);

            if (data.length > 0) {
                const { error: insertErr } = await newDb.from(table).insert(data);
                if (insertErr) {
                    console.log(`- Critical Failed to insert into new DB table ${table}: ${insertErr.message}`);
                    console.log(`Did you remember to run the .sql setup files on the NEW Supabase project?`);
                } else {
                    console.log(`- Successfully ported ${data.length} records to ${table}! ✅`);
                    movedTotal += data.length;
                }
            }
        } catch(err) {
            console.error(`- Error migrating ${table}: ${err.message}`);
        }
    }
    
    console.log(`\nMigration operation completed. Total records fully moved: ${movedTotal}`);
}

runMigration();
