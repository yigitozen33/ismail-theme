import { useEffect, useRef, useState } from "preact/hooks";
import { cx } from "../../utils/cx";
import { prefersReducedMotion } from "../../utils/hooks";

interface Props {
  src: string;
  className?: string;
  /** Muted, looping playback while on screen instead of a still frame (still frame with reduced motion). */
  live?: boolean;
}

const FRAME_AT = 0.1;

/**
 * First frame of a video painted on a <canvas> (thumb poster). The video is loaded off-DOM and
 * released once the frame is drawn, so the page keeps one <video> per media (the real player).
 * Nothing loads while the canvas is hidden (e.g. the thumb rail on mobile).
 */
function StillFrame({ src, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.offsetParent) return;
    setReady(false);
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    const release = () => {
      video.removeAttribute("src");
      video.load();
    };
    const paint = () => {
      if (!video.videoWidth) return;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d")?.drawImage(video, 0, 0);
      setReady(true);
      release();
    };
    const onLoaded = () => {
      if (video.currentTime >= FRAME_AT) paint();
      else video.currentTime = FRAME_AT;
    };
    video.addEventListener("loadeddata", onLoaded);
    video.addEventListener("seeked", paint);
    video.src = src;
    return () => {
      video.removeEventListener("loadeddata", onLoaded);
      video.removeEventListener("seeked", paint);
      release();
    };
  }, [src]);

  return <canvas ref={canvasRef} className={cx("vposter", ready && "vposter--ready", className)} aria-hidden="true" />;
}

/**
 * Muted loop that only loads once it nears the viewport and pauses whenever it leaves it
 * (a display:none rail never intersects, so it never loads).
 */
function LoopFrame({ src, className }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    setReady(false);
    video.muted = true;
    let loaded = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!loaded) {
            video.src = src;
            loaded = true;
          }
          video.play().catch(() => undefined);
        } else if (!video.paused) {
          video.pause();
        }
      },
      { rootMargin: "100px" },
    );
    io.observe(video);
    return () => {
      io.disconnect();
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      className={cx("vposter", ready && "vposter--ready", className)}
      muted
      loop
      playsInline
      preload="none"
      disablePictureInPicture
      aria-hidden="true"
      tabIndex={-1}
      onLoadedData={() => setReady(true)}
    />
  );
}

export default function VideoPoster({ src, className, live = false }: Props) {
  // SSR renders an empty box for live posters; loop vs still frame is decided after mount.
  const [mode, setMode] = useState<"pending" | "loop" | "still">(live ? "pending" : "still");
  useEffect(() => {
    setMode(live && !prefersReducedMotion() && typeof IntersectionObserver !== "undefined" ? "loop" : "still");
  }, [live]);

  if (mode === "pending") return <span className={cx("vposter", className)} aria-hidden="true" />;
  return mode === "loop" ? <LoopFrame src={src} className={className} /> : <StillFrame src={src} className={className} />;
}
