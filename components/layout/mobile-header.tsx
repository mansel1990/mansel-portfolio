"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Github, Linkedin, Mail } from "lucide-react";
import Image from "next/image";

const navigation = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Experience", href: "#experience" },
  { name: "Contact", href: "#contact" },
];

const images = [
  "/images/Mansel1.jpg",
  "/images/Mansel2.jpg",
  "/images/Mansel3.jpg",
  "/images/Mansel4.jpg",
  "/images/Mansel5.jpg",
];

export default function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleNavClick = (href: string) => {
    const element = document.getElementById(href.substring(1));
    if (element) {
      setIsOpen(false);
      // Small delay to allow menu to close first
      setTimeout(() => {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }, 100);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 lg:hidden">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-background/80 backdrop-blur-lg border-b border-border/50 px-6 py-4">
        <div className="flex items-center gap-3">
          {/* Profile Image Carousel */}
          <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-accent-cyan/40 shadow-lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="h-full w-full"
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

          <div>
            <h1 className="text-xl font-bold text-foreground">Sanjay Mansel</h1>
            <p className="text-xs text-muted-foreground">AI-Augmented Full-Stack Engineer</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-2 text-foreground transition-colors hover:bg-accent-cyan/10"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-background/95 backdrop-blur-lg border-b border-border/50"
          >
            <nav className="px-6 py-6">
              <ul className="space-y-4">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <button
                      onClick={() => handleNavClick(item.href)}
                      className="block w-full text-left text-lg font-medium text-muted-foreground transition-colors hover:text-accent-cyan"
                    >
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-center gap-4 pt-6 border-t border-border/50">
                <a
                  href="https://github.com/mansel1990"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-accent-cyan"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/sanjay-selvan-mansel/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-accent-cyan"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href="mailto:sanj.mansel@gmail.com"
                  className="text-muted-foreground transition-colors hover:text-accent-cyan"
                >
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
