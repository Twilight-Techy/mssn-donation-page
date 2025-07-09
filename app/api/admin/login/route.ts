import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json()

        // 1. Find the admin user by email
        const admin = await prisma.adminUser.findUnique({
            where: { email },
        })

        if (!admin) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            )
        }

        // 2. Compare password with hashed password
        const isPasswordValid = await bcrypt.compare(password, admin.passwordHash)

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            )
        }

        // 3. Success
        const response = NextResponse.json(
            {
                success: true,
                admin: {
                    id: admin.id,
                    name: admin.name,
                    email: admin.email,
                },
            },
            { status: 200 }
        )

        // 4. Set cookie for auth
        response.cookies.set("admin-auth", "true", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        })

        return response
    } catch (error) {
        console.error("Login error:", error)
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}
