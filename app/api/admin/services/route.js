import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global;

let prisma;

try {
    prisma = globalForPrisma.prisma || new PrismaClient();
    if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
} catch (error) {
    console.error('Error initializing Prisma:', error);
    throw error;
}

// GET all services
export async function GET() {
    try {
        const services = await prisma.service.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(services);
    } catch (error) {
        console.error('Error fetching services:', error);
        return NextResponse.json(
            { error: "Failed to fetch services" },
            { status: 500 }
        );
    }
}

// POST new service
export async function POST(req) {
    try {
        if (!req.body) {
            return NextResponse.json(
                { error: "Request body is required" },
                { status: 400 }
            );
        }

        const body = await req.json();
        console.log('Received body:', body);

        if (!body || typeof body !== 'object') {
            return NextResponse.json(
                { error: "Invalid request body format" },
                { status: 400 }
            );
        }

        const { title, description, imageUrl, bgColor, services } = body;

        if (!title || !description || !imageUrl) {
            return NextResponse.json(
                { error: "Missing required fields", received: { title, description, imageUrl } },
                { status: 400 }
            );
        }

        const serviceData = {
            title,
            description,
            imageUrl,
            bgColor: bgColor || "bg-secondary-grey-ish",
            services: Array.isArray(services) ? services : []
        };

        console.log('Creating service with data:', serviceData);

        try {
            const service = await prisma.service.create({
                data: serviceData
            });
            console.log('Service created successfully:', service);
            return NextResponse.json(service, { status: 201 });
        } catch (dbError) {
            console.error('Database error creating service:', dbError);
            return NextResponse.json(
                {
                    error: "Database error creating service",
                    details: dbError.message
                },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Error in POST handler:', error);
        return NextResponse.json(
            {
                error: "Failed to process request",
                details: error.message
            },
            { status: 500 }
        );
    }
} 