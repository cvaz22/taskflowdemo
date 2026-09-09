# Feature Spec: Team Workload Dashboard

## Vision
The PM/team lead uses this during sprint planning. Today, spotting an overloaded team member means clicking into each person's task list one by one, or just asking around. The dashboard's job is to make imbalance visible at a glance, without drilling into anyone's individual list. Success looks like: "I can spot Rachel's overloaded in 2 seconds" — that's the whole demo.

## Constraints
- **No reassignment in v1.** View and triage-plan only.
- **No editing tasks at all from this view.** Purely a read-only lens on workload; all task edits still happen from the Tasks page.
- **No historical/trend data.** Current-moment workload only.
- **Performance:** should hold up cleanly to ~50 team members without lag (well beyond current seed data, but worth building for).
- **UI consistency:** reuse the `Badge` component for any status/priority pills; stay within `tokens.css` for everything else. No new component libraries.

## Acceptance Criteria
1. **Overloaded members are visually flagged at a glance**, using a priority-weighted score (not a flat task count) — urgent and high-priority tasks weigh more than medium/low. *(Most critical — this is the "spot it in 2 seconds" bar.)*
2. Every team member shows a task count broken down by priority.
3. Clicking a member shows their full task list, read-only, no edit/reassign controls anywhere in this view.
4. Members with zero tasks show a clear "0 tasks / available" state, not a blank or missing card.
5. Members with a large task count render gracefully — count/badge caps or truncates rather than breaking layout.
6. If the workload data fails to load, show a clear error message with a retry option, matching the app's existing error-handling pattern.
7. Loads without lag at ~50 team members.

## Edge Cases & Error States
- **Zero tasks:** explicit "available" state, distinct from a loading or error state.
- **Very high task count:** badge/count visually caps rather than expanding the card indefinitely.
- **API failure:** clear error message + retry, not a silent failure or stale blank state.
- **Overload formula:** must be defined precisely enough to be testable — see Test Plan.

## Overload Formula
Priority-weighted score per member: `urgent × 3 + high × 2 + medium × 1 + low × 0.5`. A member is flagged "overloaded" when their score exceeds a threshold significantly above the team average (exact multiplier decided at build time, informed by the seed data — Rachel Torres should clearly flag, James should clearly not).

## Variant Directions

### Variant A: Expandable Rows
Each team member's card expands in place to show their task list, without leaving the grid.
- **Strongest argument for:** fewer clicks, feels lightweight — no modal or panel to open/close.
- **Biggest risk:** limited space for a detailed task list inline; multiple expanded rows can get messy.

### Variant B: Slide-Out Panel
Clicking a member slides a detail panel in from the side; the grid stays visible behind it.
- **Strongest argument for:** detail without losing the overview — you can glance back at the rest of the team while focused on one person.
- **Biggest risk:** squeezes the grid awkwardly on smaller screens.

### Variant C: Modal Deep-Dive
Clicking a member opens a full modal with their complete task breakdown.
- **Strongest argument for:** familiar pattern — the app already uses modals for create/edit flows.
- **Biggest risk:** you lose the team overview while it's open.

## Test Plan
**Visual:**
- Screenshot the grid at rest — confirm Rachel's overload reads instantly without clicking in.
- Screenshot each variant's detail view, for both an overloaded member (Rachel) and a low-load member.

**Functional:**
- Click through all three variants for the same two members (Rachel, a low-load member) and confirm consistent underlying data across all three.
- Confirm no edit/reassign controls appear anywhere in the workload view.

**Edge cases:**
- Member with 0 tasks → "available" state renders correctly.
- Member with a very high task count → badge/layout holds up.
- Simulated API failure → error + retry state renders.

**Formula verification:**
- Manually check the priority-weighted score for 2-3 known members against the raw task data, confirm the math and the flagging threshold produce sensible, expected results (Rachel flags, James doesn't).
