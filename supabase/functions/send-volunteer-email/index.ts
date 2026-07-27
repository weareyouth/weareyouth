import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { volunteer, toEmail } = await req.json();

    if (!volunteer) {
      return new Response(JSON.stringify({ error: "Missing volunteer data" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: "Resend API Key is not configured on the server." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "NGO Portal <onboarding@resend.dev>", // Resend sandbox testing sender
        to: toEmail || "leader@weareyouthfoundation.com",
        subject: `New Volunteer Application: ${volunteer.name}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #eaeaea; border-radius: 10px;">
            <h2 style="color: #00aeef; border-bottom: 2px solid #00aeef; padding-bottom: 10px; margin-top: 0;">New Volunteer Application</h2>
            <p><strong>Name:</strong> ${volunteer.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${volunteer.email}">${volunteer.email}</a></p>
            <p><strong>Phone:</strong> ${volunteer.phone || 'Not Provided'}</p>
            <p><strong>Selected Role:</strong> ${volunteer.role || 'Not Provided'}</p>
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 15px; border-left: 4px solid #d4af37;">
              <h4 style="margin-top: 0; margin-bottom: 8px; color: #555;">Message:</h4>
              <p style="margin: 0; line-height: 1.5; font-style: italic;">"${volunteer.message || 'No message provided.'}"</p>
            </div>
          </div>
        `,
      }),
    });

    const resData = await response.json();

    return new Response(JSON.stringify(resData), {
      status: response.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
