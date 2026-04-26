#!/bin/bash

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; PURPLE='\033[0;35m'; CYAN='\033[0;36m'
NC='\033[0m'; BOLD='\033[1m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

LOGS_DIR="$SCRIPT_DIR/logs"
mkdir -p "$LOGS_DIR"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
PID_FILE="$LOGS_DIR/services.pid"
> "$PID_FILE"

clear
echo -e "${BLUE}${BOLD}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║           🎮  GAMESTORE - STARTING ALL SERVICES              ║"
echo "║           📅  $(date '+%Y-%m-%d %H:%M:%S')                     ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

start_service() {
    local NAME=$1 PORT=$2 COLOR=$3
    local LOG="$LOGS_DIR/${NAME}_$(date +%Y%m%d).log"
    echo -e "${COLOR}${BOLD}[$(date +%H:%M:%S)] Starting ${NAME} (Port ${PORT})...${NC}"
    cd "$SCRIPT_DIR/${NAME}"
    nohup dotnet run --urls "http://0.0.0.0:${PORT}" >> "$LOG" 2>&1 &
    local PID=$!
    echo $PID >> "$PID_FILE"
    sleep 2
    if kill -0 $PID 2>/dev/null; then
        echo -e "${COLOR}  └─ ✅ RUNNING (PID: $PID)${NC}"
    else
        echo -e "${COLOR}  └─ ❌ FAILED${NC}"
    fi
    cd "$SCRIPT_DIR"
    echo ""
}

echo -e "${YELLOW}${BOLD}════════════ BACKEND SERVICES ════════════${NC}\n"
start_service "GameStore.AuthService" "5002" "$CYAN"
start_service "GameStore.APIService" "5001" "$GREEN"
start_service "GameStore.ApiGateway" "5000" "$PURPLE"

echo -e "${YELLOW}${BOLD}════════════ FRONTEND ════════════${NC}\n"
FRONTEND_PATH="$SCRIPT_DIR/GameStore.WebClient"
if [ -d "$FRONTEND_PATH" ]; then
    echo -e "${BLUE}${BOLD}[$(date +%H:%M:%S)] Starting WebClient (Port 3000)...${NC}"
    cd "$FRONTEND_PATH"
    [ ! -d "node_modules" ] && npm install
    nohup npm run dev >> "$LOGS_DIR/webclient_$(date +%Y%m%d).log" 2>&1 &
    FPID=$!
    echo $FPID >> "$PID_FILE"
    sleep 3
    kill -0 $FPID 2>/dev/null && echo -e "${BLUE}  └─ ✅ RUNNING (PID: $FPID)${NC}" || echo -e "${BLUE}  └─ ❌ FAILED${NC}"
fi
cd "$SCRIPT_DIR"
echo ""

echo -e "${GREEN}${BOLD}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║              ✅  ALL SERVICES STARTED                       ║"
echo "╠══════════════════════════════════════════════════════════════╣"
echo "║  🌐 API Gateway  : http://localhost:5000                    ║"
echo "║  📦 API Service  : http://localhost:5001/swagger            ║"
echo "║  🔐 Auth Service : http://localhost:5002/swagger            ║"
echo "║  🖥️  Web Client   : http://localhost:3000                    ║"
echo "║  📝 Logs         : ${LOGS_DIR}                               ║"
echo "║  🛑 Stop all     : ./kill-all.sh                             ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"
