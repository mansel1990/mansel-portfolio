import Sidebar from "@/components/layout/sidebar";
import MobileHeader from "@/components/layout/mobile-header";
import MainContent from "@/components/layout/main-content";
import CompactHero from "@/components/hero/compact-hero";
import ModernSkillsSection from "@/components/skills/modern-skills-section";
import ModernExperience from "@/components/experience/modern-experience";
import ContactForm from "@/components/contact/contact-form";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <MobileHeader />

      {/* Fixed Left Sidebar (Desktop) */}
      <Sidebar />

      {/* Scrollable Right Content */}
      <MainContent>
        {/* Hero/About Section */}
        <CompactHero />

        {/* Skills Section */}
        <section id="skills" className="scroll-mt-20">
          <ModernSkillsSection />
        </section>

        {/* Experience Timeline */}
        <section id="experience" className="scroll-mt-20">
          <ModernExperience />
        </section>

        {/* Contact Section */}
        <section id="contact" className="scroll-mt-20 py-20">
          <div className="text-center mb-12">
            <h2 className="mb-4 text-4xl font-bold tracking-tight text-foreground">
              Let&apos;s Work Together
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Have a project in mind or want to discuss opportunities? I&apos;d love to hear from you.
            </p>
          </div>
          <ContactForm />
        </section>

        {/* Footer */}
        <footer className="border-t border-border/30 py-8 text-center">
          <p className="text-sm text-muted-foreground/60">
            &copy; 2026 Sanjay Mansel. Built with Next.js & TypeScript
          </p>
        </footer>
      </MainContent>
    </div>
  );
}
