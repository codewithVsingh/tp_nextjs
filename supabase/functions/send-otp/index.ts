import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.49.4/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { phone } = await req.json();

    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return new Response(
        JSON.stringify({ error: "Valid 10-digit Indian phone number required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Generate 4-digit OTP
    const otp = String(Math.floor(1000 + Math.random() * 9000));
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 min

    // Invalidate previous unused OTPs for this phone
    await supabase
      .from("otp_codes")
      .update({ verified: true })
      .eq("phone", phone)
      .eq("verified", false);

    // Store new OTP
    const { error: insertError } = await supabase.from("otp_codes").insert({
      phone,
      code: otp,
      expires_at: expiresAt,
      verified: false,
    });

    if (insertError) {
      console.error("OTP insert error:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to generate OTP" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send SMS via Ping4SMS
    const apiKey = Deno.env.get("PING4SMS_API_KEY");
    if (!apiKey) {
      console.error("PING4SMS_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "SMS service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const smsMessage = `Your Tutors Parliament verification code is ${otp}. Valid for 5 minutes. Do not share this code.`;
    const smsUrl = `https://site.ping4sms.com/api/smsapi?key=${encodeURIComponent(apiKey)}&route=2&sender=PINGSM&number=${phone}&sms=${encodeURIComponent(smsMessage)}&templateid=1107164612508406352`;

    const smsResponse = await fetch(smsUrl);
    const smsResult = await smsResponse.text();
    console.log("SMS API response:", smsResult);

    return new Response(
      JSON.stringify({ success: true, message: "OTP sent successfully" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("send-otp error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
