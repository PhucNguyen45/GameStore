// GameStore.WebClient/src/components/games/TrailerPlayer.jsx
import { useEffect, useRef, useState, useMemo } from "react";
import { Play, Pause, Maximize, Volume2, VolumeX } from "lucide-react";
import { useTranslation } from "react-i18next";

function getYouTubeId(url) {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export default function TrailerPlayer({ trailerUrl, poster, title }) {
  const { t } = useTranslation();
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const controlsTimer = useRef(null);

  const youtubeId = useMemo(() => getYouTubeId(trailerUrl), [trailerUrl]);
  const isYouTube = !!youtubeId;

  // ── HTML5 video player logic (non-YouTube) ──
  useEffect(() => {
    if (!videoRef.current || !trailerUrl || isYouTube) return;

    const video = videoRef.current;
    setLoading(true);

    const handlePlayStart = () => {
      setPlaying(true);
      setLoading(false);
    };
    const handlePause = () => setPlaying(false);
    const handleTimeUpdate = () => {
      setProgress(video.duration ? video.currentTime / video.duration : 0);
    };
    const handleLoadedMetadata = () => {
      setDuration(video.duration || 0);
      setLoading(false);
    };
    const handleError = () => {
      setError(true);
      setLoading(false);
    };
    const handleEnded = () => {
      setPlaying(false);
      setProgress(1);
    };

    video.addEventListener("play", handlePlayStart);
    video.addEventListener("pause", handlePause);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("error", handleError);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("play", handlePlayStart);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("error", handleError);
      video.removeEventListener("ended", handleEnded);
      if (controlsTimer.current) clearTimeout(controlsTimer.current);
    };
  }, [trailerUrl, isYouTube]);

  const togglePlay = () => {
    if (!videoRef.current || isYouTube) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  const toggleMute = () => {
    if (!videoRef.current || isYouTube) return;
    const newMuted = !muted;
    videoRef.current.muted = newMuted;
    setMuted(newMuted);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen().catch(() => {});
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
        onMouseMove={isYouTube ? undefined : handleMouseMove}
        onMouseLeave={isYouTube ? undefined : () => playing && setShowControls(false)}
        style={{
          position: "relative",
          borderRadius: 8,
          overflow: "hidden",
          background: "#000",
          aspectRatio: "16 / 9",
          cursor: isYouTube ? "default" : "pointer",
          width: "100%",
        }}
      >
        {isYouTube ? (
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=${playing ? 1 : 0}&mute=${muted ? 1 : 0}&origin=${window.location.origin}&rel=0`}
            title={title || "YouTube trailer"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              display: "block",
            }}
            onLoad={() => setLoading(false)}
            onError={() => setError(true)}
          />
        ) : (
          <>
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
                  <Play
                    size={28}
                    fill="#fff"
                    color="#fff"
                    style={{ marginLeft: 3 }}
                  />
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
                  if (!videoRef.current || !duration) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const ratio = (e.clientX - rect.left) / rect.width;
                  videoRef.current.currentTime = ratio * duration;
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
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#fff",
                    padding: 0,
                    display: "flex",
                  }}
                >
                  {playing ? (
                    <Pause size={16} fill="#fff" />
                  ) : (
                    <Play size={16} fill="#fff" />
                  )}
                </button>
                <button
                  onClick={toggleMute}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#fff",
                    padding: 0,
                    display: "flex",
                  }}
                >
                  {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
                <span
                  style={{
                    fontSize: 11,
                    color: "#ccc",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {formatTime(progress * duration)} / {formatTime(duration)}
                </span>
                <div style={{ flex: 1 }} />
                <button
                  onClick={toggleFullscreen}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#fff",
                    padding: 0,
                    display: "flex",
                  }}
                >
                  <Maximize size={16} />
                </button>
              </div>
            </div>
          </>
        )}
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
