# Changelog

All notable changes to the Zeeguu Browser Extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).









## [2.5.13] - 2026-02-04

### Fixed
- Fix Firefox cookie access by adding zeeguu.org (without www) to permissions
- Fix Firefox session retrieval with URL variations fallback
- Improve error messages (show "Connection error" instead of "Language not supported" for API errors)

## [2.5.12] - 2026-02-04

### Fixed
- Fix extension not loading after Vite migration (webpack compatibility for import.meta.env)
- Fix session validation check (API returns "OK" not "true")
- Fix crash when userDetails is undefined in ProgressContext
- Fix webpack publicPath error for dynamic imports

## [2.5.11] - 2025-12-11

### Added
- Track reading source (extension vs web) when starting reading sessions for activity history

## [2.5.10] - 2025-11-19

### Changed
- Complete pre-extraction optimization: Extension now extracts all article data locally using Mozilla Readability
- Backend processing completely bypassed for extension requests - significantly faster article loading
- Improved bot detection avoidance by doing all extraction client-side in user's browser

### Added
- Client-side main image extraction (checks og:image meta tag and article HTML)
- Pass extracted data (title, author, excerpt, text, image) directly to backend

### Fixed
- HTML entities (like &quot;) in article titles and metadata are now properly decoded

## [2.5.9] - 2025-11-19

### Added
- Release 2.5.9

## [2.5.8] - 2025-11-19

### Added
- Release 2.5.8

## [2.5.7] - 2025-11-19

### Fixed
- Fixed authentication error handling to properly detect expired sessions
- Extension now automatically clears stale cookies when session expires
- Improved error messages to distinguish between authentication errors and language support issues
- Users no longer need to manually log in again if already logged in on zeeguu.org

## [2.5.6] - 2025-08-21

### Added
- Styling of headings and list items in text
- Translate & Simplify for articles that are not in the learned language

## [2.5.5] - 2025-08-20

### Added
- Simplify article button

### Fixed
- Better visual feedback while article is being prepared


## [2.5.4] - 2025-07-24

### Fixed

- Fixed DOM manipulation error on fotogramas.es and similar websites by removing redundant link cleanup
- Fixed styled-components style injection crashes by adding safety checks to insertBefore operations

### Removed

- Removed unnecessary removeLinks function from generalClean.js since DOM is completely replaced anyway

## [2.5.3] - 2025-07-22

### Added

- Cross-browser compatibility improvements with unified cookie API
- ProgressContext provider for word review functionality
- Proper browser API abstraction layer for Chrome and Firefox

### Changed

- Renamed Modal component to InjectedReaderApp for better clarity
- Consolidated loading experience in popup with progress indicators
- Enhanced Firefox cookie handling with API-based fallback authentication
- Cleaned up debugging code and improved code maintainability

### Fixed

- Firefox login detection issues with cookie API returning undefined
- XMLHttpRequest timeout errors in synchronous requests
- Word review page crashing with useContext undefined error
- Styled-components loading before content display
- Cross-browser cookie access inconsistencies

## [2.5.2] - 2025-07-22

### Added

- Automated publishing system for Chrome Web Store and Firefox Add-ons
- Version management system with centralized version.json
- Development manifest support for localhost testing
- Comprehensive release process documentation

### Changed

- Improved build process to exclude debug files from production builds
- Updated popup UI for better user experience
- Enhanced error messaging and loading states

### Fixed

- Extension popup rendering issues in Chrome
- React JSX transform configuration for modern React
- Session authentication between popup and content script
- Firefox manifest compatibility (manifest v2)

## [2.5.1] - 2025-07-21

### Fixed

- Extension popup loading issues
- UI improvements for popup display

## [2.5.0] - 2025-07-20

### Added

- Improved popup interface
- Better error handling and user feedback

### Changed

- Enhanced UI components for better user experience

## Previous Versions

Earlier versions were released through manual processes. Starting with v2.5.2,
all releases follow the automated process documented in RELEASE_PROCESS.md.