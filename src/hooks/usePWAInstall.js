import { useState, useEffect } from 'react';

// Progressive dismissal durations: 5min → 15min → 1day → 2days → 1week
const DISMISS_DURATIONS = [
  5 * 60 * 1000,        // 5 minutes
  15 * 60 * 1000,       // 15 minutes
  24 * 60 * 60 * 1000,  // 1 day
  2 * 24 * 60 * 60 * 1000,  // 2 days
  7 * 24 * 60 * 60 * 1000   // 1 week
];

// Detect specific iOS browsers
const getIOSBrowserType = () => {
  const userAgent = window.navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(userAgent)) {
    if (/CriOS/.test(userAgent)) return 'chrome';
    if (/FxiOS/.test(userAgent)) return 'firefox';
    if (/EdgiOS/.test(userAgent)) return 'edge';
    if (/Safari/.test(userAgent) && !/CriOS|FxiOS|EdgiOS/.test(userAgent)) return 'safari';
    return 'other';
  }
  return null;
};

export default function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isPWAInstalled, setIsPWAInstalled] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isAnyIOSBrowser, setIsAnyIOSBrowser] = useState(false);

  // Check if banner was dismissed recently with progressive delays
  const isDismissedRecently = () => {
    const dismissedTime = localStorage.getItem('pwa-install-dismissed');
    const dismissCount = parseInt(localStorage.getItem('pwa-dismiss-count') || '0');
    
    if (!dismissedTime) return false;
    
    const now = Date.now();
    const timeSinceDismiss = now - parseInt(dismissedTime);
    
    // Use the appropriate duration based on dismiss count
    const durationIndex = Math.min(dismissCount, DISMISS_DURATIONS.length - 1);
    const currentDuration = DISMISS_DURATIONS[durationIndex];
    
    return timeSinceDismiss < currentDuration;
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
    const iosBrowserType = getIOSBrowserType();
    const isPWA = checkIfPWA();
    const isMobile = isMobileDevice();
    const isDismissed = isDismissedRecently();
    
    setIsPWAInstalled(isPWA);
    setIsAnyIOSBrowser(anyIOSBrowser);

    // For any iOS browser, show banner immediately (no beforeinstallprompt event on iOS)
    if (anyIOSBrowser && isMobile && !isPWA && !isDismissed) {
      setIsInstallable(true);
      setShowInstallBanner(true);
    }
    
    // For Android, also show banner as fallback if beforeinstallprompt doesn't fire
    // Wait a bit to give beforeinstallprompt a chance to fire first
    const androidFallbackTimer = setTimeout(() => {
      if (!anyIOSBrowser && isMobile && !isPWA && !isDismissed && !isInstallable) {
        setIsInstallable(true);
        setShowInstallBanner(true);
      }
    }, 2000); // Wait 2 seconds

    // Listen for PWA install prompt
    const handleBeforeInstallPrompt = (e) => {
      console.log('beforeinstallprompt event fired!', e);
      e.preventDefault();
      
      // Only allow PWA installation on mobile devices
      if (!isMobileDevice()) {
        console.log('Not mobile device, ignoring prompt');
        return;
      }
      
      console.log('Setting deferred prompt and showing banner');
      setDeferredPrompt(e);
      setIsInstallable(true);
      
      // Show banner only if not in PWA and not recently dismissed
      if (!checkIfPWA() && !isDismissedRecently()) {
        setShowInstallBanner(true);
      }
    };

    // Listen for successful PWA install
    const handleAppInstalled = () => {
      setIsPWAInstalled(true);
      setShowInstallBanner(false);
      setDeferredPrompt(null);
      localStorage.removeItem('pwa-install-dismissed');
      localStorage.removeItem('pwa-dismiss-count');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearTimeout(androidFallbackTimer);
    };
  }, []);

  const installPWA = async () => {
    // iOS browsers don't support programmatic install
    if (isAnyIOSBrowser) {
      return false;
    }

    if (!deferredPrompt) {
      return false;
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setShowInstallBanner(false);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    } finally {
      setDeferredPrompt(null);
    }
  };

  const dismissBanner = () => {
    setShowInstallBanner(false);
    
    // Increment dismiss count and save timestamp
    const currentCount = parseInt(localStorage.getItem('pwa-dismiss-count') || '0');
    const newCount = currentCount + 1;
    
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    localStorage.setItem('pwa-dismiss-count', newCount.toString());
  };

  const resetDismissal = () => {
    localStorage.removeItem('pwa-install-dismissed');
    localStorage.removeItem('pwa-dismiss-count');
    if (isInstallable && !isPWAInstalled) {
      setShowInstallBanner(true);
    }
  };

  return {
    isPWAInstalled,
    isInstallable,
    showInstallBanner,
    isAnyIOSBrowser,
    iosBrowserType: getIOSBrowserType(),
    installPWA,
    dismissBanner,
    resetDismissal,
    // Debug info
    hasDeferredPrompt: !!deferredPrompt,
    userAgent: navigator.userAgent,
    // Add console logs for mobile debugging
    debugLog: `Mobile: ${isMobileDevice()}, iOS: ${isAnyIOSBrowser}, Prompt: ${!!deferredPrompt}`
  };
}