CI/CD Pipeline Documentation

Overview
This repository implements a fully automated CI/CD pipeline for a TypeScript package following semantic release practices. The pipeline uses GitHub Actions and is designed with reusable workflows.

Labels System
Available Labels
Label	Purpose	Trigger
verify	Triggers integration/E2E tests	When added to a PR
publish	Triggers release candidate generation and publishing	When added to a PR
How Labels Work
Default PR Checks: Every PR automatically runs:

Linting

Build

Unit tests

Branch validation (up-to-date with main, linear history)

With verify Label:

yaml
# Additional checks triggered:
- Integration tests
- End-to-end validation
- Cross-module compatibility tests
With publish Label:

yaml
# Additional workflow:
- Version validation (checks if version exists)
- Release candidate generation
- Pre-release npm build (with -dev suffix)
- Artifact creation
Both Labels (verify + publish):

Runs all verification steps

Generates release candidate

Performs full validation before merge

Release Process Flow
1. Development Phase
text
Developer → Creates Feature Branch → Makes Changes → Opens PR
2. Pull Request Validation
text
PR Created → Automatic Checks Run:
├── Code linting (ESLint/Prettier)
├── TypeScript compilation
├── Unit test execution
├── Dependency validation (package-lock.json)
└── Branch policy validation
3. Label Application
text
Maintainer Reviews → Applies Labels:
├── `verify` → Integration tests run
├── `publish` → Release candidate generated
└── Both → Full validation + release prep
4. Release Candidate Generation (Pre-Merge)
text
With `publish` label:
├── Version checked (must not exist on npm)
├── Pre-release version created (e.g., 1.2.3-dev-abc123)
├── Package built with dev suffix
├── Artifacts created
└── Ready for final review
5. Merge & Automatic Release
text
PR Merged → Automatic Release:
├── Full validation (re-runs all checks)
├── Version bump validation
├── npm publication (@latest)
├── Git tag creation (vX.Y.Z)
└── GitHub Release generation
How to Trigger Deployments
Option 1: Standard Feature Development
bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Make changes and commit
git add .
git commit -m "Add new feature"

# 3. Push and create PR
git push origin feature/new-feature
# Then create PR via GitHub UI
Option 2: Release Preparation
bash
# 1. Update package.json version
# Manually bump version following semver:
# - patch: 1.0.0 → 1.0.1 (bug fixes)
# - minor: 1.0.0 → 1.1.0 (new features, backward compatible)
# - major: 1.0.0 → 2.0.0 (breaking changes)

# 2. Create release branch
git checkout -b release/v1.2.3

# 3. Update version and commit
npm version patch --no-git-tag-version
git add package.json package-lock.json
git commit -m "chore: bump version to 1.2.3"

# 4. Push and create PR
git push origin release/v1.2.3

# 5. Add labels via GitHub UI:
#   - Add `verify` label for integration tests
#   - Add `publish` label for release candidate
Option 3: Hotfix Deployment
bash
# 1. Create hotfix from main
git checkout main
git pull
git checkout -b hotfix/critical-bug

# 2. Fix the issue and bump patch version
npm version patch --no-git-tag-version

# 3. Commit and push
git add .
git commit -m "fix: critical bug resolution"
git push origin hotfix/critical-bug

# 4. Create PR with both labels
# Labels: `verify` + `publish`
# Merge after approval → Automatic deployment
Versioning Strategy
Pre-Merge vs Post-Merge Versioning
Pre-Merge (Development Builds)
Format: X.Y.Z-dev-<short-sha>

Example: 1.2.3-dev-abc123def

When used: During PR validation with publish label

Purpose: Test the exact build that will be published

npm tag: next or dev

Key characteristic: Unique per commit, not published as latest

Post-Merge (Production Release)
Format: X.Y.Z

Example: 1.2.3

When used: After PR merge to main

Purpose: Stable production release

npm tag: latest

Key characteristic: Stable, semantic version

Version Bump Rules
yaml
# In package.json, follow SemVer:
major.X.Y (2.0.0):
  - Breaking API changes
  - Incompatible with previous versions

minor.X.Y (1.3.0):
  - New backward-compatible features
  - Deprecated functionality (still working)

patch.X.Y (1.2.4):
  - Bug fixes
  - Performance improvements
  - Documentation updates
Example Flow












Branch Protection Rules
Automated Setup
The pipeline automatically configures:

✅ Require PR before merging

✅ Require 1 approval minimum

✅ Require up-to-date branch

✅ Require status checks to pass

✅ Linear commit history (rebase only)

✅ Admin bypass enabled

❌ No force pushes allowed

❌ No branch deletions allowed

Manual Override
Admins can merge even if checks fail (for emergency fixes).

Reusable Workflows
Location
text
maksim-sialitski-innowise/devops-automation/
└── .github/workflows/
    ├── pr-verification.yml     # PR validation
    ├── integration-tests.yml   # Label: verify
    ├── publish-release.yml     # Label: publish + release
    └── setup-repository.yml    # Branch protection
Usage in Projects
yaml
# In your project's .github/workflows/ci-cd.yml
jobs:
  verification:
    uses: maksim-sialitski-innowise/devops-automation/.github/workflows/pr-verification.yml@main
    
  integration:
    if: contains(github.event.pull_request.labels.*.name, 'verify')
    uses: maksim-sialitski-innowise/devops-automation/.github/workflows/integration-tests.yml@main
Troubleshooting
Common Issues
PR checks not running

Ensure branch is up-to-date with main

Check if package-lock.json is committed

Version already exists error

Bump version in package.json

Ensure unique version for each release

Label not triggering workflows

Labels are case-sensitive

Wait for GitHub to register label changes

npm publish failure

Check NPM_TOKEN secret exists

Verify package name is available

Emergency Procedures
Bypass all checks (Admin only):

bash
# 1. Temporarily disable branch protection
# 2. Push directly to main
# 3. Re-enable protection
# 4. Create follow-up PR to fix pipeline
Support
For pipeline issues, check:

GitHub Actions logs

npm audit results

TypeScript compilation errors

Test execution reports
