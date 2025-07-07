import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    const campaignId = req.nextUrl.searchParams.get("campaignId")

    const fromDate = new Date()
    fromDate.setMonth(fromDate.getMonth() - 6)

    const where = {
        createdAt: {
            gte: fromDate,
        },
        ...(campaignId && campaignId !== "all" ? { campaignId } : {}),
    }

    try {
        const donations = await prisma.donation.findMany({
            where,
            include: { campaign: true },
        })

        return NextResponse.json({ donations })
    } catch (error) {
        console.error("Failed to fetch donations for chart:", error)
        return NextResponse.json({ error: "Failed to load donations" }, { status: 500 })
    }
}
