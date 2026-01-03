"use client";

import { motion } from "framer-motion";
import { Code2, Layers, Users, Sparkles } from "lucide-react";

const skillCategories = [
  {
    icon: Code2,
    title: "Core Technologies",
    color: "cyan",
    skills: [
      "JavaScript (ES6+)",
      "TypeScript",
      "React.js",
      "Node.js",
      "HTML5 & CSS3",
      "Java",
      "SQL",
    ],
  },
  {
    icon: Layers,
    title: "Frameworks & Libraries",
    color: "purple",
    skills: [
      "Next.js",
      "Redux",
      "React Query",
      "Tailwind CSS",
      "Spring Boot",
      "ExtJS",
    ],
  },
  {
    icon: Users,
    title: "Leadership & Management",
    color: "emerald",
    skills: [
      "Technical Leadership",
      "Team Management (10+ members)",
      "Mentorship",
      "Project Bootstrapping",
      "Code Reviews",
      "Architecture Design",
    ],
  },
  {
    icon: Sparkles,
    title: "Specializations",
    color: "cyan",
    skills: [
      "Performance Optimization",
      "UI/UX Development",
      "RESTful APIs",
      "Microservices",
      "Agile Methodologies",
      "CI/CD",
    ],
  },
];

const colorMap = {
  cyan: {
    bg: "bg-accent-cyan/10",
    border: "border-accent-cyan/50",
    icon: "text-accent-cyan",
    glow: "group-hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]",
  },
  purple: {
    bg: "bg-accent-purple/10",
    border: "border-accent-purple/50",
    icon: "text-accent-purple",
    glow: "group-hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]",
  },
  emerald: {
    bg: "bg-accent-emerald/10",
    border: "border-accent-emerald/50",
    icon: "text-accent-emerald",
    glow: "group-hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]",
  },
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function SkillsSection() {
  return (
    <section className="w-full px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Skills & Expertise
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Full-stack capabilities with deep frontend expertise and proven leadership in building
            scalable, high-performance applications
          </p>
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {skillCategories.map((category) => {
            const Icon = category.icon;
            const colors = colorMap[category.color as keyof typeof colorMap];

            return (
              <motion.div
                key={category.title}
                variants={item}
                className={`group rounded-2xl border ${colors.border} bg-card p-6 transition-all duration-300 ${colors.glow}`}
              >
                {/* Icon & Title */}
                <div className="mb-6">
                  <div className={`mb-4 inline-flex rounded-xl ${colors.bg} p-3`}>
                    <Icon className={`h-6 w-6 ${colors.icon}`} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{category.title}</h3>
                </div>

                {/* Skills List */}
                <ul className="space-y-2">
                  {category.skills.map((skill) => (
                    <li key={skill} className="flex items-start gap-2 text-sm text-foreground/80">
                      <span className={`mt-1.5 h-1.5 w-1.5 rounded-full ${colors.bg}`} />
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
