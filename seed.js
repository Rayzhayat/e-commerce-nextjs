const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
    const password = await bcrypt.hash('password123', 10)

    // Create Admin
    const admin = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            email: 'admin@example.com',
            name: 'Admin User',
            password,
            role: 'ADMIN',
        },
    })
    console.log({ admin })

    // Create User
    const user = await prisma.user.upsert({
        where: { email: 'user@example.com' },
        update: {},
        create: {
            email: 'user@example.com',
            name: 'Test Customer',
            password,
            role: 'USER',
        },
    })
    console.log({ user })

    // Create Product
    const product = await prisma.product.create({
        data: {
            name: 'Premium Headphones',
            description: 'High quality noise cancelling headphones.',
            price: 199.99,
            stock: 50,
            category: 'Electronics',
            images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80']
        }
    })
    console.log({ product })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
