import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface AnimateInViewProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: number;
  animation?: "fadeIn" | "slideUp" | "slideRight" | "slideLeft" | "scale" | "stagger";
  once?: boolean;
  staggerChildren?: number;
  staggerDelay?: number;
}

export const AnimateInView: React.FC<AnimateInViewProps> = ({
  children,
  delay = 0,
  duration = 0.5,
  className = "",
  threshold = 0.1,
  animation = "fadeIn",
  once = true,
  staggerChildren = 0.1,
  staggerDelay = 0.1,
}) => {
  const [ref, inView] = useInView({
    triggerOnce: once,
    threshold,
    rootMargin: "0px",
  });

  const variants = {
    fadeIn: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          duration,
          delay,
          ease: "easeOut",
        },
      },
    },
    slideUp: {
      hidden: { opacity: 0, y: 30 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          type: "spring",
          stiffness: 100,
          damping: 15,
          duration,
          delay,
        },
      },
    },
    slideRight: {
      hidden: { opacity: 0, x: -30 },
      visible: {
        opacity: 1,
        x: 0,
        transition: {
          type: "spring",
          stiffness: 100,
          damping: 15,
          duration,
          delay,
        },
      },
    },
    slideLeft: {
      hidden: { opacity: 0, x: 30 },
      visible: {
        opacity: 1,
        x: 0,
        transition: {
          type: "spring",
          stiffness: 100,
          damping: 15,
          duration,
          delay,
        },
      },
    },
    scale: {
      hidden: { opacity: 0, scale: 0.9 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: {
          type: "spring",
          stiffness: 100,
          damping: 15,
          duration,
          delay,
        },
      },
    },
    stagger: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren,
          delayChildren: staggerDelay,
          delay,
        },
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants[animation]}
    >
      {animation === "stagger"
        ? React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return (
                <motion.div variants={childVariants} key={child.key || undefined}>
                  {child}
                </motion.div>
              );
            }
            return child;
          })
        : children}
    </motion.div>
  );
};

export default AnimateInView;
