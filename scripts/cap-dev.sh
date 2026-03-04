#!/bin/bash
set -e

PLATFORM=$1
if [ "$PLATFORM" != "ios" ] && [ "$PLATFORM" != "android" ] && [ "$PLATFORM" != "both" ]; then
  echo "Usage: $0 <ios|android|both>"
  exit 1
fi

IP=$(ipconfig getifaddr en0)
if [ -z "$IP" ]; then
  echo "Could not detect local IP. Are you connected to Wi-Fi?"
  exit 1
fi

PORT=3000
URL="http://$IP:$PORT"
echo "Starting Vite dev server at $URL ..."

# Start Vite in background, bound to all interfaces
npx vite --host &
VITE_PID=$!

# Wait for Vite to be ready
until curl -s -o /dev/null http://$IP:$PORT 2>/dev/null; do
  sleep 0.5
done
echo "Vite is ready."

if [ "$PLATFORM" = "both" ]; then
  LIVE_RELOAD_URL=$URL npx cap sync ios
  LIVE_RELOAD_URL=$URL npx cap sync android
  npx cap open ios
  npx cap open android
  echo "Hit Run in both Xcode and Android Studio. CSS/JS changes will hot-reload."
else
  LIVE_RELOAD_URL=$URL npx cap sync $PLATFORM
  npx cap open $PLATFORM
  if [ "$PLATFORM" = "ios" ]; then
    echo "Hit Run in Xcode. CSS/JS changes will hot-reload."
  else
    echo "Hit Run in Android Studio. CSS/JS changes will hot-reload."
  fi
fi

echo "Press Ctrl+C to stop."

# Keep running until Ctrl+C
wait $VITE_PID
