import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    const campaignId = req.nextUrl.searchParams.get("campaignId")

    try {
        if (campaignId && campaignId !== "all") {
            const campaign = await prisma.campaign.findUnique({
                where: { id: campaignId },
                include: {
                    donations: true,
                },
            })

            if (!campaign) {
                return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
            }

            const raised = campaign.donations.reduce((sum, d) => sum + d.amount, 0)

            return NextResponse.json({
                campaign: {
                    id: campaign.id,
                    title: campaign.title,
                    goal: campaign.goal,
                    raised,
                    isActive: campaign.isActive,
                    donationsCount: campaign.donations.length,
                    progress: Math.round((raised / campaign.goal) * 100),
                },
                donations: campaign.donations.slice(-5).map(d => ({
                    id: d.id,
                    name: d.isAnonymous ? "Anonymous" : d.name,
                    email: d.email,
                    amount: d.amount,
                    createdAt: d.createdAt,
                    isAnonymous: d.isAnonymous,
                    campaign: {
                        id: campaign.id,
                        title: campaign.title,
                    },
                })),
            })
        } else {
            const [campaigns, donations] = await Promise.all([
                prisma.campaign.findMany(),
                prisma.donation.findMany({ include: { campaign: true } }),
            ])

            const activeCampaigns = campaigns.filter(c => c.isActive)
            const activeCampaignIds = activeCampaigns.map(c => c.id)
            const activeCampaignsDonations = donations.filter(d => activeCampaignIds.includes(d.campaignId))

            return NextResponse.json({
                stats: {
                    totalCampaigns: campaigns.length,
                    activeCampaignsCount: activeCampaigns.length,
                    totalDonationsCount: donations.length,
                    activeCampaignsDonationsCount: activeCampaignsDonations.length,
                    totalAmountRaised: donations.reduce((sum, d) => sum + d.amount, 0),
                    activeCampaignsAmountRaised: activeCampaignsDonations.reduce((sum, d) => sum + d.amount, 0),
                },
                donations: donations
                    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                    .slice(0, 5)
                    .map(d => ({
                        id: d.id,
                        name: d.isAnonymous ? "Anonymous" : d.name,
                        email: d.email,
                        amount: d.amount,
                        createdAt: d.createdAt,
                        isAnonymous: d.isAnonymous,
                        campaign: {
                            id: d.campaign.id,
                            title: d.campaign.title,
                        },
                    })),
            })
        }
    } catch (error) {
        console.error("Dashboard summary error:", error)
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
    }
}
