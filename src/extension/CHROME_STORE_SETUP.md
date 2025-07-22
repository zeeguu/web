# Chrome Web Store Publishing Setup

## Prerequisites

1. You need a Chrome Web Store developer account ($5 one-time fee)
2. Your extension must already be published at least once manually

## Setup Steps

### 1. Create OAuth2 Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable the Chrome Web Store API:
    - Go to "APIs & Services" > "Library"
    - Search for "Chrome Web Store API"
    - Enable it

4. Create OAuth2 credentials:
    - Go to "APIs & Services" > "Credentials"
    - Click "Create Credentials" > "OAuth client ID"
    - Application type: "Desktop app"
    - Name it (e.g., "Chrome Extension Publisher")
    - Download the credentials

Client ID = YOUR_CLIENT_ID_HERE
Client secret = YOUR_CLIENT_SECRET_HERE

### 2. Get Refresh Token

Install the Chrome Web Store API client:

```bash
npm install -g chrome-webstore-upload-cli
```

Get your refresh token:

```bash
chrome-webstore-upload get-refresh-token --client-id=YOUR_CLIENT_ID --client-secret=YOUR_CLIENT_SECRET
```

This will open a browser window. Authorize the app and copy the refresh token.

### 3. Set Environment Variables

Add to your `.env` file or export in your shell:

```bash
export CHROME_CLIENT_ID="your-client-id"
export CHROME_CLIENT_SECRET="your-client-secret"  
export CHROME_REFRESH_TOKEN="your-refresh-token"
export CHROME_APP_ID="your-extension-id"  # Found in Chrome Web Store dashboard
```

### 4. Update package.json

Add the publish script:

```json
{
  "scripts": {
    "ext:publish:chrome": "npm run ext:buildZipChrome && node src/extension/scripts/publish-chrome.js"
  }
}
```

## Usage

```bash
# Build and publish to Chrome Web Store
npm run ext:publish:chrome
```

## GitHub Actions Integration

Create `.github/workflows/publish-extension.yml`:

```yaml
name: Publish Chrome Extension

on:
  workflow_dispatch:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build and publish extension
        env:
          CHROME_CLIENT_ID: ${{ secrets.CHROME_CLIENT_ID }}
          CHROME_CLIENT_SECRET: ${{ secrets.CHROME_CLIENT_SECRET }}
          CHROME_REFRESH_TOKEN: ${{ secrets.CHROME_REFRESH_TOKEN }}
          CHROME_APP_ID: ${{ secrets.CHROME_APP_ID }}
        run: npm run ext:publish:chrome
```

## Alternative: Using chrome-webstore-upload Package

For a simpler approach, you can use the `chrome-webstore-upload` npm package:

```bash
npm install --save-dev chrome-webstore-upload
```

Then create a simpler script that uses this package directly.

## Notes

- The Chrome Web Store API has rate limits
- Publishing can take 30-60 minutes to propagate
- You can only publish updates, not create new extensions via API
- Consider using semantic versioning and auto-incrementing version numbers