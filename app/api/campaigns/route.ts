import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { isBefore, isAfter } from "date-fns"
import { DonationStatus } from "@prisma/client"

export async function GET() {
  try {
    const campaigns = await prisma.campaign.findMany({
      orderBy: { startDate: "desc" },
      include: {
        donations: {
          where: { status: DonationStatus.completed },
          select: { amount: true },
        },
      },
    })

    const now = new Date()

    // Map each campaign to include raised amount
    const campaignsWithRaised = campaigns.map((c) => {
      const raised = c.donations.reduce((sum, d) => sum + d.amount, 0)
      return { ...c, raised }
    })

    const activeCampaigns = campaignsWithRaised.filter(
      (c) =>
        c.isActive &&
        isBefore(new Date(c.startDate), now) &&
        isAfter(new Date(c.endDate), now)
    )

    const upcomingCampaigns = campaignsWithRaised.filter((c) =>
      isAfter(new Date(c.startDate), now)
    )

    const completedCampaigns = campaignsWithRaised.filter((c) =>
      isBefore(new Date(c.endDate), now)
    )

    return NextResponse.json(
      {
        activeCampaigns,
        upcomingCampaigns,
        completedCampaigns,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    )
  } catch (error) {
    console.error("Failed to fetch campaigns:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
