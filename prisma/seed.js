require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    const sampleProjects = [
        {
            name: 'Project Alpha',
            title: 'Revolutionary Tech Platform',
            description: 'A cutting-edge technology platform transforming the way businesses operate.',
            mainImage: 'https://res.cloudinary.com/example/project-alpha.jpg',
            images: ['https://res.cloudinary.com/example/alpha-1.jpg', 'https://res.cloudinary.com/example/alpha-2.jpg'],
            industry: 'Technology'
        },
        {
            name: 'Project Beta',
            title: 'Sustainable Energy Solution',
            description: 'Innovative renewable energy solution for modern cities.',
            mainImage: 'https://res.cloudinary.com/example/project-beta.jpg',
            images: ['https://res.cloudinary.com/example/beta-1.jpg', 'https://res.cloudinary.com/example/beta-2.jpg'],
            industry: 'Energy'
        }
    ];

    for (const project of sampleProjects) {
        await prisma.project.create({
            data: project
        });
    }

    console.log('Sample projects have been created');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    }); 