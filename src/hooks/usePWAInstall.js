import { useState, useEffect } from 'react';

// const DISMISS_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours
const DISMISS_DURATION_MS = 1 * 60 * 1000; // 1 minute for testing

export default function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isPWAInstalled, setIsPWAInstalled] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isAnyIOSBrowser, setIsAnyIOSBrowser] = useState(false);

  // Check if banner was dismissed recently (within 24 hours)
  const isDismissedRecently = () => {
    const dismissedTime = localStorage.getItem('pwa-install-dismissed');
    if (!dismissedTime) return false;
    
    const now = Date.now();
    const timeSinceDismiss = now - parseInt(dismissedTime);
    
    return timeSinceDismiss < DISMISS_DURATION_MS;
  };

  useEffect(() => {
    // Check if user is already using PWA
    const checkIfPWA = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const isPWALaunch = urlParams.get('source') === 'pwa';
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSStandalone = window.navigator.standalone === true;
      const isFullscreen = window.matchMedia('(display-mode: fullscreen)').matches;
      const isMinimalUI = window.matchMedia('(display-mode: minimal-ui)').matches;
      
      const result = isPWALaunch || isStandalone || isIOSStandalone || isFullscreen || isMinimalUI;
      
      console.log('PWA Detection:', {
        isPWALaunch,
        isStandalone,
        isIOSStandalone,
        isFullscreen,
        isMinimalUI,
        result,
        userAgent: navigator.userAgent,
        url: window.location.href
      });
      
      return result;
    };

    // Detect if user is on mobile device
    const isMobileDevice = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
             (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); // iPad on iOS 13+
    };

    // Detect any iOS browser (Safari, Chrome, Firefox, etc.)
    const isIOSBrowser = () => {
      const userAgent = window.navigator.userAgent;
      return /iPad|iPhone|iPod/.test(userAgent);
    };


    const anyIOSBrowser = isIOSBrowser();
    const isPWA = checkIfPWA();
    const isMobile = isMobileDevice();
    const isDismissed = isDismissedRecently();
    
    setIsPWAInstalled(isPWA);
    setIsAnyIOSBrowser(anyIOSBrowser);

    console.log('Banner conditions check:', {
      anyIOSBrowser,
      isMobile,
      isPWA,
      isDismissed,
      shouldShowiOS: anyIOSBrowser && isMobile && !isPWA && !isDismissed
    });

    // For any iOS browser, show banner immediately (no beforeinstallprompt event on iOS)
    if (anyIOSBrowser && isMobile && !isPWA && !isDismissed) {
      console.log('iOS browser detected - showing install banner');
      setIsInstallable(true);
      setShowInstallBanner(true);
    }

    // Listen for PWA install prompt
    const handleBeforeInstallPrompt = (e) => {
      console.log('PWA install prompt available');
      e.preventDefault();
      
      // Only allow PWA installation on mobile devices
      if (!isMobileDevice()) {
        console.log('Desktop detected - PWA installation disabled to preserve extension functionality');
        return;
      }
      
      setDeferredPrompt(e);
      setIsInstallable(true);
      
      // Show banner only if not in PWA and not recently dismissed
      if (!checkIfPWA() && !isDismissedRecently()) {
        setShowInstallBanner(true);
      }
    };

    // Listen for successful PWA install
    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setIsPWAInstalled(true);
      setShowInstallBanner(false);
      setDeferredPrompt(null);
      localStorage.removeItem('pwa-install-dismissed');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installPWA = async () => {
    // iOS browsers don't support programmatic install
    if (isAnyIOSBrowser) {
      console.log('iOS browser detected - cannot trigger install programmatically');
      return false;
    }

    if (!deferredPrompt) {
      console.log('No install prompt available');
      return false;
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setShowInstallBanner(false);
        return true;
      } else {
        console.log('User dismissed the install prompt');
        return false;
      }
    } catch (error) {
      console.error('Error during PWA install:', error);
      return false;
    } finally {
      setDeferredPrompt(null);
    }
  };

  const dismissBanner = () => {
    setShowInstallBanner(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  const resetDismissal = () => {
    localStorage.removeItem('pwa-install-dismissed');
    if (isInstallable && !isPWAInstalled) {
      setShowInstallBanner(true);
    }
  };

  // Visual debug info - remove after testing
  const debugInfo = {
    isPWAInstalled,
    isInstallable, 
    showInstallBanner,
    isAnyIOSBrowser,
    userAgent: navigator.userAgent.substring(0, 50) + '...'
  };
  
  // Show debug on page
  if (typeof window !== 'undefined') {
    window.pwaDebugInfo = debugInfo;
  }

  return {
    isPWAInstalled,
    isInstallable,
    showInstallBanner,
    isAnyIOSBrowser,
    installPWA,
    dismissBanner,
    resetDismissal,
    debugInfo
  };
}