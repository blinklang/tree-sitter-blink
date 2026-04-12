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

All tasks use `repo:tree-sitter-blink` + one type tag (e.g. `type:chore`).
