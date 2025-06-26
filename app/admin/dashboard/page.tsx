"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, FileText, TrendingUp, BarChart3 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import DashboardChart from "@/components/admin/dashboard-chart"

// Mock data for preview
const mockCampaigns = [
  {
    id: "camp1",
    title: "Magazine Launch",
    description: "Help us launch our first Islamic magazine to spread knowledge and inspire our community.",
    imageSrc: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000&auto=format&fit=crop",
    goal: 500000,
    raised: 325000,
    startDate: new Date(),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    isActive: true,
    isFeatured: true,
  },
  {
    id: "camp2",
    title: "Ramadan Food Drive",
    description: "Provide iftar meals for students and community members during Ramadan.",
    imageSrc: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?q=80&w=1000&auto=format&fit=crop",
    goal: 300000,
    raised: 120000,
    startDate: new Date(),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45),
    isActive: true,
    isFeatured: false,
  },
  {
    id: "camp3",
    title: "Islamic Library",
    description: "Help us expand our collection of Islamic books and resources for students.",
    imageSrc: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1000&auto=format&fit=crop",
    goal: 300000,
    raised: 75000,
    startDate: new Date(),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60),
    isActive: true,
    isFeatured: false,
  },
  {
    id: "camp4",
    title: "Annual Islamic Conference",
    description: "Support our upcoming annual conference featuring renowned Islamic scholars.",
    imageSrc: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000&auto=format&fit=crop",
    goal: 750000,
    raised: 0,
    startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90),
    isActive: false,
    isFeatured: false,
  },
  {
    id: "camp5",
    title: "Student Scholarship Fund",
    description: "Help provide financial assistance to deserving Muslim students.",
    imageSrc: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1000&auto=format&fit=crop",
    goal: 1000000,
    raised: 0,
    startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 120),
    isActive: false,
    isFeatured: false,
  },
  {
    id: "camp6",
    title: "Mosque Renovation",
    description: "We successfully renovated the campus mosque to accommodate more worshippers.",
    imageSrc: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=1000&auto=format&fit=crop",
    goal: 800000,
    raised: 850000,
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120),
    endDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    isActive: false,
    isFeatured: false,
  },
  {
    id: "camp7",
    title: "Eid Celebration",
    description: "We organized a successful Eid celebration for students and community members.",
    imageSrc: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?q=80&w=1000&auto=format&fit=crop",
    goal: 250000,
    raised: 250000,
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90),
    endDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60),
    isActive: false,
    isFeatured: false,
  },
]

const mockDonations = [
  {
    id: "don1",
    name: "Ibrahim Abdullah",
    email: "ibrahim@example.com",
    amount: 10000,
    campaign: { id: "camp1", title: "Magazine Launch" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    isAnonymous: false,
  },
  {
    id: "don2",
    name: "Aisha Mohammed",
    email: "aisha@example.com",
    amount: 5000,
    campaign: { id: "camp2", title: "Ramadan Food Drive" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    isAnonymous: false,
  },
  {
    id: "don3",
    name: "Anonymous",
    email: "yusuf@example.com",
    amount: 15000,
    campaign: { id: "camp3", title: "Islamic Library" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
    isAnonymous: true,
  },
  {
    id: "don4",
    name: "Fatima Hassan",
    email: "fatima@example.com",
    amount: 2000,
    campaign: { id: "camp1", title: "Magazine Launch" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    isAnonymous: false,
  },
  {
    id: "don5",
    name: "Ahmed Bello",
    email: "ahmed@example.com",
    amount: 7500,
    campaign: { id: "camp3", title: "Islamic Library" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    isAnonymous: false,
  },
  {
    id: "don6",
    name: "Zainab Umar",
    email: "zainab@example.com",
    amount: 20000,
    campaign: { id: "camp6", title: "Mosque Renovation" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60),
    isAnonymous: false,
  },
  {
    id: "don7",
    name: "Musa Ibrahim",
    email: "musa@example.com",
    amount: 15000,
    campaign: { id: "camp7", title: "Eid Celebration" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 70),
    isAnonymous: false,
  },
]

export default function AdminDashboardPage() {
  const [selectedCampaign, setSelectedCampaign] = useState<string>("all")

  // Calculate statistics
  const stats = useMemo(() => {
    const activeCampaigns = mockCampaigns.filter((campaign) => campaign.isActive)
    const totalCampaigns = mockCampaigns.length
    const activeCampaignsCount = activeCampaigns.length

    // Calculate donations stats
    const activeCampaignIds = activeCampaigns.map((campaign) => campaign.id)

    const activeCampaignsDonations = mockDonations.filter((donation) =>
      activeCampaignIds.includes(donation.campaign?.id || ""),
    )

    const activeCampaignsDonationsCount = activeCampaignsDonations.length
    const totalDonationsCount = mockDonations.length

    const activeCampaignsAmountRaised = activeCampaignsDonations.reduce((sum, donation) => sum + donation.amount, 0)

    const totalAmountRaised = mockDonations.reduce((sum, donation) => sum + donation.amount, 0)

    return {
      totalCampaigns,
      activeCampaignsCount,
      activeCampaignsDonationsCount,
      totalDonationsCount,
      activeCampaignsAmountRaised,
      totalAmountRaised,
    }
  }, [])

  // Get campaign-specific stats when a campaign is selected
  const campaignStats = useMemo(() => {
    if (selectedCampaign === "all") {
      return null
    }

    const campaign = mockCampaigns.find((c) => c.id === selectedCampaign)
    if (!campaign) return null

    const campaignDonations = mockDonations.filter((donation) => donation.campaign?.id === selectedCampaign)

    const donationsCount = campaignDonations.length
    const amountRaised = campaignDonations.reduce((sum, donation) => sum + donation.amount, 0)

    return {
      title: campaign.title,
      goal: campaign.goal,
      raised: amountRaised,
      donationsCount,
      progress: Math.round((amountRaised / campaign.goal) * 100),
      isActive: campaign.isActive,
    }
  }, [selectedCampaign])

  // Get recent donations based on selected campaign
  const recentDonations = useMemo(() => {
    if (selectedCampaign === "all") {
      return mockDonations.slice(0, 3)
    }

    return mockDonations.filter((donation) => donation.campaign?.id === selectedCampaign).slice(0, 3)
  }, [selectedCampaign])

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm md:text-base text-gray-600">Welcome, Admin User</p>
      </div>

      <div className="w-full md:w-64">
        <Label htmlFor="campaign-selector" className="mb-2 block text-sm md:text-base">
          Select Campaign for Stats
        </Label>
        <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
          <SelectTrigger id="campaign-selector">
            <SelectValue placeholder="Select campaign" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Campaigns</SelectItem>
            {mockCampaigns.map((campaign) => (
              <SelectItem key={campaign.id} value={campaign.id}>
                {campaign.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {campaignStats ? (
        // Campaign-specific stats
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Campaign Status</CardTitle>
              <FileText className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">{campaignStats.isActive ? "Active" : "Inactive"}</div>
              <p className="text-xs text-gray-500 truncate">{campaignStats.title}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Goal Amount</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">₦{campaignStats.goal.toLocaleString()}</div>
              <p className="text-xs text-gray-500">Target funding</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Amount Raised</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">₦{campaignStats.raised.toLocaleString()}</div>
              <p className="text-xs text-gray-500">{campaignStats.progress}% of goal</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Donations</CardTitle>
              <BarChart3 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">{campaignStats.donationsCount}</div>
              <p className="text-xs text-gray-500">Total donations</p>
            </CardContent>
          </Card>
        </div>
      ) : (
        // Overall stats
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Campaigns</CardTitle>
              <FileText className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">{stats.totalCampaigns}</div>
              <p className="text-xs text-gray-500">{stats.activeCampaignsCount} active campaigns</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Amount</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">₦{stats.totalAmountRaised.toLocaleString()}</div>
              <p className="text-xs text-gray-500">All time funds raised</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Active Campaigns Amount</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">₦{stats.activeCampaignsAmountRaised.toLocaleString()}</div>
              <p className="text-xs text-gray-500">Current campaigns</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Donations</CardTitle>
              <BarChart3 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">{stats.totalDonationsCount}</div>
              <p className="text-xs text-gray-500">{stats.activeCampaignsDonationsCount} for active campaigns</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Donation Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <DashboardChart campaignId={selectedCampaign === "all" ? null : selectedCampaign} />
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Recent Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDonations.map((donation) => (
                <div
                  key={donation.id}
                  className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0 border-b pb-2"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{donation.isAnonymous ? "Anonymous" : donation.name}</p>
                    <p className="text-sm text-gray-500 truncate">{donation.campaign?.title || "General Donation"}</p>
                  </div>
                  <div className="text-left md:text-right flex-shrink-0">
                    <p className="font-medium">₦{donation.amount.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{donation.createdAt.toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
