import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

// PUT update project type
export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const data = await request.json();

        if (!data.name) {
            return NextResponse.json(
                { error: "Name is required" },
                { status: 400 }
            );
        }

        const projectType = await prisma.projectType.update({
            where: { id },
            data: {
                name: data.name,
                order: data.order || 0,
                isActive: data.isActive ?? true
            }
        });

        return NextResponse.json(projectType);
    } catch (error) {
        console.error('Error updating project type:', error);
        return NextResponse.json(
            { error: "Failed to update project type" },
            { status: 500 }
        );
    }
}

// DELETE project type
export async function DELETE(request, { params }) {
    try {
        const { id } = params;
        await prisma.projectType.delete({
            where: { id }
        });

        return NextResponse.json({ message: "Project type deleted successfully" });
    } catch (error) {
        console.error('Error deleting project type:', error);
        return NextResponse.json(
            { error: "Failed to delete project type" },
            { status: 500 }
        );
    }
} 