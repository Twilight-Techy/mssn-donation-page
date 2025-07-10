"use client"

import { useEffect, useState } from "react"

interface Campaign {
  id: string
  title: string
}

interface Donation {
  id: string
  amount: number
  createdAt: string
  status: string
  campaign: {
    id: string
    title: string
  }
}

const colorPalette = [
  "bg-green-500",
  "bg-blue-500",
  "bg-amber-500",
  "bg-purple-500",
  "bg-rose-500",
  "bg-indigo-500",
  "bg-teal-500",
]

export default function DashboardChart({
  campaignId,
  campaigns,
}: {
  campaignId: string | null
  campaigns: Campaign[]
}) {
  const [donations, setDonations] = useState<Donation[]>([]) // ✅ This line declares the state
  const [chartData, setChartData] = useState<any[]>([])
  const [colorMap, setColorMap] = useState<Record<string, string>>({})

  // Assign dynamic colors
  useEffect(() => {
    const map: Record<string, string> = {}
    campaigns.forEach((c, i) => {
      map[c.title] = colorPalette[i % colorPalette.length]
    })
    setColorMap(map)
  }, [campaigns])

  // Fetch donations for selected campaign (or all)
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await fetch(`/api/admin/donations?campaignId=${campaignId ?? "all"}`)
        const data = await res.json()

        // ✅ Filter to only 'completed' donations
        const completed = data.donations.filter((d: Donation) => d.status === "completed")

        setDonations(completed)
      } catch (err) {
        console.error("Failed to fetch donations for chart:", err)
      }
    }

    fetchDonations()
  }, [campaignId])

  // Generate chart data (last 6 months)
  useEffect(() => {
    const now = new Date()
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
      return {
        label: date.toLocaleString("default", { month: "short" }),
        year: date.getFullYear(),
        month: date.getMonth(),
        key: `${date.getFullYear()}-${date.getMonth() + 1}`,
      }
    })

    const grouped: Record<string, Record<string, number>> = {}
    months.forEach(({ key }) => (grouped[key] = {}))

    for (const d of donations) {
      const date = new Date(d.createdAt)
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`
      const campaignTitle = d.campaign?.title ?? "Unknown"

      if (!grouped[key]) continue
      grouped[key][campaignTitle] = (grouped[key][campaignTitle] || 0) + d.amount
    }

    const data = months.map(({ key, label }) => ({
      month: label,
      ...grouped[key],
    }))

    setChartData(data)
  }, [donations])

  // Determine max value for chart scaling
  const maxValue = chartData.reduce((max, item) => {
    const values = Object.values(item).filter((v) => typeof v === "number") as number[]
    return Math.max(max, values.reduce((a, b) => a + b, 0))
  }, 0)

  const selectedCampaignName =
    campaignId === null ? "All Campaigns" : campaigns.find((c) => c.id === campaignId)?.title || "Campaign"

  return (
    <div className="w-full">
      <h3 className="mb-4 text-sm font-medium text-gray-500">Monthly Donations - {selectedCampaignName}</h3>

      <div className="flex h-[250px] items-end space-x-2">
        {chartData.map((item, index) => (
          <div key={index} className="flex flex-1 flex-col items-center">
            <div className="relative flex h-[200px] w-full flex-col-reverse">
              {Object.entries(item).map(([label, value]) => {
                if (label === "month" || typeof value !== "number") return null
                const height = `${(value / maxValue) * 200}px`
                const color = colorMap[label] || "bg-gray-400"
                return <div key={label} className={`w-full ${color}`} style={{ height }} />
              })}
            </div>
            <div className="mt-2 text-xs font-medium text-gray-500">{item.month}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 max-w-full overflow-hidden"></div><div className="mt-4 flex flex-wrap justify-center gap-3">
        {(campaignId === null ? campaigns : campaigns.filter((c) => c.id === campaignId)).map((c) => (
          <div key={c.id} className="flex items-center whitespace-nowrap text-xs text-gray-700">
            <div className={`mr-2 h-3 w-3 ${colorMap[c.title] || "bg-gray-400"}`}></div>
            <span className="text-xs text-gray-700">{c.title}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
