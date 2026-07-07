import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export function PageLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
          style={{
            position:        "fixed",
            inset:           0,
            zIndex:          9998,
            backgroundColor: "#081229",
            display:         "flex",
            flexDirection:   "column",
            alignItems:      "center",
            justifyContent:  "center",
            gap:             24,
          }}
        >
          {/* Logo mark */}
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily:    "'Syne', sans-serif",
              fontSize:       72,
              fontWeight:     800,
              background:     "linear-gradient(135deg, #06B6D4, #6D28D9, #10B981)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor:  "transparent",
              backgroundClip: "text",
              letterSpacing:  "-0.04em",
              lineHeight:     1,
            }}
          >
            PS
          </motion.div>

          {/* Loading bar */}
          <motion.div
            style={{
              width:           160,
              height:          2,
              backgroundColor: "rgba(255,255,255,0.08)",
              borderRadius:    1,
              overflow:        "hidden",
            }}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              style={{
                width:           "100%",
                height:          "100%",
                background:      "linear-gradient(90deg, #06B6D4, #6D28D9)",
                borderRadius:    1,
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
