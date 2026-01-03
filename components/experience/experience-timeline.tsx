"use client";

import { motion } from "framer-motion";
import { Briefcase, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const experiences = [
  {
    company: "Kumaran Systems",
    position: "Tech Specialist",
    date: "August 2025 – Present",
    location: "Chennai, India",
    current: true,
    highlights: [
      "Managing a team of 10 employees, providing technical guidance and performance oversight",
      "Overseeing technical execution of Swap Logistics and Insurance platform projects",
      "Directing task assignments and focusing on critical technical points for project stability",
    ],
  },
  {
    company: "Optimum Solutions (Mashreq Bank)",
    position: "Senior Front-end Developer",
    date: "February 2025 – August 2025",
    location: "Remote",
    current: false,
    highlights: [
      "Developed core features for loan payment section using React",
      "Collaborated with cross-functional teams on secure financial workflows",
      "Focused on digital banking transformation",
    ],
  },
  {
    company: "Revcomm Inc.",
    position: "Senior Frontend Engineer",
    date: "July 2023 – November 2024",
    location: "Tokyo, Japan",
    current: false,
    highlights: [
      "Built CSV processing feature handling 30,000+ rows in <1 second",
      "Delivered performance improvements that attracted new merchants post-launch",
      "Led team of 4 developers with reliable release schedules",
    ],
  },
  {
    company: "State Street",
    position: "Tech Lead",
    date: "September 2019 – November 2022",
    location: "Bengaluru, India",
    current: false,
    highlights: [
      "Developed reusable React framework adopted by 6 projects",
      "Guided multiple teams on React best practices and architecture",
      "Built RESTful APIs in Java with rigorous code reviews",
    ],
  },
  {
    company: "HCL Technologies",
    position: "Senior Software Engineer",
    date: "January 2017 – August 2019",
    location: "Bengaluru, India",
    current: false,
    highlights: [
      "Delivered $1M annual cost savings through admin portal optimization",
      "Created single-click Excel to app migration solution",
      "Led ExtJS to React modernization POC",
    ],
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 },
};

export default function ExperienceTimeline() {
  return (
    <section className="w-full px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Professional Journey
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            13+ years of progressive growth from Software Engineer to Tech
            Specialist, working with global companies
          </p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="relative"
        >
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-accent-cyan via-accent-purple to-accent-emerald opacity-30" />

          {/* Experience items */}
          <div className="space-y-8">
            {experiences.map((exp) => (
              <motion.div
                key={`${exp.company}-${exp.date}`}
                variants={item}
                className="group relative pl-20"
              >
                {/* Timeline dot */}
                <div className="absolute left-6 top-6 h-5 w-5">
                  <div
                    className={`absolute inset-0 rounded-full ${
                      exp.current ? "bg-accent-emerald" : "bg-accent-cyan"
                    } ${exp.current ? "animate-ping opacity-75" : ""}`}
                  />
                  <div
                    className={`relative h-5 w-5 rounded-full ${
                      exp.current ? "bg-accent-emerald" : "bg-accent-cyan"
                    } border-4 border-background`}
                  />
                </div>

                {/* Content card */}
                <div className="rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-accent-cyan/50 hover:shadow-lg">
                  {/* Header */}
                  <div className="mb-4">
                    <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="text-2xl font-bold text-foreground">
                          {exp.position}
                        </h3>
                        <p className="text-lg font-semibold text-accent-cyan">
                          {exp.company}
                        </p>
                      </div>
                      {exp.current && (
                        <Badge className="bg-accent-emerald/20 text-accent-emerald border-accent-emerald/50">
                          Current
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{exp.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        <span>{exp.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Highlights */}
                  <ul className="space-y-2">
                    {exp.highlights.map((highlight, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-foreground/80"
                      >
                        <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-cyan" />
                        <span className="text-sm leading-relaxed">
                          {highlight}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
