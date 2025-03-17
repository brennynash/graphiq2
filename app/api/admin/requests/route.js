import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

// GET all requests
export async function GET() {
    try {
        const requests = await prisma.request.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(requests);
    } catch (error) {
        console.error('Error fetching requests:', error);
        return NextResponse.json(
            { error: "Failed to fetch requests" },
            { status: 500 }
        );
    }
} 