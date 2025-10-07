import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Users, ArrowRight, CheckCircle } from "lucide-react"
import Head from "next/head"

export default function Home() {
  return (
    <>
    
      <head>
        <title>PersonaParse</title>
        <link rel="icon" type="image/png" href="/logo.png" />
      </head>
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-playfair)" }}>
                PersonaParse
              </h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="#features" className="text-muted-foreground hover:text-primary transition-colors">
                Features
              </Link>
              <Link href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">
                Pricing
              </Link>
              <Link href="#support" className="text-muted-foreground hover:text-primary transition-colors">
                Support
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2
            className="text-5xl md:text-6xl font-bold text-foreground mb-6"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Professional PDF Processing
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Transform your PDF workflows with our advanced processing tools. Extract, categorize, and analyze content
            with precision and speed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-4">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 bg-transparent">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-foreground mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
              Powerful PDF Processing Features
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the perfect tool for your PDF processing needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Feature 1: Text Extraction & Categorization */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
                  <FileText className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-2xl mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
                  Text Extraction & Categorization
                </CardTitle>
                <CardDescription className="text-base">
                  Extract and automatically categorize text content from PDFs into structured headings and sections
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm">Automatic heading detection (H1, H2, H3)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm">Smart content categorization</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm">Structured data export</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm">Batch processing support</span>
                  </div>
                </div>
                <Link href="/" className="block">
                  <Button className="w-full mt-6 group-hover:bg-primary/90 transition-colors">
                    Start Text Extraction
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

          
            <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-4 bg-secondary/10 rounded-full w-fit">
                  <Users className="h-12 w-12 text-secondary" />
                </div>
                <CardTitle className="text-2xl mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
                 PersonaParse
                </CardTitle>
                <CardDescription className="text-base">
                 AI-powered persona-driven extraction that analyzes multiple PDFs against specific job rols and tasks using smeantic matching to deliver ranked, relevant insights
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                    <span className="text-sm">Semantic similarity matching with AI</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                    <span className="text-sm">Persona-driven content extraction</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                    <span className="text-sm">Relevance ranking & filtering</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                    <span className="text-sm">Structured JSON output with Metadata</span>
                  </div>
                </div>
                <Link href="/PersonaParse" className="block">
                  <Button variant="secondary" className="w-full mt-6 group-hover:bg-secondary/90 transition-colors">
                    Start Job Analysis
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h4 className="text-2xl font-bold text-foreground mb-8" style={{ fontFamily: "var(--font-playfair)" }}>
            Trusted by Professionals Worldwide
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
            <div className="text-4xl font-bold text-muted-foreground">10K+</div>
            <div className="text-4xl font-bold text-muted-foreground">99.9%</div>
            <div className="text-4xl font-bold text-muted-foreground">24/7</div>
            <div className="text-4xl font-bold text-muted-foreground">SOC2</div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm text-muted-foreground mt-2">
            <div>Documents Processed</div>
            <div>Uptime Guarantee</div>
            <div>Support Available</div>
            <div>Compliant</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h5 className="text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
            Ready to Transform Your PDF Workflow?
          </h5>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of professionals who trust PersonParse for their document processing needs.
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
            Get Started Free Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-card border-t border-border">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <FileText className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-playfair)" }}>
                PersonaParse
              </span>
            </div>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © 2025 PersonaParse. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
     </>
  )
}
