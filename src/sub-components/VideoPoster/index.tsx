import { useEffect, useRef, useState } from "preact/hooks";
import { cx } from "../../utils/cx";

interface Props {
  src: string;
  className?: string;
}

const FRAME_AT = 0.1;

/**
 * First frame of a video painted on a <canvas> (thumb poster). The video is loaded off-DOM and
 * released once the frame is drawn, so the page keeps one <video> per media (the real player).
 * Nothing loads while the canvas is hidden (e.g. the thumb rail on mobile).
 */
export default function VideoPoster({ src, className }: Props) {
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
