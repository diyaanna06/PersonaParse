"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, FileText, Briefcase, Target, CheckCircle } from "lucide-react"

export default function PersonaParse() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [jobRole, setJobRole] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [selectedPdfSet, setSelectedPdfSet] = useState("")
  const [uploadMethod, setUploadMethod] = useState("upload")

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
  description: "Collection of documents covering creating, editing, exporting, sharing, and managing fillable PDFs and e-signatures",
  count: 15,
    },
    {
  id: "menu_planning",
  title: "Vegetarian Menu Planning",
  description: "Collection of documents with breakfast, lunch, and dinner ideas, including mains, sides, and gluten-free options for corporate buffets",
  count: 9,
},

  ]
const handleAnalysis = async () => {
  try {
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

    const uploadResult = await response.json()

    const processRes = await fetch("http://127.0.0.1:5000/process", {
      method: "POST",
    })
  } catch (error) {
    console.error("Error uploading:", error)
  }
}


  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">PersonaParse</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
           Upload multiple PDFs or select from our curated sets to extract the most relevant headings and top subsections from your documents, 
           aligned with the specific job role
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
               Set your preferences and upload PDFs to extract the most pertinent headings and subsections aligned with the selected job.
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
                    !jobRole ||
                    !jobDescription ||
                    (uploadMethod === "upload" && selectedFiles.length === 0) ||
                    (uploadMethod === "predefined" && !selectedPdfSet)
                  }
                >
                  <Target className="h-5 w-5 mr-2" />
                  Start PersonaParse
                </Button>
    
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
