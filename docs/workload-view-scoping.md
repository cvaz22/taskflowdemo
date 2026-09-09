# Scoping Brief: Workload View

## What You'd Need to Build

- **A new aggregate endpoint**, e.g. `GET /api/team/workload`, that returns every team member joined with their task counts broken down by status and priority in one query. The existing `server/routes/teams.js` only has `GET /:id/tasks` (one member's tasks). Calling that per member from the client would mean N requests for N teammates just to render the list, so this needs a single server-side aggregation (`GROUP BY assignee_id, priority` against `tasks`) rather than reusing what's there.
- **A `WorkloadCard` (or extended `MemberCard`) component** in `client/src/components/team/` that shows task count, a priority breakdown, and an overload indicator per person. Per the notes, this should look like the existing team cards, not a new visual language — so this is closer to *extending* `MemberCard.jsx` (`client/src/components/team/MemberCard.jsx`) with a workload section than building from scratch.
- **An overload signal** — color coding or an icon when someone's load crosses some threshold. This needs a definition of "overloaded" (see Unknowns below) before it can be built, but mechanically it's a conditional style branch, the same pattern `TaskRow.jsx` already uses for overdue dates (red styling via `isOverdue`).
- **A `useWorkload` hook** in `client/src/hooks/`, following the existing `useTeam.js` pattern (a thin wrapper around `useApi`), pointed at the new `/team/workload` endpoint.
- **Page-level integration** — either a new view on `client/src/pages/Team.jsx` or a toggle within it, since the notes describe this as the team page "right now" being basically useless, not a separate destination.

## What Already Exists

- **`Badge` component** (`client/src/components/common/Badge.jsx`) already has a `colorMap` for priority (`urgent`, `high`, `medium`, `low`) and could drive the priority-breakdown display directly, just add counts alongside each badge.
- **`MemberCard` / `MemberList`** (`client/src/components/team/`) already render the per-person card grid the notes want to build on. `MemberList.jsx`'s `auto-fill` grid and empty-state pattern can be reused as-is for the workload grid.
- **`useApi` / `useTeam`** (`client/src/hooks/useApi.js`, `useTeam.js`) establish the fetch-hook pattern any new `useWorkload` hook should follow, no new data-fetching approach needed.
- **`tasks` table** already has `priority`, `status`, `assignee_id`, and `estimated_hours` columns (`server/db/schema.sql`), so raw material for "task count by priority" exists without a schema change. Only the aggregation query and endpoint are missing.
- **Design tokens** for status/warning color (`--color-warning`, `--color-error`, `--color-warning-light`) are already defined in `tokens.css` and are the natural fit for an overload indicator.

## Dependencies & Unknowns

- **"Capacity" is not a real field anywhere in the schema.** `team_members` has no `capacity` or `hours_per_week` column. The notes ask for "task count and capacity," but right now capacity would have to be either (a) a raw task count compared against a hardcoded threshold, or (b) sum of `tasks.estimated_hours` per assignee compared against some hours limit that doesn't exist yet. This needs a product decision before engineering can scope it: what does "capacity" mean at TaskFlow, and does it need a new `capacity` column on `team_members`?
- **The overload threshold itself is undefined.** The notes give an anecdotal example (14 tasks vs. 3) but no rule. Is it count-based, hours-based, or priority-weighted (e.g. 3 urgent tasks is worse than 8 low-priority ones)? This is a conversation with Sarah before any styling logic gets written.
- **The triage/reassignment flow** ("click into someone's workload and see what could be reassigned") is explicitly flagged as maybe-not-v1 in the notes. It would need a task reassignment UI and likely a `PATCH /api/tasks/:id` call for `assignee_id` (the existing `PUT /api/tasks/:id` in `server/routes/tasks.js` already supports partial updates via `COALESCE`, so the write path exists) plus a new interaction surface. Worth explicitly scoping out of v1 rather than letting it creep in.

## Where the Difficulty Is

- **Easy: the visual layer.** Card layout, priority badges, and grid rendering all reuse existing components and tokens almost unchanged. This is the fastest part of the build once the data shape is settled.
- **Easy-medium: the new aggregate endpoint.** It's one new SQL query following the same `db.prepare(...).all()` pattern already used in `routes/tasks.js` and `routes/projects.js` (which already does subquery counts for `task_count`/`completed_count` on projects — nearly the same shape needed here for team members).
- **Hard: defining "capacity" and "overloaded."** This isn't a code problem, it's an undefined product concept. Nothing in the current schema or codebase encodes workload capacity, so whatever gets decided here may require a schema change (`ALTER TABLE team_members ADD COLUMN capacity`) — worth raising with Sarah early since it affects both the migration and the seed data (`server/db/seed.sql`) before this can look real in a demo.
- **Deferred complexity: reassignment.** If triage/reassignment goes into v1, it's a meaningfully bigger scope (new modal or inline UI, drag-and-drop or picker, likely touching `TaskForm.jsx` patterns) than the read-only dashboard. Recommend confirming this is v2 before estimating anything.
