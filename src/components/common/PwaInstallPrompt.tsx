import React, { useEffect, useState } from 'react';
import { Download, X, Sparkles } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const PwaInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      const isDismissed = sessionStorage.getItem('cab_pwa_prompt_dismissed');
      if (!isDismissed) {
        setIsVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone 
      || document.referrer.includes('android-app://');

    if (isStandalone) {
      setIsVisible(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to cab install prompt: ${outcome}`);
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    sessionStorage.setItem('cab_pwa_prompt_dismissed', 'true');
    setIsVisible(false);
  };

  if (!isVisible || !deferredPrompt) return null;

  return (
    <div className="fixed bottom-6 right-6 left-6 md:left-auto md:w-96 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="relative overflow-hidden rounded-2xl bg-slate-900/95 backdrop-blur-md p-5 shadow-2xl border border-slate-800 transition-all duration-300 hover:shadow-orange-500/10 hover:border-orange-500/30">
        {/* Glow accent */}
        <div className="absolute -top-10 -left-10 w-24 h-24 bg-orange-500/15 rounded-full blur-xl pointer-events-none" />
        
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 p-3 bg-gradient-to-tr from-orange-500 to-amber-500 text-white rounded-xl shadow-md">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
              Install KK Smart Cab
            </h3>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Book rides faster, track your driver partner, manage wallet balances, and receive security alerts instantly.
            </p>
            
            <div className="mt-4 flex items-center gap-2.5">
              <button
                onClick={handleInstallClick}
                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-semibold rounded-lg shadow-sm transition-all duration-200 hover:scale-[1.02] cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Install App
              </button>
              <button
                onClick={handleDismiss}
                className="px-3 py-2 text-slate-400 hover:text-white text-xs font-medium rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Maybe Later
              </button>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close prompt"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
