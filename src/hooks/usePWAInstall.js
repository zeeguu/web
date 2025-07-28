import { useState, useEffect } from 'react';

const DISMISS_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours
// For testing: const DISMISS_DURATION_MS = 5 * 1000; // 5 seconds

export default function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isPWAInstalled, setIsPWAInstalled] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isIOSSafari, setIsIOSSafari] = useState(false);

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
      
      return isPWALaunch || isStandalone || isIOSStandalone;
    };

    // Detect if user is on mobile device
    const isMobileDevice = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
             (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); // iPad on iOS 13+
    };

    // Detect iOS Safari
    const isIOSSafari = () => {
      const userAgent = window.navigator.userAgent;
      const isIOS = /iPad|iPhone|iPod/.test(userAgent);
      const isSafari = /Safari/.test(userAgent) && !/CriOS|FxiOS|EdgiOS/.test(userAgent);
      return isIOS && isSafari;
    };

    const iosDetected = isIOSSafari();
    setIsPWAInstalled(checkIfPWA());
    setIsIOSSafari(iosDetected);

    // For iOS Safari on mobile, show banner immediately (no beforeinstallprompt event)
    if (iosDetected && isMobileDevice() && !checkIfPWA() && !isDismissedRecently()) {
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
    // iOS Safari doesn't support programmatic install
    if (isIOSSafari) {
      console.log('iOS Safari detected - cannot trigger install programmatically');
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

  return {
    isPWAInstalled,
    isInstallable,
    showInstallBanner,
    isIOSSafari,
    installPWA,
    dismissBanner,
    resetDismissal
  };
}