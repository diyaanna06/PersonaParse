"use client"

import { CardDescription } from "@/components/ui/card"

import type React from "react"
import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Briefcase, Target, Loader2 } from "lucide-react"
import type { Results } from "@/components/persona-parse/types"
import { UploadTabs } from "@/components/persona-parse/upload-tabs"
import { ResultsCard } from "@/components/persona-parse/results-card"
import { SiteFooter } from "@/components/landing/site-footer"
import { SiteHeader } from "@/components/landing/site-header"

export default function PersonaParse() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [jobRole, setJobRole] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [selectedPdfSet, setSelectedPdfSet] = useState("")
  const [uploadMethod, setUploadMethod] = useState("upload")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<Results | null>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setSelectedFiles(files)
  }

  const predefinedSets = [
    {
      id: "Collection1",
      title: "France Travel Documents",
      description: "Collection of documents covering cities, cuisine, history, hotels of France",
      count: 7,
    },
    {
      id: "Collection2",
      title: "Acrobat Forms & PDF Management",
      description:
        "Collection of documents covering creating, editing, exporting, sharing, and managing fillable PDFs and e-signatures",
      count: 15,
    },
    {
      id: "Collection3",
      title: "Vegetarian Menu Planning",
      description:
        "Collection of documents with breakfast, lunch, and dinner ideas, including mains, sides, and gluten-free options for corporate buffets",
      count: 9,
    },
  ]

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
     const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL
      const response = await fetch(`${BACKEND_URL}/upload`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`)
      }
      const processRes = await fetch(`${BACKEND_URL}/process`, {
        method: "POST",
      })

      if (!processRes.ok) {
        throw new Error(`Process failed: ${processRes.status} ${processRes.statusText}`)
      }

      const processJson = await processRes.json()
      const normalized = processJson?.results ?? processJson?.documents ?? processJson?.outputs ?? processJson
      setResults(normalized)
    } catch (err: unknown) {
      console.error("Error uploading/processing:", err)
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Something went wrong")
      }
    } finally {
      setIsLoading(false)
    }
  }, [jobRole, jobDescription, uploadMethod, selectedFiles, selectedPdfSet])

  return (
    <>
    <SiteHeader />
    <div className="min-h-screen bg-white text-foreground">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">PersonaParse</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload multiple PDFs or select from our curated sets to extract the most relevant headings and top
            subsections from your documents, aligned with the specific persona
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="bg-muted border border-gray-600 shadow-lg">
            <CardHeader className="border-b rounded-t-lg  bg-white">
              <CardTitle className="flex items-center gap-2">
                <Briefcase className=" h-6 w-6 text-foreground" />
                Role-Based Insights
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Set your preferences and upload PDFs to extract the most pertinent headings and subsections aligned with
                the selected job.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <Label htmlFor="jobRole" className="text-sm font-medium flex items-center gap-2">
                    <Target className=" h-4 w-4 text-foreground" aria-hidden="true" />
                    Persona
                  </Label>
                  <Input
                    id="jobRole"
                    placeholder="e.g.,Student"
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                    className="border-border bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobDescription" className="text-sm font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-foreground" aria-hidden="true" />
                    Job to be done
                  </Label>
                  <Textarea
                    id="jobDescription"
                    placeholder="What should I study for Organic Chemistry given the chemistry documents"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="border-border bg-white min-h-[100px]"
                  />
                </div>
              </div>

              {/* PDF Upload Options */}
              <UploadTabs
                uploadMethod={uploadMethod}
                setUploadMethod={setUploadMethod}
                handleFileUpload={handleFileUpload}
                selectedFiles={selectedFiles}
                predefinedSets={predefinedSets}
                selectedPdfSet={selectedPdfSet}
                setSelectedPdfSet={setSelectedPdfSet}
              />

              {/* Analysis Button */}
              <div className="mt-8 text-center">
                <Button
                  onClick={handleAnalysis}
                  size="lg"
                  className="px-8 py-3 text-lg font-medium bg-primary"
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

          {/* Results Card */}
          <ResultsCard
            isLoading={isLoading}
            error={error}
            results={results as Results | null}
            jobRole={jobRole}
            jobDescription={jobDescription}
          />
        </div>
      </div>
    </div>
    <SiteFooter />
    </>
  )
}
