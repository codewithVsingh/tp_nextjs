import { supabase } from "./src/integrations/supabase/client";

async function verifyLeads() {
  const { data, error } = await supabase
    .from("leads")
    .select("id, name")
    .limit(5);

  if (error) {
    console.error("Error fetching leads:", error);
    return;
  }

  console.log("Leads Sample:", JSON.stringify(data, null, 2));

  const { data: tutorData, error: tutorError } = await supabase
    .from("tutor_registrations")
    .select("id, name")
    .limit(5);

  if (tutorError) {
    console.error("Error fetching tutors:", tutorError);
    return;
  }

  console.log("Tutors Sample:", JSON.stringify(tutorData, null, 2));
}

verifyLeads();
