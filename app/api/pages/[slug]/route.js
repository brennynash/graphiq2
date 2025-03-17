import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
    try {
        // Await the params object before destructuring
        const resolvedParams = await params;
        const { slug } = resolvedParams;

        const page = await prisma.page.findUnique({
            where: { slug }
        });

        if (!page) {
            return NextResponse.json({ error: 'Page not found' }, { status: 404 });
        }

        let content;
        try {
            content = JSON.parse(page.content);
        } catch {
            content = page.content;
        }

        return NextResponse.json(content);
    } catch (error) {
        console.error('Error fetching page:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 