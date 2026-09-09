# Scoping Brief: Team Workload Dashboard

## What You'd Need to Build

- **A workload aggregation endpoint.** Nothing today returns "task count by priority, per team member" in one shot. `GET /api/team/:id/tasks` (`server/routes/teams.js`) already returns one member's tasks, but for a dashboard view of the whole team, you'd want a new endpoint, e.g. `GET /api/team/workload`, that joins `team_members` to `tasks` and groups by `assignee_id` and `priority` server-side rather than shipping every task to the client and counting there.
- **An overload/imbalance calculation.** "Rachel has 14 tasks, James has 3, that should jump out" is a threshold or relative-comparison rule (e.g. flag anyone with N+ open tasks, or anyone more than 2x the team average). This logic doesn't exist anywhere in the codebase yet — it's new business logic, not a UI concern.
- **A new page or dashboard section.** Either a new route (`client/src/pages/WorkloadDashboard.jsx`) or a significant addition to `Team.jsx`. Given the notes describe this as its own view with drill-in, a new page is the more natural fit, following the same shell pattern as `Dashboard.jsx` (`page-header`, `Spinner` gate while loading).
- **A workload card variant.** Extends `MemberCard.jsx` (`client/src/components/team/MemberCard.jsx`) with a task-count breakdown by priority and a visual warning state. Not a from-scratch component, a variant of an existing one.
- **A triage/drill-in view** (notes flag this as maybe-v1). Clicking into a member's workload to see what could be reassigned would reuse `GET /api/team/:id/tasks` for the data, but the reassignment UI itself (moving a task's `assignee_id`) is new — `PUT /api/tasks/:id` already supports updating `assignee_id`, so the backend piece is a non-issue; the UI for it is not.

## What Already Exists

- **`GET /api/team/:id/tasks`** (`server/routes/teams.js`) — already returns a member's tasks with project name joined in. Useful for the drill-in view without new backend work.
- **`PUT /api/tasks/:id`** (`server/routes/tasks.js`) — already supports reassigning a task via `assignee_id`. Reassignment during triage needs no new API work, just a UI that calls it.
- **`MemberCard.jsx`** — the existing card component the notes explicitly ask to reuse. Has an avatar, name, role, email. It's a natural base to extend with a task-count summary rather than replace.
- **`Badge.jsx`** — already drives every colored pill in the app off a `colorMap`. A priority breakdown ("4 urgent, 6 high") or a warning badge can reuse this directly instead of inventing new pill styling.
- **`Stats.jsx`** pattern (`client/src/components/dashboard/Stats.jsx`) — the grid-of-stat-cards approach could work for a team-level summary row (e.g. total overloaded members) above the per-member breakdown.
- **Design tokens** — `--color-warning`, `--color-error` and their light-background pairs already exist in `tokens.css`, which covers the color-coding the notes ask for without inventing new colors.

## Dependencies & Unknowns

- **No aggregation query exists today.** Every current API route returns rows for one resource (all tasks, one member's tasks). A "task count by priority per member across the whole team" query is new SQL, not a variation of something already written. Worth a conversation with engineering about whether this is a single grouped query or computed in the route handler.
- **The overload threshold is a product decision, not a technical one.** "14 vs. 3 is obviously imbalanced" is intuitive from the notes, but a concrete rule (fixed number? relative to team average? per-priority weighting so 5 urgent tasks counts differently than 5 low-priority ones?) needs to be decided before anyone builds the warning logic.
- **Triage/reassignment scope is explicitly unresolved in the notes** ("not sure if that's v1 or later"). The backend already supports it (`PUT /api/tasks/:id`), so this is a scope decision, not a technical blocker — worth resolving before estimating, since it changes whether this is one page or a page plus a modal flow.

## Where the Difficulty Is

- **Straightforward: the visual layer.** Extending `MemberCard.jsx` with a `Badge`-based priority breakdown and a warning color state follows patterns already used everywhere else in the app (tokens, `Badge`, `.card` styling). This is assembly, not invention.
- **Straightforward: the drill-in data fetch.** `GET /api/team/:id/tasks` already exists and already joins project names in. The drill-in view is mostly UI work on top of a working endpoint.
- **The real new work is the aggregation endpoint and the overload rule.** Nothing in the current codebase groups tasks by assignee and priority in one query, and there's no precedent for "flag when X" logic anywhere in the app. This is where genuinely new code gets written, not reused, and it's worth the most engineering conversation time.
- **Reassignment UI, if it's in v1, is a second new surface** (not just a new field on an existing form) — a way to pick a task and change its assignee from within the dashboard, distinct from the existing `TaskForm.jsx` edit flow.
