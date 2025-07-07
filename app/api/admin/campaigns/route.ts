// /app/api/admin/campaigns/route.ts
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const campaigns = await prisma.campaign.findMany({
            select: {
                id: true,
                title: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        })
        return NextResponse.json(campaigns)
    } catch (error) {
        console.error("Failed to fetch campaigns:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
