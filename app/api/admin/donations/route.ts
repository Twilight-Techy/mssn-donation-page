import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    const url = req.nextUrl
    const campaignId = url.searchParams.get("campaignId")
    const range = url.searchParams.get("range") // "all" or undefined

    const where: any = {}

    // Only filter by date if range !== "all"
    if (range !== "all") {
        const fromDate = new Date()
        fromDate.setMonth(fromDate.getMonth() - 6)
        where.createdAt = { gte: fromDate }
    }

    if (campaignId && campaignId !== "all") {
        where.campaignId = campaignId
    }

    try {
        const donations = await prisma.donation.findMany({
            where,
            include: { campaign: true },
            orderBy: { createdAt: "desc" },
        })

        return NextResponse.json({ donations })
    } catch (error) {
        console.error("Failed to fetch donations:", error)
        return NextResponse.json({ error: "Failed to load donations" }, { status: 500 })
    }
}
