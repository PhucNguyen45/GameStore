#!/usr/bin/env bash
# dump-project.sh
# GameStore - Dump project files into a single text file with flags and options

set -euo pipefail

# ===== Defaults =====
OUTPUT_FILE="project_dump.txt"
INCLUDE_BINARY=false
INCLUDE_MD=false
SORT_FILES=true
VERBOSE=false
QUIET=false
DRY_RUN=false
declare -a EXTRA_EXCLUDES=()

# ===== Colors =====
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; NC='\033[0m'; BOLD='\033[1m'; DIM='\033[2m'

# ===== Help =====
show_help() {
    cat <<EOF
${BOLD}Usage:${NC} ./dump-project.sh [OPTIONS]

${BOLD}Description:${NC}
  Dump all project source files into a single text file for sharing or analysis.
  By default, binary files, .md files, logs, build artifacts, and common
  config files are excluded.

${BOLD}Options:${NC}
  ${GREEN}-h, --help${NC}            Show this help message and exit
  ${GREEN}-o, --output FILE${NC}     Output file name (default: project_dump.txt)
  ${GREEN}-e, --exclude PATTERN${NC} Extra exclude pattern (can be used multiple times)
                        Examples: ${DIM}--exclude '*.test.js' --exclude '*/docs/*'${NC}
  ${GREEN}-b, --include-binary${NC}  Include binary files in the dump
  ${GREEN}-m, --include-md${NC}      Include .md files (README, docs, etc.)
  ${GREEN}--no-sort${NC}             Don't sort files alphabetically (faster)
  ${GREEN}-v, --verbose${NC}         Show all files being processed
  ${GREEN}-q, --quiet${NC}           Quiet mode — only show final summary
  ${GREEN}--dry-run${NC}             Show what files would be dumped without writing

${BOLD}Examples:${NC}
  ./dump-project.sh                          # Default dump
  ./dump-project.sh -o dump.txt              # Custom output file
  ./dump-project.sh -b -m                    # Include binaries and markdown
  ./dump-project.sh -e '*.css' -e '*.png'    # Exclude CSS and PNG files
  ./dump-project.sh --dry-run -v             # Preview files that would be dumped
  ./dump-project.sh -q                       # Quiet mode
EOF
    exit 0
}

# ===== Parse flags =====
while [[ $# -gt 0 ]]; do
    case "$1" in
        -h|--help)          show_help ;;
        -o|--output)
            if [[ -z "${2:-}" ]]; then
                echo -e "${RED}Error:${NC} --output requires a filename"
                exit 1
            fi
            OUTPUT_FILE="$2"
            shift
            ;;
        -e|--exclude)
            if [[ -z "${2:-}" ]]; then
                echo -e "${RED}Error:${NC} --exclude requires a pattern"
                exit 1
            fi
            EXTRA_EXCLUDES+=("$2")
            shift
            ;;
        -b|--include-binary)  INCLUDE_BINARY=true ;;
        -m|--include-md)      INCLUDE_MD=true ;;
        --no-sort)            SORT_FILES=false ;;
        -v|--verbose)         VERBOSE=true ;;
        -q|--quiet)           QUIET=true ;;
        --dry-run)            DRY_RUN=true ;;
        *)
            echo -e "${RED}${BOLD}Unknown option:${NC} $1"
            echo -e "Run ${CYAN}./dump-project.sh --help${NC} for usage."
            exit 1
            ;;
    esac
    shift
done

# ===== Header =====
if [ "$QUIET" = false ]; then
    echo -e "${CYAN}${BOLD}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║        📦  GAMESTORE - PROJECT DUMP                         ║"
    echo "║        📅  $(date '+%Y-%m-%d %H:%M:%S')                                     ║"
    if [ "$DRY_RUN" = true ]; then
        echo "║        🔍  DRY RUN MODE                                     ║"
    fi
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
fi

# ===== Clean output file =====
if [ "$DRY_RUN" = false ]; then
    rm -f "$OUTPUT_FILE"
fi

# ===== Build find exclude arguments =====
EXCLUDE_ARGS=()
EXCLUDE_ARGS+=(-not -path "*/\.git/*")
EXCLUDE_ARGS+=(-not -name ".gitignore")
EXCLUDE_ARGS+=(-not -path "*/node_modules/*")
EXCLUDE_ARGS+=(-not -path "*/bin/*")
EXCLUDE_ARGS+=(-not -path "*/obj/*")
EXCLUDE_ARGS+=(-not -path "*/Migrations/*")
EXCLUDE_ARGS+=(-not -name "*.http")
EXCLUDE_ARGS+=(-not -name "*.log")
EXCLUDE_ARGS+=(-not -name "GameStore structure.txt")
EXCLUDE_ARGS+=(-not -name "appsettings.Development.json")
EXCLUDE_ARGS+=(-not -name "package-lock.json")
EXCLUDE_ARGS+=(-not -name "package.json")
EXCLUDE_ARGS+=(-not -name ".gitattributes")
EXCLUDE_ARGS+=(-not -name ".editorconfig")
EXCLUDE_ARGS+=(-not -name ".DS_Store")
EXCLUDE_ARGS+=(-not -name "*.sql")
EXCLUDE_ARGS+=(-not -name "*.bak")
EXCLUDE_ARGS+=(-not -name "$OUTPUT_FILE")
EXCLUDE_ARGS+=(-not -name "GameStore.sln")
EXCLUDE_ARGS+=(-not -name "*.sh")

# Extra user exclusions — properly array-based, no quoting issues
for pattern in "${EXTRA_EXCLUDES[@]}"; do
    EXCLUDE_ARGS+=(-not -path "$pattern")
done

# .md files — excluded by default
if [ "$INCLUDE_MD" = false ]; then
    EXCLUDE_ARGS+=(-not -name "*.md")
fi

# ===== Collect file list into an array (avoids pipeline subshell) =====
if [ "$QUIET" = false ]; then
    echo -e "${YELLOW}${BOLD}Scanning project files...${NC}"
fi

FILES=()
if [ "$SORT_FILES" = true ]; then
    while IFS= read -r -d $'\0' file; do
        FILES+=("$file")
    done < <(find . -type f "${EXCLUDE_ARGS[@]}" -print0 2>/dev/null | sort -z)
else
    while IFS= read -r -d $'\0' file; do
        FILES+=("$file")
    done < <(find . -type f "${EXCLUDE_ARGS[@]}" -print0 2>/dev/null)
fi

TOTAL_FILES=${#FILES[@]}

# ===== Process each file =====
FILE_COUNT=0
SKIPPED_BINARY=0
BINARY_COUNT=0

for file in "${FILES[@]}"; do
    clean_path="${file#./}"
    FILE_COUNT=$((FILE_COUNT + 1))

    # Check if binary
    if file "$file" 2>/dev/null | grep -qiE 'text|json|xml|shell script'; then
        IS_TEXT=true
    else
        IS_TEXT=false
    fi

    if [ "$IS_TEXT" = false ] && [ "$INCLUDE_BINARY" = false ]; then
        SKIPPED_BINARY=$((SKIPPED_BINARY + 1))
        if [ "$VERBOSE" = true ]; then
            echo -e "  ${DIM}[BINARY SKIPPED]${NC} $clean_path"
        fi
        continue
    fi

    BINARY_COUNT=$((BINARY_COUNT + 1))

    if [ "$VERBOSE" = true ]; then
        echo -e "  ${GREEN}[DUMPING]${NC} $clean_path"
    fi

    if [ "$DRY_RUN" = false ]; then
        {
            echo "FILE: $clean_path"
            if [ "$IS_TEXT" = true ]; then
                cat "$file" 2>/dev/null || echo "[ERROR READING FILE]"
            else
                echo "[BINARY FILE - $(file "$file" 2>/dev/null | cut -d: -f2- | xargs)]"
            fi
            echo
        } >> "$OUTPUT_FILE"
    fi
done

# ===== Calculate sizes =====
if [ "$DRY_RUN" = false ] && [ -f "$OUTPUT_FILE" ]; then
    LINE_COUNT=$(wc -l < "$OUTPUT_FILE")
    BYTE_COUNT=$(wc -c < "$OUTPUT_FILE" | tr -d ' ')
    if [ "$BYTE_COUNT" -ge 1048576 ]; then
        SIZE=$((BYTE_COUNT / 1048576))
        SIZE_UNIT="MB"
    elif [ "$BYTE_COUNT" -ge 1024 ]; then
        SIZE=$((BYTE_COUNT / 1024))
        SIZE_UNIT="KB"
    else
        SIZE="$BYTE_COUNT"
        SIZE_UNIT="B"
    fi
else
    LINE_COUNT=0
    SIZE="0"
    SIZE_UNIT="B"
fi

# ===== Summary =====
if [ "$DRY_RUN" = true ]; then
    echo
    echo -e "${YELLOW}${BOLD}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${YELLOW}${BOLD}║              🔍  DRY RUN COMPLETE                          ║${NC}"
    printf "${YELLOW}${BOLD}║   Files found     : %3d                                    ║${NC}\n" "$TOTAL_FILES"
    printf "${YELLOW}${BOLD}║   Would dump      : %3d (text)                             ║${NC}\n" "$BINARY_COUNT"
    if [ "$SKIPPED_BINARY" -gt 0 ]; then
        printf "${YELLOW}${BOLD}║   Would skip      : %3d binary                            ║${NC}\n" "$SKIPPED_BINARY"
    fi
    echo -e "${YELLOW}${BOLD}╚══════════════════════════════════════════════════════════════╝${NC}"
else
    echo
    echo -e "${GREEN}${BOLD}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}${BOLD}║              ✅  DUMP COMPLETE                              ║${NC}"
    echo -e "${GREEN}${BOLD}╠══════════════════════════════════════════════════════════════╣${NC}"
    echo -e "${GREEN}${BOLD}║  📄 File     : ${OUTPUT_FILE}${NC}"
    echo -e "${GREEN}${BOLD}║  📏 Size     : ${SIZE} ${SIZE_UNIT}${NC}"
    echo -e "${GREEN}${BOLD}║  📝 Lines    : ${LINE_COUNT}${NC}"
    printf "${GREEN}${BOLD}║  📂 Dumped   : %3d files${NC}\n" "$BINARY_COUNT"
    if [ "$SKIPPED_BINARY" -gt 0 ]; then
        printf "${GREEN}${BOLD}║  ⏭️  Skipped  : %3d binary${NC}\n" "$SKIPPED_BINARY"
    fi
    echo -e "${GREEN}${BOLD}╚══════════════════════════════════════════════════════════════╝${NC}"
fi

echo -e "${NC}"
