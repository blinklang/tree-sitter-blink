#!/usr/bin/env bash
# install-ast-grep.sh — Set up ast-grep support for Blink
#
# Downloads and compiles the Blink tree-sitter grammar as a shared library,
# then writes an sgconfig.yml so ast-grep can parse .bl files.
#
# Usage:
#   curl -sSL https://raw.githubusercontent.com/blinklang/tree-sitter-blink/main/install-ast-grep.sh | bash
#
# Requirements: cc (or gcc/clang), curl

set -euo pipefail

REPO="https://raw.githubusercontent.com/blinklang/tree-sitter-blink/main"
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

info()  { echo -e "${BLUE}==>${NC} $*"; }
error() { echo -e "${RED}error:${NC} $*" >&2; exit 1; }

# Detect OS
OS="$(uname -s)"
if [[ "$OS" == "Darwin" ]]; then
    LIB_OUT="blink.dylib"
    SHARED_FLAGS="-dynamiclib"
else
    LIB_OUT="blink.so"
    SHARED_FLAGS="-shared -Wl,--no-undefined"
fi

# Check for a C compiler
CC_BIN=""
for candidate in cc gcc clang; do
    if command -v "$candidate" &>/dev/null; then
        CC_BIN="$candidate"
        break
    fi
done
[[ -z "$CC_BIN" ]] && error "No C compiler found. Install gcc or clang and try again."

# Check for curl
command -v curl &>/dev/null || error "curl is required but not found."

# Download source files into a temp dir
TMPDIR="$(mktemp -d)"
trap 'rm -rf "$TMPDIR"' EXIT

info "Downloading Blink tree-sitter grammar source..."
mkdir -p "$TMPDIR/src/tree_sitter"
curl -sSL "$REPO/src/parser.c"                  -o "$TMPDIR/src/parser.c"
curl -sSL "$REPO/src/tree_sitter/parser.h"      -o "$TMPDIR/src/tree_sitter/parser.h"
curl -sSL "$REPO/src/tree_sitter/alloc.h"       -o "$TMPDIR/src/tree_sitter/alloc.h"
curl -sSL "$REPO/src/tree_sitter/array.h"       -o "$TMPDIR/src/tree_sitter/array.h"

# Compile
info "Compiling $LIB_OUT with $CC_BIN..."
# shellcheck disable=SC2086
"$CC_BIN" -O2 -fPIC -std=c11 $SHARED_FLAGS \
    -I "$TMPDIR/src" \
    "$TMPDIR/src/parser.c" \
    -o "./$LIB_OUT"

# Write sgconfig.yml if it doesn't exist
if [[ ! -f sgconfig.yml ]]; then
    info "Writing sgconfig.yml..."
    cat > sgconfig.yml <<EOF
customLanguages:
  blink:
    libraryPath: ./$LIB_OUT
    extensions: [bl]
    expandoAttribute: null
    metaVarChar: "\$"

ruleDirs: []
testConfigs: []
EOF
else
    info "sgconfig.yml already exists, skipping."
fi

echo ""
echo "Done! ast-grep is ready for Blink. Example usage:"
echo ""
echo "  ast-grep run -p 'foo(\$X)' -l blink --config sgconfig.yml path/to/file.bl"
echo "  ast-grep run -p 'foo(\$X)' -r 'bar(\$X)' -l blink --config sgconfig.yml path/to/file.bl"
echo ""
