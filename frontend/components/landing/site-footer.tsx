"use client"

import Link from "next/link"
import { FileText } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="px-4 py-4 bg-card border-t border-border">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-foreground" aria-hidden="true" />
            <span className="font-semibold">PersonaParse</span>
          </div>
          <p className="mt-3 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} PersonaParse. All rights reserved.
        </p>
          <nav className="flex items-center gap-6 text-sm text-muted-foreground" aria-label="Footer">
            <Link href="#support" className="hover:text-foreground transition-colors">
              Support
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Contact
            </Link>
          </nav>
       
        
         </div>
      </div>
    </footer>
  )
}
