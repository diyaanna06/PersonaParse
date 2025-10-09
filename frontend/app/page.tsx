import type { Metadata } from "next"
import { SiteHeader } from "@/components/landing/site-header"
import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { HowItWorks } from "@/components/landing/how-it-works"
import { CtaSection } from "@/components/landing/cta-section"
import { SiteFooter } from "@/components/landing/site-footer"

export const metadata: Metadata = {
  title: "PersonaParse",
  description:
    "Extract role-specific insights from PDFs with offline, AI-assisted semantic matching. Fast, accurate, and structured for action.",
    icons: {
    icon: "/favicon.png", // Path relative to /public
  },
}

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="min-h-screen bg-background">
        <Hero />
        <Features />
        <HowItWorks />
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  )
}
