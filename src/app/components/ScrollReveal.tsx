import { type ReactNode } from "react";
import { motion } from "motion/react";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
  className?: string;
  style?: React.CSSProperties;
}

export function ScrollReveal({
  children,
  delay = 0,
  direction = "up",
  className,
  style,
}: ScrollRevealProps) {
  const initial: Record<string, number> = { opacity: 0 };
  if (direction === "up")    { initial.y = 28; }
  if (direction === "left")  { initial.x = -28; }
  if (direction === "right") { initial.x = 28; }

  const animate: Record<string, number> = { opacity: 1, y: 0, x: 0 };

  return (
    <motion.div
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.55,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
