"use client";

import { motion } from "framer-motion";
import {
  SiReact,
  SiTypescript,
  SiJavascript,
  SiNodedotjs,
  SiNextdotjs,
  SiTailwindcss,
  SiRedux,
  SiPostgresql,
  SiMongodb,
  SiHtml5,
  SiAmazonwebservices,
  SiVercel,
} from "react-icons/si";
import { Bot, Terminal, GitBranch, Brain, Sparkles } from "lucide-react";

const skills = [
  { name: "React.js", icon: SiReact, color: "#61DAFB", level: 95 },
  { name: "Next.js", icon: SiNextdotjs, color: "#FFFFFF", level: 92 },
  { name: "TypeScript", icon: SiTypescript, color: "#3178C6", level: 90 },
  { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E", level: 95 },
  { name: "Node.js", icon: SiNodedotjs, color: "#339933", level: 88 },
  { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4", level: 92 },
  { name: "Redux", icon: SiRedux, color: "#764ABC", level: 85 },
  { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1", level: 82 },
  { name: "MongoDB", icon: SiMongodb, color: "#47A248", level: 80 },
  { name: "AWS", icon: SiAmazonwebservices, color: "#FF9900", level: 78 },
  { name: "Vercel", icon: SiVercel, color: "#FFFFFF", level: 85 },
  { name: "HTML5 / CSS3", icon: SiHtml5, color: "#E34F26", level: 98 },
];

const aiNative = [
  { title: "Claude Code", description: "Primary agentic coding tool", icon: Bot },
  { title: "Cursor", description: "AI-native IDE for daily development", icon: Terminal },
  { title: "Spec-Driven Dev", description: "Markdown specs as living PRDs for humans + agents", icon: GitBranch },
  { title: "Context Engineering", description: "Architecture briefs & ADRs that keep agents aligned", icon: Brain },
];

const leadership = [
  {
    title: "Technical Leadership",
    description: "Owning architecture end-to-end",
  },
  { title: "Team Management", description: "Leading an 8-engineer team" },
  { title: "Mentorship", description: "Developing junior & senior talent" },
  { title: "Code Reviews", description: "Ensuring quality standards" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, scale: 0.8 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 200,
      damping: 20,
    },
  },
};

export default function ModernSkillsSection() {
  return (
    <section className="w-full py-2">
      <div className="w-full">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center"
        >
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Skills & Expertise
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground">
            Full-stack capabilities with deep frontend expertise
          </p>
        </motion.div>

        <div className="space-y-8">
          {/* All Skills */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6"
          >
            {skills.map((skill) => {
              const Icon = skill.icon;
              return (
                <motion.div
                  key={skill.name}
                  variants={item}
                  whileHover={{ y: -5, scale: 1.05 }}
                  className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 transition-all duration-300"
                  style={{ borderColor: `${skill.color}20` }}
                >
                  <div
                    className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(circle at center, ${skill.color}15, transparent 70%)`,
                    }}
                  />
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <Icon
                      className="mb-2 h-8 w-8 transition-transform duration-300 group-hover:scale-110"
                      style={{ color: skill.color }}
                    />
                    <p className="text-xs font-semibold text-foreground">
                      {skill.name}
                    </p>
                    <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 1,
                          delay: 0.2,
                          ease: "easeOut",
                        }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: skill.color }}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* AI-Native Skills */}
          <div>
            <div className="mb-5 flex items-center gap-3">
              <h3 className="flex items-center gap-2 text-xl font-bold text-accent-purple">
                <Sparkles className="h-5 w-5" />
                AI-Native
              </h3>
              <div className="h-px flex-1 bg-gradient-to-r from-accent-purple/50 to-transparent" />
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {aiNative.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.03, y: -4 }}
                  className="group rounded-xl border-2 border-accent-purple/30 bg-gradient-to-br from-accent-purple/10 to-transparent p-5 transition-all duration-300 hover:border-accent-purple hover:shadow-lg hover:shadow-accent-purple/20"
                >
                  <div className="flex items-start gap-3">
                    <item.icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent-purple" />
                    <div>
                      <h4 className="mb-1 font-bold text-foreground text-sm">
                        {item.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Leadership Skills */}
          <div>
            <div className="mb-5 flex items-center gap-3">
              <h3 className="text-xl font-bold text-accent-emerald">
                Leadership & Management
              </h3>
              <div className="h-px flex-1 bg-gradient-to-r from-accent-emerald/50 to-transparent" />
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {leadership.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.03, y: -4 }}
                  className="group rounded-xl border-2 border-accent-emerald/30 bg-gradient-to-br from-accent-emerald/10 to-transparent p-5 transition-all duration-300 hover:border-accent-emerald hover:shadow-lg hover:shadow-accent-emerald/20"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-accent-emerald" />
                    <div>
                      <h4 className="mb-1 font-bold text-foreground text-sm">
                        {item.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
