// app/api/verify/paystack/route.ts

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendDonationReceipt } from "@/lib/email"
import { addSubscriber } from "@/lib/subscriber"

export async function GET(req: NextRequest) {
  const reference = req.nextUrl.searchParams.get("reference")
  console.log("Verifying payment with reference:", reference)

  if (!reference) {
    return NextResponse.json({ error: "Missing reference" }, { status: 400 })
  }

  const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    },
  })

  const data = await res.json()

  if (!data.status || data.data.status !== "success") {
    // Update status to failed
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

  // Add to newsletter if subscribed
  if (donation.isSubscribed) {
    await addSubscriber(donation.email, donation.name)
  }

  // // Send email receipt
  // await sendDonationReceipt({
  //   email: donation.email,
  //   name: donation.name,
  //   amount: donation.amount,
  //   reference: donation.reference,
  //   campaign: donation.campaign.title, // assuming you fetched the campaign earlier
  //   date: donation.createdAt.toISOString(),
  // })

  return NextResponse.json({ success: true, donation })
}
