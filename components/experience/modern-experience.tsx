"use client";

import { motion } from "framer-motion";
import {
  Building2,
  MapPin,
  Calendar,
  Sparkles,
  Users,
  TrendingUp,
  Award,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const experiences = [
  {
    company: "Kumarans",
    position: "Tech Lead",
    date: "Dec 2024 – Present",
    location: "Chennai, India",
    current: true,
    color: "emerald",
    teamSize: "8",
    achievement: "4-mo PWA",
    highlights: [
      "Led an 8-engineer team delivering a customer-facing insurance PWA from greenfield to production in 4 months",
      "Drove the shift to AI-native delivery — agentic coding tools and Markdown specs as living PRDs — cutting feature cycle time by 65%",
      "Enabled the team to ramp from 8 to 5 engineers without slowing delivery",
      "Own the full stack: React/TypeScript frontend, Node.js backend, offline-first PWA with service workers, auth, and CI/CD",
    ],
  },
  {
    company: "Revcomm Inc.",
    position: "Senior Frontend Engineer",
    date: "Jul 2023 – Nov 2024",
    location: "Tokyo, Japan",
    current: false,
    color: "purple",
    teamSize: "4",
    achievement: "<1s Load",
    highlights: [
      "Built <1s CSV processing for 30K+ rows",
      "Led team of 4 developers with reliable releases",
    ],
  },
  {
    company: "State Street",
    position: "Tech Lead",
    date: "Sep 2019 – Nov 2022",
    location: "Bengaluru, India",
    current: false,
    color: "cyan",
    achievement: "6 Projects",
    highlights: [
      "Developed React framework adopted by 6 projects",
      "Guided multiple teams on best practices",
    ],
  },
  {
    company: "HCL Technologies",
    position: "Senior Software Engineer",
    date: "Jan 2017 – Aug 2019",
    location: "Bengaluru, India",
    current: false,
    color: "emerald",
    teamSize: "5",
    achievement: "$1M Saved",
    highlights: [
      "$1M annual cost savings through admin portal optimization during EOY peak season",
      "Designed a single-click Excel-to-application migration tool, saving 20 person-hours per cycle",
      "Led a team of 5 and volunteered in company mentorship programs",
      "Owned the POC for upgrading ExtJS pages to AngularJS / React",
    ],
  },
  {
    company: "Walking Tree Consulting",
    position: "Senior Software Engineer",
    date: "Jan 2016 – Dec 2016",
    location: "Hyderabad, India",
    current: false,
    color: "purple",
    achievement: "UI Upgrade",
    highlights: [
      "Built custom components with ExtJS (Sencha Touch); architected the UI upgrade for a risk management engine",
      "Maintained coding standards through code reviews; cultivated a quality-over-quantity culture",
    ],
  },
  {
    company: "Tata Consultancy Services",
    position: "Software Engineer",
    date: "Dec 2012 – Dec 2015",
    location: "Bengaluru, India",
    current: false,
    color: "cyan",
    highlights: [
      "Interfaced directly with clients to gather requirements and design user-centric web applications",
      "Built web pages with Spring MVC; led HTML-to-ExtJS platform upgrades and integration testing",
    ],
  },
];

const colorMap = {
  emerald: {
    dot: "bg-accent-emerald",
    border: "border-accent-emerald/40",
    glow: "shadow-accent-emerald/40",
    badge: "bg-accent-emerald/30 text-accent-emerald border-accent-emerald/60",
    gradient: "from-accent-emerald/40 via-accent-emerald/20 to-transparent",
    bgGradient: "from-accent-emerald/30 to-emerald-500/10",
    iconBg: "bg-accent-emerald/30",
    iconColor: "text-accent-emerald",
  },
  cyan: {
    dot: "bg-accent-cyan",
    border: "border-accent-cyan/40",
    glow: "shadow-accent-cyan/40",
    badge: "bg-accent-cyan/30 text-accent-cyan border-accent-cyan/60",
    gradient: "from-accent-cyan/40 via-accent-cyan/20 to-transparent",
    bgGradient: "from-accent-cyan/30 to-cyan-500/10",
    iconBg: "bg-accent-cyan/30",
    iconColor: "text-accent-cyan",
  },
  purple: {
    dot: "bg-accent-purple",
    border: "border-accent-purple/40",
    glow: "shadow-accent-purple/40",
    badge: "bg-accent-purple/30 text-accent-purple border-accent-purple/60",
    gradient: "from-accent-purple/40 via-accent-purple/20 to-transparent",
    bgGradient: "from-accent-purple/30 to-purple-500/10",
    iconBg: "bg-accent-purple/30",
    iconColor: "text-accent-purple",
  },
};

export default function ModernExperience() {
  return (
    <section className="w-full py-16">
      <div className="w-full px-0">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Experience
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground">
            13+ years across global companies
          </p>
        </motion.div>

        {/* Compact Timeline */}
        <div className="relative">
          {/* Vibrant gradient line */}
          <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-accent-emerald via-accent-cyan to-accent-purple opacity-60 rounded-full" />

          {/* Experience items */}
          <div className="space-y-5">
            {experiences.map((exp, index) => {
              const colors = colorMap[exp.color as keyof typeof colorMap];

              return (
                <motion.div
                  key={`${exp.company}-${exp.date}`}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="relative pl-0"
                >
                  {/* Timeline dot with glow */}
                  <div className="absolute left-3.5 top-6 z-10">
                    <div className="relative">
                      {exp.current && (
                        <div
                          className={`absolute inset-0 animate-ping rounded-full ${colors.dot} opacity-75`}
                        />
                      )}
                      <div
                        className={`absolute -inset-2 rounded-full ${colors.dot} opacity-20 blur-md`}
                      />
                      <div
                        className={`relative h-5 w-5 rounded-full ${colors.dot} border-4 border-background shadow-xl ring-2 ring-background`}
                      />
                    </div>
                  </div>

                  {/* Content card with rich gradients */}
                  <motion.div
                    whileHover={{ scale: 1.02, y: -4 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className={`group relative overflow-hidden rounded-2xl border-2 ${colors.border} bg-card shadow-xl hover:shadow-2xl transition-all duration-300`}
                  >
                    {/* Multiple gradient layers for richness */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${colors.bgGradient} opacity-90`}
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-tr ${colors.gradient} opacity-60`}
                    />
                    <div
                      className={`absolute top-0 right-0 h-64 w-64 bg-gradient-radial from-${exp.color}-400/20 to-transparent blur-2xl`}
                    />

                    {/* Decorative pattern overlay */}
                    <div
                      className="absolute inset-0 opacity-[0.04] group-hover:opacity-[0.06] transition-opacity"
                      style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1.5px, transparent 0)`,
                        backgroundSize: "28px 28px",
                      }}
                    />

                    {/* Content */}
                    <div className="relative p-7">
                      {/* Header with badges and metrics */}
                      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="mb-3 flex flex-wrap items-center gap-2">
                            {exp.current && (
                              <Badge
                                className={`${colors.badge} border-2 shadow-lg`}
                              >
                                <Sparkles className="mr-1 h-3.5 w-3.5" />
                                Current Role
                              </Badge>
                            )}
                          </div>

                          <h3 className="mb-3 text-2xl font-bold text-foreground leading-tight">
                            {exp.position}
                          </h3>

                          <div
                            className={`mb-3 flex items-center gap-2 ${colors.iconColor} font-bold text-lg`}
                          >
                            <Building2 className="h-5 w-5" />
                            <span>{exp.company}</span>
                          </div>

                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-4 w-4" />
                              <span>{exp.date}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-4 w-4" />
                              <span>{exp.location}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Achievement metrics with vibrant backgrounds - 2 rows layout */}
                      <div className="mb-4 grid grid-cols-2 gap-3">
                        {exp.teamSize && (
                          <div
                            className={`flex items-center gap-3 rounded-xl ${colors.iconBg} border-2 ${colors.border} px-4 py-3 backdrop-blur-sm shadow-lg`}
                          >
                            <Users className={`h-6 w-6 ${colors.iconColor}`} />
                            <div>
                              <span
                                className={`block text-xl font-bold ${colors.iconColor}`}
                              >
                                {exp.teamSize}
                              </span>
                              <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">
                                Team Size
                              </span>
                            </div>
                          </div>
                        )}
                        {exp.achievement && (
                          <div
                            className={`flex items-center gap-3 rounded-xl ${colors.iconBg} border-2 ${colors.border} px-4 py-3 backdrop-blur-sm shadow-lg`}
                          >
                            <Award className={`h-6 w-6 ${colors.iconColor}`} />
                            <div>
                              <span
                                className={`block text-xl font-bold ${colors.iconColor}`}
                              >
                                {exp.achievement}
                              </span>
                              <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">
                                Impact
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Highlights with colored icon backgrounds */}
                      <ul className="space-y-2.5 mt-5">
                        {exp.highlights.map((highlight, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-3 text-sm text-foreground/90"
                          >
                            <div
                              className={`mt-0.5 rounded-lg ${colors.iconBg} p-1.5 border ${colors.border} shadow-sm`}
                            >
                              <TrendingUp
                                className={`h-3.5 w-3.5 ${colors.iconColor}`}
                              />
                            </div>
                            <span className="leading-relaxed flex-1">
                              {highlight}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* Decorative bottom gradient bar */}
                      <div
                        className={`mt-6 h-1.5 rounded-full bg-gradient-to-r ${colors.bgGradient} shadow-lg`}
                      />
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
