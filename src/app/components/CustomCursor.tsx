import { useEffect, useRef } from "react";

export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef  = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const lag = useRef({ x: -100, y: -100 });
  const raf = useRef(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      /* Dot snaps immediately */
      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
      }
    };

    const onEnterLink = () => {
      if (ringRef.current) {
        ringRef.current.style.width  = "40px";
        ringRef.current.style.height = "40px";
        ringRef.current.style.borderColor = "rgba(6,182,212,0.8)";
        ringRef.current.style.backgroundColor = "rgba(6,182,212,0.05)";
      }
    };
    const onLeaveLink = () => {
      if (ringRef.current) {
        ringRef.current.style.width  = "24px";
        ringRef.current.style.height = "24px";
        ringRef.current.style.borderColor = "rgba(6,182,212,0.45)";
        ringRef.current.style.backgroundColor = "transparent";
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    /* Add hover expansion to interactive elements */
    const addHoverListeners = () => {
      document.querySelectorAll("a, button, [role=button]").forEach((el) => {
        el.addEventListener("mouseenter", onEnterLink);
        el.addEventListener("mouseleave", onLeaveLink);
      });
    };
    addHoverListeners();
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    /* Ring follows with lerp */
    function animate() {
      lag.current.x += (pos.current.x - lag.current.x) * 0.11;
      lag.current.y += (pos.current.y - lag.current.y) * 0.11;
      if (ringRef.current) {
        const r = ringRef.current;
        const hw = parseFloat(r.style.width) / 2 || 12;
        const hh = parseFloat(r.style.height) / 2 || 12;
        r.style.transform = `translate(${lag.current.x - hw}px, ${lag.current.y - hh}px)`;
      }
      raf.current = requestAnimationFrame(animate);
    }
    raf.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      observer.disconnect();
      cancelAnimationFrame(raf.current);
    };
  }, []);

  /* Hide on mobile/touch devices */
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      {/* Lagging ring */}
      <div
        ref={ringRef}
        style={{
          position:        "fixed",
          top:             0,
          left:            0,
          width:           24,
          height:          24,
          borderRadius:    "50%",
          border:          "1.5px solid rgba(6,182,212,0.45)",
          pointerEvents:   "none",
          zIndex:          9999,
          transition:      "width 0.2s ease, height 0.2s ease, border-color 0.2s ease, background-color 0.2s ease",
          willChange:      "transform",
        }}
      />
      {/* Snappy dot */}
      <div
        ref={dotRef}
        style={{
          position:      "fixed",
          top:           0,
          left:          0,
          width:         8,
          height:        8,
          borderRadius:  "50%",
          backgroundColor: "#06B6D4",
          pointerEvents: "none",
          zIndex:        9999,
          willChange:    "transform",
        }}
      />
    </>
  );
}
