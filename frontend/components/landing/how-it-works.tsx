"use client"

import { Card } from "@/components/ui/card"
import { Brain, FileText, ListChecks, Network, Search } from "lucide-react"

const steps = [
  {
    icon: Brain,
    title: "Input parsing",
    desc: "Combine persona + task into a semantic query guiding analysis.",
  },
  {
    icon: FileText,
    title: "PDF processing",
    desc: "Layout-aware chunking produces meaningful text blocks.",
  },
  {
    icon: Network,
    title: "Context matching",
    desc: "Embed query and blocks to capture contextual meaning.",
  },
  {
    icon: Search,
    title: "Relevance scoring",
    desc: "Rank by similarity and filter low-signal content.",
  },
  {
    icon: ListChecks,
    title: "Structured output",
    desc: "Return document, page, and refined text ready for UI.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-4 py-16 ">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">How it works</h2>
          <p className="text-muted-foreground mt-3">A fast, offline pipeline from persona to structured insights.</p>
        </div>

         <div className="grid md:grid-cols-5 gap-4">
            {steps.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex">
                <Card className="flex-1 p-4 bg-muted border border-gray-400  hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                    <span className="font-medium">{title}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </Card>
              </div>
            ))}
          </div>

      </div>
    </section>
  )
}
