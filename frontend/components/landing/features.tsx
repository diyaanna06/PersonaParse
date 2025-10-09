"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, FileText, Layers, ListOrdered, Users } from "lucide-react"

export function Features() {
  return (
    <section id="features" className="px-4 py-16 ">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-balance">
            Built for role‑specific analysis
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            Combine persona + task context with semantic matching to surface the most relevant passages across PDFs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="bg-muted border  border-gray-600  hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" aria-hidden="true" />
                <CardTitle className="text-base">Persona-driven extraction</CardTitle>
              </div>
              <CardDescription>
                Tailors analysis by role and task to elevate the passages you actually need.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Uses a persona+task query to bias relevance across the entire corpus.
            </CardContent>
          </Card>

          <Card className="bg-muted border  border-gray-600  hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <ListOrdered className="h-5 w-5 text-primary" aria-hidden="true" />
                <CardTitle className="text-base">Importance ranking</CardTitle>
              </div>
              <CardDescription>
                Scores and orders results via semantic similarity with robust filtering.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              See what matters first; hide low-signal blocks automatically.
            </CardContent>
          </Card>

          <Card className="bg-muted border  border-gray-600  hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" aria-hidden="true" />
                <CardTitle className="text-base">Multi-document processing</CardTitle>
              </div>
              <CardDescription>Analyze many PDFs at once with layout-aware text chunking.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Efficient on standard hardware; scales to large collections.
            </CardContent>
          </Card>

          <Card className="bg-muted border  border-gray-600  hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" aria-hidden="true" />
                <CardTitle className="text-base">Structured output</CardTitle>
              </div>
              <CardDescription>Get document, page, and refined text fields ready for UI display.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              JSON-first results designed for your frontend.
            </CardContent>
          </Card>

          <Card className="bg-muted border  border-gray-600  hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" aria-hidden="true" />
                <CardTitle className="text-base">Offline by default</CardTitle>
              </div>
              <CardDescription>No network dependency for analysis — privacy and reliability built-in.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Works in constrained environments where connectivity is limited.
            </CardContent>
          </Card>

          <Card className="bg-muted border border-gray-600  hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" aria-hidden="true" />
                <CardTitle className="text-base">Subsection insights</CardTitle>
              </div>
              <CardDescription>Fine‑grained analysis highlights the most useful fragments.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Drill into the parts that answer your question fastest.
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
