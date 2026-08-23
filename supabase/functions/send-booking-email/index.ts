import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

interface EmailRequest {
  booking: {
    id: string;
    guest_name: string;
    guest_email: string;
    guest_phone: string;
    check_in: string;
    check_out: string;
    guests: number;
    total_price: number;
    currency?: string;
    booking_type?: 'online' | 'walk_in';
    booking_category?: 'overnight' | 'short_time';
    property?: {
      title: string;
      location?: {
        address: string;
      };
    };
  };
  event?: 'created' | 'confirmed' | 'checked_in' | 'checked_out';
}

const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") || "admin@reetay.com";
const MANAGER_EMAIL = Deno.env.get("MANAGER_EMAIL") || "manager@reetay.com";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

serve(async (req) => {
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Content-Type": "application/json",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers });
  }

  try {
    const { booking, event = "created" }: EmailRequest = await req.json();

    if (!booking || !booking.id) {
      return new Response(JSON.stringify({ error: "Missing booking data" }), {
        status: 400,
        headers,
      });
    }

    // 1. Gather all recipient email addresses: Client, Admin, Manager
    const recipients = Array.from(
      new Set(
        [booking.guest_email, ADMIN_EMAIL, MANAGER_EMAIL].filter(
          (email) => email && email.includes("@")
        )
      )
    );

    const bookingTypeLabel = booking.booking_type === "walk_in" ? "Walk-In Front Desk" : "Online Web Booking";
    const propertyName = booking.property?.title || "Luxury Stay";
    const totalAmount = `${booking.currency || "$"}${booking.total_price}`;

    const subject = `[Reetay] Reservation ${event.toUpperCase()} #${booking.id} - ${booking.guest_name}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8f7fc; margin: 0; padding: 20px; color: #2E0854; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; padding: 30px; border: 1px solid #e9d5ff; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
            .header { text-align: center; border-bottom: 2px solid #f3e8ff; padding-bottom: 20px; margin-bottom: 20px; }
            .logo { font-size: 22px; font-weight: 900; color: #2E0854; letter-spacing: 1px; }
            .badge { display: inline-block; padding: 6px 14px; background: #ecfdf5; color: #047857; border-radius: 50px; font-size: 11px; font-weight: 800; text-transform: uppercase; margin-top: 10px; }
            .details-box { background: #faf5ff; border: 1px solid #f3e8ff; border-radius: 14px; padding: 18px; margin: 20px 0; }
            .label { font-size: 10px; color: #6b7280; text-transform: uppercase; font-weight: 800; }
            .value { font-size: 14px; font-weight: 800; color: #2E0854; margin-bottom: 12px; }
            .total { font-size: 22px; font-weight: 900; color: #2E0854; text-align: right; margin-top: 15px; }
            .footer { text-align: center; font-size: 11px; color: #9ca3af; margin-top: 30px; border-top: 1px solid #f3f4f6; padding-top: 15px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">REETAY APARTMENTS & LUXURY SUITES</div>
              <div class="badge">OFFICIAL CONFIRMATION • ${bookingTypeLabel}</div>
            </div>

            <h2>Reservation ${event === "created" ? "Confirmation" : event}</h2>
            <p>A reservation has been processed for <strong>${booking.guest_name}</strong>.</p>

            <div class="details-box">
              <div class="label">Reservation Ref ID</div>
              <div class="value">#${booking.id}</div>

              <div class="label">Property / Vehicle</div>
              <div class="value">${propertyName}</div>

              <div class="label">Guest Contacts</div>
              <div class="value">${booking.guest_name} (${booking.guest_email} | ${booking.guest_phone || "N/A"})</div>

              <div class="label">Stay Schedule</div>
              <div class="value">${booking.check_in} &rarr; ${booking.check_out} (${booking.guests} Guests)</div>
            </div>

            <div class="total">
              <span style="font-size:12px; color:#6b7280; text-transform:uppercase;">Total Settled Amount:</span> ${totalAmount}
            </div>

            <div class="footer">
              Sent automatically by Reetay Apartments Concierge System.<br/>
              Notifications dispatched to: Client (${booking.guest_email}), Admin (${ADMIN_EMAIL}), Manager (${MANAGER_EMAIL})
            </div>
          </div>
        </body>
      </html>
    `;

    // 2. Dispatch via Resend API if API Key configured
    if (RESEND_API_KEY) {
      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Reetay Concierge <concierge@reetay.com>",
          to: recipients,
          subject,
          html: htmlContent,
        }),
      });

      const resendResult = await resendRes.json();
      return new Response(
        JSON.stringify({
          success: true,
          message: "Email dispatched via Resend to Client, Admin, and Manager",
          recipients,
          resendResult,
        }),
        { status: 200, headers }
      );
    }

    // Fallback response if RESEND_API_KEY is not set yet
    return new Response(
      JSON.stringify({
        success: true,
        message: "Email function executed successfully. (Set RESEND_API_KEY secret in Supabase Dashboard to send live emails).",
        recipients,
        subject,
      }),
      { status: 200, headers }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers,
    });
  }
});
