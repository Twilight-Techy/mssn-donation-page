// app/api/admin/users/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const total = await prisma.adminUser.count();
        if (total <= 1) {
            return NextResponse.json({ error: "Cannot delete the last admin" }, { status: 400 });
        }
        await prisma.adminUser.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to delete admin" }, { status: 500 });
    }
}
