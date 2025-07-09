// app/api/admin/logout/route.ts
import { NextResponse } from "next/server"

export async function POST() {
    const response = NextResponse.json({ success: true })
    response.cookies.set("admin-auth", "", {
        path: "/",
        expires: new Date(0),
    })
    return response
}
