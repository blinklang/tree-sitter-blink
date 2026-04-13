---
description: Next: Pick and Work tree-sitter-blink Tasks
---

# Next: Pick and Work tree-sitter-blink Tasks

Pick ready tasks from Bridge and execute the appropriate workflow based on type.

**Usage:** `/next` (auto-picks) or `/next $ARGUMENTS` (match by keyword)

---

## Step 1: Fetch Ready Tasks

Run `br ready -t repo:tree-sitter-blink` to get all unblocked tasks.

If no tasks are ready, run `br blocked -t repo:tree-sitter-blink`, report what's stuck, and ask the user how to proceed.

## Step 2: Select Tasks

Sort ALL ready tasks by priority first (P0 > P1 > P2 > P3 > P4), then by type preference within the same priority level (bug > friction > feature > project).

If `$ARGUMENTS` is provided, filter tasks whose title matches the argument (case-insensitive substring).

**Selection logic — priority-first, then type:**

1. Sort the full ready list by priority. Within the same priority, prefer: bug > friction > feature > project.
2. Walk the sorted list and pick up to 5 tasks, applying type rules:
   - `type:bug` / `type:friction` — auto-start, no confirmation needed.
   - `type:feature` — requires confirmation before starting.
   - `type:project` — requires confirmation; pick at most 1 project.
   - `type:chore` - auto-start, no confirmation needed.
3. Don't skip a higher-priority task just because of its type. A P2 spec should be surfaced before a P4 feature.

## Step 3: Route by Type and do the work

### type:bug — Auto-start, parallelizable
For each bug:
1. `br start <id>`
2. Read the task description, find relevant grammar rules or test cases
3. Add a failing corpus test in `test/corpus/` that reproduces the bug
4. Fix the bug in `grammar.js`
5. `npx tree-sitter generate` then `npx tree-sitter test`
6. run `/simplify`
7. `br close <id>`

When working multiple bugs: use parallel agents with worktrees. Each agent gets one bug.

### type:friction — Auto-start, parallelizable
For each friction item:
1. `br start <id>`
2. Analyze: root cause? What should be done?
3. Create follow-up tasks, routing to the repo where the fix belongs:
   - Grammar bug → `br add "..." -t repo:tree-sitter-blink -t type:bug`
   - Blink spec/compiler issue → `br add "..." -t repo:blink -t type:friction` or `type:spec`
   - Grammar improvement → `br add "..." -t repo:tree-sitter-blink -t type:feature`
4. `br close <id>` the friction task
5. Report what was created
6. run `/simplify`

### type:feature — Confirm first, parallelizable
1. Present all selected features with brief proposed approaches
2. Wait for user approval of the batch
3. Each feature: plan → implement in `grammar.js` → `npx tree-sitter generate` → `npx tree-sitter test` → `/simplify` -> br close <id>`

When working multiple features: use parallel agents with worktrees. Each agent gets one feature.

### type:project — Confirm first, single task
1. Present the task to the user
2. Break it down into subtasks with type tags
3. `br add` each subtask with `-t repo:tree-sitter-blink -t type:*`
4. Add dependencies: `br dep add <blocker> <blocked>`
5. Set priorities
6. Report breakdown
7. `br close <id>` or keep as tracker

### type:chore - Auto-start, parallelizable
You can do chores and bugs at the same time.
For each chore item:
1. `br start <id>`
2. Read the task, find relevant info
3. Do the task
4. `br close <id>`

## Step 4: Ship it

After completing tasks:
- Summarize what changed per task
- run `/shipit`
