---
description: Publish @aeriondyseti/resonance-airp to npm - alpha or release (project)
---

Publish a new version to npm.

**Usage:** `/publish <mode> [version]`
- `/publish alpha` - Increment alpha.X counter, publish to @alpha tag
- `/publish release` - Analyze commits, suggest version, publish to @latest tag
- `/publish release 0.2.0` - Explicit version, publish to @latest tag

**Argument:** $ARGUMENTS

---

## Parse Arguments

Extract mode and optional version from `$ARGUMENTS`:
- If empty or unclear, ask: **"Publish to alpha or release?"**
- If `alpha` → Alpha Publish Flow
- If `release` or `release X.Y.Z` → Release Publish Flow

---

## Alpha Publish Flow

### A1. Pre-flight

```bash
cd packages/mcp-server
git status --short
git branch --show-current
grep '"version"' package.json
```

### A2. Merge to dev branch (if needed)

```bash
# If not already on dev or main, merge current branch
git checkout dev || git checkout -b dev
git merge --no-ff [current-branch] -m "Merge [branch] for alpha release"
```

### A3. Bump Alpha Version

Increment the alpha version (e.g., `0.1.0-alpha.1` → `0.1.0-alpha.2`):

```bash
cd packages/mcp-server
npm version prerelease --preid=alpha --no-git-tag-version
```

### A4. Commit and Push

```bash
git add packages/mcp-server/package.json
git commit -m "chore: publish $(grep '"version"' packages/mcp-server/package.json | cut -d'"' -f4) to alpha"
git push origin $(git branch --show-current)
```

### A5. Type Check and Publish

No build step needed - publishing TypeScript source directly for Bun runtime.

```bash
cd packages/mcp-server
bun run type-check && npm publish --access public --tag alpha
```

### A6. Report

```
Published to alpha tag: X.Y.Z-alpha.N
Branch: [branch]
Install with: bunx --bun @aeriondyseti/resonance-airp@alpha
```

---

## Release Publish Flow

### R1. Pre-flight Checks

```bash
cd packages/mcp-server
git branch --show-current
git status --short

# Check what's being released
git log main..HEAD --oneline
```

### R2. Determine Version

**If version provided in arguments:** Use that version.

**If no version provided:** Analyze commits since last release using semver:

| Bump | Trigger |
|------|---------|
| **MAJOR** | `BREAKING CHANGE:` in body, or `feat!:`, `fix!:` |
| **MINOR** | `feat:` commits |
| **PATCH** | `fix:`, `docs:`, `refactor:`, `perf:`, `test:`, `chore:` |

```bash
# Get last release version
git describe --tags --abbrev=0 main 2>/dev/null || echo "v0.0.0"

# Get commits since last release
git log main..HEAD --oneline
```

### R3. Confirm with User

Present:
- Current version → Proposed version
- Commits being released
- Changelog summary

Ask: "Release vX.Y.Z? (yes/no)"

### R4. Update CHANGELOG.md (if exists)

Add a new section at the top:

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added
- [new features]

### Changed
- [changes]

### Fixed
- [bug fixes]
```

### R5. Bump Version and Commit

```bash
cd packages/mcp-server
npm version X.Y.Z --no-git-tag-version
git add packages/mcp-server/package.json CHANGELOG.md
git commit -m "chore: release vX.Y.Z"
git push origin $(git branch --show-current)
```

### R6. Merge to main and Tag

```bash
git checkout main
git merge --no-ff [branch] -m "Release vX.Y.Z"
git tag vX.Y.Z
git push origin main --tags
```

### R7. Type Check and Publish to @latest

```bash
cd packages/mcp-server
bun run type-check && npm publish --access public
```

### R8. Reset dev to new baseline

After releasing, reset dev branch to track the new baseline:

```bash
git checkout dev || git checkout -b dev
git merge main  # Fast-forward to release commit

# Reset to X.Y.Z-alpha.0 (same version, alpha.0 suffix)
cd packages/mcp-server
npm version X.Y.Z-alpha.0 --no-git-tag-version
git add packages/mcp-server/package.json
git commit -m "chore: reset dev to X.Y.Z-alpha.0"
git push origin dev
```

### R9. Report

```
Published to latest: X.Y.Z
Branch: main
Tag: vX.Y.Z
npm: https://www.npmjs.com/package/@aeriondyseti/resonance-airp

Dev branch reset to: X.Y.Z-alpha.0
```
