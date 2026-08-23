import { Booking } from '../types';

export interface NotificationPayload {
  recipient_name: string;
  recipient_email: string;
  recipient_phone: string;
  subject: string;
  sms_body: string;
  email_body: string;
  timestamp: string;
  all_recipients?: string[];
}

// Global active notification toast listener
type ToastCallback = (payload: NotificationPayload) => void;
const listeners: ToastCallback[] = [];

export const subscribeToNotifications = (cb: ToastCallback) => {
  listeners.push(cb);
  return () => {
    const idx = listeners.indexOf(cb);
    if (idx !== -1) listeners.splice(idx, 1);
  };
};

const dispatchHistory: NotificationPayload[] = [];

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@reetay.com';
const MANAGER_EMAIL = import.meta.env.VITE_MANAGER_EMAIL || 'manager@reetay.com';
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const notificationService = {
  getDispatchHistory(): NotificationPayload[] {
    return dispatchHistory;
  },

  async dispatchBookingNotification(
    booking: Booking,
    event: 'created' | 'confirmed' | 'checked_in' | 'checked_out'
  ): Promise<NotificationPayload> {
    const name = booking.guest_name || 'Valued Guest';
    const email = booking.guest_email || 'guest@reetay.com';
    const phone = booking.guest_phone || '+233 24 000 0000';
    const ref = booking.id;
    const propertyTitle = booking.property?.title || 'Luxury Residence';
    const category = booking.booking_category === 'short_time' ? `Short-Time Stay (${booking.short_time_hours}h)` : 'Overnight Stay';
    const bookingTypeLabel = booking.booking_type === 'walk_in' ? 'Walk-In Desk' : 'Online Booking';

    // 1. Gather all 3 recipient email addresses: Client + Admin + Manager
    const allRecipients = Array.from(
      new Set(
        [email, ADMIN_EMAIL, MANAGER_EMAIL].filter(e => e && e.includes('@'))
      )
    );

    let subject = '';
    let smsBody = '';
    let emailBody = '';

    if (event === 'created') {
      subject = `[Reetay Reservation Request] New ${bookingTypeLabel} #${ref} - ${name}`;
      smsBody = `Dear ${name}, your reservation request #${ref} for ${propertyTitle} has been received. Pending payment verification by Admin. Check-in: ${booking.check_in}.`;
      emailBody = `Dear ${name},\n\nThank you for choosing Reetay Properties. Your ${category} reservation request #${ref} (${bookingTypeLabel}) for ${propertyTitle} has been received.\n\nPayment Status: PENDING ADMIN VERIFICATION\n• Ref ID: #${ref}\n• Total Amount: ${booking.currency || '$'}${booking.total_price}\n• Check-in: ${booking.check_in} ${booking.check_in_time || ''}\n• Check-out: ${booking.check_out} ${booking.check_out_time || ''}\n\nNote: Our Admin Concierge team will verify your payment and send your official confirmed voucher.\n\nNotifications dispatched to:\n- Client: ${email}\n- Admin: ${ADMIN_EMAIL}\n- Manager: ${MANAGER_EMAIL}`;
    } else if (event === 'confirmed') {
      subject = `[Reetay Official Voucher] Reservation Confirmed & Payment Received #${ref} - ${name}`;
      smsBody = `Dear ${name}, payment received! Your reservation #${ref} at ${propertyTitle} is now CONFIRMED. Check-in: ${booking.check_in}.`;
      emailBody = `Dear ${name},\n\nPayment Received & Confirmed!\n\nYour reservation #${ref} at ${propertyTitle} is officially CONFIRMED by Reetay Admin.\n\nOur concierge team is looking forward to welcoming you.`;
    } else if (event === 'checked_in') {
      subject = `[Reetay Welcome] Checked-In #${ref} - ${name}`;
      smsBody = `Welcome to Reetay Properties, ${name}! You are now checked in for stay #${ref}.`;
      emailBody = `Dear ${name},\n\nYou have been successfully checked in for stay #${ref} at ${propertyTitle}.`;
    } else if (event === 'checked_out') {
      subject = `[Reetay Check-Out] Stay #${ref} - ${name}`;
      smsBody = `Dear ${name}, your check-out for stay #${ref} at ${propertyTitle} has been completed. Thank you!`;
      emailBody = `Dear ${name},\n\nYour check-out for stay #${ref} at ${propertyTitle} has been completed.\n\nThank you for choosing Reetay Properties!`;
    }

    const payload: NotificationPayload = {
      recipient_name: name,
      recipient_email: email,
      recipient_phone: phone,
      subject,
      sms_body: smsBody,
      email_body: emailBody,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      all_recipients: allRecipients
    };

    dispatchHistory.unshift(payload);
    console.log(`[SMS DISPATCH] To: ${phone} | ${smsBody}`);
    console.log(`[EMAIL DISPATCH] To: ${allRecipients.join(', ')} | Subject: ${subject}`);

    // Notify all UI toast listeners
    listeners.forEach(cb => cb(payload));

    // 2. Real-time Email Dispatch: Resend API (Direct or via Edge Function)
    const resendApiKey = import.meta.env.VITE_RESEND_API_KEY;
    const fromEmail = import.meta.env.VITE_FROM_EMAIL || 'Reetay Concierge <onboarding@resend.dev>';
    const testOwnerEmail = import.meta.env.VITE_TEST_OWNER_EMAIL || 'reetaypropertiess@gmail.com';

    if (resendApiKey) {
      try {
        const sendEmail = async (targetRecipients: string[]) => {
          return await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${resendApiKey}`
            },
            body: JSON.stringify({
              from: fromEmail,
              to: targetRecipients,
              subject: subject,
              text: emailBody,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
                  <div style="background-color: #2E0854; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 900; letter-spacing: 0.5px;">REETAY PROPERTIES & LUXURY SUITES</h1>
                    <p style="color: #d8b4fe; margin: 4px 0 0 0; font-size: 12px;">Airport Residential Area, Accra, Ghana</p>
                  </div>
                  <div style="padding: 24px; background-color: #ffffff;">
                    <h2 style="color: #2E0854; font-size: 18px; font-weight: 800; margin-top: 0;">${subject}</h2>
                    <div style="background-color: #f8fafc; padding: 16px; border-radius: 12px; border-left: 4px solid #c084fc; margin: 16px 0;">
                      <pre style="font-family: Arial, sans-serif; font-size: 14px; color: #1e293b; white-space: pre-wrap; margin: 0;">${emailBody}</pre>
                    </div>
                  </div>
                  <div style="background-color: #f1f5f9; padding: 16px; text-align: center; border-radius: 0 0 12px 12px; font-size: 11px; color: #64748b;">
                    Tel: +233 24 123 4567 | Email: concierge@reetay.com<br/>
                    © 2026 Reetay Apartments & Luxury Suites. All rights reserved.
                  </div>
                </div>
              `
            })
          });
        };

        let response = await sendEmail(allRecipients);

        if (!response.ok) {
          const errData = await response.json();
          console.warn('[RESEND API WARNING]', errData);

          // If blocked due to Resend testing domain restriction (only allowed to send to owner email)
          if (errData?.statusCode === 403 || errData?.message?.includes('testing emails')) {
            console.log(`[RESEND TEST FALLBACK] Redirecting notification to account owner (${testOwnerEmail})...`);
            response = await sendEmail([testOwnerEmail]);
          }
        }

        if (response.ok) {
          console.log('[RESEND API SUCCESS] Real-time email delivered successfully!');
        }
      } catch (err) {
        console.error('[RESEND DISPATCH ERROR]', err);
      }
    }

    // 3. Fallback / Edge Function Dispatch
    try {
      const functionUrl = import.meta.env.VITE_EMAIL_API_URL || 
        (SUPABASE_URL && SUPABASE_URL !== 'https://placeholder.supabase.co' ? `${SUPABASE_URL}/functions/v1/send-booking-email` : null);

      if (functionUrl && !resendApiKey) {
        await fetch(functionUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_ANON_KEY || ''}`
          },
          body: JSON.stringify({ booking, event, recipients: allRecipients })
        });
        console.log(`[EDGE FUNCTION] Email dispatched to (${allRecipients.join(', ')})`);
      }
    } catch (err) {
      console.warn('Supabase Edge Function fallback failed:', err);
    }

    return payload;
  }
};

