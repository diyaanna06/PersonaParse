"use client"

import Link from "next/link"
import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2" aria-label="PersonaParse home">
            <FileText className="h-7 w-7 text-foreground" aria-hidden="true" />
            <span className="text-xl font-semibold tracking-tight">PersonaParse</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground" aria-label="Primary">
            <Link href="#features" className="hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="hover:text-foreground transition-colors">
              How it works
            </Link>
          
          </nav>

          <div className="hidden md:block">
            <Link href="/PersonaParse">
              <Button size="sm" className="bg-foreground text-background hover:bg-foreground/90">
                Start analysis
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
