require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    // Using a simpler password for testing
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        // First, try to delete any existing admin users to start fresh
        await prisma.admin.deleteMany({});

        // Create a new admin user
        const admin = await prisma.admin.create({
            data: {
                username: 'admin',
                password: hashedPassword,
            },
        });

        console.log('Admin user has been created successfully!');
        console.log('Username:', admin.username);
        console.log('Password:', password);
    } catch (error) {
        console.error('Error creating admin:', error);
        throw error; // Re-throw to trigger the catch block below
    }
}

main()
    .catch((e) => {
        console.error('Failed to seed admin user:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    }); 