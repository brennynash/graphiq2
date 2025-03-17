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

// GET single service
export async function GET(req, { params }) {
    try {
        const service = await prisma.service.findUnique({
            where: { id: params.id }
        });

        if (!service) {
            return NextResponse.json(
                { error: "Service not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(service);
    } catch (error) {
        console.error('Error fetching service:', error);
        return NextResponse.json(
            { error: "Failed to fetch service" },
            { status: 500 }
        );
    }
}

// PUT update service
export async function PUT(req, { params }) {
    try {
        const body = await req.json();
        const { title, description, imageUrl, bgColor, services } = body;

        if (!title || !description || !imageUrl) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const updatedService = await prisma.service.update({
            where: { id: params.id },
            data: {
                title,
                description,
                imageUrl,
                bgColor: bgColor || "bg-secondary-grey-ish",
                services: Array.isArray(services) ? services : []
            }
        });

        return NextResponse.json(updatedService);
    } catch (error) {
        console.error('Error updating service:', error);
        return NextResponse.json(
            { error: "Failed to update service" },
            { status: 500 }
        );
    }
}

// DELETE service
export async function DELETE(req, { params }) {
    if (!params?.id) {
        return NextResponse.json(
            { error: "Service ID is required" },
            { status: 400 }
        );
    }

    try {
        await prisma.service.delete({
            where: { id: params.id }
        });

        return NextResponse.json({ message: "Service deleted successfully" });
    } catch (error) {
        console.error('Error deleting service:', error);
        return NextResponse.json(
            { error: "Failed to delete service" },
            { status: 500 }
        );
    }
} 