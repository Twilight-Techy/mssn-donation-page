// "use client"

// import { type NextRequest, NextResponse } from "next/server"
// import { v4 as uuidv4 } from "uuid"

// // Mock data for preview
// const mockCampaigns = [
//   {
//     id: "camp1",
//     title: "Magazine Launch",
//     description: "Help us launch our first Islamic magazine to spread knowledge and inspire our community.",
//     imageSrc: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000&auto=format&fit=crop",
//     goal: 500000,
//     raised: 325000,
//     startDate: new Date(),
//     endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
//     isActive: true,
//     isFeatured: true,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     id: "camp2",
//     title: "Ramadan Food Drive",
//     description: "Provide iftar meals for students and community members during Ramadan.",
//     imageSrc: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?q=80&w=1000&auto=format&fit=crop",
//     goal: 300000,
//     raised: 120000,
//     startDate: new Date(),
//     endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45),
//     isActive: true,
//     isFeatured: false,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     id: "camp3",
//     title: "Islamic Library",
//     description: "Help us expand our collection of Islamic books and resources for students.",
//     imageSrc: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1000&auto=format&fit=crop",
//     goal: 300000,
//     raised: 75000,
//     startDate: new Date(),
//     endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60),
//     isActive: true,
//     isFeatured: false,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
// ]

// // In-memory storage for mock data
// export let campaigns = [...mockCampaigns]

// export async function POST(request: NextRequest) {
//   try {
//     const data = await request.json()

//     // If this campaign is featured, unfeature all other campaigns
//     if (data.isFeatured) {
//       campaigns = campaigns.map((campaign) => ({
//         ...campaign,
//         isFeatured: false,
//       }))
//     }

//     // For preview, just return the data with a new ID
//     const newCampaign = {
//       ...data,
//       id: `camp-${uuidv4()}`,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     }

//     // Add to our in-memory campaigns
//     campaigns.push(newCampaign)

//     console.log("Mock: Creating campaign", newCampaign)

//     return NextResponse.json(newCampaign)
//   } catch (error) {
//     console.error("Error creating campaign:", error)
//     return NextResponse.json({ error: "Failed to create campaign" }, { status: 500 })
//   }
// }

// export async function GET(request: NextRequest) {
//   try {
//     // For preview, just return the mock data
//     return NextResponse.json(campaigns)
//   } catch (error) {
//     console.error("Error fetching campaigns:", error)
//     return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 })
//   }
// }

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
