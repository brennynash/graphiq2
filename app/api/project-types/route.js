import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const projectTypes = await prisma.projectType.findMany({
            where: { isActive: true },
            orderBy: { order: 'asc' },
            select: { id: true, name: true }
        });
        return NextResponse.json(projectTypes);
    } catch (error) {
        console.error('Error fetching project types:', error);
        // Return default project types if database fetch fails
        const defaultTypes = [
            { id: '1', name: 'Brand Strategy' },
            { id: '2', name: 'Identity' },
            { id: '3', name: 'Website' },
            { id: '4', name: 'Product design' },
            { id: '5', name: 'Other' }
        ];
        return NextResponse.json(defaultTypes);
    }
}