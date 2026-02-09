# CLAUDE.md

## Project Overview

This is a **GitHub profile repository** (`je31061/je31061`). The `README.md` in this repo is displayed on the owner's GitHub profile page. It is not a software project — it contains no source code, dependencies, or build infrastructure.

## Repository Structure

```
/
├── README.md    # GitHub profile README (displayed on github.com/je31061)
└── CLAUDE.md    # This file — guidance for AI assistants
```

## What This Repository Does

GitHub treats a repository named `<username>/<username>` as special. The `README.md` at the root is rendered on the user's public GitHub profile. This is the sole purpose of this repository.

## Key Facts

- **No build system** — no `package.json`, no bundler, no compiler
- **No tests** — no test framework or test files
- **No linting/formatting** — no ESLint, Prettier, or similar tooling
- **No CI/CD** — no GitHub Actions workflows or other pipelines
- **No `.gitignore`** — not currently needed (no generated files or dependencies)
- **Single file of content** — `README.md` is the only meaningful file

## Development Conventions

- The README uses GitHub-flavored Markdown
- Edits should preserve the profile README format (concise, personal introduction)
- Keep the HTML comment block that explains the special repository behavior

## Git Workflow

- **Remote**: `origin` points to `je31061/je31061`
- **Commits**: Use clear, descriptive commit messages
- **Branching**: Feature branches should use the `claude/` prefix when created by AI assistants

## Guidelines for AI Assistants

1. This repo is purely a Markdown profile page — do not introduce build tooling, package managers, or source code unless explicitly requested
2. Respect the owner's existing content and tone in `README.md`
3. If asked to enhance the profile, focus on Markdown formatting, badges, GitHub stats widgets, or similar profile README conventions
4. Keep changes minimal and purposeful
