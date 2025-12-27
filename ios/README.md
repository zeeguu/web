# iOS Deployment

## Quick Reference

```bash
# Check current version
npm run ios:version

# Build and open Xcode (for manual archive)
npm run ios:open

# Build and deploy to TestFlight (automatic)
npm run ios:beta

# With custom release notes
npm run ios:beta -- notes:"Fixed login persistence"

# Bump version and deploy
npm run ios:bump -- 1.0.3 && npm run ios:beta

# Deploy to App Store (for review)
npm run ios:release
```

## Scripts Explained

| Script | What it does |
|--------|--------------|
| `ios:version` | Shows current marketing version and build number |
| `ios:build` | Builds web app + syncs to iOS project |
| `ios:open` | Builds + opens Xcode (for manual archive) |
| `ios:bump -- X.Y.Z` | Sets marketing version (e.g., 1.0.3) |
| `ios:beta` | Builds + uploads to TestFlight + distributes to testers |
| `ios:release` | Builds + uploads to App Store Connect |

## Version Numbers

- **Marketing version** (1.0.3): What users see in App Store. Bump manually for releases.
- **Build number** (7): Auto-incremented by fastlane on each upload.

## First-Time Setup

1. Install fastlane: `brew install fastlane`
2. Create App-Specific Password at https://appleid.apple.com
3. Add to `~/.zshrc`:
   ```bash
   export FASTLANE_USER="your-apple-id@example.com"
   export FASTLANE_APPLE_APPLICATION_SPECIFIC_PASSWORD="xxxx-xxxx-xxxx-xxxx"
   ```

## Typical Release Flow

```bash
# 1. Bump version for new release
npm run ios:bump -- 1.1.0

# 2. Build and deploy to TestFlight
npm run ios:beta -- notes:"New feature: audio lessons"

# 3. Test on device via TestFlight app

# 4. When ready, submit to App Store
npm run ios:release
```
