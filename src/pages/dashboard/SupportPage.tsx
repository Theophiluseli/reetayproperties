import React, { useState } from 'react';
import { Mail, Phone, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { dataService } from '../../lib/supabase';

export const SupportPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) return;
    setLoading(true);
    try {
      await dataService.createSupportTicket({
        user_name: name,
        user_email: email,
        subject,
        message
      });
      setSubmitted(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err) {
      alert('Error submitting support request. Please try calling concierge hotline.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <div>
        <h1 className="text-2xl font-black text-navy-950">Contact & VIP Support</h1>
        <p className="text-xs text-gray-500 font-medium">We are available 24/7 to assist with your stay, bookings, or special requests</p>
      </div>

      {/* 3 Contact Channels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* WhatsApp Direct */}
        <a
          href="https://wa.me/233241234567"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3 hover:border-emerald-200 hover:shadow-md transition-all group block"
        >
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-extrabold text-navy-950">WhatsApp Concierge</h3>
          <p className="text-xs text-gray-500 font-light">Instant messaging with our front desk team</p>
          <span className="inline-block text-xs font-bold text-emerald-600 group-hover:underline">
            Chat on WhatsApp &rarr;
          </span>
        </a>

        {/* 24/7 Hotline Call */}
        <a
          href="tel:+233241234567"
          className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3 hover:border-gold-200 hover:shadow-md transition-all group block"
        >
          <div className="w-10 h-10 rounded-full bg-gold-50 text-gold-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Phone className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-extrabold text-navy-950">24/7 Direct Hotline</h3>
          <p className="text-xs text-navy-950 font-bold">+233 24 123 4567</p>
          <span className="inline-block text-xs font-bold text-gold-600 group-hover:underline">
            Call Concierge Now &rarr;
          </span>
        </a>

        {/* Email Support */}
        <a
          href="mailto:concierge@reetay.com"
          className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3 hover:border-purple-200 hover:shadow-md transition-all group block"
        >
          <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-extrabold text-navy-950">Email Support</h3>
          <p className="text-xs text-navy-950 font-bold">concierge@reetay.com</p>
          <span className="inline-block text-xs font-bold text-purple-600 group-hover:underline">
            Send an Email &rarr;
          </span>
        </a>

      </div>

      {/* Support Ticket Submission Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
        <div>
          <h3 className="text-lg font-black text-navy-950">Submit a Support Request</h3>
          <p className="text-xs text-gray-500 font-medium">Send a direct message to our support desk. We respond within 15 minutes.</p>
        </div>

        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="text-base font-extrabold text-emerald-950">Request Received!</h4>
            <p className="text-xs text-emerald-700 font-medium">
              Your support inquiry has been sent to our concierge desk. A representative will contact you shortly.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-2 text-xs font-bold text-emerald-800 underline"
            >
              Submit another request
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. David Mensah"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-navy-950 outline-none focus:border-navy-950 transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Your Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="david@example.com"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-navy-950 outline-none focus:border-navy-950 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Subject / Reservation Ref</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Inquiry regarding Booking #RET-INV-BK-89021"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-navy-950 outline-none focus:border-navy-950 transition-colors"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">How can we assist you?</label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message or special request details here..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-medium text-navy-950 outline-none focus:border-navy-950 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 bg-navy-950 hover:bg-navy-900 text-white font-bold text-xs rounded-full shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              <Send className="w-4 h-4 text-gold-400" />
              <span>{loading ? 'Submitting...' : 'Submit Support Request'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
