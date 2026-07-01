"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin, Mail, FileText, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { trackSectionView, trackSocialClick } from "@/lib/analytics";

const navigation = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Experience", href: "#experience" },
  { name: "Contact", href: "#contact" },
];

const socials = [
  { name: "GitHub", href: "https://github.com/mansel1990", icon: Github },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/sanjay-selvan-mansel/", icon: Linkedin },
  { name: "Email", href: "mailto:sanj.mansel@gmail.com", icon: Mail },
  { name: "Resume", href: "/Sanjay-Mansel-Resume-20260102.pdf", icon: FileText, download: true },
];

const images = [
  "/images/Mansel1.jpg",
  "/images/Mansel2.jpg",
  "/images/Mansel3.jpg",
  "/images/Mansel4.jpg",
  "/images/Mansel5.jpg",
];

export default function Sidebar() {
  const [activeSection, setActiveSection] = useState("about");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Image rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, []);

  // Active section tracking
  useEffect(() => {
    const handleScroll = () => {
      const sections = navigation.map((item) => item.href.substring(1));
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            if (activeSection !== section) {
              setActiveSection(section);
              trackSectionView(section);
            }
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeSection]);

  const handleNavClick = (href: string) => {
    const element = document.getElementById(href.substring(1));
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <aside className="fixed left-0 top-0 hidden lg:flex h-screen w-[45%] max-w-[600px] flex-col justify-between p-12 xl:p-16">
      {/* Top Section */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Profile Image Carousel */}
          <div className="mb-8">
            <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-accent-cyan/30 shadow-2xl ring-4 ring-accent-cyan/10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={images[currentImageIndex]}
                    alt="Sanjay Mansel"
                    fill
                    className="object-cover"
                    priority={currentImageIndex === 0}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Name and Title */}
          <h1 className="mb-4 text-5xl font-bold tracking-tight text-foreground">
            Sanjay Mansel
          </h1>
          <h2 className="mb-6 text-xl font-semibold text-accent-cyan">
            AI-Augmented Full-Stack Engineer & Tech Lead
          </h2>
          <p className="max-w-sm text-base leading-relaxed text-muted-foreground">
            13+ years building and scaling product teams. Leading AI-native
            delivery with agentic coding tools and spec-driven workflows —
            end-to-end from architecture to production.
          </p>
        </motion.div>

        {/* Navigation */}
        <nav className="mt-12">
          <ul className="space-y-3">
            {navigation.map((item, index) => {
              const isActive = activeSection === item.href.substring(1);
              return (
                <motion.li
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <button
                    onClick={() => handleNavClick(item.href)}
                    className={`group flex w-full items-center gap-3 py-2 transition-all ${
                      isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div
                      className={`h-px transition-all ${
                        isActive
                          ? "w-16 bg-gradient-to-r from-accent-cyan to-accent-purple"
                          : "w-8 bg-muted-foreground/50 group-hover:w-12 group-hover:bg-accent-cyan/70"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium uppercase tracking-wider ${
                        isActive ? "font-bold" : ""
                      }`}
                    >
                      {item.name}
                    </span>
                    {isActive && (
                      <ChevronRight className="h-4 w-4 text-accent-cyan" />
                    )}
                  </button>
                </motion.li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Bottom Section - Social Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <div className="flex items-center gap-4">
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target={social.name === "Resume" ? "_self" : "_blank"}
              rel="noopener noreferrer"
              download={social.name === "Resume" ? "Sanjay-Mansel-Resume.pdf" : undefined}
              className="group relative"
              aria-label={social.name}
              title={social.name === "Email" ? "sanj.mansel@gmail.com" : social.name}
              onClick={() => trackSocialClick(social.name)}
            >
              <div className="absolute -inset-2 rounded-lg bg-gradient-to-r from-accent-cyan/20 to-accent-purple/20 opacity-0 blur transition-opacity group-hover:opacity-100" />
              <social.icon className="relative h-6 w-6 text-muted-foreground transition-colors group-hover:text-accent-cyan" />
            </a>
          ))}
        </div>
        <p className="mt-6 text-xs text-muted-foreground/60">
          Built with Next.js & TypeScript
        </p>
      </motion.div>
    </aside>
  );
}
