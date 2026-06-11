// GameStore.WebClient/src/components/games/TrailerPlayer.jsx
import { useEffect, useRef, useState } from "react";
import dashjs from "dashjs";
import { Play, Pause, Maximize, Volume2, VolumeX } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function TrailerPlayer({ trailerUrl, poster, title }) {
  const { t } = useTranslation();
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const controlsTimer = useRef(null);

  useEffect(() => {
    if (!videoRef.current || !trailerUrl) return;

    const player = dashjs.MediaPlayer().create();
    playerRef.current = player;

    player.on(dashjs.MediaPlayer.events.PLAYBACK_STARTED, () => {
      setPlaying(true);
      setLoading(false);
    });
    player.on(dashjs.MediaPlayer.events.PLAYBACK_PAUSED, () => setPlaying(false));
    player.on(dashjs.MediaPlayer.events.PLAYBACK_TIME_UPDATED, () => {
      const t = player.time();
      setProgress(t / (player.duration() || 1));
    });
    player.on(dashjs.MediaPlayer.events.PLAYBACK_METADATA_LOADED, () => {
      setDuration(player.duration() || 0);
      setLoading(false);
    });
    player.on(dashjs.MediaPlayer.events.ERROR, () => {
      setError(true);
      setLoading(false);
    });
    player.on(dashjs.MediaPlayer.events.PLAYBACK_ENDED, () => {
      setPlaying(false);
      setProgress(1);
    });

    player.initialize(videoRef.current, trailerUrl, false);
    player.setMute(true);

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
      if (controlsTimer.current) clearTimeout(controlsTimer.current);
    };
  }, [trailerUrl]);

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (playing) {
      playerRef.current.pause();
    } else {
      playerRef.current.play();
    }
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    const newMuted = !muted;
    playerRef.current.setMute(newMuted);
    setMuted(newMuted);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    if (playing) {
      controlsTimer.current = setTimeout(() => setShowControls(false), 2500);
    }
  };

  const formatTime = (s) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div style={{ marginBottom: 40 }}>
      <h3
        style={{
          fontSize: 12,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 1.5,
          color: "#aaa",
          marginBottom: 12,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <Play size={14} fill="#aaa" />
        {t("gameDetail.officialTrailer")}
      </h3>
      <div
        ref={containerRef}
        className="trailer-container"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => playing && setShowControls(false)}
        style={{
          position: "relative",
          borderRadius: 8,
          overflow: "hidden",
          background: "#000",
          aspectRatio: "16 / 9",
          cursor: "pointer",
          width: "100%",
        }}
      >
        {/* VIDEO ELEMENT */}
        <video
          ref={videoRef}
          style={{
            width: "100%",
            height: "100%",
            display: "block",
            objectFit: "contain",
            background: "#000",
          }}
          playsInline
          onClick={togglePlay}
          poster={poster || undefined}
        />

        {/* LOADING SPINNER */}
        {loading && !error && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,0,0,0.6)",
              zIndex: 2,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                border: "3px solid rgba(255,255,255,0.2)",
                borderTopColor: "#fff",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
          </div>
        )}

        {/* ERROR STATE */}
        {error && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "#111",
              color: "#555",
              zIndex: 2,
              gap: 8,
            }}
          >
            <Play size={48} />
            <span style={{ fontSize: 13 }}>{t("gameDetail.trailerError")}</span>
          </div>
        )}

        {/* BIG PLAY OVERLAY (when paused) */}
        {!playing && !loading && !error && (
          <div
            onClick={togglePlay}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,0,0,0.35)",
              zIndex: 2,
              transition: "background 0.3s",
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(4px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "transform 0.2s",
              }}
              className="trailer-play-btn"
            >
              <Play size={28} fill="#fff" color="#fff" style={{ marginLeft: 3 }} />
            </div>
          </div>
        )}

        {/* CONTROLS BAR */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            background: "linear-gradient(transparent, rgba(0,0,0,0.85))",
            padding: "40px 16px 12px",
            zIndex: 3,
            opacity: showControls || !playing ? 1 : 0,
            transition: "opacity 0.3s",
          }}
        >
          {/* PROGRESS BAR */}
          <div
            onClick={(e) => {
              if (!playerRef.current || !duration) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const ratio = (e.clientX - rect.left) / rect.width;
              playerRef.current.seek(ratio * duration);
            }}
            style={{
              width: "100%",
              height: 4,
              background: "rgba(255,255,255,0.2)",
              borderRadius: 2,
              cursor: "pointer",
              marginBottom: 10,
              position: "relative",
            }}
          >
            <div
              style={{
                width: `${progress * 100}%`,
                height: "100%",
                background: "#fff",
                borderRadius: 2,
                transition: "width 0.1s linear",
              }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={togglePlay}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", padding: 0, display: "flex" }}
            >
              {playing ? <Pause size={16} fill="#fff" /> : <Play size={16} fill="#fff" />}
            </button>
            <button
              onClick={toggleMute}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", padding: 0, display: "flex" }}
            >
              {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <span style={{ fontSize: 11, color: "#ccc", fontVariantNumeric: "tabular-nums" }}>
              {formatTime(progress * duration)} / {formatTime(duration)}
            </span>
            <div style={{ flex: 1 }} />
            <button
              onClick={toggleFullscreen}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", padding: 0, display: "flex" }}
            >
              <Maximize size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* TRAILER TITLE */}
      {title && (
        <p
          style={{
            fontSize: 12,
            color: "#777",
            marginTop: 6,
            fontStyle: "italic",
          }}
        >
          {title}
        </p>
      )}
    </div>
  );
}
