# Extension Release Process

This document describes the monorepo-friendly release process for the Zeeguu Browser Extension.

## 🚀 Quick Release Process

```bash
# 1. Prepare release (bump version, update changelog, build)
npm run ext:release patch

# 2. Review CHANGELOG.md and test the built extension locally
# Load src/extension/build/ as unpacked extension in Chrome
# Test all functionality before proceeding

# 3. Run the build and test it locally:
npm run ext:buildZipChrome

# Load extension in Chrome:
# 1. Go to chrome://extensions/
# 2. Click "Load unpacked"
# 3. Select src/extension/build/ folder
# 4. Test all functionality


# 3. One-command git release (commit + tag extension only)
npm run ext:git release

# 4. Push (extension commits and tags)
git push && git push origin extension-v2.5.2

# 5. Publish to Chrome Web Store
npm run ext:publish
```

## 📦 Version Management Commands

```bash
# Check current version
npm run ext:version current

# Bump version types
npm run ext:version bump patch    # 2.5.0 → 2.5.1
npm run ext:version bump minor    # 2.5.0 → 2.6.0  
npm run ext:version bump major    # 2.5.0 → 3.0.0

# Sync manifests with version file
npm run ext:version sync
```

## 🔧 Extension-Specific Git Commands

```bash
# Check what extension files changed
npm run ext:git status

# Commit only extension changes
npm run ext:git commit "Fix popup loading bug"

# Create extension-specific tag
npm run ext:git tag 2.5.2

# List all extension releases
npm run ext:git list-tags

# Full release (commit + tag in one command)
npm run ext:git release
```

## 🏷️ Tag Naming Convention

- **Extension tags**: `extension-v2.5.2`
- **Web app tags**: `v1.4.0` (when releasing the web app)

This separation allows:

- ✅ Independent extension and web app releases
- ✅ Clear version history for each component
- ✅ No conflicts between extension and web app versions

## 📝 What the System Does

### Version Management (`npm run ext:version`)

- Maintains `src/extension/version.json` as single source of truth
- Auto-updates all manifest files (production and development)
- Syncs version, name, and description across all manifests

### Release Preparation (`npm run ext:release`)

1. Bumps version in `version.json`
2. Updates all manifest files (production and development)
   - `manifest.chrome.json`
   - `manifest.firefox.json`
   - `manifest.chrome.dev.json`
   - `manifest.firefox.dev.json`
3. Updates `CHANGELOG.md` with new version and date
4. Builds the extension (`npm run ext:buildZipChrome`)
5. Provides next steps

### Git Operations (`npm run ext:git`)

- Commits only extension-related files (`src/extension/`)
- Creates extension-specific tags (`extension-v2.5.2`)
- Lists extension release history
- Provides monorepo-friendly git workflow

## 📁 File Structure

```
src/extension/
├── version.json              # Single source of truth for version
├── CHANGELOG.md             # Extension-specific release notes
├── manifest.chrome.json     # Auto-updated from version.json
├── manifest.firefox.json    # Auto-updated from version.json
├── scripts/
│   ├── update-version.js    # Version management
│   ├── prepare-release.js   # Release preparation
│   ├── git-helpers.js       # Git operations
│   └── publish-chrome.js    # Chrome Web Store publishing
└── ...
```

## 🔄 Typical Development Workflow

1. **Make changes** to extension code
2. **Test locally** with unpacked extension from `src/extension/build/`
3. **Prepare release**: `npm run ext:release patch`
4. **Review CHANGELOG.md** - edit if needed  
5. **Test built extension** from `src/extension/build/` (load as unpacked)
6. **Final validation**: Extract and test `build.zip` if needed
7. **Create release**: `npm run ext:git release`
8. **Push changes**: `git push && git push origin extension-v2.5.X`
9. **Publish**: `npm run ext:publish` (publishes to both Chrome and Firefox)

## 🎯 Release Types

- **Patch (2.5.0 → 2.5.1)**: Bug fixes, small improvements
- **Minor (2.5.0 → 2.6.0)**: New features, significant improvements
- **Major (2.5.0 → 3.0.0)**: Breaking changes, major rewrites

## 🚦 Publishing to Stores

### Chrome Web Store

#### Setup (One-time)

1. Follow instructions in `CHROME_STORE_SETUP.md`
2. Set environment variables:
   ```bash
   export CHROME_CLIENT_ID="your-client-id"
   export CHROME_CLIENT_SECRET="your-client-secret"
   export CHROME_REFRESH_TOKEN="your-refresh-token"
   export CHROME_APP_ID="your-extension-id"
   ```

#### Publishing

```bash
# Automated publishing (after release is prepared)
npm run ext:publish:chrome
```

### Firefox Add-ons (AMO)

#### Setup (One-time)

1. Go to https://addons.mozilla.org/developers/addon/api/key/
2. Generate API credentials (JWT issuer and secret)
3. Set environment variables:
   ```bash
   export FIREFOX_JWT_ISSUER="user:12345:67"
   export FIREFOX_JWT_SECRET="your-jwt-secret"
   export FIREFOX_ADDON_SLUG="the-zeeguu-reader"
   ```

#### Publishing

```bash
# Automated publishing (after release is prepared)
npm run ext:publish:firefox
```

**Note**: Firefox requires manual review before publication.

### Publish to Both Stores

```bash
# Automated publishing to both Chrome and Firefox (recommended)
npm run ext:publish
```

This will:
1. Build and publish Chrome version
2. Build and publish Firefox version
3. Ensure both stores get the same version

## 🐛 Troubleshooting

### Version out of sync

```bash
npm run ext:version sync
```

### Check what's changed

```bash
npm run ext:git status
```

### List all extension releases

```bash
npm run ext:git list-tags
```

### Manual manifest update

Edit `src/extension/version.json` and run:

```bash
npm run ext:version sync
```

## 🧪 Local Testing Instructions

### Before Release

```bash
# Build for testing
npm run ext:buildZipChrome

# Load extension in Chrome:
# 1. Go to chrome://extensions/
# 2. Enable "Developer mode" (top right)
# 3. Click "Load unpacked"
# 4. Select src/extension/build/ folder
# 5. Test all functionality
```

### Testing Checklist

- [ ] Extension icon appears in browser toolbar
- [ ] Popup opens and displays correctly
- [ ] Login/logout functionality works
- [ ] Article translation features work
- [ ] Content script injection works on target sites
- [ ] No console errors in popup or content scripts
- [ ] All images/icons display correctly

### Reload Extension After Changes

```bash
# Rebuild and reload
npm run ext:buildZipChrome

# In Chrome: go to chrome://extensions/ and click reload icon
# Or use keyboard shortcut after selecting extension: Ctrl+R (Cmd+R on Mac)
```

## 📋 Checklist for Releases

- [ ] Changes tested locally with unpacked extension
- [ ] Extension functionality validated in browser
- [ ] Version bumped appropriately (patch/minor/major)
- [ ] CHANGELOG.md updated with changes
- [ ] Built extension tested from build/ folder
- [ ] Extension committed and tagged
- [ ] Changes pushed to repository
- [ ] Published to Chrome Web Store (if needed)
- [ ] Published to Firefox Add-ons (if needed)