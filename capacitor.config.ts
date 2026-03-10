import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.zeeguu.app',
  appName: 'Zeeguu',
  webDir: 'build',
  server: {
    // Allow loading resources from your API
    cleartext: true,
    // This helps with CORS issues in the WebView
    androidScheme: 'https',
    // Set by ios:dev / android:dev scripts for live reload
    ...(process.env.LIVE_RELOAD_URL ? { url: process.env.LIVE_RELOAD_URL } : {}),
  },
  ios: {
    // Enable Web Inspector for debugging (even in release builds)
    webContentsDebuggingEnabled: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,  // Show for 2 seconds
      backgroundColor: "#ffffff", // Background color
      androidScaleType: "CENTER_CROP",
      showSpinner: false,  // Show loading spinner
      splashFullScreen: true,
      splashImmersive: true
    }
  }
};

export default config;
