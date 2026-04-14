# tree-sitter-blink

Tree-sitter grammar for the [Blink programming language](https://github.com/blinklang/blink).

Provides syntax highlighting and structural parsing for `.bl` files in editors and tools that support tree-sitter.

---

## Editor Setup

### Neovim (nvim-treesitter)

Add to your nvim-treesitter config:

```lua
require("nvim-treesitter.parsers").get_parser_configs().blink = {
  install_info = {
    url = "https://github.com/blinklang/tree-sitter-blink",
    files = { "src/parser.c" },
    branch = "main",
  },
  filetype = "bl",
}
```

Then install:

```
:TSInstall blink
```

### Helix

Add to `~/.config/helix/languages.toml`:

```toml
[[language]]
name = "blink"
scope = "source.blink"
file-types = ["bl"]
roots = []
comment-token = "//"

[language.grammar]
source = { git = "https://github.com/blinklang/tree-sitter-blink", rev = "main" }
```

Then fetch and build:

```bash
hx --grammar fetch && hx --grammar build
```

---

## ast-grep Setup

[ast-grep](https://ast-grep.github.io) enables syntax-aware search and rewrite on Blink source files.

Run this one-liner to download, compile, and configure:

```bash
curl -sSL https://raw.githubusercontent.com/blinklang/tree-sitter-blink/main/install-ast-grep.sh | bash
```

This produces `blink.so` (or `blink.dylib` on Mac) and writes `sgconfig.yml` in the current directory. Then:

```bash
# Find all calls to foo with one argument
ast-grep run -p 'foo($X)' -l blink --config sgconfig.yml src/

# Rename foo to bar across all .bl files
ast-grep run -p 'foo($X)' -r 'bar($X)' -l blink --config sgconfig.yml src/
```

**Requirements:** a C compiler (`gcc` or `clang`) and `curl`.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to work on the grammar.
