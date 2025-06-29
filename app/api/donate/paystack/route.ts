import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

export async function POST(req: Request) {
    const body = await req.json()

    const { name, email, phone, amount, campaignId, isAnonymous, isSubscribed, message } = body

    const reference = `PAYSTACK-${uuidv4()}`

    // 1. Save donation with pending status
    try {
        await prisma.donation.create({
            data: {
                reference,
                name,
                email,
                phone,
                message,
                amount: parseFloat(amount),
                paymentMethod: "paystack",
                status: "pending",
                isAnonymous,
                isSubscribed,
                campaignId,
            },
        })
    } catch (error) {
        console.error("Error saving donation:", error)
        return NextResponse.json({ error: "Failed to save donation" }, { status: 500 })
    }

    // 2. Add to subscribers if not already subscribed
    if (isSubscribed) {
        try {
            await prisma.subscriber.upsert({
                where: { email },
                update: { name },
                create: { email, name },
            })
        } catch (error) {
            console.warn("Could not subscribe user:", error)
        }
    }

    // 3. Initialize Paystack payment
    const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            amount: Number(amount) * 100, // Paystack expects amount in kobo
            reference,
            callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/donation/success`,
            metadata: {
                name,
                campaignId,
                isAnonymous,
                isSubscribed,
                message,
            },
        }),
    })

    const data = await paystackRes.json()

    if (!paystackRes.ok) {
        return NextResponse.json({ error: data.message || "Failed to initialize payment" }, { status: 500 })
    }

    return NextResponse.json({ authorization_url: data.data.authorization_url })
}
