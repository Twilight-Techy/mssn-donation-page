"use client"

import { type NextRequest, NextResponse } from "next/server"

// Import the campaigns array from the parent route
// This is a workaround for the mock data in this demo
// In a real app, you would use a database
import { campaigns } from "../route"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // For preview, just return success
    console.log("Mock: Deleting campaign", id)

    // Remove from our in-memory campaigns
    const index = campaigns.findIndex((c) => c.id === id)
    if (index !== -1) {
      campaigns.splice(index, 1)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting campaign:", error)
    return NextResponse.json({ error: "Failed to delete campaign" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const data = await request.json()

    // If this campaign is being featured, unfeature all other campaigns
    if (data.isFeatured) {
      for (let i = 0; i < campaigns.length; i++) {
        if (campaigns[i].id !== id) {
          campaigns[i].isFeatured = false
        }
      }
    }

    // Update the campaign in our in-memory array
    const index = campaigns.findIndex((c) => c.id === id)
    if (index !== -1) {
      campaigns[index] = {
        ...campaigns[index],
        ...data,
        updatedAt: new Date(),
      }
    }

    // For preview, just return the data
    console.log("Mock: Updating campaign", id, data)

    return NextResponse.json({ ...data, id })
  } catch (error) {
    console.error("Error updating campaign:", error)
    return NextResponse.json({ error: "Failed to update campaign" }, { status: 500 })
  }
}
