import { Booking } from '../types';

export interface NotificationPayload {
  recipient_name: string;
  recipient_email: string;
  recipient_phone: string;
  subject: string;
  sms_body: string;
  email_body: string;
  timestamp: string;
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

export const notificationService = {
  dispatchBookingNotification(
    booking: Booking,
    event: 'created' | 'confirmed' | 'checked_in' | 'checked_out'
  ) {
    const name = booking.guest_name || 'Valued Guest';
    const email = booking.guest_email || 'guest@reetay.com';
    const phone = booking.guest_phone || '+233 24 000 0000';
    const ref = booking.id;
    const propertyTitle = booking.property?.title || 'Luxury Residence';
    const category = booking.booking_category === 'short_time' ? `Short-Time Stay (${booking.short_time_hours}h)` : 'Overnight Stay';

    let subject = '';
    let smsBody = '';
    let emailBody = '';

    if (event === 'created') {
      subject = `Reetay Properties: Booking Received #${ref}`;
      smsBody = `Dear ${name}, your ${category} reservation #${ref} for ${propertyTitle} has been received. Check-in: ${booking.check_in} ${booking.check_in_time || ''}.`;
      emailBody = `Dear ${name},\n\nThank you for choosing Reetay Properties. Your ${category} reservation #${ref} for ${propertyTitle} has been received successfully.\n\nDetails:\nCheck-in: ${booking.check_in} ${booking.check_in_time || ''}\nTotal Price: ${booking.currency}${booking.total_price}\n\nWe look forward to welcoming you!`;
    } else if (event === 'confirmed') {
      subject = `Reetay Properties: Booking Confirmed #${ref}`;
      smsBody = `Dear ${name}, your stay #${ref} at ${propertyTitle} is now CONFIRMED. Check-in date: ${booking.check_in}. Contact reception on arrival.`;
      emailBody = `Dear ${name},\n\nYour reservation #${ref} at ${propertyTitle} is officially CONFIRMED.\n\nOur front desk concierge team is ready to welcome you. Contact reception for assistance.`;
    } else if (event === 'checked_in') {
      subject = `Reetay Properties: Welcome to ${propertyTitle}!`;
      smsBody = `Welcome to Reetay Properties, ${name}! You are now checked in for stay #${ref}. Enjoy your luxury experience.`;
      emailBody = `Dear ${name},\n\nYou have been successfully checked in for stay #${ref} at ${propertyTitle}.\n\nIf you need anything, call our 24/7 concierge.`;
    } else if (event === 'checked_out') {
      subject = `Reetay Properties: Check-Out Confirmed #${ref}`;
      smsBody = `Dear ${name}, your check-out for stay #${ref} at ${propertyTitle} has been completed. Thank you for staying with Reetay Properties!`;
      emailBody = `Dear ${name},\n\nYour check-out for stay #${ref} at ${propertyTitle} has been completed.\n\nThank you for choosing Reetay Properties. We hope to see you again soon!`;
    }

    const payload: NotificationPayload = {
      recipient_name: name,
      recipient_email: email,
      recipient_phone: phone,
      subject,
      sms_body: smsBody,
      email_body: emailBody,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    console.log(`[SMS DISPATCH] To: ${phone} | ${smsBody}`);
    console.log(`[EMAIL DISPATCH] To: ${email} | Subject: ${subject}`);

    // Notify all toast listeners
    listeners.forEach(cb => cb(payload));
  }
};
