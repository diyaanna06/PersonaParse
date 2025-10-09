export interface ExtractedSection {
  section_title: string
  document: string
  page_number: number
  importance_rank?: number
}

export interface SubsectionAnalysis {
  document: string
  refined_text: string
  page_number: number
}

export interface Results {
  extracted_sections?: ExtractedSection[]
  subsection_analysis?: SubsectionAnalysis[]
}
