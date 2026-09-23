# CareerTrack

CareerTrack is a job-application tracking dashboard designed to help users stay organized throughout the job search process.

## Product overview

This project gives users a simple way to:

- track every job application in one place
- see the current status of each application
- review progress across the hiring pipeline
- keep follow-ups and decision stages organized
- monitor workload and daily activity trends

## App preview

![CareerTrack short demo](screenshots/careertrack-demo.gif)

## Key features

- Application dashboard with summary metrics
- Pipeline view by status stage
- Search and filtering for quick access
- Add new roles with company, role, location, salary, status, and link details
- Clean, mobile-friendly interface for browsing on the go

## Sample output

Example application record:

```json
{
  "company": "Northstar Labs",
  "position": "Frontend Engineer",
  "location": "Remote",
  "status": "WAITING",
  "salary": "$120k - $150k",
  "jobUrl": "https://example.com/jobs/1",
  "appliedAt": "2026-09-23"
}
```

Example dashboard summary:

```json
{
  "totalApplications": 42,
  "applied": 18,
  "waiting": 12,
  "interview": 7,
  "offer": 3,
  "rejected": 2
}
```

## Why this project matters

CareerTrack helps reduce the stress of managing multiple applications by turning a messy search into a clear, trackable workflow. It is especially useful for job seekers who want a lightweight system for staying consistent without juggling spreadsheets or scattered notes.

## Public demo

This repository contains only the clean public showcase. The runnable preview is the compiled static site in `public-site/`; the complete TypeScript, React, Node, API, and database implementation is kept in a separate private copy.

To preview the static files locally:

```bash
npx serve public-site
```

## Repository safety

Source code, local environment files, credentials, and application data are intentionally excluded from this public repository. Never commit API keys, database credentials, tokens, or personal application records.

## Public showcase note

This repository is intentionally presented as a product showcase, not the full production codebase. Sensitive configuration, internal code paths, and the complete implementation remain private and can be shared separately when appropriate.

The goal here is to share the product experience, the user workflow, and the output value without exposing the full implementation details.
