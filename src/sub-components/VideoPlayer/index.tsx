import { useEffect, useRef, useState } from "preact/hooks";
import { observer } from "@ikas/component-utils";
import { cx } from "../../utils/cx";
import { TEXT } from "../../utils/tokens";
import Icon from "../Icon";

export interface VideoPlayerTexts {
  playAriaLabel: string;
  pauseAriaLabel: string;
  muteAriaLabel: string;
  unmuteAriaLabel: string;
  fullscreenAriaLabel: string;
  seekAriaLabel: string;
}

interface Props {
  src: string;
  texts: VideoPlayerTexts;
  /** Extra class for the <video> (sizing from the host, e.g. pdp__img). */
  videoClassName?: string;
  /** false pauses the video (slide scrolled away / another media selected). */
  active?: boolean;
  /** Fires once the first play starts (true) — hosts hide overlays that share the corners. */
  onStartedChange?: (started: boolean) => void;
}

const IDLE_MS = 2000;
const SEEK_STEP = 1;

function formatTime(sec: number, round = false) {
  const s = Number.isFinite(sec) && sec > 0 ? (round ? Math.round(sec) : Math.floor(sec)) : 0;
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/**
 * V2 · yüzen hap — product video player without native controls.
 * Poster: centred 64px play + duration pill. After the first play: a floating pill at the
 * bottom-left (toggle · 120px progress · time · mute) and a 36px fullscreen disc at the
 * bottom-right; both fade after 2s without pointer movement while playing.
 */
const VideoPlayer = observer(function VideoPlayer({ src, texts, videoClassName, active = true, onStartedChange }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const idleTimer = useRef(0);
  const dragRaf = useRef(0);
  const dragRatio = useRef<number | null>(null);
  const revealOnly = useRef(false);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [idle, setIdle] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  // Hide the controls after IDLE_MS while playing, unless a keyboard user is inside them.
  const scheduleIdle = () => {
    clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => {
      const video = videoRef.current;
      if (!video || video.paused || dragRatio.current !== null) return;
      let focused = false;
      try {
        focused = !!rootRef.current?.querySelector(":focus-visible");
      } catch {
        focused = !!rootRef.current?.contains(document.activeElement);
      }
      if (!focused) setIdle(true);
    }, IDLE_MS);
  };

  const reveal = () => {
    setIdle(false);
    scheduleIdle();
  };

  useEffect(() => () => {
    clearTimeout(idleTimer.current);
    cancelAnimationFrame(dragRaf.current);
  }, []);

  useEffect(() => {
    if (!active) videoRef.current?.pause();
  }, [active]);

  useEffect(() => {
    onStartedChange?.(started);
  }, [started]);

  useEffect(() => {
    const onChange = () => {
      const d = document as any;
      setFullscreen((d.fullscreenElement || d.webkitFullscreenElement) === rootRef.current);
    };
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, []);

  const play = () => {
    videoRef.current?.play().catch(() => undefined);
  };

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) play();
    else video.pause();
  };

  const onVideoClick = () => {
    // First tap on touch while the controls are hidden only brings them back.
    if (revealOnly.current) {
      revealOnly.current = false;
      return;
    }
    toggle();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) video.muted = !video.muted;
  };

  const toggleFullscreen = () => {
    const root = rootRef.current as any;
    const video = videoRef.current as any;
    const d = document as any;
    if (!root) return;
    if (d.fullscreenElement || d.webkitFullscreenElement) {
      (d.exitFullscreen || d.webkitExitFullscreen)?.call(d)?.catch?.(() => undefined);
      return;
    }
    if (root.requestFullscreen) root.requestFullscreen().catch(() => undefined);
    else if (root.webkitRequestFullscreen) root.webkitRequestFullscreen();
    else if (video?.webkitEnterFullscreen) video.webkitEnterFullscreen();
  };

  /* ---------- seeking ---------- */
  const seekTo = (time: number) => {
    const video = videoRef.current;
    if (!video || !duration) return;
    const t = Math.min(Math.max(time, 0), duration);
    video.currentTime = t;
    setCurrent(t);
  };

  const ratioAt = (clientX: number) => {
    const rect = barRef.current?.getBoundingClientRect();
    if (!rect || !rect.width) return 0;
    return Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
  };

  const onSeekDown = (e: PointerEvent) => {
    if (!duration || e.button > 0) return;
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    (e.currentTarget as HTMLElement).focus({ preventScroll: true });
    dragRatio.current = ratioAt(e.clientX);
    setDragging(true);
    seekTo(dragRatio.current * duration);
  };

  const onSeekMove = (e: PointerEvent) => {
    if (dragRatio.current === null) return;
    dragRatio.current = ratioAt(e.clientX);
    cancelAnimationFrame(dragRaf.current);
    dragRaf.current = requestAnimationFrame(() => {
      if (dragRatio.current !== null) seekTo(dragRatio.current * duration);
    });
  };

  const onSeekUp = (e: PointerEvent) => {
    if (dragRatio.current === null) return;
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    cancelAnimationFrame(dragRaf.current);
    seekTo(ratioAt(e.clientX) * duration);
    dragRatio.current = null;
    setDragging(false);
    scheduleIdle();
  };

  const onSeekKey = (e: KeyboardEvent) => {
    const video = videoRef.current;
    if (!video || !duration) return;
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") next = video.currentTime + SEEK_STEP;
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = video.currentTime - SEEK_STEP;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = duration;
    if (next === null) return;
    // keep the gallery / preview arrow-key navigation out of it
    e.preventDefault();
    e.stopPropagation();
    seekTo(next);
    reveal();
  };

  const progress = duration ? Math.min(current / duration, 1) : 0;
  const timeText = `${formatTime(current)} / ${formatTime(duration, true)}`;
  const hidden = playing && idle && !dragging;

  return (
    <div
      ref={rootRef}
      className={cx("vplay", started && "vplay--started", playing && "vplay--playing", hidden && "vplay--idle", fullscreen && "vplay--fullscreen")}
      onPointerMove={(e) => {
        if ((e as PointerEvent).pointerType === "mouse") reveal();
      }}
      onPointerDownCapture={(e) => {
        revealOnly.current = hidden && (e as PointerEvent).pointerType !== "mouse";
        reveal();
      }}
      onFocusCapture={reveal}
    >
      <video
        ref={videoRef}
        className={cx("vplay__video", videoClassName)}
        src={src}
        muted={muted}
        loop
        playsInline
        preload="metadata"
        onClick={onVideoClick}
        onLoadedMetadata={(e) => setDuration((e.currentTarget as HTMLVideoElement).duration || 0)}
        onDurationChange={(e) => setDuration((e.currentTarget as HTMLVideoElement).duration || 0)}
        onTimeUpdate={(e) => {
          if (dragRatio.current === null) setCurrent((e.currentTarget as HTMLVideoElement).currentTime);
        }}
        onPlay={() => {
          setStarted(true);
          setPlaying(true);
          scheduleIdle();
        }}
        onPause={() => {
          setPlaying(false);
          setIdle(false);
          clearTimeout(idleTimer.current);
        }}
        onVolumeChange={(e) => setMuted((e.currentTarget as HTMLVideoElement).muted)}
      >
        <track kind="captions" />
      </video>

      {!playing && (
        <button type="button" className="vplay__play" aria-label={texts.playAriaLabel} onClick={play}>
          <span className="vplay__play-icon">
            <Icon name="play" size={24} />
          </span>
        </button>
      )}

      {!started && duration > 0 && <span className={cx("vplay__duration", TEXT.label, "tabular")}>{formatTime(duration, true)}</span>}

      {started && (
        <>
          <div className="vplay__bar">
            <button
              type="button"
              className="vplay__btn"
              aria-label={playing ? texts.pauseAriaLabel : texts.playAriaLabel}
              onClick={toggle}
            >
              <Icon name={playing ? "pause" : "play"} size={16} />
            </button>
            <div
              ref={barRef}
              className="vplay__seek"
              role="slider"
              tabIndex={0}
              aria-label={texts.seekAriaLabel}
              aria-valuemin={0}
              aria-valuemax={Math.round(duration)}
              aria-valuenow={Math.round(current)}
              aria-valuetext={timeText}
              onPointerDown={onSeekDown as any}
              onPointerMove={onSeekMove as any}
              onPointerUp={onSeekUp as any}
              onPointerCancel={onSeekUp as any}
              onKeyDown={onSeekKey as any}
            >
              <span className="vplay__track">
                <span className="vplay__fill" style={{ transform: `scaleX(${progress})` }} />
              </span>
            </div>
            <span className={cx("vplay__time", TEXT.uiSm, "tabular")} aria-hidden="true">
              {timeText}
            </span>
            <button
              type="button"
              className="vplay__btn"
              aria-label={muted ? texts.unmuteAriaLabel : texts.muteAriaLabel}
              onClick={toggleMute}
            >
              <Icon name={muted ? "volume-x" : "volume-2"} size={16} />
            </button>
          </div>
          <button
            type="button"
            className="vplay__fs"
            aria-label={texts.fullscreenAriaLabel}
            aria-pressed={fullscreen}
            onClick={toggleFullscreen}
          >
            <Icon name={fullscreen ? "minimize" : "maximize"} size={16} />
          </button>
        </>
      )}
    </div>
  );
});

export default VideoPlayer;
