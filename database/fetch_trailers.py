#!/usr/bin/env python3
"""
Fetch Steam trailer URLs for all 68 games (AppIDs 1-33, 49-68)
and generate SQL UPDATE statements.
Uses the Steam Store API: store.steampowered.com/api/appdetails
"""
import json
import time
import urllib.request
import urllib.error
import sys

# Game ID -> Steam AppID mapping
GAMES = {
    # Games 1-33
    1: 730,        # Counter-Strike 2
    2: 570,        # Dota 2
    3: 578080,     # PUBG: BATTLEGROUNDS
    4: 1172470,    # Apex Legends
    5: 271590,     # Grand Theft Auto V
    6: 1245620,    # ELDEN RING
    7: 1091500,    # Cyberpunk 2077
    8: 1086940,    # Baldur's Gate 3
    9: 1174180,    # Red Dead Redemption 2
    10: 292030,    # The Witcher 3: Wild Hunt
    11: 582010,    # Monster Hunter: World
    12: 413150,    # Stardew Valley
    13: 105600,    # Terraria
    14: 550,       # Left 4 Dead 2
    15: 4000,      # Garry's Mod
    16: 945360,    # Among Us
    17: 739630,    # Phasmophobia
    18: 892970,    # Valheim
    19: 252490,    # Rust
    20: 346110,    # ARK: Survival Evolved
    21: 990080,    # Hogwarts Legacy
    22: 289070,    # Sid Meier's Civilization VI
    23: 227300,    # Euro Truck Simulator 2
    24: 359550,    # Rainbow Six Siege
    25: 440,       # Team Fortress 2
    26: 377160,    # Fallout 4
    27: 489830,    # Skyrim SE
    28: 374320,    # Dark Souls III
    29: 814380,    # Sekiro: Shadows Die Twice
    30: 1593500,   # God of War
    31: 1817070,   # Marvel's Spider-Man Remastered
    32: 1151640,   # Horizon Zero Dawn Complete Edition
    33: 1259420,   # Days Gone
    # Games 49-68
    49: 294100,    # RimWorld
    50: 427520,    # Factorio
    51: 1145360,   # Hades
    52: 367520,    # Hollow Knight
    53: 588650,    # Dead Cells
    54: 646570,    # Slay the Spire
    55: 548430,    # Deep Rock Galactic
    56: 264710,    # Subnautica
    57: 1313140,   # Cult of the Lamb
    58: 1794680,   # Vampire Survivors
    59: 1332010,   # Stray
    60: 1868140,   # Dave the Diver
    61: 553850,    # Helldivers 2
    62: 1627720,   # Lies of P
    63: 2050650,   # Resident Evil 4
    64: 1888160,   # Armored Core VI
    65: 230410,    # Warframe
    66: 322330,    # Don't Starve Together
    67: 394360,    # Hearts of Iron IV
    68: 1326470,   # Sons of the Forest
}

RESULTS = {}

def fetch_appdetails(appid):
    """Fetch game details from Steam Store API."""
    url = f"https://store.steampowered.com/api/appdetails?appids={appid}&cc=us&l=en"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return data.get(str(appid), {})
    except Exception as e:
        print(f"  Error fetching {appid}: {e}", file=sys.stderr)
        return {}

def get_movie_url(game_id, appid):
    """Get trailer URL for a game from Steam API."""
    result = fetch_appdetails(appid)
    if not result.get("success"):
        print(f"  Game {game_id} (AppID {appid}): API returned no success", file=sys.stderr)
        return None

    data = result.get("data", {})
    movies = data.get("movies", [])

    if not movies:
        print(f"  Game {game_id} (AppID {appid}): No movies found", file=sys.stderr)
        return None

    # Find highlighted movie first, otherwise use first one
    highlight = None
    first = movies[0]
    for m in movies:
        if m.get("highlight"):
            highlight = m
            break

    movie = highlight or first
    name = movie.get("name", "Unknown")

    # Prefer dash_h264 (most compatible), fallback to hls_h264
    url = movie.get("dash_h264") or movie.get("hls_h264") or movie.get("dash_av1")
    if url:
        print(f"  Game {game_id} (AppID {appid}): '{name}' -> {url[:80]}...")
        return url

    print(f"  Game {game_id} (AppID {appid}): Movie '{name}' has no valid URLs", file=sys.stderr)
    return None

def main():
    total = len(GAMES)
    for i, (game_id, appid) in enumerate(GAMES.items(), 1):
        print(f"[{i}/{total}] Fetching Game ID {game_id} (AppID {appid})...")
        url = get_movie_url(game_id, appid)
        RESULTS[game_id] = url
        # Be nice to Steam API - rate limit
        if i < total:
            time.sleep(1.5)

    # Generate SQL
    print("\n" + "=" * 60)
    print("GENERATING SQL UPDATE STATEMENTS")
    print("=" * 60)
    print()

    success_count = 0
    print("-- TrailerUrl updates from Steam API")
    print(f"IF NOT EXISTS (SELECT 1 FROM Games WHERE TrailerUrl IS NOT NULL AND TrailerUrl != '' AND Id = 1)")
    print("BEGIN")
    for game_id in sorted(GAMES.keys()):
        url = RESULTS.get(game_id)
        appid = GAMES[game_id]
        if url:
            # Escape single quotes in URL for SQL
            safe_url = url.replace("'", "''")
            print(f"    UPDATE Games SET TrailerUrl = N'{safe_url}' WHERE Id = {game_id};")
            success_count += 1
        else:
            print(f"    -- Game {game_id} (AppID {appid}): NO TRAILER FOUND")
    print("END")
    print("GO")
    print()
    print(f"-- Success: {success_count}/{total} games got trailer URLs")
    print(f"-- Failed: {total - success_count}/{total} games have no trailer")

if __name__ == "__main__":
    main()
