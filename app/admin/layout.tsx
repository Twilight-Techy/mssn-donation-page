"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import AdminSidebar from "@/components/admin/sidebar"
import { ChurchIcon as Mosque } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Don't show sidebar on login page
  const isLoginPage = pathname === "/admin/login"

  if (isLoginPage) {
    return <div className="min-h-screen">{children}</div>
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Desktop Sidebar */}
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-b flex-shrink-0">
          <AdminSidebar isMobile={true} />
          <div className="flex items-center gap-2">
            <Mosque className="h-5 w-5 text-green-600" />
            <span className="font-arabic text-lg font-bold text-green-700">Admin Panel</span>
          </div>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>

        {/* Main content - allows vertical scrolling within its container */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">{children}</div>
      </div>
    </div>
  )
}
