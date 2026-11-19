// Adapted from Magic UI's AnimatedBeam (MIT, https://github.com/magicuidesign/magicui): framer-motion instead of
// motion/react, and a still beam when the visitor prefers reduced motion.
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useId, useState, type RefObject } from "react";

interface Props {
  containerRef: RefObject<HTMLElement | null>;
  fromRef: RefObject<HTMLElement | null>;
  toRef: RefObject<HTMLElement | null>;
  curvature?: number;
  reverse?: boolean;
  duration?: number;
  delay?: number;
  pathColor?: string;
  pathOpacity?: number;
  pathWidth?: number;
  gradientStartColor?: string;
  gradientStopColor?: string;
}

export function AnimatedBeam({
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false,
  duration = 4,
  delay = 0,
  pathColor = "#2A449E",
  pathOpacity = 0.25,
  pathWidth = 2.5,
  gradientStartColor = "#04CCDB",
  gradientStopColor = "#2A449E",
}: Props) {
  const id = useId();
  const still = useReducedMotion();
  const [d, setD] = useState("");
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const update = () => {
      const c = containerRef.current?.getBoundingClientRect();
      const a = fromRef.current?.getBoundingClientRect();
      const b = toRef.current?.getBoundingClientRect();
      if (!c || !a || !b) return;
      setSize({ width: c.width, height: c.height });
      const sx = a.left - c.left + a.width / 2;
      const sy = a.top - c.top + a.height / 2;
      const ex = b.left - c.left + b.width / 2;
      const ey = b.top - c.top + b.height / 2;
      setD(`M ${sx},${sy} Q ${(sx + ex) / 2},${sy - curvature} ${ex},${ey}`);
    };
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    update();
    return () => ro.disconnect();
  }, [containerRef, fromRef, toRef, curvature]);

  const x = reverse ? { x1: ["90%", "-10%"], x2: ["100%", "0%"] } : { x1: ["10%", "110%"], x2: ["0%", "100%"] };
  return (
    <svg
      aria-hidden
      fill="none"
      width={size.width}
      height={size.height}
      viewBox={`0 0 ${size.width} ${size.height}`}
      className="pointer-events-none absolute left-0 top-0 transform-gpu"
    >
      <path d={d} stroke={pathColor} strokeWidth={pathWidth} strokeOpacity={pathOpacity} strokeLinecap="round" />
      {!still && (
        <>
          <path d={d} stroke={`url(#${id})`} strokeWidth={pathWidth} strokeLinecap="round" />
          <defs>
            <motion.linearGradient
              id={id}
              gradientUnits="userSpaceOnUse"
              initial={{ x1: "0%", x2: "0%", y1: "0%", y2: "0%" }}
              animate={{ ...x, y1: ["0%", "0%"], y2: ["0%", "0%"] }}
              transition={{ delay, duration, ease: [0.16, 1, 0.3, 1], repeat: Infinity }}
            >
              <stop stopColor={gradientStartColor} stopOpacity="0" />
              <stop stopColor={gradientStartColor} />
              <stop offset="32.5%" stopColor={gradientStopColor} />
              <stop offset="100%" stopColor={gradientStopColor} stopOpacity="0" />
            </motion.linearGradient>
          </defs>
        </>
      )}
    </svg>
  );
}
