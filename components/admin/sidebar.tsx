"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LayoutDashboard, FileText, DollarSign, LogOut, ChurchIcon as Mosque, UserPlus, Menu } from "lucide-react"
import { useState } from "react"

interface AdminSidebarProps {
  isMobile?: boolean
}

export default function AdminSidebar({ isMobile = false }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const isActive = (path: string) => {
    return pathname === path
  }

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Campaigns",
      href: "/admin/campaigns",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: "Donations",
      href: "/admin/donations",
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      name: "Admin Users",
      href: "/admin/users",
      icon: <UserPlus className="h-5 w-5" />,
    },
  ]

  const handleSignOut = () => {
    localStorage.removeItem("adminAuthenticated")
    router.push("/admin/login")
  }

  const handleNavClick = () => {
    setIsOpen(false)
  }

  // Mobile Sidebar Component
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="flex-shrink-0" onClick={() => setIsOpen(true)}>
            <Menu className="h-4 w-4" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-full flex-col bg-white">
            <div className="flex items-center gap-2 p-6 border-b">
              <Mosque className="h-6 w-6 text-green-600" />
              <span className="font-arabic text-xl font-bold text-green-700">Admin Panel</span>
            </div>

            <nav className="flex-1 space-y-1 px-2 py-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={handleNavClick}
                  className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive(item.href) ? "bg-green-100 text-green-700" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="p-4 border-t">
              <Button variant="outline" className="w-full justify-start" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  // Desktop Sidebar Component
  return (
    <div className="hidden md:flex h-full w-64 flex-col bg-white shadow-md flex-shrink-0">
      <div className="flex items-center gap-2 p-6 border-b">
        <Mosque className="h-6 w-6 text-green-600" />
        <span className="font-arabic text-xl font-bold text-green-700">Admin Panel</span>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-4">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              isActive(item.href) ? "bg-green-100 text-green-700" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t">
        <Button variant="outline" className="w-full justify-start" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
