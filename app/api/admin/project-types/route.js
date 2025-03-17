import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

// GET all project types
export async function GET() {
    try {
        const projectTypes = await prisma.projectType.findMany({
            orderBy: { order: 'asc' }
        });
        return NextResponse.json(projectTypes);
    } catch (error) {
        console.error('Error fetching project types:', error);
        return NextResponse.json(
            { error: "Failed to fetch project types" },
            { status: 500 }
        );
    }
}

// POST new project type
export async function POST(request) {
    try {
        const data = await request.json();

        if (!data.name) {
            return NextResponse.json(
                { error: "Name is required" },
                { status: 400 }
            );
        }

        const projectType = await prisma.projectType.create({
            data: {
                name: data.name,
                order: data.order || 0,
                isActive: data.isActive ?? true
            }
        });

        return NextResponse.json(projectType, { status: 201 });
    } catch (error) {
        console.error('Error creating project type:', error);
        return NextResponse.json(
            { error: "Failed to create project type" },
            { status: 500 }
        );
    }
} 