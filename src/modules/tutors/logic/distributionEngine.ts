import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client (Replace with your env vars in production)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

interface DistributionEngineParams {
  area_slug?: string;
  city_slug?: string;
  subject?: string;
  mode?: "online" | "offline" | "both";
  limit?: number;
}

export async function getTutorsForPage({
  area_slug,
  city_slug,
  subject,
  mode,
  limit = 12,
}: DistributionEngineParams) {
  const page_slug = `/tutors/${area_slug ? `${area_slug}-` : ""}${city_slug || ""}`;
  let finalTutors: any[] = [];
  const addedTutorIds = new Set<string>();

  // =========================================================
  // 🥇 STEP 0: PAGE OVERRIDES (Highest Priority)
  // Admin Superpower: Always show these pinned tutors first
  // =========================================================
  const { data: overrides } = await supabase
    .from("page_overrides")
    .select("entity_id")
    .eq("page_slug", page_slug)
    .eq("entity_type", "tutor")
    .order("position", { ascending: true });

  if (overrides && overrides.length > 0) {
    const overrideIds = overrides.map((o) => o.entity_id);
    
    // Fetch pinned tutors and ensure they are active
    const { data: pinnedTutors } = await supabase
      .from("tutor_registrations")
      .select(`
        *,
        tutor_visibility!inner(is_featured, priority_score, visibility_status)
      `)
      .in("id", overrideIds)
      .eq("tutor_visibility.visibility_status", "active");

    if (pinnedTutors) {
      // Sort them to respect the override position order
      const sortedPinned = pinnedTutors.sort(
        (a, b) => overrideIds.indexOf(a.id) - overrideIds.indexOf(b.id)
      );
      
      sortedPinned.forEach(tutor => {
        finalTutors.push(tutor);
        addedTutorIds.add(tutor.id);
      });
    }
  }

  // If we already filled the quota just with overrides, return early
  if (finalTutors.length >= limit) {
    return finalTutors.slice(0, limit);
  }

  // =========================================================
  // PREPARE LOCATION RESOLUTION
  // Resolve slugs to actual Area and City IDs
  // =========================================================
  let areaId = null;
  let cityId = null;

  if (area_slug) {
    const { data: areaData } = await supabase
      .from("areas")
      .select("id, city_id")
      .eq("slug", area_slug)
      .single();
    if (areaData) {
      areaId = areaData.id;
      cityId = areaData.city_id; // Derived automatically, as you noted!
    }
  } else if (city_slug) {
    const { data: cityData } = await supabase
      .from("cities")
      .select("id")
      .eq("slug", city_slug)
      .single();
    if (cityData) {
      cityId = cityData.id;
    }
  }

  // Build the base dynamic query for standard tutors
  let query = supabase
    .from("tutor_registrations")
    .select(`
      *,
      tutor_visibility!inner(is_featured, priority_score, visibility_status),
      tutor_locations!inner(area_id, mode)
    `)
    .eq("tutor_visibility.visibility_status", "active");

  // If IDs were already added via overrides, exclude them
  if (addedTutorIds.size > 0) {
    query = query.not("id", "in", `(${Array.from(addedTutorIds).join(",")})`);
  }

  // =========================================================
  // 🥈 STEP 1: EXACT AREA MATCH (Offline)
  // =========================================================
  if (areaId && (!mode || mode === "offline")) {
    const { data: areaTutors } = await query
      .eq("tutor_locations.area_id", areaId)
      .in("tutor_locations.mode", ["offline", "both"])
      .order("tutor_visibility.priority_score", { ascending: false, foreignTable: "tutor_visibility" })
      .order("tutor_visibility.is_featured", { ascending: false, foreignTable: "tutor_visibility" })
      .limit(limit - finalTutors.length);

    if (areaTutors) {
      areaTutors.forEach(tutor => {
        if (!addedTutorIds.has(tutor.id)) {
          finalTutors.push(tutor);
          addedTutorIds.add(tutor.id);
        }
      });
    }
  }

  // =========================================================
  // 🥉 STEP 2: CITY MATCH (Broader fallback)
  // =========================================================
  if (cityId && finalTutors.length < limit && (!mode || mode === "offline")) {
    // Note: To match by city, we need to join areas. 
    // In Supabase standard JS client, deep filtering across multiple tables can be complex.
    // For a robust implementation, you might want to create a Supabase View: `vw_tutor_city_locations`
    // For now, let's assume we fetch all area IDs in that city.
    const { data: cityAreas } = await supabase.from("areas").select("id").eq("city_id", cityId);
    
    if (cityAreas && cityAreas.length > 0) {
      const cityAreaIds = cityAreas.map(a => a.id);
      let cityQuery = supabase
        .from("tutor_registrations")
        .select(`
          *,
          tutor_visibility!inner(is_featured, priority_score, visibility_status),
          tutor_locations!inner(area_id, mode)
        `)
        .eq("tutor_visibility.visibility_status", "active")
        .in("tutor_locations.area_id", cityAreaIds)
        .in("tutor_locations.mode", ["offline", "both"])
        .order("tutor_visibility.priority_score", { ascending: false, foreignTable: "tutor_visibility" })
        .order("tutor_visibility.is_featured", { ascending: false, foreignTable: "tutor_visibility" })
        .limit(limit - finalTutors.length);
        
      if (addedTutorIds.size > 0) {
        cityQuery = cityQuery.not("id", "in", `(${Array.from(addedTutorIds).join(",")})`);
      }

      const { data: cityTutors } = await cityQuery;

      if (cityTutors) {
        cityTutors.forEach(tutor => {
          if (!addedTutorIds.has(tutor.id)) {
            finalTutors.push(tutor);
            addedTutorIds.add(tutor.id);
          }
        });
      }
    }
  }

  // =========================================================
  // 🌐 STEP 4: ONLINE TUTORS (Universal Fallback)
  // =========================================================
  if (finalTutors.length < limit && (!mode || mode === "online")) {
    let onlineQuery = supabase
      .from("tutor_registrations")
      .select(`
        *,
        tutor_visibility!inner(is_featured, priority_score, visibility_status),
        tutor_locations!inner(mode)
      `)
      .eq("tutor_visibility.visibility_status", "active")
      .in("tutor_locations.mode", ["online", "both"])
      .order("tutor_visibility.priority_score", { ascending: false, foreignTable: "tutor_visibility" })
      .order("tutor_visibility.is_featured", { ascending: false, foreignTable: "tutor_visibility" })
      .limit(limit - finalTutors.length);

    if (addedTutorIds.size > 0) {
      onlineQuery = onlineQuery.not("id", "in", `(${Array.from(addedTutorIds).join(",")})`);
    }

    const { data: onlineTutors } = await onlineQuery;

    if (onlineTutors) {
      onlineTutors.forEach(tutor => {
        if (!addedTutorIds.has(tutor.id)) {
          finalTutors.push(tutor);
          addedTutorIds.add(tutor.id);
        }
      });
    }
  }

  // =========================================================
  // 📊 FINAL SORTING & SUBJECT FILTERING
  // =========================================================
  
  // Note: Subject filtering can be done either dynamically in the DB queries above,
  // or via post-filtering here depending on your array format.
  if (subject) {
    finalTutors = finalTutors.filter(tutor => 
      tutor.subjects.some((s: string) => s.toLowerCase() === subject.toLowerCase())
    );
  }

  // Sort remaining manually if needed by ratings/experience (Mock sorting for now)
  // finalTutors.sort((a, b) => (b.rating || 0) - (a.rating || 0));

  return finalTutors.slice(0, limit);
}
