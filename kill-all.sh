#!/bin/bash

# ═══════════════════════════════════════════════════════════════════
#  GameStore - Kill All Services
#  Stops all running services (API Gateway, API Service, Auth, Web)
# ═══════════════════════════════════════════════════════════════════
#  Usage: ./kill-all.sh [OPTIONS]
#
#  Options:
#    --force, -f    Force kill (SIGKILL instead of SIGTERM)
#    --clean, -c    Clean up logs after stopping
#    --help, -h     Show this help message
# ═══════════════════════════════════════════════════════════════════

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'; BOLD='\033[1m'
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"
LOGS_DIR="$SCRIPT_DIR/logs"
PID_FILE="$LOGS_DIR/services.pid"

FORCE_MODE=false
CLEAN_MODE=false

# ─── Parse arguments ──────────────────────────────────────────────
while [[ $# -gt 0 ]]; do
  case "$1" in
    --force|-f) FORCE_MODE=true; shift ;;
    --clean|-c) CLEAN_MODE=true; shift ;;
    --help|-h)
      echo -e "${CYAN}${BOLD}Usage:${NC} ./kill-all.sh [OPTIONS]"
      echo ""
      echo -e "  ${YELLOW}--force, -f${NC}    Force kill with SIGKILL (skip graceful shutdown)"
      echo -e "  ${YELLOW}--clean, -c${NC}    Remove all log files after stopping services"
      echo -e "  ${YELLOW}--help, -h${NC}     Show this help message"
      echo ""
      echo -e "Default behavior sends SIGTERM first, then SIGKILL if still running."
      exit 0
      ;;
    *)
      echo -e "${RED}${BOLD}Unknown option:${NC} $1"
      echo -e "Run ${CYAN}./kill-all.sh --help${NC} for usage."
      exit 1
      ;;
  esac
done

# ─── Banner ───────────────────────────────────────────────────────
clear
echo -e "${RED}${BOLD}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║           🛑  GAMESTORE - STOPPING ALL SERVICES            ║"
echo -e "║           📅  $(date '+%Y-%m-%d %H:%M:%S')                        ║"
[ "$FORCE_MODE" = true ] && echo "║           ⚡  FORCE MODE ENABLED                              ║"
[ "$CLEAN_MODE" = true ] && echo "║           🧹  CLEAN MODE ENABLED                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# ─── Kill a process by port ───────────────────────────────────────
kill_port() {
    local PORT=$1 NAME=$2
    echo -e "${YELLOW}[$(date +%H:%M:%S)] Stopping ${NAME} (Port ${PORT})...${NC}"
    local PIDS=$(lsof -ti :$PORT 2>/dev/null)
    if [ -z "$PIDS" ]; then
        echo -e " ${CYAN}not running${NC}"
        return
    fi
    for PID in $PIDS; do
        if [ "$FORCE_MODE" = true ]; then
            # ── Force: skip graceful, go straight to SIGKILL ──
            kill -9 $PID 2>/dev/null
        else
            # ── Graceful: try SIGTERM first, then SIGKILL ──
            kill $PID 2>/dev/null
            sleep 0.3
            kill -0 $PID 2>/dev/null && kill -9 $PID 2>/dev/null
        fi
    done
    echo -e " ${GREEN}stopped${NC}"
}

# ─── Kill processes from PID file ─────────────────────────────────
if [ -f "$PID_FILE" ]; then
    echo -e "${YELLOW}[$(date +%H:%M:%S)] Reading PID file...${NC}"
    while IFS= read -r PID; do
        [ -n "$PID" ] && kill -0 $PID 2>/dev/null && kill $PID 2>/dev/null
    done < "$PID_FILE"
    rm -f "$PID_FILE"
    echo -e " ${GREEN}PID file cleaned${NC}"
fi

# ─── Kill services by port ────────────────────────────────────────
echo ""
kill_port 5000 "API Gateway"
kill_port 5001 "API Service"
kill_port 5002 "Auth Service"
kill_port 3000 "Web Client"

# ─── Kill by process name (catch any remaining) ───────────────────
pkill -f "dotnet.*GameStore" 2>/dev/null
pkill -f "vite" 2>/dev/null
sleep 1

# ─── Clean mode: remove logs ──────────────────────────────────────
if [ "$CLEAN_MODE" = true ]; then
    echo ""
    echo -e "${YELLOW}[$(date +%H:%M:%S)] Cleaning logs directory...${NC}"
    if [ -d "$LOGS_DIR" ]; then
        rm -f "$LOGS_DIR"/*.log "$LOGS_DIR"/*.pid 2>/dev/null
        echo -e " ${GREEN}logs cleaned${NC}"
    else
        echo -e " ${CYAN}no logs directory${NC}"
    fi
fi

# ─── Done ─────────────────────────────────────────────────────────
echo -e "\n${GREEN}${BOLD}╔══════════════════════════════════════════════════════════════╗"
echo -e "║              ✅  ALL SERVICES STOPPED                       ║"
echo -e "╚══════════════════════════════════════════════════════════════╝${NC}"
