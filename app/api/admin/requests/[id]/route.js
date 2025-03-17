import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

// PUT update request status
export async function PUT(req, { params }) {
    try {
        const { status } = await req.json();

        const request = await prisma.request.update({
            where: { id: params.id },
            data: { status }
        });

        return NextResponse.json(request);
    } catch (error) {
        console.error('Error updating request:', error);
        return NextResponse.json(
            { error: "Failed to update request" },
            { status: 500 }
        );
    }
}

// DELETE request
export async function DELETE(req, { params }) {
    try {
        await prisma.request.delete({
            where: { id: params.id }
        });

        return NextResponse.json({ message: "Request deleted successfully" });
    } catch (error) {
        console.error('Error deleting request:', error);
        return NextResponse.json(
            { error: "Failed to delete request" },
            { status: 500 }
        );
    }
} 