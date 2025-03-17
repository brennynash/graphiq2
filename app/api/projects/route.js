import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const featured = searchParams.get('featured') === 'true';

        // Get all unique industries
        const uniqueIndustries = await prisma.project.findMany({
            select: {
                industry: true
            },
            where: {
                industry: {
                    not: null
                }
            },
            distinct: ['industry']
        });

        const industries = uniqueIndustries
            .map(p => p.industry)
            .filter(Boolean);

        // Get projects based on filters
        const projects = await prisma.project.findMany({
            where: featured ? {
                isFeatured: true
            } : {},
            orderBy: [
                { order: 'asc' },
                { createdAt: 'desc' }
            ]
        });

        return NextResponse.json({
            projects,
            industries
        });
    } catch (error) {
        console.error('Error fetching projects:', error);
        return NextResponse.json(
            { error: 'Failed to fetch projects' },
            { status: 500 }
        );
    }
}
