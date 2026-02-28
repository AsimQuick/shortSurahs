# Sprint Retrospective Log

---

## Sprint 1 — Core MVP

**Sprint Duration:** 2026-02-28 -> 2026-03-14
**Retrospective Date:** 2026-02-28
**Retrospective Author:** tester

---

### Sprint Outcome

Sprint 1 did not complete. No implementation work was merged or branched. The sprint produced:
- Well-defined, requirements-approved user stories for all 6 stories (positive outcome from the planning phase).
- A broken CI baseline — the scaffold committed to `main` fails ESLint on every push because no `eslint.config.js` file exists.
- Zero feature development commits, zero PRs, zero merged branches.

The Tester Sprint Status is `FAILED`.

---

### Missed Checks

**MC-1: CI scaffold validation was not performed before the sprint started.**
The project scaffold (`ead7454 [SETUP] Initial project scaffold`) was committed and pushed to `main` without verifying that CI passes. The CI workflow (`ci.yml`) references `npx eslint . --max-warnings 0` but no ESLint configuration was included in the scaffold. This caused every subsequent push — including the planning commits — to fail CI immediately. A pre-sprint CI smoke test (verify all CI steps pass on the scaffold before the first sprint begins) would have caught this in minutes.

Future DoD addition: Before sprint kickoff, verify that CI passes on `main` at HEAD. A failing CI baseline is a sprint blocker and must be treated as P0.

**MC-2: `package.json` has no `test` script and no test runner installed.**
The CI workflow runs `npm test -- --coverage --coverageThreshold=...` but `package.json` defines no `test` script, and neither `jest` nor any test framework is listed in `dependencies` or `devDependencies`. This would cause the test step to fail even if Lint and TypeCheck passed. This was not caught in the scaffold review.

Future DoD addition: Confirm `package.json` has a working `test` script that invokes a test runner before the first dev PR is opened.

**MC-3: ESLint was not added to `devDependencies`.**
The CI workflow invokes `npx eslint` without ESLint being a declared project dependency. `npx` downloads ESLint on every CI run (adding latency and introducing version drift risk). ESLint should be pinned in `devDependencies` and installed via `npm ci`.

Future DoD addition: Lint toolchain (`eslint`, config package) must be declared in `devDependencies` and present in `package-lock.json` before the sprint begins.

**MC-4: Sprint started without a passing CI gate.**
Sprint 1 was initiated (`phase: development` was set) with CI already failing on `main`. Development cannot begin in a meaningful way when the baseline CI is broken — any feature PR will also fail CI for reasons unrelated to the feature itself. The Project Lead workflow should include a CI gate check before transitioning from `planning` to `development`.

---

### Process Improvements

**PI-1: Add a "Scaffold CI Smoke Test" step to the sprint kickoff checklist.**
Before any sprint begins, the Project Lead (or Dev Team) must push the scaffold, confirm all CI steps pass, and record the passing run ID. Only then should the sprint phase advance to `development`. This is a one-time verification per sprint that prevents CI-broken baselines from blocking all development work.

**PI-2: Include ESLint and Jest setup as a zero-story prerequisite task, not a user story.**
ESLint config, Jest config, and the `test` script in `package.json` are toolchain prerequisites, not product features. They should be set up as part of the scaffold (before Sprint 1) or as a zero-point tech setup task at the start of the sprint. They must not be left for feature PRs to resolve organically.

**PI-3: Add CI health to the Definition of Done at the sprint level.**
The sprint-level DoD should include: "CI passes on `main` at sprint start." This makes the CI baseline a gatable condition, not an assumption.

**PI-4: Add a PR template with the US-6 manual device test checklist.**
US-6 (Background Audio) requires manual device testing on physical iOS and Android devices — this cannot be automated. A PR template (`.github/pull_request_template.md`) with a manual test checklist for US-6 would prevent this requirement from being overlooked at merge time.

**PI-5: Requirements validation process worked well — carry forward.**
The two-round PO-Tester requirements validation loop (Round 1 flagging 3 stories as `requirements-defect`, Round 2 approving all 7 fixes) is evidence that the process adds real value. All 6 stories entered the development phase with specific, measurable, CI-verifiable acceptance criteria. This process should be preserved and made explicit in the sprint kickoff checklist for Sprint 2 and beyond.

---

### Carry-Forward Action Items (Sprint 2 Pre-Work)

| ID | Action | Owner | Priority |
|----|--------|-------|----------|
| CF-1 | Add `eslint.config.js` using Expo flat config format | Dev Team | P0 — blocks all CI |
| CF-2 | Add `eslint` and `eslint-config-expo` to `devDependencies` | Dev Team | P0 — blocks Lint step |
| CF-3 | Add `jest` config and `test` script to `package.json` | Dev Team | P0 — blocks Test step |
| CF-4 | Verify CI passes on `main` before first feature PR | Dev Team / Project Lead | P0 — sprint gate |
| CF-5 | Add `.github/pull_request_template.md` with US-6 manual test checklist | Dev Team | P1 |

---

---

## Sprint 1 Final QA Review

**Review Date:** 2026-03-01
**Review Author:** tester
**Sprint Phase at Review:** development (mid-sprint; sprint end date 2026-03-14)

---

### Sprint Outcome (Updated)

NOTE: The initial retrospective entry above (dated 2026-02-28) was written erroneously before any development work occurred — it reflected a pipeline misfire at sprint start. This section supersedes it with the actual mid-sprint quality assessment.

Significant implementation work was completed and merged between 2026-02-28 and 2026-03-01. 8 PRs merged, all with passing CI. The sprint goal is not yet met but foundation work is high quality.

**Stories fully done:** US-1 (Data Layer), US-2 (Navigation) — 6 story points
**Stories in progress:** US-3 (Surah List Screen, AC-3.1 done, AC-3.2 through AC-3.4 open) — partial credit on 5 points
**Stories not started:** US-4, US-5, US-6 — 15 story points

---

### Missed Checks (New — discovered during final QA review)

**MC-5: Dev-Tester loop did not distinguish infrastructure failures from code defects.**
The 3-iteration Dev-Tester loop for US-2 AC-2.1 was exhausted on Iteration 3 due to a transient GitHub Actions runner failure that produced no logs. This is not a code defect and should not have consumed an iteration. The loop cap exists to prevent endless code-defect cycles — it is not intended to penalize teams for infrastructure instability outside their control. The Project Lead correctly resolved this via a recovery decision, but the policy gap remained unaddressed for the sprint.

Future process addition: Infrastructure-only CI failures (zero-log failures, runner unavailability, timeout before output) must not count against the Dev-Tester loop iteration cap. Only failures that produce actionable failure output should consume an iteration. Add this rule to the Dev-Tester loop documentation before Sprint 2.

**MC-6: scrum-master.md sprint backlog table was not updated as stories were completed.**
At review date, scrum-master.md still shows US-1 and US-2 as `in-progress` even though both are fully merged and passing CI. The backlog table should reflect `done` status for completed stories. This is owned by the Project Lead script, not individual agents, but the staleness creates confusion for any agent reading scrum-master.md as a source of truth for sprint state.

Future process addition: After each merged PR, the Project Lead should update the sprint backlog table in scrum-master.md to reflect the correct story status. Alternatively, the backlog table should be explicitly flagged as "updated at sprint close only" to avoid misleading mid-sprint readers.

**MC-7: Two PRs exist for US-2 AC-2.1 (PR #10 and PR #12).**
PR #10 is titled "[US-2] AC-1: Install and configure Expo Router" and PR #12 is titled "[US-2] AC-2.1: Install and configure Expo Router." Both were merged. PR #10 appears to be a superseded early attempt or a branch naming error. Both passed CI. No quality defect resulted, but having two merged PRs for the same AC creates ambiguity in the audit trail.

Future process addition: PR branch naming should strictly follow the `feature/US-X-AC-Y` convention. If a PR is superseded by a later one covering the same AC, the earlier PR should be noted in the later PR's description for traceability.

**MC-8: US-3 AC-3.1 merged artwork source as string URI without a tracking issue for AC-3.2 completion dependency.**
The current `app/index.tsx` uses `source={{ uri: item.artwork }}` for artwork. The Dev Team Notes acknowledge this is temporary ("AC-3.2 will convert to bundled require() assets"). However, there is no explicit blocker or tracking mechanism to ensure this is picked up before US-3 is marked done. A reviewer unfamiliar with the sprint history could mistake the current state for AC-3.2 compliance.

Future process addition: When a PR is merged with a known incomplete AC, the PR description or Dev Team Notes should include an explicit "open item" tag with the AC number. The Tester should validate that open items are resolved before marking the story done.

---

### Process Improvements (New — from Sprint 1 development phase)

**PI-6: Dev-Tester loop policy: infrastructure failures must not consume iterations.**
As noted in MC-5, the loop cap should only apply to actionable code defects. This is a policy clarification, not a new process step. Add it to the loop documentation and share it with the Dev Team and Tester at Sprint 2 kickoff.

**PI-7: scrum-master.md sprint backlog must be kept current by the Project Lead.**
The Project Lead script should update the sprint backlog table after each PR merge. This is a low-effort, high-value housekeeping step that keeps the backlog table reliable for all agents throughout the sprint.

**PI-8: Require explicit "open item" tags in Dev Team Notes for deferred work within a merged PR.**
When a PR deliberately defers part of an AC (e.g., "AC-3.2 will be addressed in the next PR"), the Dev Team Notes should use a standardized marker such as `[OPEN: AC-X.Y]` so it is unambiguous to the Tester and Project Lead during quality gate review.

**PI-9: The two-iteration defect resolution pattern (US-1 and US-2 both needed exactly one defect-fix iteration) suggests the toolchain setup (devDependencies, peer resolution) is a recurring first-PR friction point.**
For Sprint 2, the Dev Team should perform a "first-PR preflight" before committing: run `npm ci`, `npx tsc --noEmit`, and `npm test` locally and confirm all pass before the first feature PR. This one step would likely have prevented both defects from reaching CI.

---

### CI Infrastructure Resolution Status

All carry-forward items from the early retrospective have been resolved:

| ID | Action | Status |
|----|--------|--------|
| CF-1 | Add `eslint.config.js` | RESOLVED — done in US-1 AC-1.1 |
| CF-2 | Add `eslint` and `eslint-config-expo` to devDeps | RESOLVED — done in US-1 AC-1.1 |
| CF-3 | Add `jest` config and `test` script | RESOLVED — done in US-1 AC-1.1 |
| CF-4 | Verify CI passes on `main` before first feature PR | RESOLVED — CI green from US-1 AC-1.1 onward |
| CF-5 | Add PR template with US-6 manual test checklist | OPEN — not yet added; remains a pre-US-6 action item |

---

### Carry-Forward Action Items (Remaining Sprint 1 Work)

| ID | Action | Owner | Priority |
|----|--------|-------|----------|
| CF-6 | Complete US-3 AC-3.2: bundled artwork, borderRadius, resizeMode: cover | Dev Team | P1 — blocks US-3 done |
| CF-7 | Complete US-3 AC-3.3: verify full bundled path compliance after AC-3.2 | Dev Team | P1 — blocks US-3 done |
| CF-8 | Complete US-3 AC-3.4: apply useColorScheme to background and text colors | Dev Team | P1 — blocks US-3 done |
| CF-9 | Implement US-4: Player Screen UI (all 4 ACs) | Dev Team | P1 |
| CF-10 | Implement US-5: Audio Playback (all 8 ACs) | Dev Team | P0 — core feature |
| CF-11 | Implement US-6: Background Audio (all 4 ACs) | Dev Team | P1 |
| CF-12 | Add `.github/pull_request_template.md` with US-6 manual test checklist | Dev Team | P1 — before US-6 PR |
| CF-13 | Update scrum-master.md sprint backlog to reflect US-1 and US-2 as done | Project Lead | housekeeping — RESOLVED |
| CF-14 | Document Dev-Tester loop infrastructure failure policy for Sprint 2 | Project Lead | process |

---

---

## Sprint 1 — Product Owner Retrospective

**Review Date:** 2026-03-01
**Review Author:** product-owner

---

### Sprint Outcome (PO Perspective)

Sprint 1 delivered a solid technical foundation but zero user-facing value. A user opening the app today sees a surah list (partially styled) and a placeholder player screen — but cannot hear audio. The sprint goal required "looping audio playback" which is entirely unimplemented.

**Accepted:** US-1 (3 pts) + US-2 (3 pts) = 6 story points
**Not accepted:** US-3 (partial), US-4, US-5, US-6 = 20 story points
**Velocity:** 6 / 26 = 23%

---

### What Went Well

**WW-1: Requirements validation prevented ambiguity from reaching development.**
The two-round PO-Tester validation loop caught 3 stories with subjective or unmeasurable ACs ("Apple Music aesthetic", "large padding", "large artwork"). Every AC that reached development was specific and CI-verifiable. This is the single most valuable process innovation of Sprint 1 and must be preserved.

**WW-2: CI quality discipline was maintained throughout.**
All 8 merged PRs passed CI. No force-merges, no skipped checks. Test count grew from 0 to 140 without a single regression. The Dev Team and Tester maintained high standards under pressure.

**WW-3: Defect resolution was fast and targeted.**
All 3 CI defects (missing @types/jest, ESLint glob, react peer version) were correctly diagnosed by the Tester and fixed by the Dev Team in a single iteration each. No defect required re-scoping or AC revision.

**WW-4: The Tester's quality gate process is thorough and fair.**
The final QA review distinguished between code defects, infrastructure incidents, and documentation staleness. Missed-checks (MC-5 through MC-8) are actionable without being punitive. The carry-forward table is well-structured. This level of rigor should be the standard for Sprint 2.

---

### What Didn't Go Well

**WDW-1: 23% velocity means the sprint was fundamentally misjudged.**
Either the sprint was overscoped (26 points was too ambitious for a first sprint with no established velocity baseline) or execution was too slow (foundation work took 100% of available time). Both factors contributed. Sprint 2 planning must use the actual velocity of 6 points as the baseline, not the aspirational 26.

**WDW-2: The P0 core feature (US-5, Audio Playback) was not started.**
US-5 is the product's reason to exist. It carries the highest story points (8) and the longest dependency chain (US-4 → US-5 → US-6). Not starting US-5 means the product cannot ship from Sprint 1 output. In hindsight, the build order should have front-loaded a vertical slice that reached audio playback, even with a minimal UI.

**WDW-3: CI infrastructure was broken at sprint start.**
The scaffold committed to `main` had no ESLint config, no test runner, and no test script. This should have been caught before Sprint 1 began. The Dev Team resolved it as part of US-1, but it consumed early-sprint velocity on toolchain work.

**WDW-4: US-1 and US-2 were serialized unnecessarily.**
These two stories have zero dependencies on each other. Executing them in parallel would have shaved time off the foundation phase and created room for US-3/US-4 work.

---

### Process Improvements (PO Recommendations for Sprint 2)

**PO-PI-1: Use actual velocity (6 pts) as the Sprint 2 planning baseline.**
Do not plan more than 8–10 story points for Sprint 2 until the team demonstrates it can deliver more. Overcommitting and underdelivering is worse than planning conservatively and finishing early.

**PO-PI-2: Front-load the highest-value story.**
Sprint 2 must prioritize US-5 (Audio Playback) above all else. If only one story ships from Sprint 2, it must be US-5. The build order should be: US-3 remaining + US-4 (parallel) → US-5 → US-6.

**PO-PI-3: Pre-sprint scaffold validation is non-negotiable.**
Before Sprint 2 development begins, confirm CI passes on `main` at HEAD. This is a one-minute check that prevents days of wasted time. Add it to the sprint kickoff checklist.

**PO-PI-4: Parallelize independent stories.**
Any stories without dependencies on each other should be developed in parallel. The dependency graph exists for this purpose — use it.

**PO-PI-5: Consider a "walking skeleton" approach for Sprint 2.**
Rather than completing all ACs for US-3 before starting US-4, consider a minimal vertical slice: basic list → basic player → audio playback → then polish. This de-risks the sprint by reaching the core feature loop earlier.

---

### Carry-Forward Backlog (Sprint 2 Input)

| Priority | Story | Remaining Work | Points |
|----------|-------|----------------|--------|
| P0 | US-5 | All 8 ACs (Audio Playback) | 8 |
| P1 | US-4 | All 4 ACs (Player Screen UI) | 5 |
| P1 | US-3 | AC-3.2, AC-3.3, AC-3.4 (List Screen polish) | ~3 (partial) |
| P1 | US-6 | All 4 ACs (Background Audio) | 2 |
| Process | CF-5 | PR template with US-6 manual test checklist | — |
| Process | CF-14 | Dev-Tester loop infrastructure failure policy | — |

**Total carry-forward:** ~18 story points of feature work.

---
