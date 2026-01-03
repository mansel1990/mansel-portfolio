"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { CaseStudy } from "./case-studies-data";
import { TrendingUp, TrendingDown } from "lucide-react";

const accentColors = {
  cyan: "var(--accent-cyan)",
  purple: "var(--accent-purple)",
  emerald: "var(--accent-emerald)",
};

export default function CaseStudyCard({ study }: { study: CaseStudy }) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotateY((x - centerX) / 20);
    setRotateX((centerY - y) / 20);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const accentColor = accentColors[study.accentColor];

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="h-full"
    >
      <Card className="group relative h-full overflow-hidden border-border bg-card p-6 transition-all duration-300 hover:border-opacity-50">
        {/* Accent bar */}
        <div
          className="absolute left-0 top-0 h-full w-1"
          style={{ backgroundColor: accentColor }}
        />

        {/* Header */}
        <div className="mb-6">
          <div className="mb-2 flex items-start justify-between">
            <h3 className="text-2xl font-bold text-foreground">
              {study.title}
            </h3>
          </div>
          <p className="mb-1 text-sm font-medium text-muted-foreground">
            {study.role}
          </p>
          <p className="text-sm text-muted-foreground">{study.duration}</p>
        </div>

        {/* Tags */}
        <div className="mb-6 flex flex-wrap gap-2">
          {study.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-secondary/50 text-secondary-foreground"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Challenge */}
        <div className="mb-6">
          <h4
            className="mb-2 text-sm font-semibold uppercase tracking-wider"
            style={{ color: accentColor }}
          >
            Challenge
          </h4>
          <p className="text-sm leading-relaxed text-foreground/80">
            {study.challenge}
          </p>
        </div>

        {/* Solution */}
        <div className="mb-6">
          <h4
            className="mb-2 text-sm font-semibold uppercase tracking-wider"
            style={{ color: accentColor }}
          >
            Solution
          </h4>
          <p className="text-sm leading-relaxed text-foreground/80">
            {study.solution}
          </p>
        </div>

        {/* Impact */}
        <div>
          <h4
            className="mb-4 text-sm font-semibold uppercase tracking-wider"
            style={{ color: accentColor }}
          >
            Impact
          </h4>
          <div className="grid gap-4 sm:grid-cols-3">
            {study.impact.map((item, index) => (
              <div
                key={index}
                className="rounded-lg border border-border/50 bg-background/50 p-4 transition-colors hover:border-opacity-100"
              >
                <div className="mb-1 flex items-center gap-1">
                  {item.value.startsWith("-") ? (
                    <TrendingDown className="h-4 w-4 text-accent-emerald" />
                  ) : (
                    <TrendingUp className="h-4 w-4 text-accent-emerald" />
                  )}
                  <p
                    className="text-2xl font-bold"
                    style={{ color: accentColor }}
                  >
                    {item.value}
                  </p>
                </div>
                <p className="mb-1 text-xs font-medium text-foreground">
                  {item.metric}
                </p>
                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Hover glow effect */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            boxShadow: `inset 0 0 60px ${accentColor}10`,
          }}
        />
      </Card>
    </motion.div>
  );
}
