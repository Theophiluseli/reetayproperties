import React, { useEffect, useState } from 'react';
import { subscribeToNotifications, NotificationPayload } from '../../lib/notificationService';
import { Mail, Smartphone, CheckCircle, X } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const [activeNotification, setActiveNotification] = useState<NotificationPayload | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToNotifications((payload) => {
      setActiveNotification(payload);
      const timer = setTimeout(() => {
        setActiveNotification(null);
      }, 6000);
      return () => clearTimeout(timer);
    });
    return () => unsubscribe();
  }, []);

  if (!activeNotification) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full bg-[#2E0854] text-white p-5 rounded-3xl shadow-2xl border border-purple-800 animate-in fade-in slide-in-from-bottom-5 space-y-3">
      <div className="flex items-center justify-between border-b border-purple-800/80 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-black text-purple-200 uppercase tracking-wider">SMS & Email Dispatched</span>
        </div>
        <button onClick={() => setActiveNotification(null)} className="text-purple-300 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex items-center gap-2 text-purple-100 font-bold">
          <Smartphone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>SMS to <span className="font-mono text-white">{activeNotification.recipient_phone}</span></span>
        </div>
        <p className="bg-purple-900/60 p-2.5 rounded-xl font-mono text-[11px] text-purple-200 border border-purple-800">
          "{activeNotification.sms_body}"
        </p>

        <div className="flex items-center gap-2 text-purple-100 font-bold pt-1">
          <Mail className="w-4 h-4 text-gold-400 flex-shrink-0" />
          <span>Email to <span className="text-white">{activeNotification.recipient_email}</span></span>
        </div>
      </div>
    </div>
  );
};
