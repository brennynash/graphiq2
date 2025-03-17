import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Use the singleton Prisma instance
import { uploadImage } from "@/lib/cloudinary";

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

// Validate database connection
async function validateDbConnection() {
    try {
        await prisma.$connect();
        // Test connection with a simple find operation
        await prisma.trend.findFirst({
            select: { id: true },
            take: 1
        });
        console.log('[Database] Connection successful');
        return true;
    } catch (error) {
        console.error('[Database] Connection failed:', {
            message: error.message,
            name: error.name,
            code: error.code
        });
        return false;
    }
}

// GET all trends (admin)
export async function GET() {
    try {
        console.log('[GET /api/admin/trends] Fetching all trends...');

        const trends = await prisma.trend.findMany({
            orderBy: [
                { order: 'asc' },
                { createdAt: 'desc' }
            ]
        });

        console.log(`[GET /api/admin/trends] Found ${trends.length} trends`);
        return createSuccessResponse(trends);
    } catch (error) {
        console.error('[GET /api/admin/trends] Error:', error);
        return createErrorResponse('Failed to fetch trends', 500, error.message);
    }
}

// POST new trend
export async function POST(request) {
    try {
        console.log('[POST /api/admin/trends] Creating new trend...');

        const json = await request.json();

        // Validate required fields
        if (!json?.title?.trim()) {
            return createErrorResponse('Title is required', 400);
        }

        // Get the highest order number
        const highestOrder = await prisma.trend.findFirst({
            orderBy: { order: 'desc' },
            select: { order: true }
        });

        const newOrder = (highestOrder?.order || 0) + 1;

        // Create the trend
        const trend = await prisma.trend.create({
            data: {
                title: json.title.trim(),
                description: json.description?.trim() || '',
                image: json.image || null,
                category: json.category?.trim() || null,
                href: json.href?.trim() || null,
                order: newOrder,
                isActive: true
            }
        });

        console.log('[POST /api/admin/trends] Created trend:', trend);
        return createSuccessResponse(trend, 201);
    } catch (error) {
        console.error('[POST /api/admin/trends] Error:', error);
        return createErrorResponse('Failed to create trend', 500, error.message);
    }
}

// PUT update trend order
export async function PUT(request) {
    try {
        console.log('[PUT /api/admin/trends] Updating trend order...');

        const json = await request.json();
        const { id, newOrder } = json;

        if (!id || typeof newOrder !== 'number') {
            return createErrorResponse('Invalid request. ID and newOrder are required.', 400);
        }

        const trend = await prisma.trend.update({
            where: { id },
            data: { order: newOrder }
        });

        console.log('[PUT /api/admin/trends] Updated trend order:', trend);
        return createSuccessResponse(trend);
    } catch (error) {
        console.error('[PUT /api/admin/trends] Error:', error);
        return createErrorResponse('Failed to update trend order', 500, error.message);
    }
}

// DELETE trend
export async function DELETE(request) {
    try {
        console.log('[DELETE /api/admin/trends] Deleting trend...');

        const json = await request.json();

        if (!json?.id) {
            return createErrorResponse('Trend ID is required', 400);
        }

        const trend = await prisma.trend.delete({
            where: { id: json.id }
        });

        console.log('[DELETE /api/admin/trends] Deleted trend:', trend);
        return createSuccessResponse({ deleted: true, id: json.id });
    } catch (error) {
        console.error('[DELETE /api/admin/trends] Error:', error);
        return createErrorResponse('Failed to delete trend', 500, error.message);
    }
} 