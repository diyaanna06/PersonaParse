"use client"

import type React from "react"
import { useState, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Upload, FileText, Briefcase, Target, CheckCircle, Loader2, Search, Download } from "lucide-react"

export default function PersonaParse() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [jobRole, setJobRole] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [selectedPdfSet, setSelectedPdfSet] = useState("")
  const [uploadMethod, setUploadMethod] = useState("upload")

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<any>(null)
  const [filter, setFilter] = useState("")

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setSelectedFiles(files)
  }

  const predefinedSets = [
    {
      id: "travel planner",
      title: "France Travel Documents",
      description: "Collection of documents covering cities,cuisinne,history,hotels of France",
      count: 7,
    },
    {
      id: "create_manageable_forms",
      title: "Acrobat Forms & PDF Management",
      description:
        "Collection of documents covering creating, editing, exporting, sharing, and managing fillable PDFs and e-signatures",
      count: 15,
    },
    {
      id: "menu_planning",
      title: "Vegetarian Menu Planning",
      description:
        "Collection of documents with breakfast, lunch, and dinner ideas, including mains, sides, and gluten-free options for corporate buffets",
      count: 9,
    },
  ]

  const documents = useMemo(() => {
    if (!results) return []
    if (Array.isArray(results)) return results
    if (Array.isArray(results?.documents)) return results.documents
    if (Array.isArray(results?.results)) return results.results
    if (Array.isArray(results?.outputs)) return results.outputs
    return [results]
  }, [results])

  const computeCounts = useMemo(() => {
    const docCount = documents.length
    let sectionCount = 0
    let highlightCount = 0

    documents.forEach((doc: any) => {
      const sections = Array.isArray(doc?.sections) ? doc.sections : []
      sectionCount += sections.length
      sections.forEach((s: any) => {
        const highlights = Array.isArray(s?.highlights) ? s.highlights : Array.isArray(s?.snippets) ? s.snippets : []
        highlightCount += highlights.length
      })
    })

    return { docCount, sectionCount, highlightCount }
  }, [documents])

  const filteredDocuments = useMemo(() => {
    const q = filter.trim().toLowerCase()
    if (!q) return documents

    const match = (v?: string) => (v || "").toLowerCase().includes(q)

    return documents.filter((doc: any) => {
      const title = doc?.title || doc?.name || doc?.filename
      const sections = Array.isArray(doc?.sections) ? doc.sections : []
      const docMatch = match(title)
      const sectionMatch = sections.some((s: any) => {
        const heading = s?.heading || s?.title
        const highlights = Array.isArray(s?.highlights) ? s.highlights : Array.isArray(s?.snippets) ? s.snippets : []
        return match(heading) || highlights.some((h: any) => match(typeof h === "string" ? h : h?.text))
      })
      return docMatch || sectionMatch
    })
  }, [documents, filter])

  const handleAnalysis = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      setResults(null)

      const formData = new FormData()
      formData.append("jobRole", jobRole)
      formData.append("jobDescription", jobDescription)

      if (uploadMethod === "upload") {
        selectedFiles.forEach((file) => {
          formData.append("files", file)
        })
      } else if (uploadMethod === "predefined") {
        formData.append("selectedSet", selectedPdfSet)
      }

      // Step 1: Upload PDFs + metadata
      const response = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`)
      }

      // Step 2: Process and get output
      const processRes = await fetch("http://127.0.0.1:5000/process", {
        method: "POST",
      })

      if (!processRes.ok) {
        throw new Error(`Process failed: ${processRes.status} ${processRes.statusText}`)
      }

      const processJson = await processRes.json()
      const normalized = processJson?.results ?? processJson?.documents ?? processJson?.outputs ?? processJson
      setResults(normalized)
    } catch (err: any) {
      console.error("Error uploading/processing:", err)
      setError(err?.message ?? "Something went wrong while processing your request.")
    } finally {
      setIsLoading(false)
    }
  }, [jobRole, jobDescription, uploadMethod, selectedFiles, selectedPdfSet])

  const handleDownloadJson = useCallback(() => {
    if (!results) return
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "persona-parse-results.json"
    a.click()
    URL.revokeObjectURL(url)
  }, [results])

  const ResultsCard = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center mt-8">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <p className="ml-2 text-gray-600">Processing...</p>
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
          <p className="text-gray-600">No results yet. Start PersonaParse to see extracted content here.</p>
        </div>
      )
    }

    return (
      <div className="mt-8">
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-white rounded-t-lg">
            <CardTitle className="flex items-center justify-between">
              <span>Extracted Output</span>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Input
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    placeholder="Filter by heading or text..."
                    className="pl-9 w-64"
                    aria-label="Filter output"
                  />
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadJson}
                  disabled={!results}
                  aria-label="Download JSON"
                >
                  <Download className="h-4 w-4 mr-2" />
                  JSON
                </Button>
              </div>
            </CardTitle>
            <CardDescription>
              Review extracted sections and important texts aligned to your role and job-to-be-done.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="by-doc">By Document</TabsTrigger>
                <TabsTrigger value="raw">Raw JSON</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border bg-emerald-50 p-4">
                    <div className="text-sm text-gray-600">Documents</div>
                    <div className="text-2xl font-semibold text-gray-900">{computeCounts.docCount}</div>
                  </div>
                  <div className="rounded-lg border bg-teal-50 p-4">
                    <div className="text-sm text-gray-600">Sections</div>
                    <div className="text-2xl font-semibold text-gray-900">{computeCounts.sectionCount}</div>
                  </div>
                  <div className="rounded-lg border bg-white p-4">
                    <div className="text-sm text-gray-600">Highlights</div>
                    <div className="text-2xl font-semibold text-gray-900">{computeCounts.highlightCount}</div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-medium text-gray-900">Context</h4>
                  <div className="mt-2 grid gap-4 md:grid-cols-2">
                    <div className="rounded-md border bg-white p-3">
                      <div className="text-xs text-gray-500">Job Role</div>
                      <div className="text-sm text-gray-800">{jobRole || "—"}</div>
                    </div>
                    <div className="rounded-md border bg-white p-3">
                      <div className="text-xs text-gray-500">Job To Be Done</div>
                      <div className="text-sm text-gray-800 whitespace-pre-line">{jobDescription || "—"}</div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="by-doc" className="mt-6">
                {filteredDocuments.length === 0 ? (
                  <div className="text-gray-600">No documents match your filter.</div>
                ) : (
                  <Accordion type="single" collapsible className="w-full">
                    {filteredDocuments.map((doc: any, idx: number) => {
                      const title = doc?.title || doc?.name || doc?.filename || `Document ${idx + 1}`
                      const sections = Array.isArray(doc?.sections) ? doc.sections : []
                      return (
                        <AccordionItem value={`doc-${idx}`} key={`doc-${idx}`} className="border-b">
                          <AccordionTrigger className="text-left">
                            <div className="flex w-full items-center justify-between pr-4">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-primary" />
                                <span className="font-medium text-gray-900">{title}</span>
                              </div>
                              <span className="text-xs text-gray-500">{sections.length} sections</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            {sections.length === 0 ? (
                              <div className="rounded-md border bg-gray-50 p-3 text-sm text-gray-600">
                                No sections extracted.
                              </div>
                            ) : (
                              <div className="space-y-4">
                                {sections
                                  .slice()
                                  .sort((a: any, b: any) => (b?.importance ?? 0) - (a?.importance ?? 0))
                                  .map((section: any, sIdx: number) => {
                                    const heading = section?.heading || section?.title || `Section ${sIdx + 1}`
                                    const importance = section?.importance
                                    const highlights = Array.isArray(section?.highlights)
                                      ? section.highlights
                                      : Array.isArray(section?.snippets)
                                        ? section.snippets
                                        : []
                                    return (
                                      <div key={`sec-${idx}-${sIdx}`} className="rounded-lg border bg-white p-4">
                                        <div className="flex items-start justify-between gap-4">
                                          <div>
                                            <h5 className="text-gray-900 font-medium">{heading}</h5>
                                            {typeof section?.page === "number" && (
                                              <div className="text-xs text-gray-500 mt-0.5">Page {section.page}</div>
                                            )}
                                          </div>
                                          {importance !== undefined && (
                                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">
                                              Importance: {importance}
                                            </span>
                                          )}
                                        </div>

                                        {highlights.length > 0 && (
                                          <div className="mt-3 space-y-2">
                                            {highlights.map((h: any, hIdx: number) => {
                                              const text = typeof h === "string" ? h : (h?.text ?? "")
                                              return (
                                                <div
                                                  key={`hl-${idx}-${sIdx}-${hIdx}`}
                                                  className="rounded-md border bg-gray-50 p-2 text-sm text-gray-800"
                                                >
                                                  {text}
                                                </div>
                                              )
                                            })}
                                          </div>
                                        )}
                                      </div>
                                    )
                                  })}
                              </div>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      )
                    })}
                  </Accordion>
                )}
              </TabsContent>

              <TabsContent value="raw" className="mt-6">
                <div className="rounded-md border bg-gray-50 p-4">
                  <pre className="max-h-96 overflow-auto text-xs leading-5 text-gray-800">
                    {JSON.stringify(results, null, 2)}
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">PersonaParse</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload multiple PDFs or select from our curated sets to extract the most relevant headings and top
            subsections from your documents, aligned with the specific job role
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-6 w-6" />
                Role-Based Insights
              </CardTitle>
              <CardDescription className="text-primary-foreground/80">
                Set your preferences and upload PDFs to extract the most pertinent headings and subsections aligned with
                the selected job.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {/* Job Role and Description */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <Label htmlFor="jobRole" className="text-sm font-medium flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    Job Role
                  </Label>
                  <Input
                    id="jobRole"
                    placeholder="e.g.,Student"
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                    className="border-gray-300 focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobDescription" className="text-sm font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Job Description
                  </Label>
                  <Textarea
                    id="jobDescription"
                    placeholder="What should I study for Organic Chemistry given the chemistry documents"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="border-gray-300 focus:border-primary min-h-[100px]"
                  />
                </div>
              </div>

              {/* PDF Upload Options */}
              <Tabs value={uploadMethod} onValueChange={setUploadMethod} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upload">Upload PDFs</TabsTrigger>
                  <TabsTrigger value="predefined">Use Predefined Sets</TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="mt-6">
                  <Card className="border-dashed border-2 border-gray-300 hover:border-primary transition-colors">
                    <CardContent className="p-8">
                      <div className="text-center">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <Label htmlFor="fileUpload" className="cursor-pointer">
                          <span className="text-lg font-medium text-gray-700">
                            Click to upload PDFs or drag and drop
                          </span>
                          <p className="text-sm text-gray-500 mt-2">Support for multiple PDF files (Max 50MB each)</p>
                        </Label>
                        <Input
                          id="fileUpload"
                          type="file"
                          multiple
                          accept=".pdf"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </div>

                      {selectedFiles.length > 0 && (
                        <div className="mt-6">
                          <h4 className="font-medium text-gray-700 mb-3">Selected Files:</h4>
                          <div className="space-y-2">
                            {selectedFiles.map((file, index) => (
                              <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                <FileText className="h-4 w-4 text-primary" />
                                <span className="text-sm text-gray-700">{file.name}</span>
                                <span className="text-xs text-gray-500">
                                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="predefined" className="mt-6">
                  <div className="grid gap-4">
                    {predefinedSets.map((set) => (
                      <Card
                        key={set.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedPdfSet === set.id ? "ring-2 ring-primary bg-primary/5" : "hover:border-primary/50"
                        }`}
                        onClick={() => setSelectedPdfSet(set.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-primary/10 rounded-lg">
                                <FileText className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">{set.title}</h4>
                                <p className="text-sm text-gray-600">{set.description}</p>
                                <p className="text-xs text-gray-500 mt-1">{set.count} documents</p>
                              </div>
                            </div>
                            {selectedPdfSet === set.id && <CheckCircle className="h-5 w-5 text-primary" />}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              {/* Analysis Button */}
              <div className="mt-8 text-center">
                <Button
                  onClick={handleAnalysis}
                  size="lg"
                  className="px-8 py-3 text-lg font-medium"
                  disabled={
                    isLoading ||
                    !jobRole ||
                    !jobDescription ||
                    (uploadMethod === "upload" && selectedFiles.length === 0) ||
                    (uploadMethod === "predefined" && !selectedPdfSet)
                  }
                >
                  {isLoading ? (
                    <span className="inline-flex items-center">
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    <>
                      <Target className="h-5 w-5 mr-2" />
                      Start PersonaParse
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <ResultsCard />
        </div>
      </div>
    </div>
  )
}
