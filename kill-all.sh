#!/usr/bin/env bash
# kill-all.sh
# GameStore - Stop all services with flags and options

set -euo pipefail

# ===== Colors =====
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; NC='\033[0m'; BOLD='\033[1m'; DIM='\033[2m'

# ===== Defaults =====
FORCE=false
QUIET=false
DRY_RUN=false
CLEAN_LOGS=false
declare -a TARGET_PORTS=()

# ===== Help =====
show_help() {
    cat <<EOF
${BOLD}Usage:${NC} ./kill-all.sh [OPTIONS]

${BOLD}Options:${NC}
  ${GREEN}-h, --help${NC}            Show this help message and exit
  ${GREEN}-p, --port PORT${NC}       Kill only specific port(s) (can be used multiple times)
  ${GREEN}-s, --service NAME${NC}    Kill only specific service name (gateway|api|auth|web)
  ${GREEN}-C, --clean-logs${NC}     Delete all log files after stopping
  ${GREEN}-f, --force${NC}           Force kill with SIGKILL (-9) immediately
  ${GREEN}-q, --quiet${NC}           Quiet mode — minimal output
  ${GREEN}--dry-run${NC}             Show what would be killed without actually killing

${BOLD}Services & Ports:${NC}
  ${CYAN}gateway${NC}    →  ${DIM}API Gateway  on port 5000${NC}
  ${CYAN}api${NC}        →  ${DIM}API Service  on port 5001${NC}
  ${CYAN}auth${NC}       →  ${DIM}Auth Service on port 5002${NC}
  ${CYAN}web${NC}        →  ${DIM}Web Client  on port 3000${NC}

${BOLD}Examples:${NC}
  ./kill-all.sh                     # Stop all services
  ./kill-all.sh -p 5000             # Kill only port 5000
  ./kill-all.sh -s api -s auth      # Kill only API and Auth services
  ./kill-all.sh -f                  # Force kill all services
  ./kill-all.sh --clean-logs        # Stop services and clean log files
  ./kill-all.sh --dry-run           # Preview what would be killed
  ./kill-all.sh -q                  # Quiet mode
EOF
    exit 0
}

# ===== Resolve service name → port =====
resolve_service_port() {
    local NAME="$1"
    case "$(echo "$NAME" | tr '[:upper:]' '[:lower:]')" in
        gateway|api-gateway|apigateway)  echo "5000" ;;
        api|apiserver|apiservice)         echo "5001" ;;
        auth|authservice|auth-server)     echo "5002" ;;
        web|webclient|frontend|client)    echo "3000" ;;
        *)
            echo -e "${RED}${BOLD}Unknown service:${NC} $NAME"
            echo -e "Valid services: ${CYAN}gateway${NC}, ${CYAN}api${NC}, ${CYAN}auth${NC}, ${CYAN}web${NC}"
            exit 1
            ;;
    esac
}

# ===== Parse flags =====
while [[ $# -gt 0 ]]; do
    case "$1" in
        -h|--help)    show_help ;;
        -f|--force)   FORCE=true ;;
        -C|--clean-logs) CLEAN_LOGS=true ;;
        -q|--quiet)   QUIET=true ;;
        --dry-run)    DRY_RUN=true ;;
        -p|--port)
            if [[ -z "${2:-}" ]]; then
                echo -e "${RED}Error:${NC} --port requires a port number"
                exit 1
            fi
            TARGET_PORTS+=("$2")
            shift
            ;;
        -s|--service)
            if [[ -z "${2:-}" ]]; then
                echo -e "${RED}Error:${NC} --service requires a service name"
                exit 1
            fi
            PORT=$(resolve_service_port "$2")
            TARGET_PORTS+=("$PORT")
            shift
            ;;
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

# If no specific ports, use all default ports
if [ ${#TARGET_PORTS[@]} -eq 0 ]; then
    TARGET_PORTS=(5000 5001 5002 3000)
fi

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

# ===== Kill by PID file =====
if [ -f "$PID_FILE" ] && [ "$DRY_RUN" = false ]; then
    while IFS= read -r PID; do
        if [ -n "$PID" ] && kill -0 "$PID" 2>/dev/null; then
            if [ "$QUIET" = false ]; then
                echo -e "${YELLOW}[$(date +%H:%M:%S)] Killing PID $PID...${NC}"
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
    rm -f "$PID_FILE"
fi

# ===== Kill by port function =====
kill_port() {
    local PORT=$1
    local PIDS
    PIDS=$(lsof -ti :"$PORT" 2>/dev/null) || true

    if [ -z "$PIDS" ]; then
        [ "$QUIET" = false ] && echo -e "${DIM}Port $PORT: not running${NC}"
        return
    fi

    if [ "$DRY_RUN" = true ]; then
        echo -e "${YELLOW}[DRY-RUN] Would kill on port $PORT: PIDs $PIDS${NC}"
        return
    fi

    if [ "$QUIET" = false ]; then
        echo -e "${YELLOW}[$(date +%H:%M:%S)] Stopping port $PORT...${NC}"
    fi

    for PID in $PIDS; do
        if [ "$FORCE" = true ]; then
            kill -9 "$PID" 2>/dev/null || true
        else
            kill "$PID" 2>/dev/null || true
            sleep 0.3
            kill -0 "$PID" 2>/dev/null && kill -9 "$PID" 2>/dev/null || true
        fi
    done

    if [ "$QUIET" = false ]; then
        echo -e "${GREEN}  └─ Port $PORT stopped${NC}"
    fi
}

# ===== Execute =====
for PORT in "${TARGET_PORTS[@]}"; do
    kill_port "$PORT"
done

# ===== Clean up any remaining processes =====
if [ "$DRY_RUN" = false ] && [ ${#TARGET_PORTS[@]} -eq 4 ]; then
    pkill -f "dotnet.*GameStore" 2>/dev/null || true
    pkill -f "vite" 2>/dev/null || true
fi

# ===== Clean logs =====
if [ "$CLEAN_LOGS" = true ]; then
    if [ "$DRY_RUN" = true ]; then
        echo -e "${YELLOW}[DRY-RUN] Would delete all files in ${LOGS_DIR}${NC}"
    else
        echo -e "${YELLOW}${BOLD}[CLEAN] Deleting old log files...${NC}"
        rm -f "$LOGS_DIR"/*.log "$LOGS_DIR"/*.pid 2>/dev/null || true
        echo -e "${GREEN}  └─ Logs cleaned${NC}"
        echo ""
    fi
fi

# ===== Footer =====
if [ "$QUIET" = false ]; then
    if [ "$DRY_RUN" = true ]; then
        echo -e "${YELLOW}${BOLD}"
        echo "╔══════════════════════════════════════════════════════════════╗"
        echo "║           🔍  DRY RUN COMPLETE                              ║"
        echo "║           Run without --dry-run to actually kill            ║"
        echo "╚══════════════════════════════════════════════════════════════╝"
    else
        echo -e "${GREEN}${BOLD}"
        echo "╔══════════════════════════════════════════════════════════════╗"
        echo "║              ✅  ALL TARGETS STOPPED                       ║"
        echo "╚══════════════════════════════════════════════════════════════╝"
    fi
    echo -e "${NC}"
fi
