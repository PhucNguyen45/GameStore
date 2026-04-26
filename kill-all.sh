#!/bin/bash

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'; BOLD='\033[1m'
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"
LOGS_DIR="$SCRIPT_DIR/logs"
PID_FILE="$LOGS_DIR/services.pid"

clear
echo -e "${RED}${BOLD}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║           🛑  GAMESTORE - STOPPING ALL SERVICES           ║"
echo "║           📅  $(date '+%Y-%m-%d %H:%M:%S')                        ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

kill_port() {
    local PORT=$1 NAME=$2
    echo -ne "${YELLOW}[$(date +%H:%M:%S)] Stopping ${NAME} (Port ${PORT})...${NC}"
    local PIDS=$(lsof -ti :$PORT 2>/dev/null)
    if [ -z "$PIDS" ]; then echo -e " ${CYAN}not running${NC}"; return; fi
    for PID in $PIDS; do kill $PID 2>/dev/null; sleep 0.3; kill -0 $PID 2>/dev/null && kill -9 $PID 2>/dev/null; done
    echo -e " ${GREEN}stopped${NC}"
}

if [ -f "$PID_FILE" ]; then
    while IFS= read -r PID; do
        [ -n "$PID" ] && kill -0 $PID 2>/dev/null && kill $PID 2>/dev/null
    done < "$PID_FILE"
    rm -f "$PID_FILE"
fi

echo ""
kill_port 5000 "API Gateway"
kill_port 5001 "API Service"
kill_port 5002 "Auth Service"
kill_port 3000 "Web Client"

pkill -f "dotnet.*GameStore" 2>/dev/null
pkill -f "vite" 2>/dev/null

echo -e "\n${GREEN}${BOLD}╔══════════════════════════════════════════════════════════════╗"
echo -e "║              ✅  ALL SERVICES STOPPED                       ║"
echo -e "╚══════════════════════════════════════════════════════════════╝${NC}"
