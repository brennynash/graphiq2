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

// GET single trend
export async function GET(request, { params }) {
    try {
        console.log(`[GET /api/admin/trends/${params.id}] Fetching trend...`);

        const trend = await prisma.trend.findUnique({
            where: { id: params.id }
        });

        if (!trend) {
            return createErrorResponse('Trend not found', 404);
        }

        return createSuccessResponse(trend);
    } catch (error) {
        console.error(`[GET /api/admin/trends/${params.id}] Error:`, error);
        return createErrorResponse('Failed to fetch trend', 500, error.message);
    }
}

// PATCH update trend
export async function PATCH(request, { params }) {
    try {
        console.log(`[PATCH /api/admin/trends/${params.id}] Updating trend...`);

        const json = await request.json();

        // Validate the trend exists
        const exists = await prisma.trend.findUnique({
            where: { id: params.id }
        });

        if (!exists) {
            return createErrorResponse('Trend not found', 404);
        }

        // Update the trend
        const trend = await prisma.trend.update({
            where: { id: params.id },
            data: {
                title: json.title?.trim() || exists.title,
                description: json.description?.trim() || exists.description,
                image: json.image || exists.image,
                category: json.category?.trim() || exists.category,
                href: json.href?.trim() || exists.href,
                isActive: json.isActive ?? exists.isActive,
                order: json.order ?? exists.order
            }
        });

        console.log(`[PATCH /api/admin/trends/${params.id}] Updated trend:`, trend);
        return createSuccessResponse(trend);
    } catch (error) {
        console.error(`[PATCH /api/admin/trends/${params.id}] Error:`, error);
        return createErrorResponse('Failed to update trend', 500, error.message);
    }
}

// DELETE trend
export async function DELETE(request, { params }) {
    try {
        console.log(`[DELETE /api/admin/trends/${params.id}] Deleting trend...`);

        const trend = await prisma.trend.delete({
            where: { id: params.id }
        });

        console.log(`[DELETE /api/admin/trends/${params.id}] Deleted trend:`, trend);
        return createSuccessResponse({ deleted: true, id: params.id });
    } catch (error) {
        console.error(`[DELETE /api/admin/trends/${params.id}] Error:`, error);
        return createErrorResponse('Failed to delete trend', 500, error.message);
    }
} 