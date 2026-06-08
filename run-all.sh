#!/bin/bash

# ═══════════════════════════════════════════════════════════════════
#  GameStore - Run All Services
#  Starts all services (API Gateway, API Service, Auth, Web Client)
# ═══════════════════════════════════════════════════════════════════
#  Usage: ./run-all.sh [OPTIONS]
#
#  Options:
#    --rebuild, -r  Restore & rebuild all projects before starting
#    --clean, -c    Clean up log files before starting
#    --help, -h     Show this help message
# ═══════════════════════════════════════════════════════════════════

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

REBUILD_MODE=false
CLEAN_MODE=false
set -euo pipefail

# ─── Parse arguments ──────────────────────────────────────────────
while [[ $# -gt 0 ]]; do
  case "$1" in
    --rebuild|-r) REBUILD_MODE=true; shift ;;
    --clean|-c) CLEAN_MODE=true; shift ;;
    --help|-h)
      echo -e "${CYAN}${BOLD}Usage:${NC} ./run-all.sh [OPTIONS]"
      echo ""
      echo -e "  ${YELLOW}--rebuild, -r${NC}  Restore & rebuild all projects before starting"
      echo -e "  ${YELLOW}--clean, -c${NC}    Clean up log files before starting"
      echo -e "  ${YELLOW}--help, -h${NC}     Show this help message"
      echo ""
      echo -e "Starts 4 services: Auth (5002), API (5001), Gateway (5000), Web (3000)"
      exit 0
      ;;
    *)
      echo -e "${RED}${BOLD}Unknown option:${NC} $1"
      echo -e "Run ${CYAN}./run-all.sh --help${NC} for usage."
      exit 1
      ;;
  esac
done

# ─── Clean mode ───────────────────────────────────────────────────
if [ "$CLEAN_MODE" = true ]; then
  echo -e "${YELLOW}[$(date +%H:%M:%S)] Cleaning logs directory...${NC}"
  if [ -d "$LOGS_DIR" ]; then
    rm -f "$LOGS_DIR"/*.log "$LOGS_DIR"/*.pid 2>/dev/null
    echo -e " ${GREEN}logs cleaned${NC}"
  else
    echo -e " ${CYAN}no logs directory${NC}"
  fi
  echo ""
fi

# ─── Rebuild mode ─────────────────────────────────────────────────
if [ "$REBUILD_MODE" = true ]; then
  echo -e "${YELLOW}${BOLD}"
  echo "╔══════════════════════════════════════════════════════════════╗"
  echo "║        🔨  REBUILD MODE - RESTORING & BUILDING ALL          ║"
  echo "╚══════════════════════════════════════════════════════════════╝"
  echo -e "${NC}"

  # ── Backend: dotnet restore & build ──
  echo -e "${CYAN}${BOLD}[1/4] Restoring .NET packages...${NC}"
  dotnet restore >> "$LOGS_DIR/rebuild_${TIMESTAMP}.log" 2>&1
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}  └─ ✅ dotnet restore succeeded${NC}"
  else
    echo -e "${RED}  └─ ❌ dotnet restore failed (check logs/rebuild_*.log)${NC}"
    exit 1
  fi

  echo -e "${CYAN}${BOLD}[2/4] Cleaning & building .NET projects...${NC}"
  dotnet clean >> "$LOGS_DIR/rebuild_${TIMESTAMP}.log" 2>&1
  dotnet build --no-restore >> "$LOGS_DIR/rebuild_${TIMESTAMP}.log" 2>&1
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}  └─ ✅ dotnet build succeeded${NC}"
  else
    echo -e "${RED}  └─ ❌ dotnet build failed (check logs/rebuild_*.log)${NC}"
    exit 1
  fi

  # ── Frontend: npm install & build ──
  FRONTEND_PATH="$SCRIPT_DIR/GameStore.WebClient"
  if [ -d "$FRONTEND_PATH" ]; then
    echo -e "${CYAN}${BOLD}[3/4] Installing frontend dependencies...${NC}"
    cd "$FRONTEND_PATH"
    npm install >> "$LOGS_DIR/rebuild_${TIMESTAMP}.log" 2>&1
    if [ $? -eq 0 ]; then
      echo -e "${GREEN}  └─ ✅ npm install succeeded${NC}"
    else
      echo -e "${RED}  └─ ❌ npm install failed (check logs/rebuild_*.log)${NC}"
      cd "$SCRIPT_DIR"
      exit 1
    fi

    echo -e "${CYAN}${BOLD}[4/4] Building frontend (Vite)...${NC}"
    npx vite build >> "$LOGS_DIR/rebuild_${TIMESTAMP}.log" 2>&1
    if [ $? -eq 0 ]; then
      echo -e "${GREEN}  └─ ✅ Frontend build succeeded${NC}"
    else
      echo -e "${RED}  └─ ❌ Frontend build failed (check logs/rebuild_*.log)${NC}"
      cd "$SCRIPT_DIR"
      exit 1
    fi
    cd "$SCRIPT_DIR"
  fi

  echo ""
  echo -e "${GREEN}${BOLD}════════════ REBUILD COMPLETE ════════════${NC}"
  echo ""
fi

# ─── Banner ───────────────────────────────────────────────────────
clear
echo -e "${BLUE}${BOLD}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║           🎮  GAMESTORE - STARTING ALL SERVICES              ║"
echo -e "║           📅  $(date '+%Y-%m-%d %H:%M:%S')                     ║"
[ "$REBUILD_MODE" = true ] && echo -e "║           🔨  REBUILD MODE                                   ║"
[ "$CLEAN_MODE" = true ] && echo -e "║           🧹  CLEAN MODE                                     ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# ─── Start service function ───────────────────────────────────────
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

# ─── Start backend services ───────────────────────────────────────
echo -e "${YELLOW}${BOLD}════════════ BACKEND SERVICES ════════════${NC}\n"
start_service "GameStore.AuthService" "5002" "$CYAN"
start_service "GameStore.APIService" "5001" "$GREEN"
start_service "GameStore.ApiGateway" "5000" "$PURPLE"

# ─── Start frontend ───────────────────────────────────────────────
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

# ─── Done banner ──────────────────────────────────────────────────
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
