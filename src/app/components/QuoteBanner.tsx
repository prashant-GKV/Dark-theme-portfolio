import { motion } from "motion/react";

export function QuoteBanner() {
  const words = ["Great", "ideas", "deserve", "great", "execution"];

  return (
    <section
      style={{
        position: "relative",
        zIndex: 1,
        padding: "clamp(28px, 4vw, 52px) clamp(20px, 5vw, 48px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      {/* Soft glow behind the quote */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 45% 55% at 50% 50%, rgba(203,213,225,0.05) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      {/* Decorative top mark */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(40px, 5vw, 64px)",
          lineHeight: 0.5,
          color: "rgba(203,213,225,0.35)",
          marginBottom: 6,
          userSelect: "none",
        }}
      >
        &ldquo;
      </motion.div>

      {/* The quote — word-by-word reveal, one line */}
      <h2
        className="quote-line"
        style={{
          position: "relative",
          fontFamily: "'Playfair Display', serif",
          fontStyle: "italic",
          fontWeight: 600,
          fontSize: "clamp(20px, 3vw, 38px)",
          lineHeight: 1.2,
          letterSpacing: "-0.01em",
          maxWidth: 900,
          margin: 0,
          display: "flex",
          flexWrap: "nowrap",
          gap: "0.28em",
          justifyContent: "center",
          whiteSpace: "nowrap",
        }}
      >
        {words.map((word, i) => {
          const mid = (words.length - 1) / 2;
          // words split apart from the centre: left half enters from the
          // left, right half from the right, distance grows toward the edges
          const offset = (i - mid) * 80;
          const delay = 0.1 + Math.abs(i - mid) * 0.14;
          return (
            <motion.span
              key={i}
              className="quote-word"
              initial={{ opacity: 0, x: offset, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: false, amount: 0.6 }}
              transition={{
                delay,
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ y: -5, scale: 1.05, color: "#FFFFFF" }}
              style={{
                display: "inline-block",
                color: "#CBD5E1",
                cursor: "default",
              }}
            >
              {word}
            </motion.span>
          );
        })}
      </h2>

      {/* Animated underline accent */}
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        whileInView={{ width: "clamp(60px, 8vw, 110px)", opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.9, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{
          height: 2,
          borderRadius: 999,
          marginTop: 24,
          background: "linear-gradient(90deg, transparent, rgba(203,213,225,0.6), transparent)",
        }}
      />

    </section>
  );
}
