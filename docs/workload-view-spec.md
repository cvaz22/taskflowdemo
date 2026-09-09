# Feature Spec: Workload View

## Vision

Sarah (engineering lead) needs to see team workload at a glance without asking around or scrolling the Tasks board. Today there's no way to spot an imbalance without manually checking individual assignees. This feature turns the existing Team page into a workload dashboard: open it, and who's overloaded jumps out visually with no clicking required.

Success looks like: Sarah opens the Team page during a planning conversation and immediately sees who's flagged, without drilling into anyone's individual task list.

## Constraints

- **No per-project workload breakdown.** Aggregates across all projects; doesn't split a person's load by which project it's on.
- **No task reassignment/triage interaction in v1.** Read-only view. Clicking into someone's workload to reassign tasks is explicitly deferred to a later phase.
- **Must handle 50+ team members gracefully.** Layout and data loading need to hold up well past the current small seed dataset.
- **Must extend the existing `MemberCard` look and feel** (`client/src/components/team/MemberCard.jsx`), not introduce a new visual language. Should read as "the team page, but smarter."
- **Single aggregate API call**, not a per-member request waterfall — required both for the 50+ member constraint and to avoid the N+1 pattern the current `GET /api/team/:id/tasks` endpoint would force if called per person.

## Acceptance Criteria

1. **Team page shows every member with total task count and priority breakdown.** (Top priority — if only one criterion ships, it's this one. Overload styling is meaningless without accurate underlying counts.)
2. Overload is visually flagged directly on the card (color/icon) — no click-through required.
3. Layout holds up gracefully with 50+ team members.
4. Single aggregate API call loads all workload data (no per-person waterfall).
5. Visual style extends the existing `MemberCard`, not a new component style.
6. No task reassignment/triage interaction in v1 — read-only view.

**Open dependency:** the overload threshold itself (count-based, hours-based, or priority-weighted) is still undefined — see `docs/workload-view-scoping.md`. This needs a decision from Sarah before criterion #2 can be built.

## Edge Cases & Error States

| Scenario | Expected behavior |
|---|---|
| Member has zero tasks assigned | Explicit "No tasks assigned" note on the card, not a bare "0" — zero could mean they're free for new work, a useful signal for Sarah. |
| Workload data fails to load (API error/timeout) | Show cards with stale/cached data plus a "data may be outdated" warning, rather than a blank error screen. Note: the current `useApi` hook (`client/src/hooks/useApi.js`) doesn't cache anything, so this behavior requires new state-retention logic, not just error handling. |
| 50+ team members | Grid layout must not break or overflow oddly — verify against `MemberList.jsx`'s existing `auto-fill` grid at scale. |
| Access/permissions | No restriction — visible to everyone, same as the current Team page. TaskFlow has no real auth system yet (per `CLAUDE.md`), so this is moot until one exists. |

## Variant Directions

None specified for this feature.

## Test Plan

**Visual verification (screenshots):**
- Normal state with a realistic mix of loaded, light, and overloaded team members, to confirm the color/icon distinction reads clearly side by side.
- A card for a zero-task member, in context with other cards, showing the "No tasks assigned" note.

**Functional verification:**
- Load the Team page and confirm rendered counts and priority breakdowns match the underlying task data.
- Reassign a task to a different person elsewhere in the app, confirm the workload view reflects the updated counts on next load.
- Create a new task assigned to someone, confirm their count increments correctly.

**Edge case verification:**
- Zero-task member displays the explicit empty note, not a bare 0.
- Simulate an API failure and confirm stale-data + warning behavior instead of a blank/broken screen.
- Render with 50+ team members and confirm the grid layout holds.
