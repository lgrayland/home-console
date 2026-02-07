# Home Console

Home Console is a self-hosted personal OS / second brain built to unify planning, tracking, and reflection in a single system.

It is an opinionated, long-lived project designed around:
- local-first data ownership
- clear domain boundaries
- incremental feature growth
- low operational overhead in a homelab environment

This is not a generic productivity app. It is intentionally personal and expected to evolve over time.

---

## Core Goals

- Replace scattered tools (notes, todos, planners, finance trackers) with one cohesive system
- Treat personal data as structured, queryable state rather than unstructured notes
- Optimise for daily use and long-term continuity
- Remain deployable and maintainable as a self-hosted service

---

## Architecture Overview

Frontend: Next.js (App Router)
Language: TypeScript
Styling/UI: Tailwind CSS + shadcn/ui

Backend approach:
- Server Components and Server Actions by default
- PostgreSQL as the primary datastore
- Typed SQL via a query builder (no heavy ORM abstractions)

Authentication: TODO
Deployment: Docker (homelab-first)

The application favours server-side logic and explicit data flows over client-heavy state.

---

## Key Modules

### Thoughts

Fast, low-friction capture for unstructured input.
- Designed for speed
- Minimal formatting
- Can be processed or promoted later

### Ideas

Longer-lived concepts organised using a PARA-style structure:
- Projects
- Areas
- Resources
- Archives

Ideas may evolve, link to other modules, or remain inactive.

### Todos

A planning-focused task system.
- Weekly planning as the primary view
- Status-based flow (planning → in progress → done)
- Supports both daily execution and weekly review

### Finance

Personal finance visibility and tracking.
- Multiple accounts (e.g. EUR / GBP)
- Recurring expenses
- Cash-flow-oriented views
- Manual by design (no automatic bank syncing)

### Other Modules

Additional modules are expected to emerge over time (e.g. travel, health, inventory, logs).

Each module should:
- Own its database schema
- Own its UI
- Minimise cross-module coupling

---

## Data Model Philosophy

- PostgreSQL is the single source of truth
- Schemas are explicit and migration-driven
- Each module maintains its own tables and query layer
- Types flow from the database upward

Avoid:
- god tables
- polymorphic blobs
- implicit or hidden relations

---

## Project Structure

app/
&nbsp;&nbsp;Next.js App Router

modules/
&nbsp;&nbsp;Domain modules (thoughts, todos, finance, etc.)
&nbsp;&nbsp;common/
&nbsp;&nbsp;&nbsp;&nbsp;components/
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ui/ - UI components (shadcn)

lib/
&nbsp;&nbsp;db/ – database config, migrations, queries
&nbsp;&nbsp;date/ – date and time utilities

Domains are organised by intent, not by technical layer.

---

## Local Development

Install dependencies and run the dev server:

pnpm install
pnpm dev

Required environment variables:

DATABASE_URL=

Database notes:
- PostgreSQL
- Migrations must be applied before running the app

---

## Deployment

Home Console is designed to run as a long-lived service in a homelab.

- Docker-based deployment
- Reverse proxy handled externally (e.g. Nginx Proxy Manager)
- Persistent data via mounted volumes

Planned:
- docker-compose.yml example
- backup and restore documentation

---

## Non-Goals

- Being a commercial SaaS
- Supporting arbitrary third-party customisation
- Feature parity with tools like Notion, Todoist, or YNAB

This is a personal system, not a platform.

---

## Guiding Principles

- Fewer features, better integrated
- Explicit over clever
- Boring, proven tech over novelty
- Data should outlive the UI
- The system should feel calm to use

---

## Status

This project is actively evolving.

Expect:
- schema changes
- module refactors
- ongoing UI iteration

Stability follows clarity.

---

## Future Ideas (Non-Exhaustive)

- Cross-module linking
- Global search
- Activity timeline
- Read-only public views
- Import/export tooling
