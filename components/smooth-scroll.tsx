"use client"

import { useEffect } from "react"

export default function SmoothScroll() {
  useEffect(() => {
    // Function to handle smooth scrolling for hash links
    const handleHashLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest("a")

      if (!link) return

      const href = link.getAttribute("href")

      if (!href || !href.startsWith("#")) return

      const targetId = href.substring(1)
      const targetElement = document.getElementById(targetId)

      if (!targetElement) return

      e.preventDefault()

      window.scrollTo({
        top: targetElement.offsetTop - 80, // Adjust for header height
        behavior: "smooth",
      })
    }

    // Add event listener to the document
    document.addEventListener("click", handleHashLinkClick)

    // Clean up
    return () => {
      document.removeEventListener("click", handleHashLinkClick)
    }
  }, [])

  return null
}
