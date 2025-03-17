import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const pages = await prisma.page.findMany({
            orderBy: { slug: 'asc' }
        });
        return NextResponse.json(pages);
    } catch (error) {
        console.error('Error fetching pages:', error);
        return NextResponse.json(
            { error: 'Failed to fetch pages' },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const data = await request.json();

        // Validate required fields
        if (!data.slug || !data.title || !data.content) {
            return NextResponse.json(
                { error: 'Slug, title and content are required' },
                { status: 400 }
            );
        }

        // Check if page already exists
        const existing = await prisma.page.findUnique({
            where: { slug: data.slug }
        });

        if (existing) {
            // Update existing page
            const updated = await prisma.page.update({
                where: { slug: data.slug },
                data: {
                    title: data.title,
                    content: data.content,
                    isActive: data.isActive ?? true
                }
            });
            return NextResponse.json(updated);
        }

        // Create new page
        const page = await prisma.page.create({
            data: {
                slug: data.slug,
                title: data.title,
                content: data.content,
                isActive: data.isActive ?? true
            }
        });

        return NextResponse.json(page);
    } catch (error) {
        console.error('Error saving page:', error);
        return NextResponse.json(
            { error: 'Failed to save page' },
            { status: 500 }
        );
    }
} 