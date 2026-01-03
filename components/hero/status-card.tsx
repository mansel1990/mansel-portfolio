"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Briefcase } from "lucide-react";

export default function StatusCard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="group relative col-span-12 row-span-1 overflow-hidden rounded-3xl border border-border bg-card p-8 md:col-span-7"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-emerald/5 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-center">
        <div className="mb-4 flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-accent-emerald opacity-20" />
            <div className="relative h-3 w-3 rounded-full bg-accent-emerald" />
          </div>
          <Badge
            variant="outline"
            className="border-accent-emerald/50 bg-accent-emerald/10 text-accent-emerald"
          >
            Available for Work
          </Badge>
        </div>

        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-accent-emerald/10 p-3">
            <Briefcase className="h-6 w-6 text-accent-emerald" />
          </div>
          <div>
            <h3 className="mb-2 text-2xl font-bold text-foreground md:text-3xl">
              Tech Specialist & Team Lead
            </h3>
            <p className="text-lg text-muted-foreground">
              Leading teams, mentoring developers, and architecting frontend solutions
            </p>
          </div>
        </div>
      </div>

      {/* Subtle hover effect */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div
          className="absolute inset-0"
          style={{
            boxShadow: "inset 0 0 40px rgba(16, 185, 129, 0.05)",
          }}
        />
      </div>
    </motion.div>
  );
}
