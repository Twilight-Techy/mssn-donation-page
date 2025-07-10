"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Trash } from "lucide-react"
import { toast } from "sonner"

type Admin = { id: string; name: string; email: string };

export default function AdminUsersPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Load admins on mount
  useEffect(() => {
    async function fetchAdmins() {
      try {
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setAdmins(data.admins);
      } catch (err) {
        toast.error("Something went wrong", {
          description:
            err instanceof Error ? err.message : "Please try again later.",
        })
      }
    }
    fetchAdmins();
  }, []);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!name || !email || !password) {
      toast.error("Missing fields", { description: "Please fill all fields" });
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setAdmins(prev => [data.admin, ...prev]);
      toast("Admin added", { description: `${data.admin.name} was added` });
      setName(""), setEmail(""), setPassword("");
    } catch (err) {
      toast.error("Something went wrong", {
        description:
          err instanceof Error ? err.message : "Please try again later.",
      })
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAdmin = async (id: string) => {
    // prevent deleting last admin
    if (admins.length <= 1) {
      return toast.error("Cannot delete", { description: "At least one admin required" });
    }

    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setAdmins(prev => prev.filter(a => a.id !== id));
      toast("Admin deleted", { description: "Removed successfully" });
    } catch (err) {
      toast.error("Something went wrong", {
        description:
          err instanceof Error ? err.message : "Please try again later.",
      })
    }
  };

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
