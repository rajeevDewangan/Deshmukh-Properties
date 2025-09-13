"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface TextAnimateProps {
  children: string;
  animation?: "slideLeft" | "slideRight" | "slideUp" | "slideDown" | "fadeIn" | "scaleIn";
  by?: "character" | "word" | "line";
  className?: string;
  delay?: number;
  duration?: number;
  style?: React.CSSProperties;
}

export function TextAnimate({
  children,
  animation = "slideLeft",
  by = "character",
  className,
  delay = 0,
  duration = 0.5,
  style,
}: TextAnimateProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const getAnimationVariants = () => {
    const baseVariants = {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    };

    switch (animation) {
      case "slideLeft":
        return {
          hidden: { opacity: 0, x: 50 },
          visible: { opacity: 1, x: 0 },
        };
      case "slideRight":
        return {
          hidden: { opacity: 0, x: -50 },
          visible: { opacity: 1, x: 0 },
        };
      case "slideUp":
        return {
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 },
        };
      case "slideDown":
        return {
          hidden: { opacity: 0, y: -50 },
          visible: { opacity: 1, y: 0 },
        };
      case "fadeIn":
        return baseVariants;
      case "scaleIn":
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: { opacity: 1, scale: 1 },
        };
      default:
        return baseVariants;
    }
  };

  const renderText = () => {
    if (by === "character") {
      return children.split("").map((char, index) => (
        <motion.span
          key={index}
          variants={getAnimationVariants()}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{
            duration,
            delay: delay + index * 0.05,
            ease: "easeOut",
          }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ));
    }

    if (by === "word") {
      return children.split(" ").map((word, index) => (
        <motion.span
          key={index}
          variants={getAnimationVariants()}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{
            duration,
            delay: delay + index * 0.1,
            ease: "easeOut",
          }}
          className="inline-block mr-2"
        >
          {word}
        </motion.span>
      ));
    }

    // by === "line"
    return children.split("\n").map((line, index) => (
      <motion.div
        key={index}
        variants={getAnimationVariants()}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{
          duration,
          delay: delay + index * 0.2,
          ease: "easeOut",
        }}
        className="block"
      >
        {line}
      </motion.div>
    ));
  };

  return (
    <div ref={ref} className={cn("overflow-hidden", className)} style={style}>
      {renderText()}
    </div>
  );
}
