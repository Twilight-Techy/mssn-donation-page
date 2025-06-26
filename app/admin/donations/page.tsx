"use client"

import { useState, useMemo } from "react"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Mock data for preview - expanded to show pagination
const initialDonations = [
  {
    id: "don1",
    reference: "MSSN-123456",
    name: "Ibrahim Abdullah",
    email: "ibrahim@example.com",
    amount: 10000,
    campaign: { id: "camp1", title: "Magazine Launch" },
    paymentMethod: "paystack",
    status: "completed",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    isAnonymous: false,
  },
  {
    id: "don2",
    reference: "MSSN-123457",
    name: "Aisha Mohammed",
    email: "aisha@example.com",
    amount: 5000,
    campaign: { id: "camp2", title: "Ramadan Food Drive" },
    paymentMethod: "paystack",
    status: "completed",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    isAnonymous: false,
  },
  {
    id: "don3",
    reference: "MSSN-123458",
    name: "Yusuf Oladimeji",
    email: "yusuf@example.com",
    amount: 15000,
    campaign: { id: "camp3", title: "Islamic Library" },
    paymentMethod: "opay",
    status: "completed",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
    isAnonymous: true,
  },
  {
    id: "don4",
    reference: "MSSN-123459",
    name: "Fatima Hassan",
    email: "fatima@example.com",
    amount: 2000,
    campaign: { id: "camp1", title: "Magazine Launch" },
    paymentMethod: "paystack",
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    isAnonymous: false,
  },
  {
    id: "don5",
    reference: "MSSN-123460",
    name: "Ahmed Bello",
    email: "ahmed@example.com",
    amount: 7500,
    campaign: { id: "camp3", title: "Islamic Library" },
    paymentMethod: "opay",
    status: "failed",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    isAnonymous: false,
  },
  {
    id: "don6",
    reference: "MSSN-123461",
    name: "Khadijah Usman",
    email: "khadijah@example.com",
    amount: 12000,
    campaign: { id: "camp1", title: "Magazine Launch" },
    paymentMethod: "paystack",
    status: "completed",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96),
    isAnonymous: false,
  },
  {
    id: "don7",
    reference: "MSSN-123462",
    name: "Musa Ibrahim",
    email: "musa@example.com",
    amount: 8000,
    campaign: { id: "camp2", title: "Ramadan Food Drive" },
    paymentMethod: "opay",
    status: "completed",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120),
    isAnonymous: false,
  },
  {
    id: "don8",
    reference: "MSSN-123463",
    name: "Zainab Ali",
    email: "zainab@example.com",
    amount: 25000,
    campaign: { id: "camp3", title: "Islamic Library" },
    paymentMethod: "paystack",
    status: "completed",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 144),
    isAnonymous: false,
  },
  {
    id: "don9",
    reference: "MSSN-123464",
    name: "Anonymous",
    email: "anonymous@example.com",
    amount: 5000,
    campaign: { id: "camp1", title: "Magazine Launch" },
    paymentMethod: "opay",
    status: "completed",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 168),
    isAnonymous: true,
  },
  {
    id: "don10",
    reference: "MSSN-123465",
    name: "Abdullahi Sani",
    email: "abdullahi@example.com",
    amount: 18000,
    campaign: { id: "camp2", title: "Ramadan Food Drive" },
    paymentMethod: "paystack",
    status: "completed",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 192),
    isAnonymous: false,
  },
  {
    id: "don11",
    reference: "MSSN-123466",
    name: "Hafsat Garba",
    email: "hafsat@example.com",
    amount: 3000,
    campaign: { id: "camp3", title: "Islamic Library" },
    paymentMethod: "paystack",
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 216),
    isAnonymous: false,
  },
  {
    id: "don12",
    reference: "MSSN-123467",
    name: "Umar Farouk",
    email: "umar@example.com",
    amount: 9500,
    campaign: { id: "camp1", title: "Magazine Launch" },
    paymentMethod: "opay",
    status: "completed",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 240),
    isAnonymous: false,
  },
]

const ITEMS_PER_PAGE = 10

export default function DonationsPage() {
  const [donations] = useState(initialDonations)
  const [selectedCampaign, setSelectedCampaign] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)

  // Get unique campaigns for filter dropdown
  const campaigns = useMemo(() => {
    const uniqueCampaigns = new Map()
    donations.forEach((donation) => {
      if (donation.campaign) {
        uniqueCampaigns.set(donation.campaign.id, donation.campaign)
      }
    })
    return Array.from(uniqueCampaigns.values())
  }, [donations])

  // Filter donations based on selected campaign
  const filteredDonations = useMemo(() => {
    if (selectedCampaign === "all") {
      return donations
    }
    return donations.filter((donation) => donation.campaign?.id === selectedCampaign)
  }, [donations, selectedCampaign])

  // Reset to first page when filter changes
  useMemo(() => {
    setCurrentPage(1)
  }, [selectedCampaign])

  // Calculate pagination
  const totalPages = Math.ceil(filteredDonations.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentDonations = filteredDonations.slice(startIndex, endIndex)

  // Calculate summary statistics
  const summary = useMemo(() => {
    const count = filteredDonations.length
    const totalAmount = filteredDonations.reduce((sum, donation) => sum + donation.amount, 0)

    // Get campaign title if a specific campaign is selected
    let title = "All Campaigns"
    if (selectedCampaign !== "all") {
      const campaign = campaigns.find((c) => c.id === selectedCampaign)
      if (campaign) {
        title = campaign.title
      }
    }

    return {
      count,
      totalAmount,
      title,
    }
  }, [filteredDonations, selectedCampaign, campaigns])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Donations</h1>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
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
            <div className="rounded-lg bg-green-50 p-4 col-span-1 sm:col-span-2 lg:col-span-1">
              <h3 className="text-sm font-medium text-green-800">Campaign</h3>
              <p className="mt-1 text-xl md:text-2xl font-semibold text-green-900 truncate">{summary.title}</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-4">
              <h3 className="text-sm font-medium text-blue-800">Donations</h3>
              <p className="mt-1 text-xl md:text-2xl font-semibold text-blue-900">{summary.count}</p>
            </div>
            <div className="rounded-lg bg-amber-50 p-4">
              <h3 className="text-sm font-medium text-amber-800">Total Amount</h3>
              <p className="mt-1 text-xl md:text-2xl font-semibold text-amber-900">
                ₦{summary.totalAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table with horizontal scroll only */}
      <div className="rounded-md border bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-3 text-sm font-medium text-gray-500 whitespace-nowrap">Reference</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500 whitespace-nowrap">Donor</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500 whitespace-nowrap">Campaign</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500 whitespace-nowrap">Amount</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500 whitespace-nowrap">Payment Method</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500 whitespace-nowrap">Status</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500 whitespace-nowrap">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {currentDonations.map((donation) => (
                <tr key={donation.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 font-medium text-sm whitespace-nowrap">{donation.reference}</td>
                  <td className="px-4 py-4 text-sm whitespace-nowrap">
                    {donation.isAnonymous ? "Anonymous" : donation.name}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <div className="max-w-[150px] truncate" title={donation.campaign?.title || "General Donation"}>
                      {donation.campaign?.title || "General Donation"}
                    </div>
                  </td>
                  <td className="px-4 py-4 font-medium text-sm whitespace-nowrap">
                    ₦{donation.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-sm capitalize whitespace-nowrap">{donation.paymentMethod}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold leading-5 ${
                        donation.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : donation.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {donation.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm whitespace-nowrap">
                    {format(new Date(donation.createdAt), "MMM d, yyyy")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile scroll hint */}
        <div className="block sm:hidden px-4 py-2 text-xs text-gray-500 text-center border-t bg-gray-50">
          Scroll horizontally to view all columns
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredDonations.length)} of {filteredDonations.length}{" "}
            donations
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="flex items-center"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Show first page, last page, current page, and pages around current page
                const showPage =
                  page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)

                if (!showPage) {
                  // Show ellipsis
                  if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <span key={page} className="px-2 py-1 text-sm text-gray-500">
                        ...
                      </span>
                    )
                  }
                  return null
                }

                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                )
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="flex items-center"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
