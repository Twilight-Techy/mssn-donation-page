// app/api/opay/initiate/route.ts
import { NextResponse } from "next/server"
import { initOpayPayment } from "@/lib/opay"
import { v4 as uuid } from "uuid"

export async function POST(req: Request) {
    const body = await req.json()

    const reference = `OPAY-${uuid()}`
    const result = await initOpayPayment({
        amount: body.amount,
        reference,
        customerName: body.name,
        customerEmail: body.email,
        returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/donation/success?reference=${reference}&payment_method=opay`
    })

    if (result.code === "00000") {
        return NextResponse.json({ cashierUrl: result.data.cashierUrl })
    }

    return NextResponse.json({ error: result.message }, { status: 400 })
}
