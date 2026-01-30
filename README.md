# Tether - CI/CD Pipeline Implementation

A TypeScript package demonstrating a fully automated CI/CD pipeline with GitHub Actions.

Quick Start:

Development
npm install
npm run build
npm test

Release Process
Create PR with version bump in package.json
Add publish label to generate release candidate
Merge PR → automatic npm publish + GitHub release

CI/CD Pipeline
Workflows
PR Verification: Linting, building, testing on every PR
Label-Driven: verify for integration tests, publish for release candidates
Auto-Publish: Automatic npm publish on merge to main

Versioning
Pre-merge: X.Y.Z-dev-<sha> (development)
Post-merge: X.Y.Z (production, npm @latest)

Tech Stack
TypeScript
Jest (testing)
ESLint (linting)
GitHub Actions (CI/CD)
npm (package registry)

Configuration
.github/workflows/ci-cd.yml - Main pipeline
Reusable workflows from devops-automation repository
