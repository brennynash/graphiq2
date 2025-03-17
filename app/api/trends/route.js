import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';

// Helper function to create error response
function createErrorResponse(message, status = 500, details = null) {
    console.error(`[API Error] ${message}`, details);
    return NextResponse.json({
        success: false,
        error: message,
        details: process.env.NODE_ENV === 'development' ? details : undefined
    }, { status });
}

// Helper function to create success response
function createSuccessResponse(data, status = 200) {
    return NextResponse.json({
        success: true,
        data: data || null
    }, { status });
}

export async function GET() {
    try {
        console.log('[GET /api/trends] Fetching public trends...');

        const trends = await prisma.trend.findMany({
            where: {
                isActive: true
            },
            select: {
                id: true,
                title: true,
                description: true,
                image: true,
                category: true,
                href: true,
                order: true,
                createdAt: true
            },
            orderBy: [
                { order: 'asc' },
                { createdAt: 'desc' }
            ]
        });

        console.log(`[GET /api/trends] Found ${trends.length} active trends`);

        return createSuccessResponse(trends);
    } catch (error) {
        console.error('[GET /api/trends] Error:', error);
        return createErrorResponse('Failed to fetch trends', 500, error.message);
    }
} 