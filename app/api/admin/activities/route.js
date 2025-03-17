import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // Fetch the last 10 activities from various sources
        const [projects, blogs, members, requests] = await Promise.all([
            prisma.project.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                select: {
                    title: true,
                    createdAt: true
                }
            }),
            prisma.blog.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                select: {
                    title: true,
                    createdAt: true
                }
            }),
            prisma.member.findMany({
                take: 10,
                orderBy: { updatedAt: 'desc' },
                select: {
                    name: true,
                    updatedAt: true
                }
            }),
            prisma.request.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                select: {
                    name: true,
                    createdAt: true,
                    status: true
                }
            })
        ]);

        // Transform and combine activities
        const activities = [
            ...projects.map(p => ({
                type: 'project',
                title: `New project added: ${p.title}`,
                timestamp: p.createdAt
            })),
            ...blogs.map(b => ({
                type: 'blog',
                title: `Blog post published: ${b.title}`,
                timestamp: b.createdAt
            })),
            ...members.map(m => ({
                type: 'member',
                title: `Team member updated: ${m.name}`,
                timestamp: m.updatedAt
            })),
            ...requests.map(r => ({
                type: 'request',
                title: `New project request from ${r.name}`,
                timestamp: r.createdAt
            }))
        ];

        // Sort by timestamp and take the 10 most recent
        const sortedActivities = activities
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 10);

        return NextResponse.json(sortedActivities);
    } catch (error) {
        console.error('Error fetching activities:', error);
        return NextResponse.json(
            { error: 'Failed to fetch activities' },
            { status: 500 }
        );
    }
} 