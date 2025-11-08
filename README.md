# PersonaParse

PersonaParse is a role-based PDF content extraction tool that helps users efficiently extract contextually relevant information from large collections of documents. By understanding a user’s persona and task, it identifies and extracts the most relevant sections and subsections from PDFs, ranks them by importance, and produces structured, role-specific insights. These insights are displayed directly on the frontend, allowing users to quickly view and interpret the most important information.

## What does it do?

- Extracts persona-specific sections from multiple PDFs
- Ranks sections by importance using semantic similarity
- Performs subsection-level analysis for fine-grained insights
- Presents the analyzed and structured results with details such as page number, document name, and refined text to the user
- Fully offline operation with no network dependency

## Key Feature

- Persona-based content analysis: Adapts extraction dynamically based on the user’s role and task.
- Importance ranking: Uses semantic similarity to prioritize the most relevant sections.
- Multi-document processing: Efficiently analyzes multiple PDFs or predefined collections in a single run.
- Structured output visualization: Presents analyzed results including document name, page number, and refined text, directly to the user through a clean, organized interface.
- Offline & CPU-efficient: Fully functional without internet access and optimized to run smoothly on standard hardware.

## How It Works

PersonaParse extracts the most relevant information from PDFs tailored to a specific persona and task. It intelligently analyzes all documents, ranks text blocks by semantic relevance, and presents the most meaningful content in a structured and user-friendly way.

The process consists of the following steps:

1. Input Parsing: Combines the persona and task into a clear semantic query to guide document analysis.

2. PDF Processing: Breaks PDFs into smaller, meaningful text blocks while preserving layout using PyMuPDF.

3. Semantic Matching: Embeds both the query and document blocks using the pre-trained all-MiniLM-L6-v2 transformer to capture contextual meaning.

4. Relevance Scoring: Computes cosine similarity between the query and text blocks, ranking them by importance and filtering out irrelevant content.

5. Output Generation: Aggregates the top-ranked results into a structured JSON including page numbers, document names, and refined text, which is then rendered on the frontend for seamless user interpretation.

## Tech Stack


- **Frontend:** Built with Next.js and React, styled using Tailwind CSS and Shadcn UI components.  
- **Backend:** Powered by Flask for API endpoints and PDF processing with PyMuPDF (fitz).  
- **Model:** Uses the lightweight all-MiniLM-L6-v2 transformer for efficient semantic embeddings.  
- **Other Libraries & Tools:** Includes Transformers for model management and NumPy for numerical computations.


## Getting Started
1. Fork & Clone the Repository:
   
 ```bash
 git clone https://github.com/<your-username>/personaParse.git
 cd personaParse
```
 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev  # Start development server 
npm run build   
npm start    # Start production server
```
3. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python app.py  # Start backend server
```

## Adobe India Hackathon
PersonaParse was developed as part of the Adobe India Women-in-Tech Hackathon 2025.
This repository represents the frontend for Round 1B, focusing on delivering an interactive interface to visualize persona-specific insights extracted from multiple PDFs.
### Related Repositories 
- [Round 1A](https://github.com/pavani0959/Adobe_Round1A)
- [Round 1B](https://github.com/pavani0959/Adobe_Round1B)
