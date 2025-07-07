import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

export async function POST(req: Request) {
    const body = await req.json()
    const { name, email, phone, amount, campaignId, isAnonymous, isSubscribed, message } = body

    const reference = `OPAY-${uuidv4()}`
    const amountInKobo = Number(amount) * 100

    // 1. Save donation
    try {
        await prisma.donation.create({
            data: {
                reference,
                name,
                email,
                phone,
                message,
                amount: parseFloat(amount),
                paymentMethod: "opay",
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

    // 2. Add subscriber
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

    // 3. Create Opay Cashier payment
    try {
        const response = await fetch("https://sandboxapi.opaycheckout.com/api/v1/international/cashier/create", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.OPAY_PUBLIC_KEY}`,
                MerchantId: process.env.OPAY_MERCHANT_ID!,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                country: "EG",
                reference,
                amount: {
                    total: amountInKobo,
                    currency: "NGN",
                },
                returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/donation/success?payment_method=opay`,
                cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/donation/failed`,
                callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/verify/opay?reference=${reference}`,
                expireAt: 30,
                userInfo: {
                    userEmail: email,
                    userName: name,
                    userMobile: phone,
                    userId: email,
                },
                productList: [
                    {
                        productId: "donation",
                        name: "MSSN Donation",
                        description: message || "Donation to MSSN Campaign",
                        price: amountInKobo,
                        quantity: 1,
                        imageUrl: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
                    },
                ],
                // payMethod: "BankCard",
            }),
        })

        const data = await response.json()

        if (!response.ok || data.code !== "00000") {
            console.error("Opay initialization failed:", data)
            return NextResponse.json({ error: data.message || "Failed to initialize Opay payment" }, { status: 500 })
        }

        return NextResponse.json({ authorizationUrl: data.data.cashierUrl })
    } catch (error) {
        console.error("Opay fetch failed:", error)
        return NextResponse.json({ error: "Opay request failed" }, { status: 500 })
    }
}