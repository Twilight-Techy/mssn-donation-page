"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { PlusCircle, Trash } from "lucide-react"

// Mock data for preview
const initialAdmins = [
  {
    id: "admin-1",
    name: "Admin User",
    email: "admin@mssnlasu.org",
    role: "admin",
  },
]

export default function AdminUsersPage() {
  const [admins, setAdmins] = useState(initialAdmins)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validate inputs
    if (!name || !email || !password) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // Check if email already exists
    if (admins.some((admin) => admin.email === email)) {
      toast({
        title: "Email already exists",
        description: "An admin with this email already exists",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // For preview, just add to the state
    const newAdmin = {
      id: `admin-${Date.now()}`,
      name,
      email,
      role: "admin",
    }

    setAdmins([...admins, newAdmin])

    toast({
      title: "Admin added",
      description: `${name} has been added as an admin`,
    })

    // Reset form
    setName("")
    setEmail("")
    setPassword("")
    setIsLoading(false)
  }

  const handleDeleteAdmin = (id: string) => {
    // Don't allow deleting the last admin
    if (admins.length <= 1) {
      toast({
        title: "Cannot delete",
        description: "You must have at least one admin",
        variant: "destructive",
      })
      return
    }

    setAdmins(admins.filter((admin) => admin.id !== id))

    toast({
      title: "Admin deleted",
      description: "The admin has been removed",
    })
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Users</h1>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="order-2 lg:order-1">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Current Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {admins.map((admin) => (
                <div
                  key={admin.id}
                  className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0 rounded-md border p-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{admin.name}</p>
                    <p className="text-sm text-gray-500 truncate">{admin.email}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteAdmin(admin.id)}
                    className="text-red-500 hover:bg-red-50 hover:text-red-600 w-full md:w-auto"
                  >
                    <Trash className="mr-1 h-3 w-3" />
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="order-1 lg:order-2">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Add New Admin</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm md:text-base">
                  Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  required
                  className="text-sm md:text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm md:text-base">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  required
                  className="text-sm md:text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm md:text-base">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="text-sm md:text-base"
                />
              </div>

              <Button type="submit" className="w-full text-sm md:text-base" disabled={isLoading}>
                <PlusCircle className="mr-2 h-4 w-4" />
                {isLoading ? "Adding..." : "Add Admin"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
