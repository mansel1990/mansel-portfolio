"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Download, Linkedin, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Side - Photo */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative aspect-square max-w-md mx-auto overflow-hidden rounded-3xl border-2 border-border bg-card">
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/10 via-transparent to-accent-purple/10 z-10" />

              {/* Photo */}
              <Image
                src="/images/Mansel1.jpg"
                alt="Sanjay Mansel"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 h-32 w-32 rounded-full bg-accent-cyan/20 blur-3xl" />
              <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-accent-purple/20 blur-3xl" />
            </div>
          </motion.div>

          {/* Right Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            {/* Location & Status */}
            <div className="mb-6 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-accent-emerald" />
                <span className="text-sm">Chennai, Tamil Nadu, India</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative h-2 w-2">
                  <div className="absolute inset-0 animate-ping rounded-full bg-accent-emerald opacity-75" />
                  <div className="relative h-2 w-2 rounded-full bg-accent-emerald" />
                </div>
              </div>
            </div>

            {/* Name & Title */}
            <h1 className="mb-4 text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Sanjay Mansel
            </h1>

            <h2 className="mb-6 text-2xl font-semibold text-accent-cyan sm:text-3xl">
              Senior Frontend Engineer & Tech Specialist
            </h2>

            {/* Summary */}
            <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
              Highly skilled senior frontend engineer with{" "}
              <span className="font-semibold text-foreground">
                13+ years of experience
              </span>{" "}
              in frontend technology (ReactJS, Node, TypeScript, JavaScript) and
              a passion for building innovative solutions. Currently{" "}
              <span className="font-semibold text-foreground">
                leading a team of 10+ engineers
              </span>{" "}
              and managing multiple complex logistics and insurance projects.
            </p>

            {/* Stats */}
            <div className="mb-8 grid grid-cols-3 gap-4">
              <div className="rounded-xl border border-border bg-card/50 p-4 text-center backdrop-blur-sm">
                <div className="text-3xl font-bold text-accent-cyan">13+</div>
                <div className="mt-1 text-sm text-muted-foreground">Years</div>
              </div>
              <div className="rounded-xl border border-border bg-card/50 p-4 text-center backdrop-blur-sm">
                <div className="text-3xl font-bold text-accent-purple">10+</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Team Size
                </div>
              </div>
              <div className="rounded-xl border border-border bg-card/50 p-4 text-center backdrop-blur-sm">
                <div className="text-3xl font-bold text-accent-emerald">
                  $1M
                </div>
                <div className="mt-1 text-sm text-muted-foreground">Saved</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="group w-full bg-accent-cyan text-black transition-all duration-300 hover:bg-accent-cyan/90 hover:shadow-lg hover:shadow-accent-cyan/30 sm:w-auto"
              >
                <a
                  href="/Sanjay-Mansel-Resume-20260102.pdf"
                  download
                  className="flex items-center justify-center gap-2"
                >
                  <Download className="h-5 w-5 transition-transform group-hover:translate-y-0.5" />
                  Download Resume
                </a>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="group w-full border-border transition-all duration-300 hover:border-accent-cyan/50 hover:bg-accent-cyan/5 sm:w-auto"
              >
                <a
                  href="https://www.linkedin.com/in/sanjay-selvan-mansel/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <Linkedin className="h-5 w-5" />
                  LinkedIn
                </a>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="group w-full border-border transition-all duration-300 hover:border-accent-purple/50 hover:bg-accent-purple/5 sm:w-auto"
              >
                <a
                  href="mailto:sanj.mansel@gmail.com"
                  className="flex items-center justify-center gap-2"
                >
                  <Mail className="h-5 w-5" />
                  Contact
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 right-0 h-96 w-96 rounded-full bg-accent-cyan/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-accent-purple/5 blur-3xl" />
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            Scroll to explore
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-8 w-5 items-start justify-center rounded-full border-2 border-accent-cyan/50 p-1"
          >
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="h-1.5 w-1.5 rounded-full bg-accent-cyan"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
