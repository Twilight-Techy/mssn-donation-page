import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    // Clear existing campaigns
    await prisma.adminUser.deleteMany()
    await prisma.donation.deleteMany()
    await prisma.campaign.deleteMany()

    // Create admin user
    const passwordHash = await bcrypt.hash("admin123", 10)
    await prisma.adminUser.create({
        data: {
            name: "MSSN Admin",
            email: "admin@mssnlasu.org",
            passwordHash,
        },
    })

    console.log("✅ Admin user created!")

    await prisma.campaign.createMany({
        data: [
            // Active Campaigns
            {
                id: "camp1",
                title: "Magazine Launch",
                description: "Help us launch our first Islamic magazine to spread knowledge and inspire our community.",
                imageSrc: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000&auto=format&fit=crop",
                goal: 500000,
                startDate: new Date(),
                endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
                isActive: true,
                isFeatured: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: "camp2",
                title: "Ramadan Food Drive",
                description: "Provide iftar meals for students and community members during Ramadan.",
                imageSrc: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?q=80&w=1000&auto=format&fit=crop",
                goal: 300000,
                startDate: new Date(),
                endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45),
                isActive: true,
                isFeatured: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: "camp3",
                title: "Islamic Library",
                description: "Help us expand our collection of Islamic books and resources for students.",
                imageSrc: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1000&auto=format&fit=crop",
                goal: 300000,
                startDate: new Date(),
                endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60),
                isActive: true,
                isFeatured: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            },

            // Upcoming Campaigns
            {
                id: "camp4",
                title: "Annual Islamic Conference",
                description: "Support our upcoming annual conference featuring renowned Islamic scholars.",
                imageSrc: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000&auto=format&fit=crop",
                goal: 750000,
                startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
                endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90),
                isActive: false,
                isFeatured: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: "camp5",
                title: "Student Scholarship Fund",
                description: "Help provide financial assistance to deserving Muslim students.",
                imageSrc: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1000&auto=format&fit=crop",
                goal: 1000000,
                startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45),
                endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 120),
                isActive: false,
                isFeatured: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            },

            // Completed Campaigns
            {
                id: "camp6",
                title: "Mosque Renovation",
                description: "We successfully renovated the campus mosque to accommodate more worshippers.",
                imageSrc: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=1000&auto=format&fit=crop",
                goal: 800000,
                startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120),
                endDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
                isActive: false,
                isFeatured: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: "camp7",
                title: "Eid Celebration",
                description: "We organized a successful Eid celebration for students and community members.",
                imageSrc: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?q=80&w=1000&auto=format&fit=crop",
                goal: 250000,
                startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90),
                endDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60),
                isActive: false,
                isFeatured: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ],
    })

    console.log("✅ Seeded campaigns successfully!")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
