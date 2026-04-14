# Contributing to tree-sitter-blink

## Prerequisites

- Node.js (for the tree-sitter CLI)
- `npm install` to install `tree-sitter-cli`

## Workflow

1. Edit `grammar.js` — this is the source of truth
2. `./node_modules/.bin/tree-sitter generate` — regenerate `src/parser.c`
3. `./node_modules/.bin/tree-sitter test` — all corpus tests must pass
4. Add test cases in `test/corpus/` for any new grammar rules
5. Update `queries/highlights.scm` for new node types

## Structure

- `grammar.js` — grammar definition
- `src/` — generated C parser (committed; regenerate with `tree-sitter generate`)
- `test/corpus/` — tree-sitter test corpus (input + expected S-expression output)
- `queries/highlights.scm` — syntax highlighting queries
- `sgconfig.yml` — ast-grep configuration
- `install-ast-grep.sh` — ast-grep setup script

## Language Reference

The Blink compiler is the authoritative reference. From the `blink` repo:

```bash
bin/blink llms --full    # Full language reference
bin/blink llms --list    # List available topics
```

The Blink parser source (`src/parser.bl` in the blink repo) is also a useful reference for edge cases.
