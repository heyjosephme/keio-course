# Keio Course Planning Tool

A Keio distance learning management tool that helps students plan their graduation path and manage their course calendar.

## Project Overview

**Problem:** Students manually navigate complex graduation requirements across PDFs and guidelines - a time-consuming, error-prone process.

**Solution:** Constraint satisfaction algorithm that generates multiple valid graduation paths:
- Plan A: Graduate ASAP (efficient, harder courses)
- Plan B: Safer route (easier courses, backup options)
- Plan C: Interest-driven (courses you want to learn)

## Current Focus: Calendar Feature

Building a clean calendar interface for enrolled courses as the first MVP feature.

## Tech Stack

- **Frontend:** Next.js 15 + TypeScript + Tailwind CSS v4
- **Backend:** Rails API (future)
- **Validation:** Zod schemas
- **Authentication:** TBD

## Key Constraints (Keio Economics)

- **Total Credits:** 124 (48 general + 68 specialized + 8 thesis)
- **General Education:** 48+ credits
  - 3-Domain Courses: 32+ credits (24+ text-based, max 12 schooling/media)
  - Foreign Language: 8 credits (2 must be in-person)
- **Specialized:** 68+ credits (7 mandatory courses across 7 categories)
- **Delivery Methods:** Text, Schooling, Media

## Development Commands

```bash
# Development
pnpm dev

# Build
pnpm build

# Start production
pnpm start
```

## Project Structure

```
lib/
├── schemas/         # Zod schemas for validation
├── models/          # Data models
├── algorithms/      # Constraint satisfaction solver
└── parsers/         # PDF/data parsing utilities

app/
├── planner/         # Course planning interface
├── dashboard/       # Student dashboard
└── api/             # API routes

components/
├── ui/              # Reusable UI components
└── planner/         # Planning-specific components
```