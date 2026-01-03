"use client";

import { motion } from "framer-motion";
import { caseStudies } from "./case-studies-data";
import CaseStudyCard from "./case-study-card";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function CaseStudySection() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-16 text-center"
      >
        <h2 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Key Achievements
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Highlighted projects demonstrating technical excellence and measurable business impact
        </p>
      </motion.div>

      {/* Case Studies Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
      >
        {caseStudies.map((study) => (
          <motion.div key={study.id} variants={item}>
            <CaseStudyCard study={study} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
