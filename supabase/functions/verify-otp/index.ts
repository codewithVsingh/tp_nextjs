import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const respond = (success: boolean, payload: Record<string, unknown> = {}) =>
  new Response(JSON.stringify({ success, ...payload }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { phone, code } = await req.json();

    if (!phone || !code) {
      return respond(false, { error: "Phone and code are required" });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Find matching OTP
    const { data: otpRecords, error: fetchError } = await supabase
      .from("otp_codes")
      .select("*")
      .eq("phone", phone)
      .eq("code", code)
      .eq("verified", false)
      .gte("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1);

    if (fetchError || !otpRecords || otpRecords.length === 0) {
      return respond(false, { error: "Invalid or expired OTP" });
    }

    // Mark OTP as verified
    await supabase
      .from("otp_codes")
      .update({ verified: true })
      .eq("id", otpRecords[0].id);

    // Create or update lead with otp_verified = true
    const { data: existingLead } = await supabase
      .from("leads")
      .select("id")
      .eq("phone", phone)
      .order("created_at", { ascending: false })
      .limit(1);

    let leadId: string;

    if (existingLead && existingLead.length > 0) {
      leadId = existingLead[0].id;
      await supabase
        .from("leads")
        .update({ otp_verified: true, step_reached: 2 })
        .eq("id", leadId);
    } else {
      const { data: newLead } = await supabase
        .from("leads")
        .insert({ phone, otp_verified: true, step_reached: 2 })
        .select("id")
        .single();
      leadId = newLead?.id || "";
    }

    return respond(true, { lead_id: leadId });
  } catch (err) {
    console.error("verify-otp error:", err);
    return respond(false, { error: "Internal server error" });
  }
});
