"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    // For preview, we'll just redirect to login
    // In a real app, we would check if the user is authenticated
    const isAuthenticated = localStorage.getItem("adminAuthenticated") === "true"

    if (isAuthenticated) {
      router.push("/admin/dashboard")
    } else {
      router.push("/admin/login")
    }
  }, [router])

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <p>Redirecting...</p>
      </div>
    </div>
  )
}
