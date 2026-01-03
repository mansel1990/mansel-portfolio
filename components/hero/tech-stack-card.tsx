"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Database, Box, FileCode } from "lucide-react";

const techStack = [
  { name: "React.js", icon: Code2, color: "#22d3ee" },
  { name: "TypeScript", icon: FileCode, color: "#c084fc" },
  { name: "Node.js", icon: Database, color: "#34d399" },
  { name: "Next.js", icon: Box, color: "#22d3ee" },
];

export default function TechStackCard() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % techStack.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = techStack[currentIndex].icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="group relative col-span-12 row-span-1 overflow-hidden rounded-3xl border border-border bg-card p-8 md:col-span-5 md:row-span-1"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/5 via-transparent to-accent-emerald/5" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, rotateY: 90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: -90 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <div
              className="mb-6 rounded-2xl bg-gradient-to-br from-background/50 to-background/30 p-6 backdrop-blur-sm"
              style={{
                boxShadow: `0 0 40px ${techStack[currentIndex].color}20`,
              }}
            >
              <CurrentIcon
                className="h-16 w-16 md:h-20 md:w-20"
                style={{ color: techStack[currentIndex].color }}
              />
            </div>
            <h3 className="text-2xl font-bold text-foreground md:text-3xl">
              {techStack[currentIndex].name}
            </h3>
          </motion.div>
        </AnimatePresence>

        {/* Indicator dots */}
        <div className="mt-6 flex gap-2">
          {techStack.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-8 bg-accent-cyan"
                  : "bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
