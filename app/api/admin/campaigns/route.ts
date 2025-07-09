import { prisma } from "@/lib/prisma"
import { DonationStatus } from "@prisma/client"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const campaigns = await prisma.campaign.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                donations: {
                    where: { status: DonationStatus.completed },
                    select: { amount: true },
                },
            },
        })

        const campaignsWithRaised = campaigns.map((campaign) => {
            const raised = campaign.donations.reduce((sum, donation) => sum + donation.amount, 0)
            const { donations, ...rest } = campaign
            return { ...rest, raised }
        })

        return NextResponse.json(campaignsWithRaised)
    } catch (error) {
        console.error("Failed to fetch campaigns:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()

        const {
            title,
            description,
            imageSrc,
            goal,
            startDate,
            endDate,
            isActive,
            isFeatured,
        } = body

        // If this campaign is featured, unfeature others first
        if (isFeatured) {
            await prisma.campaign.updateMany({
                where: { isFeatured: true },
                data: { isFeatured: false },
            })
        }

        const newCampaign = await prisma.campaign.create({
            data: {
                title,
                description,
                imageSrc,
                goal,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                isActive,
                isFeatured,
            },
        })

        return NextResponse.json(newCampaign, { status: 201 })
    } catch (error) {
        console.error("Error creating campaign:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
