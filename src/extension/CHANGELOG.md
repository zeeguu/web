# Changelog

All notable changes to the Zeeguu Browser Extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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