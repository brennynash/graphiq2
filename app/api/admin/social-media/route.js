import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const socialMedia = await prisma.socialMedia.findMany({
            orderBy: { platform: 'asc' }
        });
        return NextResponse.json(socialMedia);
    } catch (error) {
        console.error('Error fetching social media:', error);
        return NextResponse.json(
            { error: 'Failed to fetch social media' },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const data = await request.json();

        // Validate required fields
        if (!data.platform || !data.url) {
            return NextResponse.json(
                { error: 'Platform and URL are required' },
                { status: 400 }
            );
        }

        // Check if platform already exists
        const existing = await prisma.socialMedia.findUnique({
            where: { platform: data.platform }
        });

        if (existing) {
            // Update existing record
            const updated = await prisma.socialMedia.update({
                where: { platform: data.platform },
                data: {
                    url: data.url,
                    isActive: data.isActive ?? true
                }
            });
            return NextResponse.json(updated);
        }

        // Create new record
        const socialMedia = await prisma.socialMedia.create({
            data: {
                platform: data.platform,
                url: data.url,
                isActive: data.isActive ?? true
            }
        });

        return NextResponse.json(socialMedia);
    } catch (error) {
        console.error('Error saving social media:', error);
        return NextResponse.json(
            { error: 'Failed to save social media' },
            { status: 500 }
        );
    }
} 