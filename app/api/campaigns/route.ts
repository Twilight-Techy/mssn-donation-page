import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { isBefore, isAfter } from "date-fns"

export async function GET() {
  const allCampaigns = await prisma.campaign.findMany({
    orderBy: { startDate: "desc" },
  })

  const now = new Date()

  const activeCampaigns = allCampaigns.filter(
    (c) => c.isActive && isBefore(new Date(c.startDate), now) && isAfter(new Date(c.endDate), now)
  )

  const upcomingCampaigns = allCampaigns.filter(
    (c) => isAfter(new Date(c.startDate), now)
  )

  const completedCampaigns = allCampaigns.filter(
    (c) => isBefore(new Date(c.endDate), now)
  )

  return NextResponse.json({
    activeCampaigns,
    upcomingCampaigns,
    completedCampaigns,
  })
}
