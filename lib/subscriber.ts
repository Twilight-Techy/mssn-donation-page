import { prisma } from "@/lib/prisma"

export async function addSubscriber(email: string, name: string) {
    try {
        await prisma.subscriber.upsert({
            where: { email },
            update: { name },
            create: { email, name },
        })
    } catch (error) {
        console.error("Failed to add subscriber", error)
    }
}
