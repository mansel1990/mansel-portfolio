"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, User, MessageSquare, Send } from "lucide-react";
import { trackContactFormStart, trackContactFormSubmit } from "@/lib/analytics";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Track form submission start
    trackContactFormSubmit(true);

    // Log to console
    console.log("=== Contact Form Submission ===");
    console.log("Name:", formData.name);
    console.log("Email:", formData.email);
    console.log("Message:", formData.message);
    console.log("Timestamp:", new Date().toISOString());
    console.log("===============================");

    // Simulate submission delay
    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({ name: "", email: "", message: "" });
      alert("Message logged to console! Check your browser console.");
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Track when user starts filling the form
    if (formData.name === "" && formData.email === "" && formData.message === "") {
      trackContactFormStart();
    }

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mx-auto max-w-2xl space-y-6"
    >
      {/* Name Field */}
      <div className="group">
        <label htmlFor="name" className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
          <User className="h-4 w-4 text-accent-cyan" />
          Your Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full rounded-xl border-2 border-border bg-card px-5 py-3 text-foreground transition-all focus:border-accent-cyan focus:outline-none focus:ring-2 focus:ring-accent-cyan/20"
          placeholder="John Doe"
        />
      </div>

      {/* Email Field */}
      <div className="group">
        <label htmlFor="email" className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
          <Mail className="h-4 w-4 text-accent-purple" />
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full rounded-xl border-2 border-border bg-card px-5 py-3 text-foreground transition-all focus:border-accent-purple focus:outline-none focus:ring-2 focus:ring-accent-purple/20"
          placeholder="john@example.com"
        />
      </div>

      {/* Message Field */}
      <div className="group">
        <label htmlFor="message" className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
          <MessageSquare className="h-4 w-4 text-accent-emerald" />
          Your Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          className="w-full rounded-xl border-2 border-border bg-card px-5 py-3 text-foreground transition-all focus:border-accent-emerald focus:outline-none focus:ring-2 focus:ring-accent-emerald/20 resize-none"
          placeholder="Tell me about your project or just say hi..."
        />
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
        className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-accent-cyan to-accent-purple px-8 py-4 text-base font-bold text-white shadow-xl transition-all hover:shadow-2xl hover:shadow-accent-cyan/40 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {isSubmitting ? (
            <>
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Sending...
            </>
          ) : (
            <>
              Send Message
              <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-accent-purple to-accent-emerald opacity-0 transition-opacity group-hover:opacity-100" />
      </motion.button>

      <p className="text-center text-sm text-muted-foreground">
        Your message will be logged to the browser console
      </p>
    </motion.form>
  );
}
