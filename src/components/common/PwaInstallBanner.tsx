import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Download, X, Smartphone, Sparkles, CheckCircle2 } from 'lucide-react';
import { ReetayLogo } from './ReetayLogo';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PwaInstallBanner: React.FC = () => {
  const location = useLocation();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Determine if current route is for staff/admin vs clients
  const isStaffRoute =
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/manager') ||
    location.pathname.startsWith('/reception') ||
    location.pathname.startsWith('/portal/login');

  useEffect(() => {
    // Check if dismissed in current session
    const dismissed = sessionStorage.getItem('reetay_pwa_dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }

    // Listen for browser install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback instruction demo for browsers or standalone desktop
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('reetay_pwa_dismissed', 'true');
  };

  if (isDismissed || isInstalled) {
    if (showToast) {
      return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white border border-purple-100 text-[#2E0854] px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span className="text-xs font-extrabold">
            {isStaffRoute
              ? 'Staff App added to home screen!'
              : 'Reetay Luxury App added to home screen!'}
          </span>
        </div>
      );
    }
    return null;
  }

  return (
    <>
      {/* Compact, White, Highly Responsive PWA Install Banner */}
      <div className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-4">
        <div className="bg-white text-navy-950 p-2.5 sm:p-3 px-3 sm:px-4 rounded-2xl sm:rounded-full border border-purple-100/90 shadow-xl shadow-purple-950/10 flex items-center justify-between gap-2.5 sm:gap-3 backdrop-blur-md">
          
          {/* Left: Compact Brand Logo & Details */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-purple-50 border border-purple-100 p-1 flex items-center justify-center flex-shrink-0">
              <ReetayLogo size="sm" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5 text-[#2E0854] flex-shrink-0" />
                <h4 className="text-xs font-black text-[#2E0854] tracking-tight truncate">
                  {isStaffRoute ? 'Install Staff App' : 'Install Reetay App'}
                </h4>
              </div>
              <p className="text-[10px] text-gray-500 font-medium truncate leading-tight">
                {isStaffRoute
                  ? 'Add staff portal to home screen'
                  : 'Add to home screen for 1-click booking'}
              </p>
            </div>
          </div>

          {/* Right: Action Button & Close */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={handleInstallClick}
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#2E0854] hover:bg-black text-white font-extrabold text-[11px] sm:text-xs shadow-md active:scale-95 transition-all flex items-center gap-1 whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5 text-gold-400 stroke-[2.5]" />
              <span>{isStaffRoute ? 'Install Staff' : 'Install'}</span>
            </button>

            <button
              onClick={handleDismiss}
              className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* Safari / Desktop Instruction Toast */}
      {showToast && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 bg-white border border-purple-200 text-[#2E0854] px-4 py-2.5 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Sparkles className="w-4 h-4 text-gold-600" />
          <span>Tap browser menu & select "Add to Home Screen"</span>
        </div>
      )}
    </>
  );
};
