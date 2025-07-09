"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Plus, Edit, Star } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

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
  createdAt: Date
  updatedAt: Date
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch("/api/admin/campaigns")
        const data = await response.json()
        setCampaigns(data)
      } catch (error) {
        console.error("Error fetching campaigns:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCampaigns()
  }, [])

  const activeCampaigns = campaigns.filter((campaign) => campaign.isActive)
  const inactiveCampaigns = campaigns.filter((campaign) => !campaign.isActive)

  if (isLoading) {
    return (
      <div className="container flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Campaigns</h1>
        <Button asChild className="w-full md:w-auto">
          <Link href="/admin/campaigns/new">
            <Plus className="mr-2 h-4 w-4" />
            New Campaign
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="active">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="active" className="text-xs md:text-sm">
            Active ({activeCampaigns.length})
          </TabsTrigger>
          <TabsTrigger value="inactive" className="text-xs md:text-sm">
            Inactive ({inactiveCampaigns.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {activeCampaigns.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-sm md:text-base">No active campaigns found.</p>
                <Button className="mt-4" asChild>
                  <Link href="/admin/campaigns/new">Create Campaign</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {activeCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="inactive">
          {inactiveCampaigns.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-sm md:text-base">No inactive campaigns found.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {inactiveCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function CampaignCard({ campaign }: { campaign: Campaign }) {
  const progress = Math.round((campaign.raised / campaign.goal) * 100)
  const endDate = new Date(campaign.endDate)
  const timeLeft = endDate > new Date() ? formatDistanceToNow(endDate, { addSuffix: true }) : "Ended"

  return (
    <Card className="overflow-hidden">
      <div className="relative h-32 md:h-48 w-full">
        <img
          src={campaign.imageSrc || "/placeholder.svg"}
          alt={campaign.title}
          className="h-full w-full object-cover"
        />
        {campaign.isFeatured && (
          <div className="absolute right-2 top-2">
            <Badge className="bg-amber-500 text-white text-xs">
              <Star className="mr-1 h-3 w-3" /> Featured
            </Badge>
          </div>
        )}
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="line-clamp-2 text-sm md:text-base">{campaign.title}</CardTitle>
        </div>
        <CardDescription className="flex flex-col space-y-1 md:flex-row md:items-center md:justify-between md:space-y-0">
          <span className="text-xs md:text-sm">Goal: ₦{campaign.goal.toLocaleString()}</span>
          <span className="text-xs md:text-sm">Ends {timeLeft}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-xs md:text-sm">
            <span>₦{campaign.raised.toLocaleString()} raised</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        <Button className="w-full text-xs md:text-sm" asChild>
          <Link href={`/admin/campaigns/${campaign.id}`}>
            <Edit className="mr-2 h-3 w-3 md:h-4 md:w-4" />
            Edit Campaign
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
