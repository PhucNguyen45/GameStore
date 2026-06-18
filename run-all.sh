#!/usr/bin/env bash
# run-all.sh
# Gamestore - Start all services with flags and options

set -euo pipefail

# ===== Colors =====
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; PURPLE='\033[0;35m'; CYAN='\033[0;36m'
NC='\033[0m'; BOLD='\033[1m'; DIM='\033[2m'

# ===== Defaults =====
BACKEND=true
FRONTEND=true
DO_CLEAN=false
DO_BUILD=true
DO_NPM=true
VERBOSE=false
TAIL_LOGS=false
CLEAN_LOGS=false
WATCH_MODE=false

# ===== Help =====
show_help() {
    cat <<EOF
${BOLD}Usage:${NC} ./run-all.sh [OPTIONS]

${BOLD}Options:${NC}
  ${GREEN}-h, --help${NC}           Show this help message and exit
  ${GREEN}-b, --backend-only${NC}   Start backend services only (skip frontend)
  ${GREEN}-f, --frontend-only${NC}  Start frontend only (skip backend)
  ${GREEN}-w, --watch${NC}          Watch mode — auto-restart backend services on code changes
                        ${DIM}(uses dotnet watch, frontend already has HMR)${NC}
  ${GREEN}-c, --clean${NC}          Clean + rebuild all dotnet projects before starting
  ${GREEN}-C, --clean-logs${NC}     Delete all old log files before starting
  ${GREEN}--no-build${NC}           Skip dotnet build step
  ${GREEN}--no-npm${NC}             Skip npm install step
  ${GREEN}-v, --verbose${NC}        Print verbose logs to terminal
  ${GREEN}-l, --logs${NC}           Tail service logs after starting
  ${GREEN}--dry-run${NC}            Show what would be started without actually starting

${BOLD}Examples:${NC}
  ./run-all.sh                      # Start all services
  ./run-all.sh --backend-only       # Only backend services
  ./run-all.sh -w                   # Watch mode (auto-restart on code changes)
  ./run-all.sh --watch -v           # Watch mode with verbose output
  ./run-all.sh -b --no-build        # Backend only, skip building
  ./run-all.sh -c -v                # Clean build + verbose output
  ./run-all.sh -l                   # Start and tail logs
  ./run-all.sh --clean-logs         # Delete old logs then start
EOF
    exit 0
}

# ===== Parse flags =====
DRY_RUN=false
while [[ $# -gt 0 ]]; do
    case "$1" in
        -h|--help)        show_help ;;
        -b|--backend-only) BACKEND=true; FRONTEND=false ;;
        -f|--frontend-only) BACKEND=false; FRONTEND=true ;;
        -c|--clean)       DO_CLEAN=true ;;
        --no-build)       DO_BUILD=false ;;
        --no-npm)         DO_NPM=false ;;
        -C|--clean-logs)  CLEAN_LOGS=true ;;
        -w|--watch)       WATCH_MODE=true ;;
        -v|--verbose)     VERBOSE=true ;;
        -l|--logs)        TAIL_LOGS=true ;;
        --dry-run)        DRY_RUN=true ;;
        *)
            echo -e "${RED}${BOLD}Unknown option:${NC} $1"
            echo -e "Run ${CYAN}./run-all.sh --help${NC} for usage."
            exit 1
            ;;
    esac
    shift
done

# ===== Setup =====
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

LOGS_DIR="$SCRIPT_DIR/logs"

# Clean old logs if requested
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

mkdir -p "$LOGS_DIR"
PID_FILE="$LOGS_DIR/services.pid"
> "$PID_FILE"

clear
echo -e "${BLUE}${BOLD}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║           🎮  GAMESTORE - STARTING ALL SERVICES              ║"
echo "║           📅  $(date '+%Y-%m-%d %H:%M:%S')                     ║"
if [ "$DRY_RUN" = true ]; then
echo "║           🔍  DRY RUN MODE                                    ║"
fi
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# ===== Clean & Build =====
if [ "$BACKEND" = true ]; then
    if [ "$DO_CLEAN" = true ]; then
        echo -e "${YELLOW}${BOLD}[BUILD] Cleaning dotnet projects...${NC}"
        if [ "$DRY_RUN" = false ]; then
            dotnet clean -v q 2>/dev/null || true
        else
            echo -e "${DIM}  └─ dotnet clean${NC}"
        fi
    fi

    if [ "$DO_BUILD" = true ]; then
        echo -e "${YELLOW}${BOLD}[BUILD] Building dotnet projects...${NC}"
        if [ "$DRY_RUN" = false ]; then
            if [ "$VERBOSE" = true ]; then
                dotnet build --nologo
            else
                dotnet build --nologo 2>&1 | grep -E "(error|warning|Build succeeded|Build FAILED)" || true
                echo -e "${GREEN}  └─ Build complete${NC}"
            fi
        else
            echo -e "${DIM}  └─ dotnet build${NC}"
        fi
        echo ""
    fi
fi

# ===== Start service function =====
start_service() {
    local NAME=$1 PORT=$2 COLOR=$3
    local LOG="$LOGS_DIR/${NAME}_$(date +%Y%m%d).log"

    if [ "$DRY_RUN" = true ]; then
        local CMD="dotnet run"
        [ "$WATCH_MODE" = true ] && CMD="dotnet watch run"
        echo -e "${COLOR}${BOLD}[DRY-RUN] Would start ${NAME} (Port ${PORT})${NC}"
        echo -e "${DIM}  └─ ${CMD} --urls http://0.0.0.0:${PORT}${NC}"
        return
    fi

    local MODE_TAG=""
    local CMD="dotnet run"
    if [ "$WATCH_MODE" = true ]; then
        CMD="dotnet watch run"
        MODE_TAG=" (watch)"
    fi

    echo -e "${COLOR}${BOLD}[$(date +%H:%M:%S)] Starting ${NAME} (Port ${PORT})${MODE_TAG}...${NC}"
    cd "$SCRIPT_DIR/${NAME}"

    if [ "$VERBOSE" = true ]; then
        ${CMD} --urls "http://0.0.0.0:${PORT}" 2>&1 | tee -a "$LOG" &
    else
        nohup ${CMD} --urls "http://0.0.0.0:${PORT}" >> "$LOG" 2>&1 &
    fi

    local PID=$!
    echo "$PID" >> "$PID_FILE"
    sleep 2

    if kill -0 "$PID" 2>/dev/null; then
        echo -e "${COLOR}  └─ ✅ RUNNING (PID: $PID)${NC}"
    else
        echo -e "${COLOR}  └─ ❌ FAILED — check log: $LOG${NC}"
    fi
    cd "$SCRIPT_DIR"
    echo ""
}

# ===== Start Backend =====
if [ "$BACKEND" = true ]; then
    echo -e "${YELLOW}${BOLD}════════════ BACKEND SERVICES ════════════${NC}\n"
    start_service "GameStore.AuthService" "5002" "$CYAN"
    start_service "GameStore.APIService" "5001" "$GREEN"
    start_service "GameStore.ApiGateway" "5000" "$PURPLE"
fi

# ===== Start Frontend =====
if [ "$FRONTEND" = true ]; then
    echo -e "${YELLOW}${BOLD}════════════ FRONTEND ════════════${NC}\n"
    FRONTEND_PATH="$SCRIPT_DIR/GameStore.WebClient"
    if [ -d "$FRONTEND_PATH" ]; then
        echo -e "${BLUE}${BOLD}[$(date +%H:%M:%S)] Starting WebClient (Port 3000)...${NC}"
        cd "$FRONTEND_PATH"

        if [ "$DO_NPM" = true ] && [ ! -d "node_modules" ]; then
            if [ "$DRY_RUN" = true ]; then
                echo -e "${DIM}  └─ Would run: npm install${NC}"
            else
                echo -e "${DIM}  └─ Installing npm dependencies...${NC}"
                if [ "$VERBOSE" = true ]; then
                    npm install
                else
                    npm install --silent 2>&1 | tail -1
                fi
            fi
        fi

        if [ "$DRY_RUN" = false ]; then
            WEB_LOG="$LOGS_DIR/webclient_$(date +%Y%m%d).log"
            if [ "$VERBOSE" = true ]; then
                npm run dev 2>&1 | tee -a "$WEB_LOG" &
            else
                nohup npm run dev >> "$WEB_LOG" 2>&1 &
            fi
            FPID=$!
            echo "$FPID" >> "$PID_FILE"
            sleep 3
            if kill -0 "$FPID" 2>/dev/null; then
                echo -e "${BLUE}  └─ ✅ RUNNING (PID: $FPID)${NC}"
            else
                echo -e "${BLUE}  └─ ❌ FAILED${NC}"
            fi
        else
            echo -e "${DIM}  └─ Would run: npm run dev${NC}"
        fi
    else
        echo -e "${RED}  └─ ⚠️  Frontend directory not found: $FRONTEND_PATH${NC}"
    fi
    cd "$SCRIPT_DIR"
    echo ""
fi

# ===== Summary =====
if [ "$DRY_RUN" = true ]; then
    echo -e "${YELLOW}${BOLD}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║           🔍  DRY RUN COMPLETE                              ║"
    echo "║           Run without --dry-run to start services           ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    exit 0
fi

echo -e "${GREEN}${BOLD}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║              ✅  ALL SERVICES STARTED                       ║"
echo "╠══════════════════════════════════════════════════════════════╣"
if [ "$WATCH_MODE" = true ]; then
echo "║  👀 Watch mode   : Backend auto-restarts on code changes     ║"
echo "║                     (dotnet watch running)                   ║"
fi
echo "║  🌐 API Gateway  : http://localhost:5000                    ║"
echo "║  📦 API Service  : http://localhost:5001/swagger            ║"
echo "║  🔐 Auth Service : http://localhost:5002/swagger            ║"
echo "║  🖥️  Web Client   : http://localhost:3000                    ║"
echo "║  📝 Logs         : ${LOGS_DIR}                               ║"
echo "║  🛑 Stop all     : ./kill-all.sh                             ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# ===== Tail logs =====
if [ "$TAIL_LOGS" = true ]; then
    echo -e "${YELLOW}${BOLD}Tailing logs (Ctrl+C to stop)...${NC}\n"
    tail -f "$LOGS_DIR"/*.log 2>/dev/null || echo -e "${RED}No log files found.${NC}"
fi
