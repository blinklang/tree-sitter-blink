---
allowed-tools: Bash(git push:*), Bash(git commit:*), Bash(npx tree-sitter test:*)
description: (overrides global commit skill with small modification)
---

Create a git commit with the following workflow:

1. Run `npx tree-sitter test` to make sure all tests pass.
2. Fix grammar if needed.
3. IMPORTANT: DO NOT CONTINUE UNLESS TESTS PASS (exit code 0)
4. Stage all changes with `git add .`
5. Review `git status` and `git diff --staged` to understand what's being committed
6. Draft a commit message:
   - First line: Simple, descriptive summary (50-72 chars)
   - Body: More detailed explanation of why things changed, with a balance between useful context and brevity
   - No need to mention added or updated tests, that goes without saying
   - DO NOT mention `br` issues. (br is local only and wouldn't make sense)
7. Show me the commit message and wait for my approval
8. After approval, create the commit
9. do a git pull to make sure current branch is up to date
10. Push directly to main: `git push`
11. Show me the final result
