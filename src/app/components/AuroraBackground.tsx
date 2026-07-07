export function AuroraBackground() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* Indigo blob — top-left */}
      <div style={{
        position: "absolute",
        top: "-25%", left: "-15%",
        width: "65%", height: "65%",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(109,40,217,0.18) 0%, transparent 65%)",
        animation: "aurora1 20s ease-in-out infinite",
      }} />
      {/* Cyan blob — right */}
      <div style={{
        position: "absolute",
        top: "15%", right: "-20%",
        width: "55%", height: "55%",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(6,182,212,0.14) 0%, transparent 65%)",
        animation: "aurora2 25s ease-in-out infinite",
      }} />
      {/* Emerald blob — bottom */}
      <div style={{
        position: "absolute",
        bottom: "-20%", left: "25%",
        width: "50%", height: "50%",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 65%)",
        animation: "aurora3 30s ease-in-out infinite",
      }} />
      {/* Electric blue — center */}
      <div style={{
        position: "absolute",
        top: "40%", left: "40%",
        width: "40%", height: "40%",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(37,99,235,0.09) 0%, transparent 70%)",
        animation: "aurora1 35s ease-in-out infinite reverse",
      }} />
    </div>
  );
}
