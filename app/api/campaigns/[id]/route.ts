// /app/api/campaigns/[id]/route.ts

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { DonationStatus } from "@prisma/client"

// GET a single campaign by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id: params.id },
      include: {
        donations: {
          where: { status: DonationStatus.completed },
          select: { amount: true },
        },
      },
    })

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    const raised = campaign.donations.reduce((sum, d) => sum + d.amount, 0)

    return NextResponse.json({
      ...campaign,
      raised, // Dynamically calculated
    })
  } catch (error) {
    console.error("Error fetching campaign:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// PATCH update campaign
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json()

    // If this campaign is being featured, unfeature all others
    if (data.isFeatured) {
      await prisma.campaign.updateMany({
        where: { isFeatured: true, NOT: { id: params.id } },
        data: { isFeatured: false },
      })
    }

    const updated = await prisma.campaign.update({
      where: { id: params.id },
      data: {
        title: data.title,
        description: data.description,
        imageSrc: data.imageSrc,
        goal: data.goal,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        isActive: data.isActive,
        isFeatured: data.isFeatured,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Error updating campaign:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// DELETE a campaign
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.campaign.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Campaign deleted successfully" })
  } catch (error) {
    console.error("DELETE /campaigns/[id] error:", error)
    return NextResponse.json({ error: "Failed to delete campaign" }, { status: 500 })
  }
}