# tree-sitter-blink

Tree-sitter grammar for the Blink programming language.

## Build & Test

```bash
npx tree-sitter generate    # Generate parser from grammar.js
npx tree-sitter test         # Run corpus tests in test/corpus/
npx tree-sitter parse <file> # Parse a .bl file
```

## Structure

- `grammar.js` — Grammar definition (the source of truth)
- `src/` — Generated C parser (committed; regenerate with `npx tree-sitter generate`)
- `test/corpus/` — Tree-sitter test corpus (input + expected S-expression output)
- `queries/highlights.scm` — Syntax highlighting queries

## Blink Language Reference

The Blink compiler lives at `../blink/`. To get language docs:
```bash
cd ../blink && bin/blink llms --full    # Full language reference
cd ../blink && bin/blink llms --list    # List available topics
```

The Blink parser source (`../blink/src/parser.bl`) is the reference implementation.

## Workflow

1. Edit `grammar.js`
2. `npx tree-sitter generate`
3. `npx tree-sitter test` — all corpus tests must pass
4. Add new test cases in `test/corpus/` for any new grammar rules
5. Update `queries/highlights.scm` with highlighting for new nodes

## Task Tags

All tasks use `repo:tree-sitter-blink` + one type tag:
- `type:bug` - add failing corpus test → fix grammar → generate → test
- `type:feature` - plan → confirm → implement in grammar.js
- `type:project` - break down into subtasks
- `type:friction` - triage → create bug/feature tasks (or route to repo:blink for spec issues)
- `type:chore` - carry out task

## Friction Log

When working on the grammar, log a br task whenever you hit:
- Ambiguity in the Blink spec (unclear how to parse something) → `repo:blink`
- Missing or unclear language spec that blocks grammar work → `repo:blink`
- Surprising parser behavior in the tree-sitter grammar itself → `repo:tree-sitter-blink`
- Missing corpus test coverage → `repo:tree-sitter-blink`

Route to the repo where the fix actually belongs:
- `br add "<description>" -t repo:blink -t type:friction` — spec/compiler issue
- `br add "<description>" -t repo:tree-sitter-blink -t type:friction` — grammar issue
