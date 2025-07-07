"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, FileText, TrendingUp, BarChart3 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import DashboardChart from "@/components/admin/dashboard-chart"

export default function AdminDashboardPage() {
  const [campaigns, setCampaigns] = useState<{ id: string; title: string }[]>([])
  const [selectedCampaign, setSelectedCampaign] = useState<string>("all")
  const [stats, setStats] = useState<any>(null)
  const [campaignStats, setCampaignStats] = useState<any>(null)
  const [recentDonations, setRecentDonations] = useState<any[]>([])

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch("/api/admin/campaigns") // Create this route if you haven’t
        const data = await res.json()
        setCampaigns(data)
      } catch (error) {
        console.error("Failed to fetch campaigns:", error)
      }
    }

    fetchCampaigns()
  }, [])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch(`/api/admin/dashboard?campaignId=${selectedCampaign}`)
        const data = await res.json()

        if (selectedCampaign === "all") {
          setStats(data.stats)
          setCampaignStats(null)
        } else {
          setStats(null)
          setCampaignStats(data.campaign)
        }

        setRecentDonations(data.donations)
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      }
    }

    fetchDashboardData()
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
            {campaigns.map((campaign) => (
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
              <div className="text-xl md:text-2xl font-bold">
                {campaignStats.isActive ? "Active" : "Inactive"}
              </div>
              <p className="text-xs text-gray-500 truncate">{campaignStats.title}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Goal Amount</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">
                ₦{campaignStats.goal.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500">Target funding</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Amount Raised</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">
                ₦{campaignStats.raised.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500">{campaignStats.progress}% of goal</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Donations</CardTitle>
              <BarChart3 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">
                {campaignStats.donationsCount}
              </div>
              <p className="text-xs text-gray-500">Total donations</p>
            </CardContent>
          </Card>
        </div>
      ) : stats ? (
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
              <div className="text-xl md:text-2xl font-bold">
                ₦{stats.totalAmountRaised.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500">All time funds raised</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Active Campaigns Amount</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">
                ₦{stats.activeCampaignsAmountRaised.toLocaleString()}
              </div>
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
              <p className="text-xs text-gray-500">
                {stats.activeCampaignsDonationsCount} for active campaigns
              </p>
            </CardContent>
          </Card>
        </div>
      ) : null}

      <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Donation Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <DashboardChart
              campaignId={selectedCampaign === "all" ? null : selectedCampaign}
              campaigns={campaigns}
            />
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
                    <p className="text-sm text-gray-500 truncate">
                      {donation.campaign?.title || "General Donation"}
                    </p>
                  </div>
                  <div className="text-left md:text-right flex-shrink-0">
                    <p className="font-medium">₦{donation.amount.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{new Date(donation.createdAt).toLocaleDateString()}</p>
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
