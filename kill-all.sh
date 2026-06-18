#!/usr/bin/env bash
# kill-all.sh
# GameStore - Stop services started by run-all.sh

set -euo pipefail

# ===== Colors =====
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; NC='\033[0m'; BOLD='\033[1m'; DIM='\033[2m'

# ===== Defaults =====
FORCE=false
QUIET=false
DRY_RUN=false
CLEAN_LOGS=false

# ===== Help =====
show_help() {
    cat <<EOF
${BOLD}Usage:${NC} ./kill-all.sh [OPTIONS]

${BOLD}Options:${NC}
  ${GREEN}-h, --help${NC}            Show this help message and exit
  ${GREEN}-C, --clean-logs${NC}     Delete all log files after stopping
  ${GREEN}-f, --force${NC}           Also kill any process occupying project ports (5000,5001,5002,3000)
  ${GREEN}-q, --quiet${NC}           Quiet mode — minimal output
  ${GREEN}--dry-run${NC}             Show what would be killed without actually killing

${BOLD}Examples:${NC}
  ./kill-all.sh               # Stop services started by run-all.sh (PID file)
  ./kill-all.sh -f            # Force kill + clear any process on project ports
  ./kill-all.sh --clean-logs  # Stop services and clean log files
EOF
    exit 0
}

# ===== Parse flags =====
while [[ $# -gt 0 ]]; do
    case "$1" in
        -h|--help)       show_help ;;
        -f|--force)      FORCE=true ;;
        -C|--clean-logs) CLEAN_LOGS=true ;;
        -q|--quiet)      QUIET=true ;;
        --dry-run)       DRY_RUN=true ;;
        *)
            echo -e "${RED}${BOLD}Unknown option:${NC} $1"
            echo -e "Run ${CYAN}./kill-all.sh --help${NC} for usage."
            exit 1
            ;;
    esac
    shift
done

# ===== Setup =====
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"
LOGS_DIR="$SCRIPT_DIR/logs"
PID_FILE="$LOGS_DIR/services.pid"

# ===== Header =====
if [ "$QUIET" = false ]; then
    MODE_LABEL=""
    [ "$DRY_RUN" = true ] && MODE_LABEL="🔍  DRY RUN  "
    [ "$FORCE" = true ] && MODE_LABEL="${MODE_LABEL}💀 FORCE  "

    clear
    echo -e "${RED}${BOLD}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║           🛑  GAMESTORE - STOPPING SERVICES               ║"
    echo "║           📅  $(date '+%Y-%m-%d %H:%M:%S')                     ║"
    if [ -n "$MODE_LABEL" ]; then
echo "║           ${MODE_LABEL}                         ║"
    fi
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
fi

# ===== Step 1: Kill by PID file (only processes started by run-all.sh) =====
KILLED_ANY=false
if [ -f "$PID_FILE" ]; then
    if [ "$DRY_RUN" = true ]; then
        echo -e "${YELLOW}[DRY-RUN] Found PID file: $PID_FILE${NC}"
        while IFS= read -r PID; do
            [ -n "$PID" ] && echo -e "${YELLOW}  └─ Would kill PID $PID${NC}"
        done < "$PID_FILE"
    else
        while IFS= read -r PID; do
            if [ -n "$PID" ] && kill -0 "$PID" 2>/dev/null; then
                KILLED_ANY=true
                if [ "$QUIET" = false ]; then
                    echo -e "${YELLOW}[$(date +%H:%M:%S)] Stopping PID $PID...${NC}"
                fi
                if [ "$FORCE" = true ]; then
                    kill -9 "$PID" 2>/dev/null || true
                else
                    kill "$PID" 2>/dev/null || true
                    sleep 0.3
                    kill -0 "$PID" 2>/dev/null && kill -9 "$PID" 2>/dev/null || true
                fi
            fi
        done < "$PID_FILE"
    fi
    rm -f "$PID_FILE"
else
    [ "$QUIET" = false ] && echo -e "${DIM}No PID file found at $PID_FILE${NC}"
fi

# ===== Step 2: Optionally kill by port (--force only) =====
PROJECT_PORTS=(5000 5001 5002 3000)

if [ "$FORCE" = true ]; then
    if [ "$QUIET" = false ]; then
        echo -e "\n${YELLOW}[FORCE] Checking project ports for leftover processes...${NC}"
    fi

    for PORT in "${PROJECT_PORTS[@]}"; do
        PIDS=$(lsof -ti :"$PORT" 2>/dev/null) || true
        if [ -z "$PIDS" ]; then
            [ "$QUIET" = false ] && echo -e "${DIM}  Port $PORT: clear${NC}"
            continue
        fi

        if [ "$DRY_RUN" = true ]; then
            echo -e "${YELLOW}  └─ [DRY-RUN] Would kill on port $PORT: PIDs $PIDS${NC}"
            continue
        fi

        if [ "$QUIET" = false ]; then
            echo -e "${YELLOW}  └─ Port $PORT has PIDs: $PIDS — killing...${NC}"
        fi
        for PID in $PIDS; do
            kill -9 "$PID" 2>/dev/null || true
        done
        KILLED_ANY=true
        [ "$QUIET" = false ] && echo -e "${GREEN}      └─ Port $PORT freed${NC}"
    done
fi

# ===== Clean logs =====
if [ "$CLEAN_LOGS" = true ]; then
    if [ "$DRY_RUN" = true ]; then
        echo -e "\n${YELLOW}[DRY-RUN] Would delete all files in ${LOGS_DIR}${NC}"
    else
        echo -e "\n${YELLOW}[CLEAN] Deleting old log files...${NC}"
        rm -f "$LOGS_DIR"/*.log "$LOGS_DIR"/*.pid 2>/dev/null || true
        echo -e "${GREEN}  └─ Logs cleaned${NC}"
    fi
fi

# ===== Footer =====
if [ "$QUIET" = false ]; then
    if [ "$DRY_RUN" = true ]; then
        echo -e "\n${YELLOW}${BOLD}"
        echo "╔══════════════════════════════════════════════════════════════╗"
        echo "║           🔍  DRY RUN COMPLETE                              ║"
        echo "╚══════════════════════════════════════════════════════════════╝"
    elif [ "$KILLED_ANY" = true ]; then
        echo -e "\n${GREEN}${BOLD}"
        echo "╔══════════════════════════════════════════════════════════════╗"
        echo "║              ✅  SERVICES STOPPED                           ║"
        echo "╚══════════════════════════════════════════════════════════════╝"
    else
        echo -e "\n${DIM}${BOLD}"
        echo "╔══════════════════════════════════════════════════════════════╗"
        echo "║           ℹ️  NO SERVICES WERE RUNNING                       ║"
        echo "╚══════════════════════════════════════════════════════════════╝"
    fi
    echo -e "${NC}"
fi
