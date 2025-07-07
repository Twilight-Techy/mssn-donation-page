import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendDonationReceipt } from "@/lib/email"
import { addSubscriber } from "@/lib/subscriber"
import crypto from "crypto"

export async function GET(req: NextRequest) {
    const reference = req.nextUrl.searchParams.get("reference")
    console.log("Verifying Opay payment with reference:", reference)

    if (!reference) {
        return NextResponse.json({ error: "Missing reference" }, { status: 400 })
    }

    const body = {
        reference,
        country: "EG",
    }

    const privateKey = process.env.OPAY_SECRET_KEY!
    const merchantId = process.env.OPAY_MERCHANT_ID!

    // Generate HMAC-SHA512 Signature
    const signature = crypto
        .createHmac("sha512", privateKey)
        .update(JSON.stringify(body))
        .digest("hex")

    // Call Opay Cashier Status API
    const opayRes = await fetch("https://api.opaycheckout.com/api/v1/international/cashier/status", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${signature}`,
            MerchantId: merchantId,
        },
        body: JSON.stringify(body),
    })

    const data = await opayRes.json()
    console.log("Opay status response:", data)

    const status = data?.data?.status
    const successStatuses = ["SUCCESS"]

    if (!opayRes.ok || !successStatuses.includes(status)) {
        await prisma.donation.update({
            where: { reference },
            data: { status: "failed" },
        })

        return NextResponse.json({ error: "Payment not successful" }, { status: 400 })
    }

    const donation = await prisma.donation.update({
        where: { reference },
        data: { status: "completed" },
        include: { campaign: true },
    })

    if (donation.isSubscribed) {
        await addSubscriber(donation.email, donation.name)
    }

    // Optionally send receipt
    // await sendDonationReceipt({ ... })

    return NextResponse.json({ success: true, donation })
}
