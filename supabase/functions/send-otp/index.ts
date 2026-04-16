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
    const { phone } = await req.json();

    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return respond(false, { error: "Valid 10-digit Indian phone number required" });
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
      return respond(false, { error: "Failed to generate OTP" });
    }

    // Send SMS via Ping4SMS
    const apiKey = Deno.env.get("PING4SMS_API_KEY");
    if (!apiKey) {
      console.error("PING4SMS_API_KEY not configured");
      return respond(false, { error: "SMS service not configured" });
    }

    const smsMessage = `Your Tutors Parliament verification code is ${otp}. Valid for 5 minutes. Do not share this code.`;
    const smsUrl = `https://site.ping4sms.com/api/smsapi?key=${encodeURIComponent(apiKey)}&route=2&sender=PINGSM&number=${phone}&sms=${encodeURIComponent(smsMessage)}&templateid=1107164612508406352`;

    const smsResponse = await fetch(smsUrl);
    const smsResult = await smsResponse.text();
    console.log("SMS API response:", smsResult);

    return respond(true, { message: "OTP sent successfully" });
  } catch (err) {
    console.error("send-otp error:", err);
    return respond(false, { error: "Internal server error" });
  }
});
