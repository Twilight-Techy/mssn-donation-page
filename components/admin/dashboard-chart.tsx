"use client"

import { useEffect, useState } from "react"

// Simple chart component that doesn't rely on external libraries
export default function DashboardChart({ campaignId }: { campaignId: string | null }) {
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    // Generate mock data for the chart
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    const data = months.map((month) => {
      const baseValue = Math.floor(Math.random() * 50000) + 30000

      if (campaignId === null) {
        // All campaigns
        return {
          month,
          "Magazine Launch": Math.floor(baseValue * 0.4),
          "Ramadan Food Drive": Math.floor(baseValue * 0.3),
          "Islamic Library": Math.floor(baseValue * 0.2),
        }
      } else {
        // Specific campaign
        const campaignName =
          campaignId === "camp1" ? "Magazine Launch" : campaignId === "camp2" ? "Ramadan Food Drive" : "Islamic Library"

        return {
          month,
          [campaignName]:
            campaignId === "camp1"
              ? Math.floor(baseValue * 0.4)
              : campaignId === "camp2"
                ? Math.floor(baseValue * 0.3)
                : Math.floor(baseValue * 0.2),
        }
      }
    })

    setChartData(data)
  }, [campaignId])

  // Get the campaign name for the title
  const campaignName =
    campaignId === "camp1"
      ? "Magazine Launch"
      : campaignId === "camp2"
        ? "Ramadan Food Drive"
        : campaignId === "camp3"
          ? "Islamic Library"
          : "All Campaigns"

  // Calculate max value for scaling
  const maxValue = chartData.reduce((max, item) => {
    const values = Object.values(item).filter((v) => typeof v === "number") as number[]
    const itemMax = values.reduce((a, b) => a + b, 0)
    return Math.max(max, itemMax)
  }, 0)

  return (
    <div className="h-[300px] w-full">
      <h3 className="mb-4 text-sm font-medium text-gray-500">Monthly Donations - {campaignName}</h3>

      <div className="flex h-[250px] items-end space-x-2">
        {chartData.map((item, index) => (
          <div key={index} className="flex flex-1 flex-col items-center">
            {/* Bar container */}
            <div className="relative flex h-[200px] w-full flex-col-reverse">
              {campaignId === null ? (
                // Multiple campaigns
                <>
                  <div
                    className="w-full bg-green-500"
                    style={{
                      height: `${(item["Magazine Launch"] / maxValue) * 200}px`,
                    }}
                  />
                  <div
                    className="w-full bg-blue-500"
                    style={{
                      height: `${(item["Ramadan Food Drive"] / maxValue) * 200}px`,
                    }}
                  />
                  <div
                    className="w-full bg-amber-500"
                    style={{
                      height: `${(item["Islamic Library"] / maxValue) * 200}px`,
                    }}
                  />
                </>
              ) : (
                // Single campaign
                <div
                  className={`w-full ${
                    campaignId === "camp1" ? "bg-green-500" : campaignId === "camp2" ? "bg-blue-500" : "bg-amber-500"
                  }`}
                  style={{
                    height: `${((Object.values(item).find((v) => typeof v === "number") as number) / maxValue) * 200}px`,
                  }}
                />
              )}
            </div>

            {/* Month label */}
            <div className="mt-2 text-xs font-medium text-gray-500">{item.month}</div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 flex justify-center space-x-4">
        {(campaignId === null || campaignId === "camp1") && (
          <div className="flex items-center">
            <div className="mr-1 h-3 w-3 bg-green-500"></div>
            <span className="text-xs">Magazine Launch</span>
          </div>
        )}
        {(campaignId === null || campaignId === "camp2") && (
          <div className="flex items-center">
            <div className="mr-1 h-3 w-3 bg-blue-500"></div>
            <span className="text-xs">Ramadan Food Drive</span>
          </div>
        )}
        {(campaignId === null || campaignId === "camp3") && (
          <div className="flex items-center">
            <div className="mr-1 h-3 w-3 bg-amber-500"></div>
            <span className="text-xs">Islamic Library</span>
          </div>
        )}
      </div>
    </div>
  )
}
