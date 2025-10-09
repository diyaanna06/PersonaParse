"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText} from "lucide-react"
import type { Results, ExtractedSection, SubsectionAnalysis } from "./types"

export function ResultsCard(props: {
  isLoading: boolean
  error: string | null
  results: Results | null
  jobRole: string
  jobDescription: string
}) {
  const { isLoading, error, results, jobRole, jobDescription } = props

  const documents = useMemo<ExtractedSection[]>(() => {
    if (!results) return []
    if (Array.isArray(results.extracted_sections)) return results.extracted_sections
    return []
  }, [results])

  const documents2 = useMemo<SubsectionAnalysis[]>(() => {
    if (!results) return []
    if (Array.isArray(results.subsection_analysis)) return results.subsection_analysis
    return []
  }, [results])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center mt-8">
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center mt-8">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="text-center mt-8">
      </div>
    )
  }

  return (
    <div className="mt-8">
      <Card className="bg-muted border border-gray-600 shadow-lg">
        <CardHeader className="border-b rounded-t-lg  bg-white">
          <CardTitle>Most relevant sections and content</CardTitle>
          <CardDescription className="text-muted-foreground">
            Following are the most relevant section headings and content for the job based on the persona, ordered by
            relevance.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          <div className="mt-2 grid gap-4 md:grid-cols-2">
            <div className="rounded-md border border-gray-600  p-3  bg-white">
              <div className="text-xs text-muted-foreground ">Persona</div>
              <div className="text-sm text-foreground">{jobRole || "—"}</div>
            </div>
            <div className="rounded-md border border-gray-600 p-3  bg-white">
              <div className="text-xs text-muted-foreground">Job To Be Done</div>
              <div className="text-sm text-foreground whitespace-pre-line">{jobDescription || "—"}</div>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-medium text-foreground mb-2">Sections</h4>
            {documents.length === 0 ? (
              <div className="text-muted-foreground">No documents available.</div>
            ) : (
              <div className="grid gap-4">
                {documents.map((section: ExtractedSection, idx: number) => (
                  <Card key={`sec-${idx}`} className=" border border-gray-600 shadow-sm  bg-white">
                    <CardHeader className="flex flex-row items-center justify-between ">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-foreground" />
                        <CardTitle className="text-sm font-medium text-foreground">{section.section_title}</CardTitle>
                      </div>
                      {section.importance_rank && (
                        <span className="text-xs text-muted-foreground">Importance: {section.importance_rank}</span>
                      )}
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      <p>
                        <strong className="text-foreground">Document:</strong> {section.document}
                      </p>
                      <p>
                        <strong className="text-foreground">Page:</strong> {section.page_number}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6">
            <h4 className="font-medium text-foreground mb-2">Subsections</h4>
            {documents2.length === 0 ? (
              <div className="text-muted-foreground">No subsections available.</div>
            ) : (
              <div className="grid gap-4">
                {documents2.map((sub: SubsectionAnalysis, idx: number) => (
                  <Card key={`sub-${idx}`} className=" border border-gray-600 shadow-sm  bg-white">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-foreground" />
                        <CardTitle className="text-sm font-medium text-foreground">
                          <strong>Document:</strong> {sub.document.replace(/\.pdf$/i, "")}
                        </CardTitle>
                      </div>
                      <span className="text-xs text-muted-foreground">Page: {sub.page_number}</span>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      <p>{sub.refined_text.replace(/^[^a-zA-Z0-9]+/, "")}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
