"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import DeleteCampaignButton from "@/components/admin/delete-campaign-button"

interface Campaign {
  id: string
  title: string
  description: string
  imageSrc: string
  goal: number
  raised: number
  startDate: Date
  endDate: Date
  isActive: boolean
  isFeatured: boolean
}

export default function EditCampaignPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = params
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [campaign, setCampaign] = useState<Campaign | null>(null)

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await fetch(`/api/campaigns/${id}`)
        if (!response.ok) throw new Error("Failed to fetch campaign")
        const foundCampaign = await response.json()

        if (foundCampaign) {
          // Convert date strings to Date objects
          foundCampaign.startDate = new Date(foundCampaign.startDate)
          foundCampaign.endDate = new Date(foundCampaign.endDate)
          setCampaign(foundCampaign)
        } else {
          toast.error("Campaign not found")
          router.push("/admin/campaigns")
        }
      } catch (error) {
        console.error("Error fetching campaign:", error)
        toast.error("Failed to load campaign")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCampaign()
  }, [id, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!campaign) return

    const { name, value } = e.target
    setCampaign({
      ...campaign,
      [name]: name === "goal" || name === "raised" ? Number.parseFloat(value) || 0 : value,
    })
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    if (!campaign) return

    setCampaign({
      ...campaign,
      [name]: checked,
    })
  }

  const handleDateChange = (name: string, date: Date | undefined) => {
    if (!campaign || !date) return

    setCampaign({
      ...campaign,
      [name]: date,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!campaign) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/campaigns/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(campaign),
      })

      if (!response.ok) {
        throw new Error("Failed to update campaign")
      }

      toast.success("Campaign updated successfully")
      router.push("/admin/campaigns")
      router.refresh()
    } catch (error) {
      console.error("Error updating campaign:", error)
      toast.error("Failed to update campaign")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="container py-6">
        <Card>
          <CardContent className="py-10 text-center">
            <p>Campaign not found</p>
            <Button className="mt-4" onClick={() => router.push("/admin/campaigns")}>
              Back to Campaigns
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Campaign</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <DeleteCampaignButton id={id} onSuccess={() => router.push("/admin/campaigns")} />
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
            <CardDescription>Edit the details for this campaign.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Campaign Title</Label>
              <Input
                id="title"
                name="title"
                value={campaign.title}
                onChange={handleChange}
                placeholder="Enter campaign title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={campaign.description}
                onChange={handleChange}
                placeholder="Enter campaign description"
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageSrc">Image URL</Label>
              <Input
                id="imageSrc"
                name="imageSrc"
                value={campaign.imageSrc}
                onChange={handleChange}
                placeholder="Enter image URL"
                required
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="goal">Fundraising Goal (₦)</Label>
                <Input
                  id="goal"
                  name="goal"
                  type="number"
                  value={campaign.goal || ""}
                  onChange={handleChange}
                  placeholder="Enter fundraising goal"
                  min={1}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Amount Raised</Label>
                <p className="text-lg font-medium text-green-700">₦{campaign.raised.toLocaleString()}</p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <DatePicker date={campaign.startDate} setDate={(date) => handleDateChange("startDate", date)} />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <DatePicker date={campaign.endDate} setDate={(date) => handleDateChange("endDate", date)} />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={campaign.isActive}
                onCheckedChange={(checked) => handleSwitchChange("isActive", checked)}
              />
              <Label htmlFor="isActive">Active Campaign</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isFeatured"
                checked={campaign.isFeatured}
                onCheckedChange={(checked) => handleSwitchChange("isFeatured", checked)}
              />
              <Label htmlFor="isFeatured">Feature this Campaign</Label>
              {!campaign.isFeatured && (
                <span className="text-xs text-amber-600">
                  Note: This will unfeature any currently featured campaign
                </span>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-4">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
