"use client"

import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CtaSection() {
  return (
    <section className="px-4 py-16 bg-foreground text-background">
      <div className="container mx-auto text-center max-w-3xl">
        <h4 className="text-3xl md:text-4xl font-semibold text-balance">Ready to analyze PDFs by persona?</h4>
        <p className="mt-3 text-lg opacity-90">
          Upload documents, choose a persona, and get structured, role‑specific insights in minutes
        </p>

        <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/PersonaParse" aria-label="Start persona-based analysis">
            <Button size="lg" className="px-6 bg-background text-foreground hover:bg-background/90">
              Start analysis
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
            </Button>
          </Link>
          
        </div>
      </div>
    </section>
  )
}
