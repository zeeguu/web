# iOS Release Skill

Release a new iOS version to the App Store.

## Usage
- `/ios-release` - bump patch version (1.1.1 → 1.1.2)
- `/ios-release minor` - bump minor version (1.1.1 → 1.2.0)
- `/ios-release major` - bump major version (1.1.1 → 2.0.0)
- `/ios-release 1.2.0` - set specific version

## Workflow

Execute these steps in order:

### 1. Get Current Version Info

```bash
# Get current version from project
grep "MARKETING_VERSION" ios/App/App.xcodeproj/project.pbxproj | head -1

# Get latest git tag (if using tags for releases)
git describe --tags --abbrev=0 2>/dev/null || echo "No tags found"

# Find last release commit (look for version bump commits)
git log --oneline --grep="Bump iOS version\|iOS release\|version to" -1
```

### 2. Show Changes Since Last Release

```bash
# Get commits since last version bump (adjust hash as needed)
git log --oneline HEAD~20..HEAD

# Show summary of changed files
git diff --stat HEAD~20..HEAD -- src/ ios/
```

Show the user the list of changes and summarize them.

### 3. Generate Release Notes

Based on the commits, generate release notes in this format:
- One line per user-facing change
- Start each line with "- "
- Focus on features, fixes, and improvements users will notice
- Keep it concise (4-8 bullet points)
- End with "- Bug fixes and improvements" if there are minor changes

Example format:
```
- New feature description
- Improved something
- Fixed some issue
- Bug fixes and improvements
```

### 4. Ask User to Verify Release Notes

Present the generated release notes and ask:
"Here are the proposed release notes. Would you like to edit them or proceed?"

Options:
- Proceed with these notes
- Edit the notes (let user provide changes)

### 5. Calculate New Version

Based on the argument:
- No argument or "patch": increment patch (1.1.1 → 1.1.2)
- "minor": increment minor, reset patch (1.1.1 → 1.2.0)
- "major": increment major, reset minor and patch (1.1.1 → 2.0.0)
- Specific version (e.g., "1.2.0"): use that version

### 6. Update Version in Project

Update `MARKETING_VERSION` in `ios/App/App.xcodeproj/project.pbxproj`:
- There are typically 2 occurrences (Debug and Release configurations)
- Both must be updated to the same version

```bash
# Verify the update
grep "MARKETING_VERSION" ios/App/App.xcodeproj/project.pbxproj
```

### 7. Update Release Notes File

Write the release notes to:
`ios/App/fastlane/metadata/en-US/release_notes.txt`

### 8. Commit Changes

```bash
git add ios/App/App.xcodeproj/project.pbxproj ios/App/fastlane/metadata/en-US/release_notes.txt
git commit -m "Bump iOS version to X.Y.Z

Release notes:
- Note 1
- Note 2

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

### 9. Push to Remote

```bash
git push
```

### 10. Run Fastlane Release

```bash
cd /Users/gh/zeeguu/js/web && npm run ios:release
```

This will:
- Increment build number automatically
- Build the app
- Upload to App Store Connect with metadata and screenshots

## Important Notes

- Info.plist uses `$(MARKETING_VERSION)` - no need to update it separately
- Fastlane reads version from project settings via `get_version_number`
- Build number is auto-incremented by fastlane
- Screenshots are overwritten if new ones exist in `fastlane/screenshots/`

## Troubleshooting

If "version already used" error:
- Check App Store Connect for the actual latest version
- Bump to a higher version number

If build fails:
- Check Xcode for signing issues
- Ensure certificates are valid in Keychain
