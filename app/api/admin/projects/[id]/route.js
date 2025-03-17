import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request, context) {
    try {
        const id = context.params.id;
        const data = await request.json();

        // Validate required fields
        if (!data.name || !data.title || !data.description || !data.mainImage) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const project = await prisma.project.update({
            where: { id },
            data: {
                name: data.name,
                title: data.title,
                description: data.description,
                mainImage: data.mainImage,
                images: data.images || [],
                industry: data.industry || null,
                isFeatured: data.isFeatured || false,
                order: data.order || 0
            }
        });

        return NextResponse.json(project);
    } catch (error) {
        console.error('Error updating project:', error);
        return NextResponse.json(
            { error: 'Failed to update project' },
            { status: 500 }
        );
    }
}

export async function DELETE(request, context) {
    try {
        const id = context.params.id;
        await prisma.project.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        return NextResponse.json(
            { error: 'Failed to delete project' },
            { status: 500 }
        );
    }
} 