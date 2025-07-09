"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/ui/date-picker"
import { Switch } from "@/components/ui/switch"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function NewCampaignPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageSrc: "",
    goal: 0,
    startDate: new Date(),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // Default to 30 days from now
    isActive: true,
    isFeatured: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "goal" ? Number.parseFloat(value) || 0 : value,
    }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const handleDateChange = (name: string, date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        [name]: date,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // If featuring this campaign, we need to handle the logic to ensure only one campaign is featured
      const payload = {
        ...formData,
      }

      const response = await fetch("/api/admin/campaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error("Failed to create campaign")
      }

      toast.success("Campaign created successfully")
      router.push("/admin/campaigns")
      router.refresh()
    } catch (error) {
      console.error("Error creating campaign:", error)
      toast.error("Failed to create campaign")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Create New Campaign</h1>
        <Button variant="outline" onClick={() => router.back()} className="w-full md:w-auto">
          Cancel
        </Button>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Campaign Details</CardTitle>
            <CardDescription className="text-sm md:text-base">Enter the details for the new campaign.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 md:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm md:text-base">
                Campaign Title
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter campaign title"
                required
                className="text-sm md:text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm md:text-base">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter campaign description"
                rows={4}
                required
                className="text-sm md:text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageSrc" className="text-sm md:text-base">
                Image URL
              </Label>
              <Input
                id="imageSrc"
                name="imageSrc"
                value={formData.imageSrc}
                onChange={handleChange}
                placeholder="Enter image URL"
                required
                className="text-sm md:text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal" className="text-sm md:text-base">
                Fundraising Goal (₦)
              </Label>
              <Input
                id="goal"
                name="goal"
                type="number"
                value={formData.goal || ""}
                onChange={handleChange}
                placeholder="Enter fundraising goal"
                min={1}
                required
                className="text-sm md:text-base"
              />
            </div>

            <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm md:text-base">Start Date</Label>
                <DatePicker date={formData.startDate} setDate={(date) => handleDateChange("startDate", date)} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm md:text-base">End Date</Label>
                <DatePicker date={formData.endDate} setDate={(date) => handleDateChange("endDate", date)} />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleSwitchChange("isActive", checked)}
              />
              <Label htmlFor="isActive" className="text-sm md:text-base">
                Active Campaign
              </Label>
            </div>

            <div className="flex items-start space-x-2">
              <Switch
                id="isFeatured"
                checked={formData.isFeatured}
                onCheckedChange={(checked) => handleSwitchChange("isFeatured", checked)}
              />
              <div className="space-y-1">
                <Label htmlFor="isFeatured" className="text-sm md:text-base">
                  Feature this Campaign
                </Label>
                {formData.isFeatured && (
                  <p className="text-xs text-amber-600">Note: This will unfeature any currently featured campaign</p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 md:flex-row md:justify-end md:space-x-4 md:space-y-0">
            <Button variant="outline" type="button" onClick={() => router.back()} className="w-full md:w-auto">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Campaign
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
