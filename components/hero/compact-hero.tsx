"use client";

import { motion } from "framer-motion";
import { ArrowDown, ChevronRight } from "lucide-react";

export default function CompactHero() {
  const scrollToNext = () => {
    const skillsSection = document.getElementById("skills");
    if (skillsSection) {
      skillsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="about"
      className="min-h-screen pt-12 pb-12 lg:pt-20"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="space-y-6"
      >
        {/* Main Heading */}
        <div className="space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl"
          >
            <span className="block text-foreground mb-2">
              Transforming ideas into
            </span>
            <span className="inline-block bg-gradient-to-r from-[#06b6d4] via-[#a855f7] to-[#10b981] bg-clip-text text-transparent dark:from-[#22d3ee] dark:via-[#c084fc] dark:to-[#34d399] animate-gradient bg-[length:200%_auto]">
              elegant solutions
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-2xl text-lg leading-relaxed text-muted-foreground/90 sm:text-xl lg:text-2xl"
          >
            Senior Frontend Engineer & Tech Lead specializing in building
            scalable, high-performance web applications. Leading teams and
            driving innovation with cutting-edge technologies.
          </motion.p>
        </div>

        {/* Key Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-3 gap-4 sm:gap-6"
        >
          {[
            { value: "13+", label: "Years Experience", color: "emerald", from: "from-emerald-500/20", to: "to-emerald-500/5", border: "border-emerald-500/30", text: "text-emerald-400", glow: "bg-emerald-500", shadow: "hover:shadow-emerald-500/20" },
            { value: "50+", label: "Projects Delivered", color: "cyan", from: "from-cyan-500/20", to: "to-cyan-500/5", border: "border-cyan-500/30", text: "text-cyan-400", glow: "bg-cyan-500", shadow: "hover:shadow-cyan-500/20" },
            { value: "100%", label: "Client Satisfaction", color: "purple", from: "from-purple-500/20", to: "to-purple-500/5", border: "border-purple-500/30", text: "text-purple-400", glow: "bg-purple-500", shadow: "hover:shadow-purple-500/20" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`group relative overflow-hidden rounded-2xl border ${stat.border} bg-gradient-to-br ${stat.from} ${stat.to} p-5 sm:p-6 shadow-lg backdrop-blur-sm transition-all hover:shadow-2xl ${stat.shadow}`}
            >
              {/* Glow effect */}
              <div
                className={`absolute -top-12 -right-12 h-32 w-32 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 ${stat.glow}`}
              />

              <div className="relative text-center">
                <div className={`text-3xl sm:text-4xl font-bold mb-1 ${stat.text}`}>
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground/80 font-medium">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap gap-4"
        >
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-accent-cyan to-accent-purple px-8 py-4 text-base font-bold text-white shadow-xl transition-all hover:shadow-2xl hover:shadow-accent-cyan/40"
          >
            <span className="relative z-10 flex items-center gap-2">
              Get in touch
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-accent-purple to-accent-emerald opacity-0 transition-opacity group-hover:opacity-100" />
          </motion.a>
          <motion.a
            href="#skills"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative overflow-hidden rounded-xl border-2 border-accent-cyan/40 bg-accent-cyan/5 px-8 py-4 text-base font-bold text-foreground backdrop-blur-sm transition-all hover:border-accent-cyan hover:bg-accent-cyan/20 hover:shadow-lg hover:shadow-accent-cyan/20"
          >
            <span className="relative z-10">Explore skills</span>
          </motion.a>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.button
          onClick={scrollToNext}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="group mt-12 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-accent-cyan"
        >
          <span>Explore my journey</span>
          <ArrowDown className="h-4 w-4 animate-bounce" />
        </motion.button>
      </motion.div>
    </section>
  );
}
