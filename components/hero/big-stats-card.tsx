"use client";

import { motion } from "framer-motion";

export default function BigStatsCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="group relative col-span-12 row-span-2 overflow-hidden rounded-3xl border border-border bg-card p-8 md:col-span-7 md:p-12"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/5 via-transparent to-accent-purple/5" />

      {/* Animated glow orb */}
      <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-accent-cyan/20 opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-30" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-center">
        <motion.div
          className="mb-4"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <h2 className="text-7xl font-bold tracking-tighter text-foreground md:text-8xl lg:text-9xl">
            13
            <span
              className="text-accent-cyan"
              style={{
                filter: "drop-shadow(0 0 20px rgba(6, 182, 212, 0.5))",
              }}
            >
              +
            </span>
          </h2>
        </motion.div>

        <p className="mb-2 text-2xl font-semibold text-foreground md:text-3xl">
          Years Experience
        </p>
        <p className="max-w-md text-lg text-muted-foreground md:text-xl">
          Leading frontend innovation and building high-performance solutions
        </p>
      </div>

      {/* Subtle glow effect on hover */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          boxShadow:
            "inset 0 0 60px rgba(6, 182, 212, 0.1), inset 0 0 100px rgba(6, 182, 212, 0.05)",
        }}
      />
    </motion.div>
  );
}
