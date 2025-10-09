"use client"

import Link from "next/link"
import { ArrowRight, ShieldCheck, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function Hero() {
  return (
    <section className="px-4 py-16 md:py-24">
      <div className="container mx-auto text-center max-w-3xl">
      

        <h1 className="text-balance text-4xl md:text-6xl font-semibold tracking-tight">
          PersonaParse
        </h1>
        <p className="text-pretty text-lg md:text-xl text-muted-foreground mt-4">
          Extract role-specific insights from large document sets using semantic matching. Rank what matters, filter the
          noise, and view structured results instantly.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/PersonaParse" aria-label="Start persona-based analysis">
            <Button size="lg" className="px-6 bg-foreground text-background hover:bg-foreground/90">
              Get started
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline" className="px-6 bg-transparent">
              See features
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
