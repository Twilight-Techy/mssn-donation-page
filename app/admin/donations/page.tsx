"use client"

import { useEffect, useMemo, useState } from "react"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { toast } from "sonner"

const ITEMS_PER_PAGE = 10

export default function DonationsPage() {
  const [campaigns, setCampaigns] = useState<{ id: string; title: string }[]>([])
  const [donations, setDonations] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
  const fetchCampaigns = async () => {
    try {
      const res = await fetch("/api/admin/campaigns")
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to load campaigns")
      setCampaigns(data|| [])
    } catch (error) {
      toast.error("Failed to fetch campaigns")
      console.error(error)
    }
  }

  fetchCampaigns()
}, [])

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true)
        setCurrentPage(1)
        window.scrollTo({ top: 0, behavior: "smooth" })

        const query = selectedCampaign !== "all" ? `?campaignId=${selectedCampaign}` : ""
        const res = await fetch(`/api/admin/donations${query}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Failed to load donations")
        setDonations(data.donations || [])
      } catch (error) {
        toast.error("Failed to fetch donations")
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchDonations()
  }, [selectedCampaign])

  const summary = useMemo(() => {
  const successfulDonations = donations.filter((d) => d.status === "completed")
  const count = successfulDonations.length
  const totalAmount = successfulDonations.reduce((sum, d) => sum + d.amount, 0)

  const title = selectedCampaign === "all"
    ? "All Campaigns"
    : campaigns.find((c) => c.id === selectedCampaign)?.title || "Selected Campaign"

  return { count, totalAmount, title }
}, [donations, selectedCampaign, campaigns])

  const totalPages = Math.ceil(donations.length / ITEMS_PER_PAGE)
  const currentDonations = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return donations.slice(start, start + ITEMS_PER_PAGE)
  }, [donations, currentPage])

  const handlePageChange = (page: number) => setCurrentPage(page)
  const handlePrevious = () => setCurrentPage((p) => Math.max(1, p - 1))
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1))

  if (loading) {
    return (
      <div className="container flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Donations</h1>
      </div>

      <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
        <div className="w-full md:w-64">
          <Label htmlFor="filter-campaign" className="mb-2 block text-sm md:text-base">
            Filter by Campaign
          </Label>
          <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
            <SelectTrigger id="filter-campaign">
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
      </div>

      {/* Summary Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg bg-green-50 p-4">
              <h3 className="text-sm font-medium text-green-800">Campaign</h3>
              <p className="mt-1 text-xl font-semibold text-green-900 truncate">{summary.title}</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-4">
              <h3 className="text-sm font-medium text-blue-800">Successful Donations</h3>
              <p className="mt-1 text-xl font-semibold text-blue-900">{summary.count}</p>
            </div>
            <div className="rounded-lg bg-amber-50 p-4">
              <h3 className="text-sm font-medium text-amber-800">Total Amount</h3>
              <p className="mt-1 text-xl font-semibold text-amber-900">
                ₦{summary.totalAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <div className="rounded-md border bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-3 text-sm font-medium text-gray-500">Reference</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">Donor</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">Campaign</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">Amount</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">Payment</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {currentDonations.map((donation) => (
                <tr key={donation.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 font-medium text-sm">{donation.reference}</td>
                  <td className="px-4 py-4 text-sm">
                    {donation.isAnonymous ? "Anonymous" : donation.name}
                  </td>
                  <td className="px-4 py-4 text-sm truncate max-w-[150px]">
                    {donation.campaign?.title || "General Donation"}
                  </td>
                  <td className="px-4 py-4 font-medium text-sm">
                    ₦{donation.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-sm capitalize">{donation.paymentMethod}</td>
                  <td className="px-4 py-4 text-sm">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      donation.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : donation.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}>
                      {donation.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    {format(new Date(donation.createdAt), "MMM d, yyyy")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="text-sm text-gray-700">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, donations.length)} of {donations.length} donations
          </div>
          <div className="flex items-center space-x-2">
            <Button size="sm" onClick={handlePrevious} disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                size="sm"
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => handlePageChange(page)}
                className="w-8 h-8 p-0"
              >
                {page}
              </Button>
            ))}
            <Button size="sm" onClick={handleNext} disabled={currentPage === totalPages}>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
