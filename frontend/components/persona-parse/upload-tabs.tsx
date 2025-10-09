"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, FileText, CheckCircle } from "lucide-react"

type PredefinedSet = {
  id: string
  title: string
  description: string
  count: number
}

export function UploadTabs(props: {
  uploadMethod: string
  setUploadMethod: (v: string) => void
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  selectedFiles: File[]
  predefinedSets: PredefinedSet[]
  selectedPdfSet: string
  setSelectedPdfSet: (id: string) => void
}) {
  const {
    uploadMethod,
    setUploadMethod,
    handleFileUpload,
    selectedFiles,
    predefinedSets,
    selectedPdfSet,
    setSelectedPdfSet,
  } = props

  return (
    <Tabs value={uploadMethod} onValueChange={setUploadMethod} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="upload">Upload PDFs</TabsTrigger>
        <TabsTrigger value="predefined">Use Predefined Sets</TabsTrigger>
      </TabsList>

      <TabsContent value="upload" className="mt-6">
        <Card className=" border border-gray-600 border-dashed transition-colors">
          <CardContent className="p-8">
            <div className="text-center">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <Label htmlFor="fileUpload" className="cursor-pointer block mx-auto">
                <span className="text-lg font-medium text-foreground ">Click to upload PDFs </span>
              
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
                <h4 className="font-medium text-foreground mb-3">Selected Files:</h4>
                <div className="space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded border border-gray-600">
                      <FileText className="h-4 w-4 text-foreground" />
                      <span className="text-sm text-foreground">{file.name}</span>
                      <span className="text-xs text-muted-foreground">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
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
              className={`cursor-pointer border border-gray-600 transition-all hover:shadow-md ${
                selectedPdfSet === set.id ? "ring-2 ring-foreground" : "hover:border-gray-700"
              }`}
              onClick={() => setSelectedPdfSet(set.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-foreground/10 rounded-lg">
                      <FileText className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{set.title}</h4>
                      <p className="text-sm text-muted-foreground">{set.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{set.count} documents</p>
                    </div>
                  </div>
                  {selectedPdfSet === set.id && <CheckCircle className="h-5 w-5 text-foreground" />}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  )
}
